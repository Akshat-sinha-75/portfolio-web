document.addEventListener('DOMContentLoaded', () => {
    // ========================================
    // 1. CUSTOM CURSOR
    // ========================================
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;

    const isTouchDevice = () => {
        return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
    };

    if (!isTouchDevice()) {
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        const animateCursor = () => {
            const dx = mouseX - outlineX;
            const dy = mouseY - outlineY;
            outlineX += dx * 0.27;
            outlineY += dy * 0.27;
            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;
            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        // Cursor hover effects
        const hoverElements = document.querySelectorAll('a, button, .hover-zoom, .tech-pill');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    }

    // ========================================
    // 2. MAGNETIC ELEMENTS
    // ========================================
    const magneticElements = document.querySelectorAll('[data-magnetic]');
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 4;
            const y = e.clientY - rect.top - rect.height / 4;
            el.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0px, 0px)';
        });
    });

    // ========================================
    // 3. NAVBAR SCROLL BEHAVIOR
    // ========================================
    const navbar = document.getElementById('navbar');
    const heroSection = document.querySelector('.projects-hero');

    window.addEventListener('scroll', () => {
        const scrollThreshold = heroSection ? heroSection.offsetHeight - 80 : 50;
        if (window.scrollY > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    if (navbar && !isTouchDevice()) {
        navbar.addEventListener('mouseenter', () => {
            if (navbar.classList.contains('scrolled')) {
                document.body.classList.add('cursor-light');
            }
        });
        navbar.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-light');
        });
    }

    // ========================================
    // 3.5 MOBILE MENU TOGGLE
    // ========================================
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            navbar.classList.toggle('menu-open');

            if (mobileMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                navbar.classList.remove('menu-open');
                document.body.style.overflow = '';
            });
        });
    }

    // ========================================
    // 4. SCROLL REVEAL — PROJECT SECTIONS
    // ========================================
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // Stagger children if it's a stagger container
                if (entry.target.classList.contains('reveal-stagger')) {
                    const items = entry.target.querySelectorAll('.reveal-item');
                    items.forEach((item, index) => {
                        item.style.transitionDelay = `${index * 0.15}s`;
                    });
                }

                revealObserver.unobserve(entry.target);
            }
        });
    }, revealOptions);

    // Observe project section inners for scroll reveal
    const projectInners = document.querySelectorAll('.project-section-inner');
    projectInners.forEach(el => revealObserver.observe(el));

    // Also observe reveal-stagger elements (footer)
    const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-scale, .reveal-stagger, .text-reveal');
    revealElements.forEach(el => revealObserver.observe(el));

    // ========================================
    // 5. DOT NAVIGATION — SCROLL TRACKING
    // ========================================
    const dotNav = document.getElementById('dot-nav');
    const dots = document.querySelectorAll('.dot-nav-dot');
    const projectSections = document.querySelectorAll('.project-section');

    // Show/hide dot nav based on scroll position
    const updateDotNavVisibility = () => {
        const scrollContainer = document.querySelector('.projects-scroll-container');
        if (!scrollContainer || !dotNav) return;

        const containerRect = scrollContainer.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Show dots when the first project section is approaching
        if (containerRect.top < windowHeight * 0.6 && containerRect.bottom > windowHeight * 0.3) {
            dotNav.classList.add('visible');
        } else {
            dotNav.classList.remove('visible');
        }
    };

    // Track which project is in view
    const dotObserverOptions = {
        threshold: 0.35,
        rootMargin: "-10% 0px -10% 0px"
    };

    const dotObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetId = entry.target.id;

                // Update active dot
                dots.forEach(dot => {
                    dot.classList.remove('active');
                    if (dot.dataset.target === targetId) {
                        dot.classList.add('active');
                    }
                });
            }
        });
    }, dotObserverOptions);

    projectSections.forEach(section => dotObserver.observe(section));

    // Listen for scroll to update dot nav visibility
    window.addEventListener('scroll', updateDotNavVisibility, { passive: true });
    updateDotNavVisibility(); // Initial check

    // ========================================
    // 6. DOT CLICK — SMOOTH SCROLL TO PROJECT
    // ========================================
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const targetId = dot.dataset.target;
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const offsetTop = targetSection.getBoundingClientRect().top + window.pageYOffset - 40;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // 7. BACK TO TOP
    // ========================================
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ========================================
    // 8. DARK SECTION CURSOR
    // ========================================
    const darkSections = document.querySelectorAll('.footer');
    if (!isTouchDevice()) {
        darkSections.forEach(section => {
            section.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-light');
            });
            section.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-light');
            });
        });
    }
});
