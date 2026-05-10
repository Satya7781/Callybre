function initPreloader() {
    const preloader = document.getElementById('preloader');
    const panel1 = document.getElementById('preloader-panel-1');
    const panel2 = document.getElementById('preloader-panel-2');
    const progressWrapper = document.getElementById('preloader-progress-wrapper');
    const preloaderProgress = document.getElementById('preloader-progress');

    if (!preloader) return;

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 20 + 10;
        if (progress > 100) progress = 100;
        if (preloaderProgress) preloaderProgress.style.width = `${progress}%`;

        if (progress === 100) {
            clearInterval(interval);
            
            setTimeout(() => {
                // Fade out progress bar wrapper
                if (progressWrapper) {
                    progressWrapper.style.opacity = '0';
                }
                // Open the "curtains" with the logo physically splitting
                setTimeout(() => {
                    const isDesktop = window.innerWidth >= 768; // Tailwind md breakpoint
                    if (isDesktop) {
                        if (panel1) panel1.style.transform = 'translateY(-100%)';
                        if (panel2) panel2.style.transform = 'translateY(100%)';
                    } else {
                        if (panel1) panel1.style.transform = 'translateX(-100%)';
                        if (panel2) panel2.style.transform = 'translateX(100%)';
                    }
                    
                    setTimeout(() => {
                        preloader.remove();
                        document.body.classList.remove('overflow-hidden');
                        document.body.classList.add('overflow-x-hidden');
                    }, 2500); // Wait for curtains to slide (2.5s)
                }, 400); // Wait for progress bar to fade out
            }, 200);
        }
    }, 50);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPreloader);
} else {
    initPreloader();
}

document.addEventListener('DOMContentLoaded', () => {

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-xl', 'bg-white/95');
            navbar.classList.remove('bg-white/70');
        } else {
            navbar.classList.remove('shadow-xl', 'bg-white/95');
            navbar.classList.add('bg-white/70');
        }
    });

    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuPanel = document.getElementById('mobile-menu-panel');
    
    mobileMenuBtn.addEventListener('click', () => {
        if (mobileMenu) {
            const isHidden = mobileMenu.classList.contains('hidden');
            
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                setTimeout(() => {
                    mobileMenuPanel.classList.remove('translate-x-full');
                }, 10);
            } else {
                mobileMenuPanel.classList.add('translate-x-full');
                setTimeout(() => {
                    mobileMenu.classList.add('hidden');
                }, 300);
            }
            
            // Toggle menu icon
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                if (isHidden) {
                    icon.setAttribute('data-lucide', 'x');
                } else {
                    icon.setAttribute('data-lucide', 'menu');
                }
                lucide.createIcons();
            }
        }
    });

    // Close mobile menu when clicking on backdrop
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            mobileMenuPanel.classList.add('translate-x-full');
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            }, 300);
        }
    });

    // Close mobile menu when clicking on links
    const mobileMenuLinks = document.querySelectorAll('#mobile-menu a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuPanel.classList.add('translate-x-full');
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            }, 300);
        });
    });

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll Reveal Intersection Observer
    const revealElements = document.querySelectorAll('.reveal, .fade-up');

    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -20px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                if (entry.target.querySelector('.timeline-line')) {
                    const line = entry.target.querySelector('.timeline-line');
                    line.classList.add('active');
                    
                    const steps = entry.target.querySelectorAll('.process-step');
                    steps.forEach((step, index) => {
                        setTimeout(() => {
                            step.classList.add('active');
                        }, 200 + (index * 200));
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
});

// Services Toggle functionality
function toggleServices(type) {
    const bg = document.getElementById('service-toggle-bg');
    const btnIt = document.getElementById('btn-it');
    const btnDm = document.getElementById('btn-dm');
    const itContainer = document.getElementById('it-services-container');
    const dmContainer = document.getElementById('dm-services-container');

    if (!bg || !btnIt || !btnDm || !itContainer || !dmContainer) return;

    if (type === 'it') {
        // Move slider
        bg.style.transform = 'translateX(0)';
        
        // Update text colors
        btnIt.classList.add('text-indigo-600');
        btnIt.classList.remove('text-slate-500');
        btnDm.classList.add('text-slate-500');
        btnDm.classList.remove('text-emerald-500');

        // Hide DM, Show IT
        dmContainer.style.opacity = '0';
        setTimeout(() => {
            dmContainer.classList.add('hidden');
            itContainer.classList.remove('hidden');
            
            // Trigger reflow for transition
            void itContainer.offsetWidth;
            
            itContainer.style.opacity = '1';
        }, 300);

    } else if (type === 'dm') {
        // Move slider
        bg.style.transform = 'translateX(100%)';
        
        // Update text colors
        btnDm.classList.add('text-emerald-500');
        btnDm.classList.remove('text-slate-500');
        btnIt.classList.add('text-slate-500');
        btnIt.classList.remove('text-indigo-600');

        // Hide IT, Show DM
        itContainer.style.opacity = '0';
        setTimeout(() => {
            itContainer.classList.add('hidden');
            dmContainer.classList.remove('hidden');
            
            // Trigger reflow for transition
            void dmContainer.offsetWidth;
            
            dmContainer.style.opacity = '1';
        }, 300);
    }
}

// FAQ Accordion
document.addEventListener('DOMContentLoaded', () => {
    const faqToggles = document.querySelectorAll('.faq-toggle');
    
    faqToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const item = toggle.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close all other items
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
});
