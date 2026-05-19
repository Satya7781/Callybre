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
                if (progressWrapper) progressWrapper.style.opacity = '0';
                setTimeout(() => {
                    const isDesktop = window.innerWidth >= 768;
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
                    }, 1000);
                }, 400);
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

    const navbar = document.getElementById('navbar');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuPanel = document.getElementById('mobile-menu-panel');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');

    // Consolidated Mobile Menu Functions
    function closeMobileMenu() {
        if (!mobileMenu || !mobileMenuPanel) return;
        
        mobileMenuPanel.classList.add('translate-x-full');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('overflow-hidden');
        
        setTimeout(() => {
            mobileMenu.classList.add('hidden');
            // Update toggle button icon safely
            if (mobileMenuBtn) {
                mobileMenuBtn.innerHTML = '<i data-lucide="menu"></i>';
                if (window.lucide) window.lucide.createIcons();
            }
        }, 300);
    }

    function openMobileMenu() {
        if (!mobileMenu || !mobileMenuPanel) return;
        
        mobileMenu.classList.remove('hidden');
        mobileMenu.setAttribute('aria-hidden', 'false');
        document.body.classList.add('overflow-hidden');
        
        setTimeout(() => {
            mobileMenuPanel.classList.remove('translate-x-full');
            // Update toggle button icon safely
            if (mobileMenuBtn) {
                mobileMenuBtn.innerHTML = '<i data-lucide="x"></i>';
                if (window.lucide) window.lucide.createIcons({ icons: window.lucide.icons });
            }
        }, 10);
    }

    // Direct Listeners for better reliability
    if (mobileMenuBtn) {
        mobileMenuBtn.onclick = (e) => {
            e.stopPropagation();
            const isHidden = mobileMenu.classList.contains('hidden');
            if (isHidden) openMobileMenu();
            else closeMobileMenu();
        };
    }

    const closeBtn = document.getElementById('mobile-menu-close');
    if (closeBtn) {
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            closeMobileMenu();
        };
    }

    if (mobileMenu) {
        mobileMenu.onclick = (e) => {
            if (e.target === mobileMenu) {
                closeMobileMenu();
            }
        };
    }

    // Links inside mobile menu
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.onclick = () => {
            closeMobileMenu();
        };
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('shadow-xl', 'bg-white/95');
                navbar.classList.remove('bg-white/70');
            } else {
                navbar.classList.remove('shadow-xl', 'bg-white/95');
                navbar.classList.add('bg-white/70');
            }
        }
    });

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll Reveal
    const revealElements = document.querySelectorAll('.reveal, .fade-up, .reveal-left, .reveal-right');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));
});

// Services Toggle
function toggleServices(type) {
    const bg = document.getElementById('service-toggle-bg');
    const btnIt = document.getElementById('btn-it');
    const btnDm = document.getElementById('btn-dm');
    const itContainer = document.getElementById('it-services-container');
    const dmContainer = document.getElementById('dm-services-container');

    if (!bg || !btnIt || !btnDm || !itContainer || !dmContainer) return;

    if (type === 'it') {
        bg.style.transform = 'translateX(0)';
        btnIt.classList.add('text-indigo-600');
        btnIt.classList.remove('text-slate-500');
        btnDm.classList.add('text-slate-500');
        btnDm.classList.remove('text-emerald-500');
        dmContainer.style.opacity = '0';
        setTimeout(() => {
            dmContainer.classList.add('hidden');
            itContainer.classList.remove('hidden');
            void itContainer.offsetWidth;
            itContainer.style.opacity = '1';
        }, 300);
    } else if (type === 'dm') {
        bg.style.transform = 'translateX(100%)';
        btnDm.classList.add('text-emerald-500');
        btnDm.classList.remove('text-slate-500');
        btnIt.classList.add('text-slate-500');
        btnIt.classList.remove('text-indigo-600');
        itContainer.style.opacity = '0';
        setTimeout(() => {
            itContainer.classList.add('hidden');
            dmContainer.classList.remove('hidden');
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
            document.querySelectorAll('.faq-item').forEach(otherItem => otherItem.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });
});
