document.addEventListener('DOMContentLoaded', () => {
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
    if(activeAccordion) {
        activeAccordion.style.maxHeight = activeAccordion.scrollHeight + 'px';
    }

    // Form Mock Submission
    const regForm = document.getElementById('regForm');
    const formMsg = document.getElementById('formMsg');
    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = regForm.querySelector('button[type="submit"]');
            btn.innerHTML = 'Отправка...';
            btn.disabled = true;
            
            // Mock API delay
            setTimeout(() => {
                formMsg.innerHTML = 'Спасибо за регистрацию! Мы отправили билет на ваш email.';
                formMsg.style.color = '#10b981'; // success green
                regForm.reset();
                btn.innerHTML = 'Зарегистрироваться';
                btn.disabled = false;
            }, 1000);
        });
    }
});

