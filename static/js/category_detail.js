// category_detail.js
document.addEventListener('DOMContentLoaded', function() {
    // Animate progress bars on page load
    animateProgressBars();
    
    // Apply status classes based on progress values
    updateStatusLabels();
    
    // Add hover effects to table rows
    setupTableRowHoverEffects();
    
    // Initialize tooltips for truncated content
    initializeTooltips();
    
    // Make the category progress card sticky on scroll
    initializeStickyCard();
});

/**
 * Animates all progress bars on the page
 */
function animateProgressBars() {
    // Main category progress bar
    const mainProgressBar = document.querySelector('.category-progress-card .progress-bar');
    if (mainProgressBar) {
        const percentage = parseInt(mainProgressBar.style.width) || 0;
        mainProgressBar.style.width = '0';
        
        setTimeout(() => {
            mainProgressBar.style.width = percentage + '%';
        }, 300);
    }
    
    // Item progress bars
    const itemProgressBars = document.querySelectorAll('.td-progress .progress-bar');
    itemProgressBars.forEach((bar, index) => {
        const percentage = parseInt(bar.style.width) || 0;
        bar.style.width = '0';
        
        setTimeout(() => {
            bar.style.width = percentage + '%';
        }, 300 + (index * 100)); // Staggered animation
    });
    
    // Other categories progress bars
    const categoryProgressBars = document.querySelectorAll('.category-card .progress-bar');
    categoryProgressBars.forEach((bar, index) => {
        const percentage = parseInt(bar.style.width) || 0;
        bar.style.width = '0';
        
        setTimeout(() => {
            bar.style.width = percentage + '%';
        }, 600 + (index * 100)); // Staggered animation with delay
    });
}

/**
 * Updates the visual status labels based on progress percentages
 */
function updateStatusLabels() {
    // Get the main status badge
    const statusBadge = document.querySelector('.status-badge');
    if (statusBadge) {
        // Classes already set in HTML
    }
    
    // Update contribution counts styling
    const contributionCounts = document.querySelectorAll('.contribution-count');
    contributionCounts.forEach(count => {
        // Classes already set in HTML
    });
    
    // Update progress bars colors (optional additional styling)
    const itemProgressBars = document.querySelectorAll('.item-progress-fill');
    itemProgressBars.forEach(bar => {
        const percentage = parseInt(bar.style.width);
        if (percentage === 100) {
            bar.classList.add('completed');
        }
    });
}

/**
 * Sets up interactive hover effects for table rows
 */
function setupTableRowHoverEffects() {
    const tableRows = document.querySelectorAll('.table-row');
    
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'var(--neutral-50)';
            
            // Subtle lift effect
            this.style.transform = 'translateY(-1px)';
            this.style.boxShadow = 'var(--shadow-sm)';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
}

/**
 * Initializes tooltips for truncated content
 */
function initializeTooltips() {
    const truncatedElements = document.querySelectorAll('.item-comments');
    
    truncatedElements.forEach(element => {
        if (element.scrollWidth > element.clientWidth || element.textContent.length > 100) {
            element.title = element.textContent;
            element.classList.add('has-tooltip');
            
            // Custom tooltip implementation can be added here
        }
    });
}

/**
 * Makes the category progress card sticky when scrolling
 */
function initializeStickyCard() {
    const progressCard = document.querySelector('.category-progress-card');
    const mainContent = document.querySelector('.main-content');
    
    if (!progressCard || !mainContent || window.innerWidth < 992) return;
    
    const originalTop = progressCard.getBoundingClientRect().top + window.scrollY;
    const bottomBoundary = mainContent.getBoundingClientRect().bottom + window.scrollY - progressCard.offsetHeight - 20;
    
    window.addEventListener('scroll', function() {
        if (window.innerWidth < 992) return;
        
        const scrollY = window.scrollY;
        
        if (scrollY > originalTop) {
            if (scrollY < bottomBoundary) {
                progressCard.style.position = 'fixed';
                progressCard.style.top = '20px';
                progressCard.style.width = progressCard.parentElement.offsetWidth + 'px';
            } else {
                progressCard.style.position = 'absolute';
                progressCard.style.top = (bottomBoundary - originalTop + 20) + 'px';
            }
        } else {
            progressCard.style.position = '';
            progressCard.style.top = '';
            progressCard.style.width = '';
        }
    });
    
    // Recalculate on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth < 992) {
            progressCard.style.position = '';
            progressCard.style.top = '';
            progressCard.style.width = '';
        } else {
            progressCard.style.width = progressCard.parentElement.offsetWidth + 'px';
        }
    });
}

/**
 * Function to handle copying contribution link to clipboard
 */
function copyContributionLink(itemId) {
    const contributionUrl = document.querySelector(`.contribute-btn[data-item-id="${itemId}"]`).getAttribute('href');
    if (!contributionUrl) return;
    
    const tempInput = document.createElement('input');
    document.body.appendChild(tempInput);
    tempInput.value = window.location.origin + contributionUrl;
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    
    // Show confirmation toast
    showToast('Link copied to clipboard!');
}

/**
 * Shows a toast notification message
 */
function showToast(message) {
    // Create toast element if it doesn't exist
    let toast = document.getElementById('toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notification';
        toast.className = 'toast-notification';
        document.body.appendChild(toast);
        
        // Add toast styling
        const style = document.createElement('style');
        style.textContent = `
            .toast-notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: var(--neutral-800);
                color: white;
                padding: 0.75rem 1.25rem;
                border-radius: var(--border-radius-md);
                font-size: 0.875rem;
                z-index: 1000;
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.3s, transform 0.3s;
                box-shadow: var(--shadow-md);
            }
            
            .toast-notification.visible {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Set message and show toast
    toast.textContent = message;
    toast.classList.add('visible');
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('visible'); 
    }, 3000);
}  