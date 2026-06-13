document.addEventListener('DOMContentLoaded', () => {
    // 1. Custom Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;

    // Check if device supports hover (disable custom cursor on touch devices)
    const isTouchDevice = () => {
        return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
    };

    if (!isTouchDevice()) {
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Instantly move dot
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        // Smooth follow for outline
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

        // Cursor Hover Effects
        const hoverElements = document.querySelectorAll('a, button, .hover-zoom, .cert-item');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    }

    // 2. Magnetic Elements (Buttons & Logo)
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

    // 3. Parallax Effect on Hero Image
    const parallaxFrame = document.querySelector('[data-parallax]');
    if (parallaxFrame && !isTouchDevice()) {
        window.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.clientX) * 0.02;
            const y = (window.innerHeight / 2 - e.clientY) * 0.02;

            parallaxFrame.style.transform = `translate(${x}px, ${y}px) rotateY(${x * -0.5}deg) rotateX(${y * 0.5}deg)`;
        });
    }

    // 4. Scroll Reveal Animations (Intersection Observer)
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

                revealObserver.unobserve(entry.target); // Only animate once
            }
        });
    }, revealOptions);

    const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-scale, .reveal-stagger, .text-reveal');
    revealElements.forEach(el => revealObserver.observe(el));

    // 5. Sticky Navbar
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 5.5 Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            navbar.classList.toggle('menu-open');
            
            // Prevent scrolling when menu is open
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

    // 6. Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Offset for fixed navbar
                const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 7. Back to Top Button
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 8. Footer Light Cursor
    const footer = document.querySelector('.footer');
    if (footer && !isTouchDevice()) {
        footer.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-light');
        });
        footer.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-light');
        });
    }

    // 9. Preloader Animation (Text Scramble Decode + Extras)
    const preloader = document.getElementById('preloader');
    const preloaderText = document.getElementById('preloader-text');
    const subtext = document.getElementById('preloader-subtext');
    const logsContainer = document.getElementById('preloader-logs');

    if (preloader && preloaderText) {
        // Terminal Logs Animation
        if (logsContainer) {
            const logMessages = [
                "establishing secure connection...",
                "fetching ML models from edge servers...",
                "allocating GPU memory...",
                "compiling neural pathways...",
                "bypassing mainframe...",
                "injecting custom styling...",
                "system ready."
            ];
            let logIndex = 0;

            const logInterval = setInterval(() => {
                if (logIndex < logMessages.length) {
                    const el = document.createElement('div');
                    el.className = 'log-line';
                    el.textContent = '> ' + logMessages[logIndex];
                    logsContainer.appendChild(el);

                    if (logsContainer.children.length > 4) {
                        logsContainer.removeChild(logsContainer.firstChild);
                    }
                    logIndex++;
                } else {
                    clearInterval(logInterval);
                }
            }, 120);
        }

        const finalString = "Sinha.Akshat";
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*abcdefghijklmnopqrstuvwxyz";
        let iteration = 0;

        const topBar = document.getElementById('preloader-top-bar');
        const hudCoords = document.getElementById('hud-coords');

        const scrambleInterval = setInterval(() => {
            // Update HUD coords rapidly
            if (hudCoords) {
                const hex1 = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
                const hex2 = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
                hudCoords.textContent = `SYS.LOC // 0x${hex1} : 0x${hex2}`;
            }

            // Update top bar width
            if (topBar) {
                topBar.style.width = Math.min(100, (iteration / finalString.length) * 100) + '%';
            }

            preloaderText.innerText = finalString.split("").map((char, index) => {
                if (index < iteration) {
                    return finalString[index];
                }
                return chars[Math.floor(Math.random() * chars.length)];
            }).join("");

            if (iteration >= finalString.length) {
                clearInterval(scrambleInterval);

                // Show subtext once name is decoded
                if (subtext) subtext.classList.add('visible');

                // Done loading, hold the resolved text briefly
                setTimeout(() => {
                    preloader.classList.add('hide');

                    // Allow scrolling again
                    setTimeout(() => {
                        document.body.classList.remove('loading');
                    }, 800);

                    // Trigger initial hero animations after preloader slides up halfway
                    setTimeout(() => {
                        const heroContent = document.querySelector('.hero-content');
                        const heroVisual = document.querySelector('.hero-visual');
                        if (heroContent) heroContent.classList.add('active');
                        if (heroVisual) heroVisual.classList.add('active');
                    }, 400);
                }, 800); // Pause at resolved text for visual satisfaction
            }

            iteration += 1 / 4; // Controls speed of decoding (lower = slower)
        }, 30); // 30ms per frame
    }

    // 10. Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.submit-btn');
            const submitText = submitBtn.querySelector('.submit-text');
            const originalText = submitText.innerHTML;
            
            // Loading state
            submitText.innerHTML = 'Sending...';
            submitBtn.style.opacity = '0.7';
            submitBtn.style.pointerEvents = 'none';
            formStatus.className = 'form-status';
            formStatus.textContent = '';
            
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    formStatus.className = 'form-status success';
                    formStatus.textContent = 'Thanks for reaching out! I will get back to you soon.';
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                        formStatus.textContent = data["errors"].map(error => error["message"]).join(", ");
                    } else {
                        formStatus.textContent = 'Oops! There was a problem submitting your form.';
                    }
                    formStatus.className = 'form-status error';
                }
            } catch (error) {
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Oops! There was a problem submitting your form.';
            } finally {
                // Reset button state
                submitText.innerHTML = originalText;
                submitBtn.style.opacity = '1';
                submitBtn.style.pointerEvents = 'auto';
            }
        });
    }
});
