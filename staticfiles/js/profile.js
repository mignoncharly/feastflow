// Profile JavaScript - FeastFlow Modern Profile

document.addEventListener('DOMContentLoaded', function() {
    // Initialize statistics counter animation
    animateStatCounters();
    
    // Initialize tab functionality
    initializeTabs();
    
    // Add ripple effect to buttons
    addRippleEffect();
    
    // Add animations and interactive elements
    enhanceInteractivity();
});

/**
 * Animates the statistics counters
 */
function animateStatCounters() {
    const statItems = document.querySelectorAll('.stat-item');
    
    statItems.forEach(item => {
        const counter = item.querySelector('.stat-counter');
        const targetValue = parseInt(item.dataset.value);
        
        if (isNaN(targetValue)) return;
        
        const duration = 1500; // Animation duration in milliseconds
        const framesPerSecond = 60;
        const totalFrames = duration / 1000 * framesPerSecond;
        let currentFrame = 0;
        
        const initialValue = 0;
        const valueIncrement = (targetValue - initialValue) / totalFrames;
        
        counter.textContent = initialValue;
        
        const animate = () => {
            currentFrame++;
            const newValue = Math.round(initialValue + valueIncrement * currentFrame); 
            
            counter.textContent = newValue;
            
            if (currentFrame < totalFrames) {
                requestAnimationFrame(animate);
            } else {
                counter.textContent = targetValue;
            }
        };
        
        // Add a slight delay to make it more visually appealing
        setTimeout(() => {
            animate();
        }, 300);
    });
}

/**
 * Initializes the tab functionality
 */
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Update active tab button
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            
            // Update active tab panel
            tabPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === `${targetTab}-panel`) {
                    panel.classList.add('active');
                }
            });
        });
    });
}

/**
 * Adds ripple effect to buttons
 */
function addRippleEffect() {
    const buttons = document.querySelectorAll('.quick-action, .security-button, .event-action-button, .action-button, .view-all-button, .tab-button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.classList.add('ripple-effect');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

/**
 * Enhances the interactivity of various elements
 */
function enhanceInteractivity() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.profile-card, .event-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Add hover effects to table rows
    const tableRows = document.querySelectorAll('.table-row');
    
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'var(--light-color)';
            this.style.boxShadow = 'var(--shadow-sm)';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
            this.style.boxShadow = '';
        });
    });
    
    // Add sparkle effect to achievements when hovered
    const achievements = document.querySelectorAll('.achievement-item.unlocked');
    
    achievements.forEach(achievement => {
        achievement.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.achievement-icon i');
            icon.classList.add('fa-beat');
            
            const badge = this.querySelector('.achievement-badge i');
            badge.classList.add('fa-bounce');
        });
        
        achievement.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.achievement-icon i');
            icon.classList.remove('fa-beat');
            
            const badge = this.querySelector('.achievement-badge i');
            badge.classList.remove('fa-bounce');
        });
    });
    
    // Add highlighting for active stat cards
    const statItems = document.querySelectorAll('.stat-item');
    
    statItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove highlight from all stat items
            statItems.forEach(statItem => {
                statItem.classList.remove('active-stat');
            });
            
            // Add highlight to clicked stat item
            this.classList.add('active-stat');
            
            // Pulse animation for the counter
            const counter = this.querySelector('.stat-counter');
            counter.classList.add('pulse-animation');
            
            setTimeout(() => {
                counter.classList.remove('pulse-animation');
            }, 1000);
        });
    });
    
    // Add avatar rotating animation on click
    const profileAvatar = document.querySelector('.profile-avatar');
    
    if (profileAvatar) {
        profileAvatar.addEventListener('click', function() {
            this.classList.add('rotate-animation');
            
            setTimeout(() => {
                this.classList.remove('rotate-animation');
            }, 1000);
        });
    }
    
    // Add tooltip functionality
    initTooltips();
}

/**
 * Initializes tooltip functionality for achievement items
 */
function initTooltips() {
    const achievementItems = document.querySelectorAll('.achievement-item');
    
    achievementItems.forEach(item => {
        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.classList.add('achievement-tooltip');
        
        // Get achievement details
        const title = item.querySelector('h3').textContent;
        const description = item.querySelector('p').textContent;
        const isUnlocked = item.classList.contains('unlocked');
        
        // Set tooltip content
        tooltip.innerHTML = `
            <div class="tooltip-header">
                <span class="tooltip-title">${title}</span>
                <span class="tooltip-status">${isUnlocked ? 'Unlocked' : 'Locked'}</span>
            </div>
            <div class="tooltip-description">${description}</div>
            ${isUnlocked ? '<div class="tooltip-date">Achieved on May 5, 2025</div>' : '<div class="tooltip-hint">Keep contributing to unlock this!</div>'}
        `;
        
        // Add tooltip to body
        document.body.appendChild(tooltip);
        
        // Show tooltip on hover
        item.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
            tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
            tooltip.classList.add('show-tooltip');
        });
        
        // Hide tooltip when not hovering
        item.addEventListener('mouseleave', function() {
            tooltip.classList.remove('show-tooltip');
        });
    });
    
    // Add CSS styles for tooltips
    addTooltipStyles();
}

/**
 * Adds CSS styles for tooltips
 */
function addTooltipStyles() {
    if (document.getElementById('tooltip-styles')) return;
    
    const styleSheet = document.createElement('style');
    styleSheet.id = 'tooltip-styles';
    
styleSheet.innerHTML = `
        .achievement-tooltip {
            position: absolute;
            z-index: 1000;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            padding: 12px;
            width: 250px;
            pointer-events: none;
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
        
        .show-tooltip {
            opacity: 1;
            transform: translateY(0);
        }
        
        .tooltip-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }
        
        .tooltip-title {
            font-weight: 700;
            color: #2c3e50;
        }
        
        .tooltip-status {
            font-size: 12px;
            padding: 2px 8px;
            border-radius: 10px;
            background-color: rgba(241, 196, 15, 0.1);
            color: #f1c40f;
        }
        
        .tooltip-description {
            font-size: 14px;
            color: #6c757d;
            margin-bottom: 8px;
        }
        
        .tooltip-date {
            font-size: 12px;
            color: #6c757d;
            font-style: italic;
        }
        
        .tooltip-hint {
            font-size: 12px;
            color: #6c757d;
            font-style: italic;
        }
        
        .pulse-animation {
            animation: pulse-text 1s ease;
        }
        
        @keyframes pulse-text {
            0% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.2);
                color: var(--primary-color); 
            }
            100% {
                transform: scale(1);
            }
        }
        
        .rotate-animation {
            animation: rotate-avatar 1s ease;
        }
        
        @keyframes rotate-avatar {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
        
        .active-stat {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }
        
        .active-stat .stat-highlight {
            height: 6px;
            opacity: 1;
        }
    `;
    
    document.head.appendChild(styleSheet);
}