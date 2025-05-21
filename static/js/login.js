// Login Page JavaScript - FeastFlow Modern Design

document.addEventListener('DOMContentLoaded', function() {
    // Create background particles
    createParticles();
    
    // Initialize password toggle
    initPasswordToggle();
    
    // Add form animations
    animateFormElements();
    
    // Add button effects
    addButtonEffects();
});

/**
 * Creates floating particles in the background
 */
function createParticles() {
    const container = document.querySelector('.particle-container'); 
    if (!container) return;
    
    // Create particles
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(container);
    }
}

/**
 * Creates a single particle element
 * @param {HTMLElement} container - The container to append the particle to
 */
function createParticle(container) {
    // Create particle element
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Random size between 4px and 10px
    const size = Math.random() * 6 + 4;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Random position
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    
    // Random opacity between 0.1 and 0.3
    const opacity = Math.random() * 0.2 + 0.1;
    
    // Random color
    const colors = ['#ff6b6b', '#3cb371', '#4a90e2'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Set particle styles
    particle.style.position = 'absolute';
    particle.style.borderRadius = '50%';
    particle.style.backgroundColor = color;
    particle.style.opacity = opacity;
    particle.style.pointerEvents = 'none';
    
    // Create animation with random duration and delay
    const duration = Math.random() * 20 + 10; // Between 10 and 30 seconds
    const delay = Math.random() * 5; // Between 0 and 5 seconds
    
    particle.style.animation = `floatParticle ${duration}s ease-in-out ${delay}s infinite`;
    
    // Add to container
    container.appendChild(particle);
    
    // Create animation keyframes
    if (!document.getElementById('particle-animation')) {
        const style = document.createElement('style');
        style.id = 'particle-animation';
        style.textContent = `
            @keyframes floatParticle {
                0% {
                    transform: translate(0, 0) rotate(0deg);
                }
                25% {
                    transform: translate(20px, -20px) rotate(90deg);
                }
                50% {
                    transform: translate(0, -40px) rotate(180deg);
                }
                75% {
                    transform: translate(-20px, -20px) rotate(270deg);
                }
                100% {
                    transform: translate(0, 0) rotate(360deg);
                }
            }
        `;
        document.head.appendChild(style);
    }
}