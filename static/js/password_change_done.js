// password_change_done.js
document.addEventListener('DOMContentLoaded', function() {
    // Add confetti animation when the page loads
    createConfetti();
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add mouse movement parallax effect to the background decorations
    document.addEventListener('mousemove', function(e) {
        const decorations = document.querySelectorAll('.bg-decoration');
        const moveX = (e.clientX - window.innerWidth / 2) / 50;
        const moveY = (e.clientY - window.innerHeight / 2) / 50;
        
        decorations.forEach((decoration, index) => {
            const factor = (index + 1) * 0.8;
            decoration.style.transform = `translate(${moveX * factor}px, ${moveY * factor}px)`;
        });
    });
    
    // Add custom styles for animations and effects
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .ripple-effect {
            position: absolute;
            background: rgba(255, 255, 255, 0.4);
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
        
        .confetti {
            position: absolute;
            z-index: 1;
            top: -10px;
            border-radius: 0%;
        }
        
        .confetti--animation-slow {
            animation: confetti-slow 3.25s linear 1 forwards;
        }
        
        .confetti--animation-medium {
            animation: confetti-medium 2.75s linear 1 forwards;
        }
        
        .confetti--animation-fast {
            animation: confetti-fast 2.25s linear 1 forwards;
        }
        
        @keyframes confetti-slow {
            0% {
                transform: translateY(0) rotateX(0) rotateY(0);
            }
            100% {
                transform: translateY(100vh) rotateX(360deg) rotateY(180deg);
            }
        }
        
        @keyframes confetti-medium {
            0% {
                transform: translateY(0) rotateX(0) rotateY(0);
            }
            100% {
                transform: translateY(100vh) rotateX(100deg) rotateY(360deg);
            }
        }
        
        @keyframes confetti-fast {
            0% {
                transform: translateY(0) rotateX(0) rotateY(0);
            }
            100% {
                transform: translateY(100vh) rotateX(180deg) rotateY(180deg);
            }
        }
    `;
    
    document.head.appendChild(styleElement);
});

function createConfetti() {
    const colors = ['#10b981', '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'];
    const confettiContainer = document.querySelector('.success-page');
    
    // Only create confetti if the container exists
    if (!confettiContainer) return;
    
    // Create confetti pieces
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        
        // Randomize confetti appearance
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 10 + 5; // 5-15px
        const left = Math.random() * 100; // 0-100%
        
        // Set styles
        confetti.style.backgroundColor = color;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.left = `${left}%`;
        confetti.style.opacity = Math.random() + 0.2;
        
        // Add animation class based on random speed
        const speed = Math.floor(Math.random() * 3);
        if (speed === 0) {
            confetti.classList.add('confetti--animation-slow');
        } else if (speed === 1) {
            confetti.classList.add('confetti--animation-medium');
        } else {
            confetti.classList.add('confetti--animation-fast');
        }
        
        // Randomize starting position and delay for more natural effect
        confetti.style.animationDelay = `${Math.random() * 3}s`;
        
        // Add to the container
        confettiContainer.appendChild(confetti);
        
        // Remove confetti after animation completes to avoid clutter
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}