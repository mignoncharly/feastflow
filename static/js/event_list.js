// event_list.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initAnimations();
    
    // Initialize view toggle
    initViewToggle();
    
    // Initialize status filter options
    initStatusFilter();
    
    // Add event listeners
    addEventListeners();
    
    // Initialize header gradient animation
    initHeaderGradient();
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
 * Initialize view toggle between grid and list
 */
function initViewToggle() {
    const gridButton = document.querySelector('.btn-view.grid');
    const listButton = document.querySelector('.btn-view.list');
    const eventsContainer = document.querySelector('.events-grid');
    
    if (!gridButton || !listButton || !eventsContainer) return;
    
    // Check for saved preference in localStorage
    const savedView = localStorage.getItem('eventsViewMode');
    if (savedView === 'list') {
        eventsContainer.classList.remove('grid-view');
        eventsContainer.classList.add('list-view');
        gridButton.classList.remove('active');
        listButton.classList.add('active');
    }
    
    gridButton.addEventListener('click', function() {
        if (this.classList.contains('active')) return;
        
        this.classList.add('active');
        listButton.classList.remove('active');
        
        eventsContainer.classList.remove('list-view');
        eventsContainer.classList.add('grid-view');
        
        // Save preference
        localStorage.setItem('eventsViewMode', 'grid');
        
        // Animate grid items
        animateGridItems();
    });
    
    listButton.addEventListener('click', function() {
        if (this.classList.contains('active')) return;
        
        this.classList.add('active');
        gridButton.classList.remove('active');
        
        eventsContainer.classList.remove('grid-view');
        eventsContainer.classList.add('list-view');
        
        // Save preference
        localStorage.setItem('eventsViewMode', 'list');
        
        // Animate list items
        animateListItems();
    });
    
    /**
     * Animate grid items when switching view
     */
    function animateGridItems() {
        const eventCards = document.querySelectorAll('.event-card');
        
        eventCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 50); // Stagger animation
        });
    }
    
    /**
     * Animate list items when switching view
     */
    function animateListItems() {
        const eventCards = document.querySelectorAll('.event-card');
        
        eventCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateX(0)';
            }, index * 100); // Stagger animation
        });
    }
}

/**
 * Initialize status filter options
 */
function initStatusFilter() {
    const statusOptions = document.querySelectorAll('.status-option');
    const statusSelect = document.getElementById('status');
    
    if (!statusOptions.length || !statusSelect) return;
    
    statusOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Update active class
            statusOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // Update hidden select
            const value = this.getAttribute('data-value');
            statusSelect.value = value;
        });
    });
}

/**
 * Add event listeners for interactive elements
 */
function addEventListeners() {
    // Add hover effects for event cards
    const eventCards = document.querySelectorAll('.event-card');
    
    eventCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = 'var(--shadow-lg)';
            
            // Animate the arrow icon
            const arrow = this.querySelector('.btn-view-event i');
            if (arrow) {
                arrow.style.transform = 'translateX(3px)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--shadow-md)';
            
            // Reset the arrow icon
            const arrow = this.querySelector('.btn-view-event i');
            if (arrow) {
                arrow.style.transform = 'translateX(0)';
            }
        });
    });
    
    // Add hover effects for buttons
    const buttons = document.querySelectorAll('.btn-create-event, .btn-filter, .btn-create');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            
            if (this.classList.contains('btn-create-event')) {
                this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            } else {
                this.style.boxShadow = 'var(--shadow-sm)';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
    
    // Add ripple effect to buttons
    const allButtons = document.querySelectorAll('.btn-view-event, .btn-filter, .btn-create-event, .btn-create, .btn-clear, .btn-clear-filters');
    
    allButtons.forEach(button => {
        addRippleEffect(button);
    });
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

// Add additional CSS for animations
(function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .fade-in.visible, .slide-up.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .ripple-effect {
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
        
        .btn-view-event, .btn-filter, .btn-create-event, .btn-create, .btn-clear, .btn-clear-filters { 
            position: relative;
            overflow: hidden;
        }
        
        @media (prefers-reduced-motion: reduce) {
            .fade-in, .slide-up {
                animation: none;
                opacity: 1;
            }
            
            .ripple-effect {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);
})();