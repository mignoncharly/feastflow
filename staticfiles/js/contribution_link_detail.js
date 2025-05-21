// contribution_link_detail.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initAnimations();
    
    // Initialize progress circles
    initProgressCircles();
    
    // Initialize progress bars
    animateProgressBars();
    
    // Add event listeners
    addEventListeners();
    
    // Initialize header gradient animation
    initHeaderGradient();
    
    // Initialize share buttons
    initShareButtons();
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
                
                // Add visible class
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
 * Initialize progress circles
 */
function initProgressCircles() {
    const circles = document.querySelectorAll('.progress-circle');
    
    circles.forEach(circle => {
        const value = parseInt(circle.getAttribute('data-value'));
        
        // Ensure the value is between 0 and 100
        const percentage = Math.min(100, Math.max(0, value));
        
        // Set the CSS variable for the conic gradient
        circle.style.setProperty('--progress-percentage', `${percentage}%`);
        
        // Set color based on progress
        if (percentage >= 70) {
            circle.querySelector('.progress-value').style.color = 'var(--success-color)';
            circle.style.setProperty('--progress-color', 'var(--success-color)');
        } else if (percentage >= 30) {
            circle.querySelector('.progress-value').style.color = 'var(--primary-color)';
            circle.style.setProperty('--progress-color', 'var(--primary-color)');
        } else {
            circle.querySelector('.progress-value').style.color = 'var(--warning-color)';
            circle.style.setProperty('--progress-color', 'var(--warning-color)');
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
            bar.style.transition = 'width 1.5s ease';
            bar.style.width = percentage + '%';
        }, 500);
    });
}

/**
 * Add event listeners for interactive elements
 */
function addEventListeners() {
    // Add hover effects for category cards
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = 'var(--shadow-lg)';
            
            // Animate the arrow icon
            const arrow = this.querySelector('.btn-view-items i');
            if (arrow) {
                arrow.style.transform = 'translateX(3px)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--shadow-md)';
            
            // Reset the arrow icon
            const arrow = this.querySelector('.btn-view-items i');
            if (arrow) {
                arrow.style.transform = 'translateX(0)';
            }
        });
    });
    
    // Add hover effects for view items buttons
    const viewButtons = document.querySelectorAll('.btn-view-items');
    
    viewButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'var(--primary-dark)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'var(--primary-color)';
        });
    });
    
    // Add hover effect for share buttons
    const shareButtons = document.querySelectorAll('.btn-share');
    
    shareButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            if (this.classList.contains('copy')) {
                if (!this.classList.contains('success')) {
                    this.style.backgroundColor = 'var(--neutral-800)';
                    this.style.color = 'white';
                }
            } else if (this.classList.contains('email')) {
                this.style.backgroundColor = '#ea4335';
                this.style.color = 'white';
            } else if (this.classList.contains('whatsapp')) {
                this.style.backgroundColor = '#25d366';
                this.style.color = 'white';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            if (this.classList.contains('copy')) {
                if (!this.classList.contains('success')) {
                    this.style.backgroundColor = 'var(--neutral-100)';
                    this.style.color = 'var(--neutral-700)';
                }
            } else if (this.classList.contains('email')) {
                this.style.backgroundColor = 'var(--neutral-100)';
                this.style.color = '#ea4335';
            } else if (this.classList.contains('whatsapp')) {
                this.style.backgroundColor = 'var(--neutral-100)';
                this.style.color = '#25d366';
            }
        });
    });
}

/**
 * Initialize the header gradient animation
 */
function initHeaderGradient() {
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
}

/**
 * Initialize share buttons functionality
 */
function initShareButtons() {
    const copyButton = document.querySelector('.btn-share.copy');
    
    if (copyButton) {
        copyButton.addEventListener('click', function() {
            const link = this.getAttribute('data-link');
            
            // Copy to clipboard
            navigator.clipboard.writeText(link).then(() => {
                // Success feedback
                this.classList.add('success');
                this.innerHTML = '<i class="bi bi-check-lg"></i>';
                this.title = 'Copied!';
                this.style.backgroundColor = 'var(--success-color)';
                this.style.color = 'white';
                
                // Reset after 2 seconds
                setTimeout(() => {
                    this.classList.remove('success');
                    this.innerHTML = '<i class="bi bi-link-45deg"></i>';
                    this.title = 'Copy link';
                    this.style.backgroundColor = 'var(--neutral-100)';
                    this.style.color = 'var(--neutral-700)';
                }, 2000);
            }).catch(err => {
                console.error('Could not copy text: ', err);
                
                // Error feedback
                this.style.backgroundColor = 'var(--danger-color)';
                this.style.color = 'white';
                this.innerHTML = '<i class="bi bi-exclamation-circle"></i>';
                this.title = 'Failed to copy';
                
                // Reset after 2 seconds
                setTimeout(() => {
                    this.innerHTML = '<i class="bi bi-link-45deg"></i>';
                    this.title = 'Copy link';
                    this.style.backgroundColor = 'var(--neutral-100)';
                    this.style.color = 'var(--neutral-700)';
                }, 2000);
            });
        });
    }
}

// Add additional CSS for animations
(function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .fade-in.visible, .slide-up.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Progress circle animation */
        @keyframes fillProgress {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        .progress-circle::before {
            animation: fillProgress 1.5s ease-out forwards;
            transform-origin: center;
        }
        
        /* Ripple effect for buttons */
        .btn-view-items {
            position: relative;
            overflow: hidden;
        }
        
        .btn-view-items::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 5px;
            height: 5px;
            background: rgba(255, 255, 255, 0.5);
            opacity: 0;
            border-radius: 100%;
            transform: translate(-50%, -50%);
            transition: all 0.6s;
        }
        
        .btn-view-items:active::after {
            width: 200px;
            height: 200px;
            opacity: 0;
            transition: 0s;
        }
        
        .btn-view-items:hover::after {
            opacity: 1;
        }
        
        /* Share button animation */
        @keyframes successPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        
        .btn-share.success i {
            animation: successPulse 0.4s ease-in-out;
        }
        
        /* Improve dark mode detection */
        @media (prefers-color-scheme: dark) {
            .category-card:hover .category-image-placeholder, 
            .category-card:hover .category-image-wrapper {
                background: #262626;
            }
            
            .btn-share:hover {
                background: #343a40 !important;
            }
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
            .fade-in, .slide-up {
                animation: none;
                opacity: 1;
            }
            
            .progress-circle::before {
                animation: none;
            }
            
            .progress-fill {
                transition: none !important;
            }
            
            .btn-share.success i {
                animation: none;
            }
        }
    `;
    document.head.appendChild(style);
})();