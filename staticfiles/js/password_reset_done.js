// password_reset_done.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize parallax effect for background elements
    initParallaxEffect();
    
    // Add ripple effect to buttons
    initRippleEffect();
    
    // Add subtle hover effect to info cards
    initInfoCardHover();
    
    // Add subtle animation to help section
    animateHelpSection();
    
    // Add pulse animation to envelope
    addEnvelopePulse();
});

// Initialize parallax effect for background elements
function initParallaxEffect() {
    const container = document.querySelector('.reset-done-page');
    const shapes = document.querySelectorAll('.bg-shape');
    
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

// Add ripple effect to buttons
function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
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

// Add subtle hover effect to info cards
function initInfoCardHover() {
    const infoCards = document.querySelectorAll('.info-card');
    
    infoCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 20px 30px -10px rgba(0, 0, 0, 0.15), 0 10px 15px -5px rgba(0, 0, 0, 0.1)';
            
            // Add animation to icon
            const icon = this.querySelector('.info-card-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1)';
                icon.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
            
            // Reset icon animation
            const icon = this.querySelector('.info-card-icon');
            if (icon) {
                icon.style.transform = '';
                icon.style.backgroundColor = '';
            }
        });
    });
    
    // Add transition style for smooth effect
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .info-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .info-card-icon {
            transition: transform 0.3s ease, background-color 0.3s ease;
        }
    `;
    document.head.appendChild(styleElement);
}

// Add subtle animation to help section
function animateHelpSection() {
    const helpSection = document.querySelector('.help-section');
    
    if (helpSection) {
        // Add subtle pulsing glow effect
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            @keyframes pulse-glow {
                0%, 100% {
                    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.2);
                }
                50% {
                    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
                }
            }
            
            .help-section {
                animation: pulse-glow 4s infinite ease-in-out;
            }
        `;
        document.head.appendChild(styleElement);
    }
}

// Add pulse animation to envelope
function addEnvelopePulse() {
    const envelope = document.querySelector('.envelope');
    
    if (envelope) {
        // Add subtle floating animation
        const letterAnimation = document.querySelector('.letter');
        
        if (letterAnimation) {
            // Add extra animation after letter rises
            setTimeout(() => {
                const styleElement = document.createElement('style');
                styleElement.textContent = `
                    @keyframes floating-letter {
                        0%, 100% {
                            transform: translateY(-30px) rotate(0deg);
                        }
                        50% {
                            transform: translateY(-35px) rotate(1deg);
                        }
                    }
                    
                    .letter {
                        animation: floating-letter 3s infinite ease-in-out;
                    }
                `;
                document.head.appendChild(styleElement);
            }, 2000); // Apply after initial animation
        }
        
        // Add shine effect to check icon
        const checkIcon = document.querySelector('.check-icon');
        
        if (checkIcon) {
            const styleElement = document.createElement('style');
            styleElement.textContent = `
                .check-icon::after {
                    content: '';
                    position: absolute;
                    width: 140%;
                    height: 140%;
                    background: radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0) 70%);
                    border-radius: 50%;
                    z-index: -1;
                    animation: pulse-check 2s infinite ease-in-out;
                }
                
                @keyframes pulse-check {
                    0%, 100% {
                        opacity: 0.5;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.3;
                        transform: scale(1.2);
                    }
                }
            `;
            document.head.appendChild(styleElement);
        }
    }
}

// Add wave animation to background
document.addEventListener('DOMContentLoaded', function() {
    const bgWave = document.querySelector('.bg-wave');
    
    if (bgWave) {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            @keyframes wave-animation {
                0% {
                    background-position-x: 0;
                }
                100% {
                    background-position-x: 1000px;
                }
            }
            
            .bg-wave {
                animation: wave-animation 30s linear infinite;
                background-size: 1000px 100px;
            }
        `;
        document.head.appendChild(styleElement);
    }
    
    // Add subtle fade-in animation to the main card
    const emailSentCard = document.querySelector('.email-sent-card');
    
    if (emailSentCard) {
        emailSentCard.style.opacity = '0';
        emailSentCard.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            emailSentCard.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            emailSentCard.style.opacity = '1';
            emailSentCard.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Add staggered fade-in for info cards
    const infoCards = document.querySelectorAll('.info-card');
    
    infoCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 800 + (index * 200)); // Stagger the animations
    });
});