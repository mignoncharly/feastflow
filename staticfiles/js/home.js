/**
 * FeastFlow - Home Page JavaScript
 * Handles animations and interactions for the home page
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize components
  initializeParticles();
  initializeEventCards();
  initializeCTAAnimation();
});

/**
* Initialize particles for hero section background 
*/
function initializeParticles() {
  // Check if particles.js is loaded
  if (typeof particlesJS !== 'undefined') {
      particlesJS('hero-particles', {
          "particles": {
              "number": {
                  "value": 80,
                  "density": {
                      "enable": true,
                      "value_area": 800
                  }
              },
              "color": {
                  "value": "#ffffff"
              },
              "shape": {
                  "type": "circle",
                  "stroke": {
                      "width": 0,
                      "color": "#000000"
                  },
                  "polygon": {
                      "nb_sides": 5
                  }
              },
              "opacity": {
                  "value": 0.3,
                  "random": true,
                  "anim": {
                      "enable": true,
                      "speed": 1,
                      "opacity_min": 0.1,
                      "sync": false
                  }
              },
              "size": {
                  "value": 3,
                  "random": true,
                  "anim": {
                      "enable": false,
                      "speed": 40,
                      "size_min": 0.1,
                      "sync": false
                  }
              },
              "line_linked": {
                  "enable": true,
                  "distance": 150,
                  "color": "#ffffff",
                  "opacity": 0.2,
                  "width": 1
              },
              "move": {
                  "enable": true,
                  "speed": 2,
                  "direction": "none",
                  "random": true,
                  "straight": false,
                  "out_mode": "out",
                  "bounce": false,
                  "attract": {
                      "enable": false,
                      "rotateX": 600,
                      "rotateY": 1200
                  }
              }
          },
          "interactivity": {
              "detect_on": "canvas",
              "events": {
                  "onhover": {
                      "enable": true,
                      "mode": "grab"
                  },
                  "onclick": {
                      "enable": true,
                      "mode": "push"
                  },
                  "resize": true
              },
              "modes": {
                  "grab": {
                      "distance": 140,
                      "line_linked": {
                          "opacity": 0.5
                      }
                  },
                  "bubble": {
                      "distance": 400,
                      "size": 40,
                      "duration": 2,
                      "opacity": 8,
                      "speed": 3
                  },
                  "repulse": {
                      "distance": 200,
                      "duration": 0.4
                  },
                  "push": {
                      "particles_nb": 4
                  },
                  "remove": {
                      "particles_nb": 2
                  }
              }
          },
          "retina_detect": true
      });
  }
}

/**
* Initialize event card interactions
*/
function initializeEventCards() {
  const eventCards = document.querySelectorAll('.event-card');
  
  eventCards.forEach(card => {
      // Add hover effect for links inside cards
      const links = card.querySelectorAll('a:not(.event-details-button)');
      links.forEach(link => {
          link.addEventListener('mouseenter', () => {
              card.classList.add('card-link-hovered');
          });
          
          link.addEventListener('mouseleave', () => {
              card.classList.remove('card-link-hovered');
          });
      });
      
      // Add click event to make entire card clickable
      card.addEventListener('click', (event) => {
          // Only trigger if not clicking on a link or button
          if (!event.target.closest('a') && !event.target.closest('button')) {
              const mainLink = card.querySelector('.event-title a');
              if (mainLink) {
                  mainLink.click();
              }
          }
      });
  });
}

/**
* Initialize CTA section animations
*/
function initializeCTAAnimation() {
  // Add parallax effect to CTA section
  const ctaSection = document.querySelector('.cta-section');
  
  if (ctaSection) {
      window.addEventListener('scroll', () => {
          const scrollPosition = window.scrollY;
          const ctaPosition = ctaSection.offsetTop;
          const windowHeight = window.innerHeight;
          
          // Only animate when CTA is in view
          if (scrollPosition + windowHeight > ctaPosition) {
              const distance = scrollPosition + windowHeight - ctaPosition;
              const parallaxSpeed = 0.3;
              
              // Move shapes for parallax effect
              const shapes = ctaSection.querySelectorAll('.cta-shape');
              shapes.forEach((shape, index) => {
                  const direction = index % 2 === 0 ? 1 : -1;
                  const speed = parallaxSpeed * (index + 1) * 0.5;
                  shape.style.transform = `translateY(${distance * speed * direction * 0.05}px)`;
              });
          }
      });
  }
}

/**
* Handles the hero image animation
*/
function animateHeroImage() {
  const heroImage = document.querySelector('.hero-image');
  const heroGlow = document.querySelector('.hero-image-glow');
  
  if (heroImage && heroGlow) {
      // Add animated entry
      heroImage.style.opacity = '0';
      heroImage.style.transform = 'translateY(30px) scale(0.95)';
      heroGlow.style.opacity = '0';
      
      setTimeout(() => {
          heroImage.style.transition = 'all 1s cubic-bezier(0.23, 1, 0.32, 1)';
          heroGlow.style.transition = 'all 1.5s cubic-bezier(0.23, 1, 0.32, 1)';
          heroImage.style.opacity = '1';
          heroImage.style.transform = 'translateY(0) scale(1)';
          heroGlow.style.opacity = '0.4';
      }, 300);
      
      // Add floating animation
      let floatInterval;
      const startFloating = () => {
          let direction = 1;
          let position = 0;
          const maxPosition = 10;
          
          floatInterval = setInterval(() => {
              position += 0.1 * direction;
              
              if (position >= maxPosition) {
                  direction = -1;
              } else if (position <= 0) {
                  direction = 1;
              }
              
              heroImage.style.transform = `translateY(${position}px)`;
          }, 30);
      };
      
      // Start floating animation after initial animation
      setTimeout(startFloating, 1500);
  }
}

/**
* Initialize sticky section headers on scroll
*/
function initializeStickyHeaders() {
  const sectionHeaders = document.querySelectorAll('.section-header');
  
  window.addEventListener('scroll', () => {
      sectionHeaders.forEach(header => {
          const headerPosition = header.getBoundingClientRect().top;
          const parentSection = header.closest('section');
          
          if (headerPosition <= 0 && parentSection.getBoundingClientRect().bottom > 100) {
              header.classList.add('sticky-header');
          } else {
              header.classList.remove('sticky-header');
          }
      });
  });
}

/**
* Initialize "How It Works" section animation
*/
function initializeHowItWorksAnimation() {
  const stepsRow = document.querySelector('.steps-row');
  
  if (stepsRow) {
      const stepCards = stepsRow.querySelectorAll('.step-card');
      
      // Function to check if element is in viewport
      const isInViewport = (element) => {
          const rect = element.getBoundingClientRect();
          return (
              rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
              rect.bottom >= 0
          );
      };
      
      // Check on scroll
      window.addEventListener('scroll', () => {
          if (isInViewport(stepsRow)) {
              stepCards.forEach((card, index) => {
                  setTimeout(() => {
                      card.classList.add('step-visible');
                  }, index * 200);
              });
          }
      });
      
      // Check on page load
      if (isInViewport(stepsRow)) {
          stepCards.forEach((card, index) => {
              setTimeout(() => {
                  card.classList.add('step-visible');
              }, index * 200);
          });
      }
  }
}

/**
* Initialize feature cards animation
*/
function initializeFeatureCardsAnimation() {
  const featureCards = document.querySelectorAll('.feature-card');
  
  featureCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
          const icon = card.querySelector('.feature-icon i');
          
          // Add spinning animation to icon
          if (icon) {
              icon.classList.add('spin-animation');
              
              // Remove class after animation completes
              setTimeout(() => {
                  icon.classList.remove('spin-animation');
              }, 1000);
          }
      });
  });
}

/**
* Initialize on page load
*/
window.addEventListener('load', () => {
  // Delay to ensure everything is loaded
  setTimeout(() => {
      animateHeroImage();
      initializeStickyHeaders();
      initializeHowItWorksAnimation();
      initializeFeatureCardsAnimation();
      
      // Add scroll indicator
      addScrollIndicator();
  }, 500);
});

/**
* Add scroll indicator to hero section
*/
function addScrollIndicator() {
  const heroSection = document.querySelector('.hero-section');
  
  if (heroSection) {
      const scrollIndicator = document.createElement('div');
      scrollIndicator.className = 'scroll-indicator';
      scrollIndicator.innerHTML = '<div class="scroll-icon"><i class="bi bi-chevron-down"></i></div>';
      
      heroSection.appendChild(scrollIndicator);
      
      // Animate scroll indicator
      scrollIndicator.style.opacity = '0';
      scrollIndicator.style.transform = 'translateY(-20px)';
      
      setTimeout(() => {
          scrollIndicator.style.transition = 'all 0.5s ease-out';
          scrollIndicator.style.opacity = '1';
          scrollIndicator.style.transform = 'translateY(0)';
      }, 2000);
      
      // Scroll to content when clicked
      scrollIndicator.addEventListener('click', () => {
          const nextSection = heroSection.nextElementSibling;
          
          if (nextSection) {
              nextSection.scrollIntoView({
                  behavior: 'smooth'
              });
          }
      });
      
      // Hide scroll indicator when scrolling down
      window.addEventListener('scroll', () => {
          if (window.scrollY > 100) {
              scrollIndicator.style.opacity = '0';
          } else {
              scrollIndicator.style.opacity = '1';
          }
      });
  }
}

/**
* Add custom styling to the scroll-indicator
*/
function addCustomStyles() {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
      .scroll-indicator {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          z-index: 10;
          transition: opacity 0.3s ease;
      }
      
      .scroll-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          animation: bounce 2s infinite;
      }
      
      .scroll-icon i {
          color: var(--ff-primary);
          font-size: 1.2rem;
      }
      
      @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
          }
          40% {
              transform: translateY(-10px);
          }
          60% {
              transform: translateY(-5px);
          }
      }
      
      .spin-animation {
          animation: spin 1s ease-in-out;
      }
      
      @keyframes spin {
          0% {
              transform: rotate(0deg);
          }
          100% {
              transform: rotate(360deg);
          }
      }
      
      .step-card {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
      }
      
      .step-visible {
          opacity: 1;
          transform: translateY(0);
      }
      
      .sticky-header {
          position: sticky;
          top: 0;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          background-color: rgba(var(--ff-bg-rgb), 0.85);
          padding: 15px;
          border-radius: var(--border-radius-md);
          z-index: 100;
          box-shadow: var(--shadow-md);
          transition: all 0.3s ease;
      }
  `;
  
  document.head.appendChild(styleElement);
}

// Add custom styles
addCustomStyles();