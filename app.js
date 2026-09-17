/**
 * MARCOS VINICIUS - PORTFOLIO
 * Apple Design System - Fluid Interactive Engine
 * Based on WWDC "Designing Fluid Interfaces" & "Principles of Great Design"
 */

document.addEventListener('DOMContentLoaded', () => {
    // ===== DOM ELEMENTS =====
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav__link');
    const navPillIndicator = document.getElementById('navPillIndicator');
    const themeToggle = document.getElementById('themeToggle');
    const typedText = document.getElementById('typedText');
    const backToTop = document.getElementById('backToTop');
    const filterButtons = document.querySelectorAll('.segmented-btn');
    const filterIndicator = document.getElementById('filterIndicator');
    const projectCards = document.querySelectorAll('.project-card');
    const skillCards = document.querySelectorAll('.skill-card');
    const statNumbers = document.querySelectorAll('.about__stat-number');
    const contactForm = document.getElementById('contactForm');
    const heroImageCard = document.getElementById('heroImageCard');
    const heroStage = document.querySelector('.hero__stage');

    // Accessibility check: reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ===== 1. THEME MANAGEMENT (APPLE SYSTEM PREFERENCE FIRST) =====
    const initTheme = () => {
        const savedTheme = localStorage.getItem('apple_theme');
        if (savedTheme) {
            if (savedTheme === 'light') {
                document.body.classList.add('light-mode');
            } else {
                document.body.classList.remove('light-mode');
            }
        } else {
            // Default to OS setting
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
                document.body.classList.add('light-mode');
            }
        }
    };

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            localStorage.setItem('apple_theme', isLight ? 'light' : 'dark');
            
            // Re-sync segmented indicators on theme switch (padding/metrics)
            updateNavPill();
            updateFilterPill();
        });
    }

    initTheme();

    // ===== 2. FLUID NAVIGATION PILL SLIDER (APPLE VISION / MACOS STYLE) =====
    const updateNavPill = (targetElement) => {
        if (!navPillIndicator || !navMenu) return;
        
        const activeLink = targetElement || navMenu.querySelector('.nav__link.active');
        if (!activeLink) {
            navPillIndicator.style.opacity = '0';
            return;
        }

        const menuRect = navMenu.getBoundingClientRect();
        const linkRect = activeLink.getBoundingClientRect();

        const offsetLeft = linkRect.left - menuRect.left;
        const width = linkRect.width;

        navPillIndicator.style.opacity = '1';
        navPillIndicator.style.transform = `translateX(${offsetLeft}px)`;
        navPillIndicator.style.width = `${width}px`;
    };

    // Smooth hover preview for nav items (Apple dock / menu hover behavior)
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            if (!prefersReducedMotion) {
                updateNavPill(link);
            }
        });

        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            updateNavPill(link);

            // Close mobile menu if open
            if (navMenu && navMenu.classList.contains('mobile-active')) {
                navMenu.classList.remove('mobile-active');
                if (navToggle) navToggle.classList.remove('active');
            }
        });
    });

    if (navMenu) {
        navMenu.addEventListener('mouseleave', () => {
            updateNavPill();
        });
    }

    // ===== 3. DYNAMIC SCROLL SPY & FLUID NAVBAR COLLAPSE =====
    let isTicking = false;

    const handleScroll = () => {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        // Shrink nav on scroll (Dynamic Island feel)
        if (nav) {
            if (scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }

        // Back to top visibility
        if (backToTop) {
            if (scrollY > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }

        // Scroll spy section tracking
        const sections = document.querySelectorAll('section[id], header[id]');
        const scrollPosition = scrollY + 180;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    if (link.getAttribute('data-section') === sectionId) {
                        if (!link.classList.contains('active')) {
                            navLinks.forEach(l => l.classList.remove('active'));
                            link.classList.add('active');
                            updateNavPill(link);
                        }
                    }
                });
            }
        });

        isTicking = false;
    };

    window.addEventListener('scroll', () => {
        if (!isTicking) {
            window.requestAnimationFrame(handleScroll);
            isTicking = true;
        }
    }, { passive: true });

    // Initial positioning of nav pill
    setTimeout(updateNavPill, 100);

    // ===== 4. MOBILE SHEET NAVIGATION =====
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('mobile-active');
        });

        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('mobile-active') && !nav.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('mobile-active');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('mobile-active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('mobile-active');
            }
        });
    }

    // ===== 5. APPLE SEGMENTED CONTROL (PORTFOLIO FILTERS) =====
    const updateFilterPill = () => {
        if (!filterIndicator || !filterButtons.length) return;
        const activeBtn = document.querySelector('.segmented-btn.active');
        if (!activeBtn) return;

        const parent = activeBtn.parentElement;
        const parentRect = parent.getBoundingClientRect();
        const btnRect = activeBtn.getBoundingClientRect();

        const offsetLeft = btnRect.left - parentRect.left;
        const width = btnRect.width;

        filterIndicator.style.transform = `translateX(${offsetLeft}px)`;
        filterIndicator.style.width = `${width}px`;
    };

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateFilterPill();

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach((card) => {
                const category = card.getAttribute('data-category') || '';
                const matches = (filter === 'all' || category.includes(filter));

                if (matches) {
                    card.classList.remove('hidden');
                    if (!prefersReducedMotion) {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(12px) scale(0.98)';
                        requestAnimationFrame(() => {
                            card.style.transition = 'opacity 300ms var(--spring-standard), transform 300ms var(--spring-standard)';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0) scale(1)';
                        });
                    }
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    setTimeout(updateFilterPill, 120);
    window.addEventListener('resize', () => {
        updateNavPill();
        updateFilterPill();
    });

    // ===== 6. HERO 3D PHYSICAL CARD TILT (CRITICALLY DAMPED MOTION) =====
    if (heroStage && heroImageCard && !prefersReducedMotion) {
        let mouseX = 0, mouseY = 0;
        let currentX = 0, currentY = 0;
        let isHovered = false;

        heroStage.addEventListener('mousemove', (e) => {
            const rect = heroStage.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Restrained tilt angle (-8 to +8 degrees max)
            mouseX = ((e.clientX - centerX) / (rect.width / 2)) * 8;
            mouseY = -((e.clientY - centerY) / (rect.height / 2)) * 8;
            isHovered = true;
        });

        heroStage.addEventListener('mouseleave', () => {
            mouseX = 0;
            mouseY = 0;
            isHovered = false;
        });

        // Critically damped spring physics loop using lerp
        const animateTilt = () => {
            // Lerp with damp factor 0.08
            currentX += (mouseX - currentX) * 0.08;
            currentY += (mouseY - currentY) * 0.08;

            heroImageCard.style.transform = `rotateY(${currentX.toFixed(2)}deg) rotateX(${currentY.toFixed(2)}deg)`;

            // Subtle parallax for floating chips
            const cards = heroStage.querySelectorAll('.floating-card');
            cards.forEach((card, index) => {
                const multiplier = (index + 1) * 1.8;
                const fx = currentX * multiplier;
                const fy = -currentY * multiplier;
                card.style.transform = `translate(${fx.toFixed(1)}px, ${fy.toFixed(1)}px)`;
            });

            requestAnimationFrame(animateTilt);
        };

        requestAnimationFrame(animateTilt);
    }

    // ===== 7. APPLE TYPOGRAPHY DYNAMIC ROLE CYCLER =====
    if (typedText) {
        const roles = [
            'Engenharia da Computação',
            'Full Stack Developer',
            'React & TypeScript Specialist',
            'Sistemas Distribuídos & Java',
            'UI/UX & Apple Design Lover'
        ];

        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 80;

        const tickType = () => {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                typedText.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 40;
            } else {
                typedText.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 75;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                isDeleting = true;
                typeSpeed = 2200; // Comfortable pause
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 400; // Pause before starting next phrase
            }

            setTimeout(tickType, typeSpeed);
        };

        setTimeout(tickType, 400);
    }

    // ===== 8. INTERSECTION OBSERVER: STATS & SKILL PROGRESS =====
    const observeElements = () => {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;

                    // Animate Apple Health style Metric Counters
                    if (el.classList.contains('about__stat-number')) {
                        const targetVal = parseInt(el.getAttribute('data-count'), 10) || 0;
                        animateCounter(el, targetVal);
                        obs.unobserve(el);
                    }

                    // Animate Skills status bars
                    if (el.classList.contains('skill-card')) {
                        const bar = el.querySelector('.skill-card__progress');
                        if (bar) {
                            const progress = bar.getAttribute('data-progress');
                            bar.style.width = `${progress}%`;
                        }
                        obs.unobserve(el);
                    }
                }
            });
        }, { threshold: 0.2 });

        statNumbers.forEach(stat => observer.observe(stat));
        skillCards.forEach(card => observer.observe(card));
    };

    const animateCounter = (element, target) => {
        const duration = 1600;
        const startTime = performance.now();

        const updateCount = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(easeOutProgress * target);

            element.textContent = currentVal + (target >= 10 ? '+' : '');

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                element.textContent = target + (target >= 10 ? '+' : '');
            }
        };

        requestAnimationFrame(updateCount);
    };

    observeElements();

    // ===== 9. CONTACT FORM (INSTANT VALIDATION & FEEDBACK) =====
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const name = formData.get('name') || '';
            const email = formData.get('email') || '';
            const subject = formData.get('subject') || '';
            const message = formData.get('message') || '';

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;

            // Immediate Apple feedback on submit
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Abrindo Cliente de Email...';
            submitBtn.style.background = 'var(--apple-green)';
            submitBtn.style.color = '#ffffff';

            const mailtoLink = `mailto:marcosviniciusmoraisrios117@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Nome: ${name}\nEmail: ${email}\n\nMensagem:\n${message}`)}`;

            setTimeout(() => {
                window.location.href = mailtoLink;
            }, 300);

            setTimeout(() => {
                submitBtn.innerHTML = originalHTML;
                submitBtn.style.background = '';
                submitBtn.style.color = '';
                contactForm.reset();
            }, 3500);
        });
    }

    // ===== 10. BACK TO TOP BUTTON =====
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});