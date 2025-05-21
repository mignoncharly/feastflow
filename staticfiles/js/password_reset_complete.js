// password_reset_complete.js

document.addEventListener('DOMContentLoaded', function() {
    // Add ripple effect to the login button
    initializeRippleEffect();
    
    // Add 3D tilt effect to the success card
    initializeTiltEffect();
    
    // Add parallax effect to background elements
    initializeParallaxEffect();
    
    // Animate entrance of info cards
    animateInfoCards();
    
    // Trigger confetti animation
    launchConfetti();
});

// Initialize ripple effect for the login button
function initializeRippleEffect() {
    const loginButton = document.querySelector('.login-button');
    
    if (loginButton) {
        loginButton.addEventListener('click', function(e) {
            const buttonContent = this.querySelector('.button-content');
            
            // Create ripple element
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            buttonContent.appendChild(ripple);
            
            // Get position
            const rect = buttonContent.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Set ripple position
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            // Remove ripple after animation completes
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        // Add ripple style
        const style = document.createElement('style');
        style.textContent = `
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
        document.head.appendChild(style);
    }
}

// Initialize 3D tilt effect for the success card
function initializeTiltEffect() {
    const card = document.querySelector('.success-card');
    
    if (card) {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const tiltX = (y - centerY) / 20;
            const tiltY = (centerX - x) / 20;
            
            this.style.transform = `perspective(1000px) translateY(-5px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) translateY(-5px) rotateX(0) rotateY(0)';
        });
    }
}

// Initialize parallax effect for background elements
function initializeParallaxEffect() {
    const container = document.querySelector('.reset-complete-page');
    const shapes = document.querySelectorAll('.floating-shape, .circle');
    
    if (container && shapes.length) {
        container.addEventListener('mousemove', function(e) {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            const moveX = (e.clientX - centerX) / 20;
            const moveY = (e.clientY - centerY) / 20;
            
            shapes.forEach((shape, index) => {
                const factor = (index + 1) * 0.4;
                
                // Apply different parallax effects based on element type
                if (shape.classList.contains('circle')) {
                    shape.style.transform = `translate(${moveX * factor}px, ${moveY * factor}px)`;
                } else {
                    shape.style.transform = `translate(${moveX * factor}px, ${moveY * factor}px) rotate(${moveX + index * 5}deg)`;
                }
            });
        });
    }
}

// Animate entrance of info cards
function animateInfoCards() {
    const infoCards = document.querySelectorAll('.info-card');
    
    if (infoCards.length) {
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .info-card {
                opacity: 0;
                animation: slideUp 0.6s ease-out forwards;
            }
        `;
        document.head.appendChild(style);
        
        // Apply staggered animation delay
        infoCards.forEach((card, index) => {
            card.style.animationDelay = `${0.8 + (index * 0.2)}s`;
        });
    }
}

// Launch confetti animation
function launchConfetti() {
    // Create confetti container
    const container = document.querySelector('.reset-complete-page');
    if (!container) return;
    
    const confettiContainer = document.createElement('div');
    confettiContainer.classList.add('confetti-container');
    container.appendChild(confettiContainer);
    
    // Define confetti colors
    const colors = ['#10b981', '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'];
    
    // Add confetti style
    const style = document.createElement('style');
    style.textContent = `
        .confetti-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        }
        
        .confetti {
            position: absolute;
            width: 10px;
            height: 10px;
            z-index: 10;
            animation: confetti-fall 4s ease-out forwards;
        }
        
        @keyframes confetti-fall {
            0% {
                transform: translateY(-100px) rotate(0deg) scale(0);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            100% {
                transform: translateY(calc(100vh + 100px)) rotate(720deg) scale(1);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Create and animate confetti pieces
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            createConfetti(confettiContainer, colors);
        }, i * 40); // Stagger confetti creation
    }
}

// Create a single confetti piece
function createConfetti(container, colors) {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    
    // Randomize appearance
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 10 + 5; // 5-15px
    const shape = Math.random() > 0.5 ? '50%' : '0'; // Circle or square
    const left = Math.random() * 100; // 0-100%
    const animationDuration = Math.random() * 3 + 3; // 3-6s
    
    // Set styles
    confetti.style.backgroundColor = color;
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;
    confetti.style.borderRadius = shape;
    confetti.style.left = `${left}%`;
    confetti.style.animationDuration = `${animationDuration}s`;
    
    // Add some random horizontal movement
    const swing = Math.random() * 40 - 20; // -20px to +20px
    confetti.style.animationName = 'none'; // Temporarily disable animation
    
    // Create keyframes for this specific confetti
    const keyframes = `
        @keyframes confetti-fall-${left} {
            0% {
                transform: translateY(-100px) translateX(0) rotate(0deg) scale(0);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            100% {
                transform: translateY(calc(100vh + 100px)) translateX(${swing}px) rotate(720deg) scale(1);
                opacity: 0;
            }
        }
    `;
    
    // Add unique keyframes to document
    const styleElement = document.createElement('style');
    styleElement.textContent = keyframes;
    document.head.appendChild(styleElement);
    
    // Apply the unique animation
    confetti.style.animationName = `confetti-fall-${left}`;
    
    // Add to container
    container.appendChild(confetti);
    
    // Remove confetti after animation completes to avoid memory leaks
    setTimeout(() => {
        confetti.remove();
        styleElement.remove();
    }, animationDuration * 1000);
}

// Add pulsing animation to the checkmark
document.addEventListener('DOMContentLoaded', function() {
    // Add pulsing glow effect to success icon
    const checkmarkCircle = document.querySelector('.checkmark-circle');
    
    if (checkmarkCircle) {
        // Create pulsing effect
        const style = document.createElement('style');
        style.textContent = `
            .checkmark-circle::after {
                content: '';
                position: absolute;
                inset: -10px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0) 70%);
                z-index: -1;
                animation: pulse-glow 2s infinite;
            }
            
            @keyframes pulse-glow {
                0%, 100% {
                    opacity: 0.7;
                    transform: scale(1);
                }
                50% {
                    opacity: 0.3;
                    transform: scale(1.1);
                }
            }
        `;
        document.head.appendChild(style);
    }
});