// ── Hero Banner Scaling ──────────────────────────────────────────────────────
// CSS calc() cannot produce a unitless value from viewport units, so we use JS.
// transform-origin is set to "top left" in CSS so scale anchors from the left edge.
function scaleHeroBanner() {
    const card = document.querySelector('.hero-banner-card');
    if (!card) return;

    const DESKTOP_W = 1520; // px — the fixed width set in CSS for mobile

    if (window.innerWidth <= 992) {
        const availableW = window.innerWidth - 48; // container padding (24px each side)
        const scale = availableW / DESKTOP_W;

        // Get the card's natural (unscaled) height BEFORE applying transform
        card.style.transform = '';
        card.style.marginBottom = '';
        const naturalH = card.offsetHeight;

        const scaledH = naturalH * scale;
        const deadSpace = scaledH - naturalH; // negative number

        // transform-origin: top left — no horizontal shift needed, only fix vertical dead space
        card.style.transform = `scale(${scale})`;
        card.style.marginBottom = `${deadSpace}px`;
    } else {
        // Reset on desktop
        card.style.transform = '';
        card.style.marginBottom = '';
    }
}

// Run after DOM + after full page load (images affect card height)
document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(scaleHeroBanner));
window.addEventListener('load', scaleHeroBanner);
window.addEventListener('resize', scaleHeroBanner);
// ─────────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    scaleHeroBanner(); // run again after full DOM is ready
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Accordion functionality
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = item.querySelector('.accordion-content');

            // Close all others
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.accordion-content').style.maxHeight = null;
                }
            });

            // Toggle current
            item.classList.toggle('active');
            if (item.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = null;
            }
        });
    });

    // Set initial accordion height
    const activeAccordion = document.querySelector('.accordion-item.active .accordion-content');
    if (activeAccordion) {
        activeAccordion.style.maxHeight = activeAccordion.scrollHeight + 'px';
    }

    // Form Submission
    const regForm = document.getElementById('regForm');
    const formMsg = document.getElementById('formMsg');
    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = regForm.querySelector('button[type="submit"]');
            btn.innerHTML = 'Отправка...';
            btn.disabled = true;

            const formData = new FormData(regForm);

            fetch("https://formsubmit.co/ajax/flashrit@icloud.com", {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {
                    formMsg.innerHTML = 'Спасибо за регистрацию!';
                    formMsg.style.color = '#10b981'; // success green
                    regForm.reset();
                    btn.innerHTML = 'Зарегистрироваться';
                    btn.disabled = false;
                })
                .catch(error => {
                    formMsg.innerHTML = 'Произошла ошибка при отправке.';
                    formMsg.style.color = '#ff4d4f'; // error red
                    btn.innerHTML = 'Зарегистрироваться';
                    btn.disabled = false;
                });
        });
    }

    // ── Photo Slider (manual prev/next, no auto-scroll) ───────────────────────
    const sliderTrack  = document.getElementById('sliderTrack');
    const sliderPrev   = document.getElementById('sliderPrev');
    const sliderNext   = document.getElementById('sliderNext');
    const sliderDots   = document.getElementById('sliderDots');

    if (sliderTrack && sliderPrev && sliderNext) {
        const slides     = sliderTrack.querySelectorAll('.slider-slide');
        const total      = slides.length;
        let   current    = 0;

        // Build dots
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Слайд ${i + 1}`);
            dot.addEventListener('click', () => goTo(i));
            sliderDots.appendChild(dot);
        });

        function updateDots() {
            sliderDots.querySelectorAll('.slider-dot').forEach((d, i) => {
                d.classList.toggle('active', i === current);
            });
        }

        function goTo(index) {
            current = Math.max(0, Math.min(index, total - 1));
            sliderTrack.style.transform = `translateX(-${current * 100}%)`;
            sliderPrev.disabled = current === 0;
            sliderNext.disabled = current === total - 1;
            updateDots();
        }

        sliderPrev.addEventListener('click', () => goTo(current - 1));
        sliderNext.addEventListener('click', () => goTo(current + 1));

        // Touch / swipe support
        let touchStartX = 0;
        sliderTrack.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
        sliderTrack.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
        }, { passive: true });

        // Initialise
        goTo(0);
    }
    // ─────────────────────────────────────────────────────────────────────────

    // ── Expanding Gallery: tap to open on touch devices ───────────────────────
    const expandCards = document.querySelectorAll('.expand-card');
    expandCards.forEach(card => {
        card.addEventListener('click', () => {
            const isAlreadyActive = card.classList.contains('active');
            // Close all cards first
            expandCards.forEach(c => c.classList.remove('active'));
            // If it wasn't active before, open it; if it was, leave all closed
            if (!isAlreadyActive) {
                card.classList.add('active');
            }
        });
    });
    // ─────────────────────────────────────────────────────────────────────────
});
