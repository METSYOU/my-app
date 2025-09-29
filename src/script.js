document.addEventListener("DOMContentLoaded", function () {
    function updateScrollProgress() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        
        const scrollbar = document.querySelector(".header-scrollbar");
        if (scrollbar) {
            scrollbar.style.width = scrollPercentage + "%";
        }

        const header = document.querySelector('.header');
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    function initSmoothScroll() {
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                }
            });
        });
    }

    function initProjectScrollAnimation() {
        const projectCards = document.querySelectorAll('.project-card');
        const workSection = document.querySelector('.work');
        
        if (!workSection || projectCards.length === 0) return;

        // Make first project clickable
        const firstProject = projectCards[0];
        if (firstProject) {
            firstProject.classList.add('clickable');
            firstProject.style.cursor = 'pointer';
            firstProject.addEventListener('click', function() {
                window.open('https://metsyou.github.io/Movie/', '_blank');
            });
        }
        
        function updateProjectsStackAnimation() {
            const workSectionRect = workSection.getBoundingClientRect();
            const workSectionTop = workSection.offsetTop;
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            
            // Calculate scroll progress within the work section
            const sectionScrollStart = workSectionTop - windowHeight * 0.2;
            const sectionScrollProgress = scrollTop - sectionScrollStart;
            
            projectCards.forEach((card, index) => {
                const cardRect = card.getBoundingClientRect();
                const cardTop = card.offsetTop;
                
                // Calculate when this card should start animating
                const cardStartScroll = index * (windowHeight * 0.8);
                const cardProgress = (sectionScrollProgress - cardStartScroll) / (windowHeight * 0.8);
                
                // Default state - card is below viewport
                if (cardProgress < 0) {
                    card.style.transform = 'translateY(20vh) scale(0.95)';
                    card.style.opacity = '0';
                    card.style.zIndex = index;
                } 
                // Card is entering and sticking
                else if (cardProgress >= 0 && cardProgress < 1) {
                    const easeProgress = easeOutCubic(cardProgress);
                    const translateY = (1 - easeProgress) * 20;
                    const scale = 0.95 + (easeProgress * 0.05);
                    const opacity = Math.min(1, cardProgress * 2);
                    
                    card.style.transform = `translateY(${translateY}vh) scale(${scale})`;
                    card.style.opacity = opacity;
                    card.style.zIndex = 100 + index;
                } 
                // Card is stuck and being pushed up by next card
                else {
                    const pushProgress = Math.min((cardProgress - 1) * 1.5, 1);
                    const easeOutProgress = easeInCubic(pushProgress);
                    const translateY = -easeOutProgress * 15;
                    const scale = 1 - (easeOutProgress * 0.05);
                    const opacity = 1 - (easeOutProgress * 0.3);
                    
                    card.style.transform = `translateY(${translateY}vh) scale(${scale})`;
                    card.style.opacity = opacity;
                    card.style.zIndex = 100 + index;
                }
            });
        }

        function easeOutCubic(x) {
            return 1 - Math.pow(1 - x, 3);
        }

        function easeInCubic(x) {
            return x * x * x;
        }

        let ticking = false;
        function onScroll() {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateProjectsStackAnimation();
                    ticking = false;
                });
                ticking = true;
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        updateProjectsStackAnimation();
    }

    function updateActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const scrollPosition = window.scrollY + 200;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    function initMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navCenter = document.querySelector('.nav-center');
        
        if (mobileMenuBtn && navCenter) {
            mobileMenuBtn.addEventListener('click', function() {
                navCenter.classList.toggle('mobile-active');
                this.classList.toggle('active');
            });

            const mobileNavLinks = navCenter.querySelectorAll('a');
            mobileNavLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navCenter.classList.remove('mobile-active');
                    mobileMenuBtn.classList.remove('active');
                });
            });
        }
    }

    function initStatsAnimation() {
        const stats = document.querySelectorAll('.stat h3');
        
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalValue = target.textContent;
                    
                    if (finalValue.match(/^\d+\+?$/)) {
                        const number = parseInt(finalValue);
                        animateNumber(target, 0, number, 2000);
                        observer.unobserve(target);
                    }
                }
            });
        }, observerOptions);

        stats.forEach(stat => {
            observer.observe(stat);
        });
    }

    function animateNumber(element, start, end, duration) {
        const startTime = performance.now();
        const originalText = element.textContent;
        const hasPlus = originalText.includes('+');
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.round(start + (end - start) * easeOutQuart);
            
            element.textContent = current + (hasPlus ? '+' : '');
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }

    function initPageReveal() {
        document.body.style.opacity = '0';
        document.body.style.transform = 'translateY(20px)';
        
        window.addEventListener('load', () => {
            document.body.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            document.body.style.opacity = '1';
            document.body.style.transform = 'translateY(0)';
            document.body.classList.add('loaded');
        });
    }

    function initFadeInAnimations() {
        const fadeElements = document.querySelectorAll('.about-content, .section-header, .footer-main');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        fadeElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(el);
        });
    }

    function initProjectHoverEffects() {
        const projectImages = document.querySelectorAll('.project-image');
        
        projectImages.forEach(image => {
            image.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.02)';
            });
            
            image.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }

    function initKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const navCenter = document.querySelector('.nav-center');
                const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
                
                if (navCenter && navCenter.classList.contains('mobile-active')) {
                    navCenter.classList.remove('mobile-active');
                    mobileMenuBtn.classList.remove('active');
                }
            }
        });
    }

    let ticking = false;
    
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateScrollProgress();
                updateActiveNavigation();
                ticking = false;
            });
            ticking = true;
        }
    }

    function onResize() {
        updateScrollProgress();
    }

    function init() {
        initSmoothScroll();
        initProjectScrollAnimation();
        initMobileMenu();
        initStatsAnimation();
        initPageReveal();
        initFadeInAnimations();
        initProjectHoverEffects();
        initKeyboardNavigation();
        
        updateScrollProgress();
        updateActiveNavigation();
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    init();

    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
    });

    console.log(`
    🚀 Matthew Rene Portfolio
    ========================
    Thanks for checking out the code!
    Feel free to reach out if you'd like to collaborate.
    
    📧 matthewrene36@gmail.com
    🔗 linkedin.com/in/matthew-rene-56669a252/
    `);
});