/**
 * FeastFlow - User Card Component JavaScript
 * Handles interactions for user cards
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeUserCards();
});

/**
 * Initialize user cards with interactive features
 */
function initializeUserCards() {
    const userCards = document.querySelectorAll('.user-card');
    
    if (!userCards.length) return;
    
    userCards.forEach(card => {
        // Add hover effect for profile pictures
        const profilePicture = card.querySelector('.profile-picture-sm, .profile-picture-placeholder-sm');
        if (profilePicture) {
            profilePicture.addEventListener('mouseenter', () => {
                profilePicture.style.transform = 'scale(1.1) rotate(5deg)';
            });
            
            profilePicture.addEventListener('mouseleave', () => {
                profilePicture.style.transform = '';
            });
        }
        
        // Make the entire card clickable if it has a main action link
        const mainActionLink = card.querySelector('.user-card-actions a');
        if (mainActionLink) {
            card.style.cursor = 'pointer';
            
            card.addEventListener('click', (event) => {
                // Only trigger if not clicking on a link or button
                if (!event.target.closest('a') && !event.target.closest('button')) {
                    mainActionLink.click();
                }
            });
        }
        
        // Add subtle animation when cards come into view
        animateCardOnScroll(card);
    });
}

/**
 * Animate card when it comes into view
 * @param {HTMLElement} card - The card element to animate
 */
function animateCardOnScroll(card) {
    // Check if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        card.classList.add('card-animated');
                    }, Math.random() * 200); // Random delay for staggered effect
                    
                    observer.unobserve(card);
                }
            });
        }, {
            threshold: 0.2
        });
        
        observer.observe(card);
    } else {
        // Fallback for browsers that don't support Intersection Observer
        card.classList.add('card-animated');
    }
}

// Add animation styles
document.addEventListener('DOMContentLoaded', () => {
    // Add animation styles for user cards
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .user-card {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        .card-animated {
            opacity: 1;
            transform: translateY(0);
        }
        
        .profile-picture-sm,
        .profile-picture-placeholder-sm {
            transition: transform 0.3s ease;
        }
        
        .badge {
            animation: badge-pulse 2s infinite;
        }
        
        @keyframes badge-pulse {
            0% {
                box-shadow: 0 0 0 0 rgba(var(--ff-primary-rgb), 0.4);
            }
            70% {
                box-shadow: 0 0 0 5px rgba(var(--ff-primary-rgb), 0);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(var(--ff-primary-rgb), 0);
            }
        }
        
        .badge.bg-success {
            animation: badge-pulse-success 2s infinite;
        }
        
        @keyframes badge-pulse-success {
            0% {
                box-shadow: 0 0 0 0 rgba(var(--ff-success-rgb), 0.4);
            }
            70% {
                box-shadow: 0 0 0 5px rgba(var(--ff-success-rgb), 0);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(var(--ff-success-rgb), 0);
            }
        }
    `;
    
    document.head.appendChild(styleElement);
});

/**
 * Add badge highlight effect when user badges are present
 */
function initializeBadgeEffects() {
    const badges = document.querySelectorAll('.user-card .badge');
    
    badges.forEach(badge => {
        // Add tooltip information
        if (badge.textContent.includes('Organizer')) {
            badge.setAttribute('data-bs-toggle', 'tooltip');
            badge.setAttribute('data-bs-placement', 'top');
            badge.setAttribute('title', 'This user can create and manage events');
        } else if (badge.textContent.includes('Contributor')) {
            badge.setAttribute('data-bs-toggle', 'tooltip');
            badge.setAttribute('data-bs-placement', 'top');
            badge.setAttribute('title', 'This user contributes to events');
        }
        
        // Initialize tooltips if Bootstrap JS is available
        if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
            new bootstrap.Tooltip(badge);
        }
    });
}

// Initialize badge effects after DOM is loaded
document.addEventListener('DOMContentLoaded', initializeBadgeEffects);