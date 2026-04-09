document.addEventListener('DOMContentLoaded', () => {
    // Current Year for Footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Adjust scroll position for fixed header
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for scroll animations (fade in)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply animation styles to sections initially
    const sectionsToAnimate = document.querySelectorAll('.section-container, .hero-content');

    sectionsToAnimate.forEach(section => {
        section.style.opacity = 0;
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });

    // Portfolio Modal Logic
    const modalBtn = document.getElementById('open-portfolio-btn');
    const modal = document.getElementById('portfolio-modal');
    const closeBtn = document.querySelector('.close-btn');

    if (modalBtn && modal && closeBtn) {
        modalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });

        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto'; // Restore scrolling
        });

        // Close modal on outside click
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Google Sheets Form Submission
    const scriptURL = 'https://script.google.com/macros/s/AKfycbweTNwF7hYLfDJORaYXRW-yS5XFZQbUY350fWb0_uORwrhGe20Irf9_-P9eVboHt1O5/exec';
    const form = document.getElementById('contact-form');
    const msg = document.getElementById('form-msg');
    const submitBtn = document.querySelector('.form-submit-btn');

    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            fetch(scriptURL, { method: 'POST', body: new FormData(form) })
                .then(response => {
                    msg.textContent = "Message sent! Will get back to you shortly.";
                    msg.className = "form-msg success";
                    setTimeout(function () {
                        msg.textContent = "";
                        msg.className = "form-msg";
                    }, 5000);
                    form.reset();
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                })
                .catch(error => {
                    msg.textContent = "Error sending message. Please try again.";
                    msg.className = "form-msg error";
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                    console.error('Error!', error.message);
                });
        });
    }
});
