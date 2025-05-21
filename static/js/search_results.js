// search_results.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initAnimations();
    
    // Initialize layout toggle
    initLayoutToggle();
    
    // Initialize progress bars
    animateProgressBars();
    
    // Add event listeners
    addEventListeners();
    
    // Initialize header gradient animation
    initHeaderGradient();
    
    // Initialize favorite buttons
    initFavoriteButtons();
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
 * Initialize layout toggle between grid and list view
 */
function initLayoutToggle() {
    const gridButton = document.querySelector('.btn-view.grid');
    const listButton = document.querySelector('.btn-view.list');
    const resultsContainer = document.querySelector('.search-results-container');
    
    if (!gridButton || !listButton || !resultsContainer) return;
    
    // Check for saved preference in localStorage
    const savedView = localStorage.getItem('searchResultsView');
    if (savedView === 'list') {
        resultsContainer.classList.remove('grid-view');
        resultsContainer.classList.add('list-view');
        gridButton.classList.remove('active');
        listButton.classList.add('active');
    }
    
    gridButton.addEventListener('click', function() {
        if (this.classList.contains('active')) return;
        
        this.classList.add('active');
        listButton.classList.remove('active');
        
        resultsContainer.classList.remove('list-view');
        resultsContainer.classList.add('grid-view');
        
        // Save preference
        localStorage.setItem('searchResultsView', 'grid');
        
        // Trigger resize to adjust masonry layout
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 100);
    });
    
    listButton.addEventListener('click', function() {
        if (this.classList.contains('active')) return;
        
        this.classList.add('active');
        gridButton.classList.remove('active');
        
        resultsContainer.classList.remove('grid-view');
        resultsContainer.classList.add('list-view');
        
        // Save preference
        localStorage.setItem('searchResultsView', 'list');
        
        // Trigger resize to adjust masonry layout
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 100);
    });
}

/**
 * Animate progress bars
 */
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach(bar => {
        const percentage = bar.getAttribute('data-percentage');
        
        // Initially set width to 0
        bar.style.width = '0%';
        
        // Animate the width after a delay
        setTimeout(() => {
            bar.style.transition = 'width 1s ease';
            bar.style.width = percentage + '%';
        }, 500);
    });
}