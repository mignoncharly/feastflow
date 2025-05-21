// access_code_form.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initAnimations();
    
    // Add focus to the access code input field
    focusAccessCodeInput();
    
    // Initialize the header gradient animation
    initHeaderGradient();
    
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
        }
        
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
    }
    
    // Add hover effects for back button
    const backButton = document.querySelector('.btn-back');
    if (backButton) {
        backButton.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'var(--neutral-100)';
            this.style.borderColor = 'var(--neutral-400)';
        });
        
        backButton.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'transparent';
            this.style.borderColor = 'var(--neutral-300)';
        });
    }
    
    // Add form submission animation
    const accessForm = document.querySelector('.access-form');
    if (accessForm) {
        accessForm.addEventListener('submit', function(e) {
            const submitButton = this.querySelector('.btn-verify');
            if (submitButton) {
                submitButton.innerHTML = '<span class="btn-text">Verifying...</span><span class="btn-icon"><i class="bi bi-arrow-repeat spin"></i></span>';
                submitButton.disabled = true;
                submitButton.style.opacity = '0.8';
                
                // No need to prevent default, let the form submit normally
            }
        });
    }
}

/**
 * Add ripple effect to buttons
 */
function addRippleEffect(element) {
    element.addEventListener('mousedown', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
        
        element.appendChild(ripple);
        
        // Remove the ripple after animation completes
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
}

// Add additional CSS for animations
(function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .fade-in.visible, .slide-up.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        .spin {
            animation: spin 1s linear infinite;
            display: inline-block;
        }
        
        .btn-verify .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.4);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        input[name="access_code"].has-content {
            border-color: var(--primary-color);
            background-color: white;
            transition: all 0.3s ease;
        }
        
        @media (prefers-reduced-motion: reduce) {
            .fade-in, .slide-up {
                animation: none;
                opacity: 1;
            }
            
            .spin {
                animation: none;
            }
        }
    `;
    document.head.appendChild(style);
})();

// Add special zoom effect to lock icon
(function animateLockIcon() {
    const lockIcon = document.querySelector('.lock-circle i');
    if (!lockIcon) return;
    
    let scale = 1;
    let growing = false;
    
    setInterval(() => {
        if (growing) {
            scale += 0.01;
            if (scale >= 1.1) {
                growing = false;
            }
        } else {
            scale -= 0.01;
            if (scale <= 0.9) {
                growing = true;
            }
        }
        
        lockIcon.style.transform = `scale(${scale})`;
    }, 50);
})();

/**
 * Focus on the access code input field
 */
function focusAccessCodeInput() {
    const accessCodeInput = document.querySelector('input[name="access_code"]'); 
    if (accessCodeInput) {
        setTimeout(() => {
            accessCodeInput.focus();
        }, 1000); // Delay focus to allow for page animations
    }
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
 * Add event listeners for interactive elements
 */
function addEventListeners() {
    // Add hover effects for buttons
    const verifyButton = document.querySelector('.btn-verify');
    if (verifyButton) {
        verifyButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 6px 16px rgba(63, 55, 201, 0.3)';
        });
        
        verifyButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 12px rgba(63, 55, 201, 0.25)';
        });
    }
}