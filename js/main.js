document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if (navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '70px';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = '#0f172a';
                navLinks.style.padding = '20px';
                navLinks.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
            }
        });
    }

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(15, 23, 42, 0.9)';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.padding = '15px 0';
            navbar.style.transition = '0.3s';
        } else {
            navbar.style.background = 'transparent';
            navbar.style.backdropFilter = 'none';
            navbar.style.padding = '20px 0';
        }
    });

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
});
