// user_contributions.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initAnimations();
    
    // Initialize counter animations
    animateCounters();
    
    // Initialize progress bars
    animateProgressBars();
    
    // Add event listeners
    addEventListeners();
});

/**
 * Initialize animations with intersection observer
 */
function initAnimations() {
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const fadeElements = document.querySelectorAll('.fade-in, .slide-up');
        
        const appearOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const appearOnScroll = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                
                // Add visible class instead of relying solely on CSS animations
                // This ensures elements animate when they come into view
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            });
        }, appearOptions);
        
        fadeElements.forEach(element => {
            appearOnScroll.observe(element);
            // Initially hide elements that will be animated
            element.style.opacity = '0';
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        document.querySelectorAll('.fade-in, .slide-up').forEach(el => {
            el.classList.add('visible');
            el.style.opacity = '1';
        });
    }
}

/**
 * Animate the stat counters
 */
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The lower the faster
    
    counters.forEach(counter => {
        const target = +counter.innerText;
        let count = 0;
        
        // Only animate if the number is significant enough
        if (target > 5) {
            const increment = Math.max(1, Math.floor(target / speed));
            
            const updateCount = () => {
                count += increment;
                
                if (count < target) {
                    counter.innerText = count;
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target;
                }
            };
            
            // Start animation with a slight delay based on element position
            setTimeout(updateCount, 300);
        }
    });
}

/**
 * Animate progress bars
 */
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach(bar => {
        const percentage = bar.getAttribute('data-percentage');
        
        // Initially set width to 0
        bar.style.width = '0%';
        
        // Animate the width after a delay
        setTimeout(() => {
            bar.style.transition = 'width 1s ease';
            bar.style.width = percentage + '%';
        }, 500);
    });
}

/**
 * Add event listeners for interactive elements
 */
function addEventListeners() {
    // Add hover effects for stat cards
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = 'var(--shadow-lg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--shadow-md)';
        });
    });
    
    // Add hover effects for contribution and participation items
    const listItems = document.querySelectorAll('.contribution-item, .participation-item');
    
    listItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
            this.style.boxShadow = 'var(--shadow-sm)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            this.style.boxShadow = 'none';
        });
    });
    
    // Apply special highlighting for newly added contributions (if applicable)
    highlightNewContributions();
}

/**
 * Highlight recently added contributions (e.g., within last 24 hours)
 */
function highlightNewContributions() {
    // This assumes there's a data attribute on new contributions
    // You could add this in your template with a timestamp check
    const newItems = document.querySelectorAll('[data-new="true"]');
    
    newItems.forEach(item => {
        // Add a special highlight pulse animation
        item.classList.add('new-contribution');
        
        // Add a "New" badge
        const header = item.querySelector('.contribution-header');
        if (header) {
            const newBadge = document.createElement('span');
            newBadge.className = 'new-badge';
            newBadge.textContent = 'New';
            header.appendChild(newBadge);
        }
    });
}

/**
 * Update the header gradient animation
 * Creates a subtle shifting effect in the background
 */
(function animateHeaderGradient() {
    const header = document.querySelector('.gradient-overlay');
    if (!header) return;
    
    let degree = 135;
    let direction = 1;
    
    setInterval(() => {
        // Subtle animation - only move 0.2 degrees at a time
        degree += 0.2 * direction;
        
        // Reverse direction when reaching limits
        if (degree > 155 || degree < 115) {
            direction *= -1;
        }
        
        header.style.background = `linear-gradient(${degree}deg, var(--gradient-start), var(--gradient-mid), var(--gradient-end))`;
    }, 100);
})();

/**
 * Generate a random color based on a string (for consistent colors per category)
 * @param {string} str - The string to generate a color from
 * @return {string} - A hex color code
 */
function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 45%)`;
}

/**
 * Apply category-specific colors to elements (if applicable)
 */
function applyCategoryColors() {
    const categories = document.querySelectorAll('[data-category]');
    
    categories.forEach(element => {
        const category = element.getAttribute('data-category');
        if (category) {
            const color = stringToColor(category);
            
            // Apply the color as a custom property
            element.style.setProperty('--category-color', color);
            
            // Apply to any child elements that need the color
            const colorElements = element.querySelectorAll('.category-colored');
            colorElements.forEach(el => {
                el.style.color = color;
            });
            
            // Apply to background elements with a lighter opacity
            const bgElements = element.querySelectorAll('.category-bg');
            bgElements.forEach(el => {
                el.style.backgroundColor = `${color}25`; // 25 = 15% opacity in hex
            });
        }
    });
}

/**
 * Toggle between compact and expanded view (for mobile optimization)
 */
function initViewToggle() {
    const toggleButton = document.getElementById('view-toggle');
    if (!toggleButton) return;
    
    toggleButton.addEventListener('click', function() {
        const contributionsList = document.querySelector('.contributions-list');
        contributionsList.classList.toggle('compact-view');
        
        // Update button text
        if (contributionsList.classList.contains('compact-view')) {
            this.innerHTML = '<i class="bi bi-arrows-expand"></i> Expand View';
        } else {
            this.innerHTML = '<i class="bi bi-arrows-collapse"></i> Compact View';
        }
    });
}

// Add smooth scrolling for page navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add theme toggle functionality
(function initThemeToggle() {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme');
    
    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-theme');
    }
    
    // If a theme toggle button exists, add functionality
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            
            const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
            localStorage.setItem('theme', theme);
            
            // Update icon
            const icon = this.querySelector('i');
            if (icon) {
                if (theme === 'dark') {
                    icon.classList.replace('bi-moon', 'bi-sun');
                } else {
                    icon.classList.replace('bi-sun', 'bi-moon');
                }
            }
        });
    }
})();

// Additional CSS for the animations
(function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .fade-in.visible, .slide-up.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .new-contribution {
            position: relative;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(67, 97, 238, 0.4); }
            70% { box-shadow: 0 0 0 8px rgba(67, 97, 238, 0); }
            100% { box-shadow: 0 0 0 0 rgba(67, 97, 238, 0); }
        }
        
        .new-badge {
            font-size: 0.6875rem;
            font-weight: 600;
            padding: 0.25rem 0.5rem;
            border-radius: 1rem;
            background-color: var(--secondary-color);
            color: white;
            margin-left: 0.5rem;
            animation: fadeInRight 0.5s forwards;
        }
        
        @keyframes fadeInRight {
            from {
                opacity: 0;
                transform: translateX(10px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .compact-view .contribution-item {
            padding: 0.5rem;
        }
        
        .compact-view .contribution-details {
            display: none;
        }
        
        .compact-view .contribution-comment {
            display: none;
        }
        
        .dark-theme {
            background-color: #121212;
            color: #e9ecef;
        }
    `;
    document.head.appendChild(style);
})();