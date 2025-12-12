// Mobile menu toggle
document.addEventListener("DOMContentLoaded", function() {
    const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
    const nav = document.querySelector(".nav");
    
    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener("click", function() {
            nav.classList.toggle("active");
            mobileMenuToggle.classList.toggle("active");
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                alert('Пожалуйста, заполните все обязательные поля');
            }
        });
    });
    
    // Animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.card, .portfolio-item, .article-item').forEach(el => {
        observer.observe(el);
    });

    // Accordion behavior
    document.querySelectorAll('.accordion').forEach(accordion => {
        accordion.querySelectorAll('.accordion-item').forEach(item => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');
            if (!header || !content) return;
            header.addEventListener('click', () => {
                const isOpen = header.getAttribute('aria-expanded') === 'true';
                // close others
                accordion.querySelectorAll('.accordion-item').forEach(other => {
                    const h = other.querySelector('.accordion-header');
                    const c = other.querySelector('.accordion-content');
                    if (h && c) {
                        h.setAttribute('aria-expanded', 'false');
                        c.style.maxHeight = '0px';
                        c.classList.remove('open');
                    }
                });
                if (!isOpen) {
                    header.setAttribute('aria-expanded', 'true');
                    content.classList.add('open');
                    const extra = 24; // headroom to avoid clipping
                    content.style.maxHeight = content.scrollHeight + extra + 'px';
                }
            });
        });
        // Recalculate on resize for open panels
        window.addEventListener('resize', () => {
            accordion.querySelectorAll('.accordion-item').forEach(item => {
                const header = item.querySelector('.accordion-header');
                const content = item.querySelector('.accordion-content');
                if (header && content && header.getAttribute('aria-expanded') === 'true') {
                    const extra = 24;
                    content.style.maxHeight = content.scrollHeight + extra + 'px';
                }
            });
        });
    });

    // Theme toggle with persistence
    const themeToggleButton = document.querySelector('.theme-toggle');
    const rootElement = document.documentElement;

    function applyTheme(theme) {
        rootElement.setAttribute('data-theme', theme);
        if (themeToggleButton) {
            themeToggleButton.textContent = theme === 'dark' ? '☀️' : '🌙';
            themeToggleButton.setAttribute('aria-label', theme === 'dark' ? 'Включить светлую тему' : 'Включить темную тему');
            themeToggleButton.title = theme === 'dark' ? 'Светлая тема' : 'Темная тема';
        }
    }

    const savedTheme = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(savedTheme);

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            const current = rootElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
            const next = current === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', next);
            applyTheme(next);
        });
    }
}); 