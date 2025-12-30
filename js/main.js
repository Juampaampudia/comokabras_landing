document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle bars icon to X if you want, but simple toggle for now
        });
    }

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');

    function updateNavbar() {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', updateNavbar);
    updateNavbar(); // Initial check

    // Smooth Scroll for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                if (window.innerWidth <= 768) {
                    navLinks.style.display = 'none';
                }
            }
        });
    });

    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('darkModeToggle');

    // Check for saved dark mode preference
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled') {
        document.body.classList.add('dark-mode');
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');

            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('darkMode', 'enabled');
            } else {
                localStorage.setItem('darkMode', null);
            }
        });
    }
    // Weather Widget Logic
    async function fetchWeather() {
        const tempElement = document.getElementById('moncayo-temp');
        if (!tempElement) return;

        try {
            // Coordinates for Pico Moncayo (approx)
            const lat = 41.789;
            const lon = -1.826;
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m`;

            const response = await fetch(url);
            if (!response.ok) throw new Error('Weather fetch failed');

            const data = await response.json();
            const temp = Math.round(data.current.temperature_2m);

            tempElement.textContent = temp;
        } catch (error) {
            console.error('Error fetching weather:', error);
            tempElement.textContent = '--';
        }
    }

    // Initial fetch
    fetchWeather();
    // Refresh every 30 minutes
    setInterval(fetchWeather, 30 * 60 * 1000);

    // Route Map Animation - Robust Implementation
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const routePath = document.querySelector('.route-path');
                const routePoints = document.querySelectorAll('.route-point');

                if (routePath) {
                    // Trigger the animation by resetting offset to 0
                    // The transition defined in CSS (or JS) will handle the ease
                    routePath.style.transition = 'stroke-dashoffset 2.5s ease-in-out';
                    routePath.style.strokeDashoffset = '0';

                    // Animate points sequentially
                    routePoints.forEach((point, index) => {
                        setTimeout(() => {
                            point.classList.add('animate-in');
                        }, 1000 + (index * 600)); // Wait for line to start drawing
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const heroWidget = document.querySelector('.hero-widget');

    // Pre-setup for the animation
    if (heroWidget) {
        const routePath = document.querySelector('.route-path');
        if (routePath) {
            // Calculate exact length to ensure perfect drawing
            const length = routePath.getTotalLength();

            // Set initial state: Hidden (offset = length)
            routePath.style.strokeDasharray = length;
            routePath.style.strokeDashoffset = length;

            // Force reflow/repaint so browser accepts the starting position
            routePath.getBoundingClientRect();
        }

        // Start Observing
        observer.observe(heroWidget);
    }

    // Interactive Goat Mascot - DISABLED
    // Movement effect removed per user request
    /*
    const goatMascot = document.getElementById('goatMascot');
    const heroSection = document.querySelector('.hero');

    if (goatMascot && heroSection) {
        let isHovering = false;

        // Enhanced mouse tracking with smooth following effect
        document.addEventListener('mousemove', (e) => {
            // Check if mouse is within hero section bounds
            const heroRect = heroSection.getBoundingClientRect();

            if (e.clientX >= heroRect.left && e.clientX <= heroRect.right &&
                e.clientY >= heroRect.top && e.clientY <= heroRect.bottom) {

                isHovering = true;

                // Get the center of the goat
                const goatRect = goatMascot.getBoundingClientRect();
                const goatCenterX = goatRect.left + goatRect.width / 2;
                const goatCenterY = goatRect.top + goatRect.height / 2;

                // Calculate the angle between the goat and the mouse
                const deltaX = e.clientX - goatCenterX;
                const deltaY = e.clientY - goatCenterY;

                // Calculate distance from center (for scaling effect)
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                const maxDistance = Math.sqrt(window.innerWidth * window.innerWidth + window.innerHeight * window.innerHeight);
                const distanceRatio = Math.min(distance / maxDistance, 1);

                // Enhanced rotation with more dramatic movement
                const maxRotateY = 35; // Increased from 15 for more dramatic effect
                const rotateY = (deltaX / goatRect.width) * maxRotateY;

                const maxRotateX = 25; // Increased from 10 for more visible vertical movement
                const rotateX = -(deltaY / goatRect.height) * maxRotateX;

                // Add slight tilt based on mouse position for more natural look
                const tiltZ = (deltaX / window.innerWidth) * 8;

                // Apply scale effect when mouse is closer
                const scale = 1 + (distanceRatio * 0.08); // Slight scale up to 1.08

                // Apply the transformation with enhanced effects
                goatMascot.style.transform = `
                    perspective(1000px)
                    rotateY(${rotateY}deg)
                    rotateX(${rotateX}deg)
                    rotateZ(${tiltZ}deg)
                    scale(${scale})
                `;

            } else {
                if (isHovering) {
                    // Reset when mouse leaves hero section
                    goatMascot.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) rotateZ(0deg) scale(1)';
                    isHovering = false;
                }
            }
        });

        // Reset position when mouse leaves the hero section
        heroSection.addEventListener('mouseleave', () => {
            goatMascot.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) rotateZ(0deg) scale(1)';
            isHovering = false;
        });

        console.log('Enhanced goat mascot tracking initialized');
    } else {
        console.warn('Goat mascot or hero section not found');
    }
    */

    // Progress Bar Animation for "How It Works" Section
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressFill = document.querySelector('.progress-line-fill');
                const progressDots = document.querySelectorAll('.progress-dot');

                if (progressFill) {
                    // Activate the progress fill
                    progressFill.classList.add('active');

                    // Animate dots sequentially
                    progressDots.forEach((dot, index) => {
                        setTimeout(() => {
                            dot.classList.add('active');
                        }, 300 + (index * 400)); // Stagger the animation
                    });
                }

                // Only animate once
                progressObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px'
    });

    // Observe the how-it-works section
    const howItWorksSection = document.querySelector('.how-it-works-section');
    if (howItWorksSection) {
        progressObserver.observe(howItWorksSection);
    }

    // Scroll Reveal Animation logic
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing once revealed
                // revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Exit Intent Modal Logic
    const exitModal = document.getElementById('exitModal');
    const closeBtn = document.querySelector('.close-modal');
    let modalShown = false;

    if (exitModal) {
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY < 0 && !modalShown) {
                exitModal.style.display = 'block';
                modalShown = true;
                // Save to localStorage so it doesn't show again in this session
                sessionStorage.setItem('exitModalShown', 'true');
            }
        });

        // Check if shown in this session
        if (sessionStorage.getItem('exitModalShown') === 'true') {
            modalShown = true;
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                exitModal.style.display = 'none';
            });
        }

        window.addEventListener('click', (e) => {
            if (e.target === exitModal) {
                exitModal.style.display = 'none';
            }
        });
    }

    // Language Selector Logic
    const langBtn = document.querySelector('.lang-btn');
    const langDropdown = document.querySelector('.lang-dropdown');
    const langOptions = document.querySelectorAll('.lang-option');
    const currentLangText = document.querySelector('.current-lang');

    // Toggle Dropdown
    if (langBtn) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('active');
            langBtn.classList.toggle('active');
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        if (langDropdown) {
            langDropdown.classList.remove('active');
            langBtn.classList.remove('active');
        }
    });

    // Set Language Function
    function setLanguage(lang) {
        if (!translations[lang]) return;

        // Update all elements with data-t
        document.querySelectorAll('[data-t]').forEach(el => {
            const key = el.getAttribute('data-t');
            if (translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });

        // Update placeholders
        document.querySelectorAll('[data-t-placeholder]').forEach(el => {
            const key = el.getAttribute('data-t-placeholder');
            if (translations[lang][key]) {
                el.placeholder = translations[lang][key];
            }
        });

        // Update UI Button
        currentLangText.innerHTML = lang.toUpperCase();

        // Update active class in dropdown
        langOptions.forEach(opt => {
            opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
        });

        // Save preference
        localStorage.setItem('preferred-lang', lang);
        document.documentElement.lang = lang;
    }

    // Language Option Click
    langOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = option.getAttribute('data-lang');
            setLanguage(lang);
            langDropdown.classList.remove('active');
            langBtn.classList.remove('active');
        });
    });

    // Polaroid Gallery Logic
    const initPolaroids = () => {
        const polaroidItems = document.querySelectorAll('.polaroid-item');
        polaroidItems.forEach(item => {
            const img = item.querySelector('img');
            const caption = item.querySelector('.polaroid-caption');
            if (img && caption) {
                const filename = img.getAttribute('data-filename') || img.src;
                // Extraer el nombre real: remover prefijos de cámara, fechas y extensión
                let cleanName = filename.split('/').pop(); // Solo nombre de archivo
                // Remover: 1. Fecha (YYYY-MM-DD), 2. Prefix Cámara (IMG_, DSC_, PXL_), 3. Timestamps numéricos y guiones sobrantes
                cleanName = cleanName.replace(/^(IMG_|DSC\d*_?|PXL_|\d{4}-\d{2}-\d{2}_?|\d{8}_?|\d{6}_?|\d{10,}_?|[0-9_-]+)+/i, '');
                // Remover la extensión (desde el último punto)
                const lastDotIndex = cleanName.lastIndexOf('.');
                if (lastDotIndex > 0) cleanName = cleanName.substring(0, lastDotIndex);

                caption.textContent = cleanName.replace(/_/g, ' ').trim();
            }
        });
    };
    initPolaroids();

    // Initialize Language
    const savedLang = localStorage.getItem('preferred-lang') ||
        (navigator.language.startsWith('fr') ? 'fr' :
            navigator.language.startsWith('en') ? 'en' : 'es');
    setLanguage(savedLang);
});
