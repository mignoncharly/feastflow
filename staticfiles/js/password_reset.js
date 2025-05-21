// password_reset.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize parallax effect for background elements
    initParallaxEffect();
    
    // Add ripple effect to submit button
    initRippleEffect();
    
    // Add hover effects for info cards
    initInfoCardEffects();
    
    // Add form validation visual feedback
    initFormValidation();
    
    // Add entry animations
    initEntryAnimations();
});

// Initialize parallax effect for background elements
function initParallaxEffect() {
    const container = document.querySelector('.reset-page');
    const shapes = document.querySelectorAll('.floating-shape');
    
    if (container && shapes.length) {
        container.addEventListener('mousemove', function(e) {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            const moveX = (e.clientX - centerX) / 30;
            const moveY = (e.clientY - centerY) / 30;
            
            shapes.forEach((shape, index) => {
                const factor = (index + 1) * 0.5;
                shape.style.transform = `translate(${moveX * factor}px, ${moveY * factor}px)`;
            });
        });
    }
}

// Add ripple effect to submit button
function initRippleEffect() {
    const submitButton = document.querySelector('.btn-submit');
    
    if (submitButton) {
        submitButton.addEventListener('click', function(e) {
            // Create ripple element
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            // Get coordinates
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Set position
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            // Remove ripple after animation completes
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        // Add ripple style
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .ripple {
                position: absolute;
                background-color: rgba(255, 255, 255, 0.4);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            }
            
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(styleElement);
    }
}

// Add hover effects for info cards
function initInfoCardEffects() {
    const infoCards = document.querySelectorAll('.info-card');
    
    infoCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add glow effect to icon
            const icon = this.querySelector('.info-card-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            // Remove glow effect from icon
            const icon = this.querySelector('.info-card-icon');
            if (icon) {
                icon.style.transform = '';
            }
        });
    });
    
    // Add transition style for smooth effect
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .info-card-icon {
            transition: transform 0.3s ease;
        }
    `;
    document.head.appendChild(styleElement);
}

// Add form validation visual feedback
function initFormValidation() {
    const emailInput = document.querySelector('input[type="email"]');
    
    if (emailInput) {
        // Add focus animation
        emailInput.addEventListener('focus', function() {
            this.parentElement.classList.add('input-focus');
        });
        
        emailInput.addEventListener('blur', function() {
            this.parentElement.classList.remove('input-focus');
            
            // Email validation feedback
            if (this.value) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailPattern.test(this.value)) {
                    this.parentElement.classList.add('input-valid');
                    this.parentElement.classList.remove('input-invalid');
                } else {
                    this.parentElement.classList.add('input-invalid');
                    this.parentElement.classList.remove('input-valid');
                }
            } else {
                this.parentElement.classList.remove('input-valid', 'input-invalid');
            }
        });
        
        // Add input styles
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .input-focus input {
                border-color: var(--primary-light);
                box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
            }
            
            .input-focus::before {
                opacity: 1;
            }
            
            .input-valid input {
                border-color: var(--success-color);
            }
            
            .input-invalid input {
                border-color: var(--danger-color);
            }
            
            .input-valid::after {
                content: '';
                position: absolute;
                width: 20px;
                height: 20px;
                top: 50%;
                right: 1rem;
                transform: translateY(-50%);
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%2310b981' viewBox='0 0 16 16'%3E%3Cpath d='M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z'/%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: center;
            }
            
            .input-invalid::after {
                content: '';
                position: absolute;
                width: 20px;
                height: 20px;
                top: 50%;
                right: 1rem;
                transform: translateY(-50%);
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23ef4444' viewBox='0 0 16 16'%3E%3Cpath d='M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: center;
            }
        `;
        document.head.appendChild(styleElement);
    }
}

// Add entry animations
function initEntryAnimations() {
    // Add entry animation for form card
    const formCard = document.querySelector('.form-card');
    if (formCard) {
        formCard.style.opacity = '0';
        formCard.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            formCard.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            formCard.style.opacity = '1';
            formCard.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Add staggered entry animation for info cards
    const infoCards = document.querySelectorAll('.info-card');
    infoCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 600 + (index * 200));
    });
    
    // Add animation for key
    enhanceKeyAnimation();
}

// Enhance key animation
function enhanceKeyAnimation() {
    const keyAnimation = document.querySelector('.reset-key-animation');
    if (!keyAnimation) return;
    
    // Add rotating animation
    setTimeout(() => {
        keyAnimation.style.animation = 'key-rotate 5s infinite ease-in-out';
        
        // Add style
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            @keyframes key-rotate {
                0%, 100% {
                    transform: rotate(0deg);
                }
                25% {
                    transform: rotate(-5deg);
                }
                75% {
                    transform: rotate(5deg);
                }
            }
        `;
        document.head.appendChild(styleElement);
    }, 2000);
}

// Add animated beam effect
document.addEventListener('DOMContentLoaded', function() {
    const lightBeam = document.querySelector('.light-beam');
    if (lightBeam) {
        // Make beam move slowly
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .light-beam {
                animation: beam-move 20s infinite linear;
            }
            
            @keyframes beam-move {
                0% {
                    transform: rotate(15deg) translateX(0);
                }
                100% {
                    transform: rotate(15deg) translateX(20%);
                }
            }
        `;
        document.head.appendChild(styleElement);
    }
});