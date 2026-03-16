// ── Hero Banner Scaling ──────────────────────────────────────────────────────
// CSS calc() cannot produce a unitless value from viewport units, so we use JS.
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

    // Interactive & Auto-scrolling Gallery
    const galleryContainer = document.querySelector('.gallery-scroll-container');
    if (galleryContainer) {
        let isDown = false;
        let startX;
        let scrollLeft;
        let autoScrollInterval;

        // Auto-scroll logic
        const startAutoScroll = () => {
            autoScrollInterval = setInterval(() => {
                galleryContainer.scrollLeft += 1;
                // Seamless loop: switch back to start if at the end
                if (galleryContainer.scrollLeft >= (galleryContainer.scrollWidth - galleryContainer.clientWidth)) {
                    // Slight delay before reset looks somewhat natural on snapping
                    setTimeout(() => {
                        galleryContainer.scrollLeft = 0;
                    }, 500);
                }
            }, 30);
        };

        const stopAutoScroll = () => {
            clearInterval(autoScrollInterval);
        };

        // Start initially
        startAutoScroll();

        // Mouse drag logic
        galleryContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            stopAutoScroll(); // Pause on interaction
            galleryContainer.style.cursor = 'grabbing';
            galleryContainer.style.scrollBehavior = 'auto'; // Remove smooth scroll snap temporarily 
            startX = e.pageX - galleryContainer.offsetLeft;
            scrollLeft = galleryContainer.scrollLeft;
        });

        galleryContainer.addEventListener('mouseleave', () => {
            isDown = false;
            galleryContainer.style.cursor = 'grab';
            galleryContainer.style.scrollBehavior = 'smooth';
            startAutoScroll(); // Resume
        });

        galleryContainer.addEventListener('mouseup', () => {
            isDown = false;
            galleryContainer.style.cursor = 'grab';
            galleryContainer.style.scrollBehavior = 'smooth';
            startAutoScroll(); // Resume
        });

        galleryContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - galleryContainer.offsetLeft;
            const walk = (x - startX) * 2; // Scroll-fast multiplier
            galleryContainer.scrollLeft = scrollLeft - walk;
        });

        // Pause auto scroll on touch interaction too
        galleryContainer.addEventListener('touchstart', stopAutoScroll, { passive: true });
        galleryContainer.addEventListener('touchend', startAutoScroll, { passive: true });
    }

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
