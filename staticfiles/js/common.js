// static/js/common.js

/**
 * Initialize common components across the site
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize any tooltips
    initializeTooltips();
    
    // Initialize form validation
    initializeFormValidation();
});

/**
 * Initialize Bootstrap tooltips
 */
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

/**
 * Initialize form validation
 */
function initializeFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');
    
    Array.from(forms).forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            form.classList.add('was-validated');
        }, false);
    });
}

/**
 * Handle confirmation dialog
 * @param {string} message - Confirmation message
 * @param {function} callback - Function to execute if confirmed
 * @returns {boolean}
 */
function confirmAction(message, callback) {
    if (confirm(message)) {
        if (typeof callback === 'function') {
            return callback();
        }
        return true;
    }
    return false;
}

/**
 * Format dates for display
 * @param {Date|string} date - Date to format
 * @param {string} format - Format string (optional)
 * @returns {string}
 */
function formatDate(date, format = 'long') {
    if (!date) return '';
    
    // Create a date object
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Format options
    if (format === 'long') {
        return dateObj.toLocaleDateString(undefined, { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    } else if (format === 'short') {
        return dateObj.toLocaleDateString(undefined, { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    } else if (format === 'time') {
        return dateObj.toLocaleTimeString(undefined, { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    } else if (format === 'datetime') {
        return dateObj.toLocaleDateString(undefined, { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
    
    return dateObj.toLocaleDateString();
}

/**
 * Handle Ajax requests with a simplified interface
 * @param {string} url - URL to fetch
 * @param {object} options - Fetch options
 * @param {function} successCallback - Success callback
 * @param {function} errorCallback - Error callback
 */
function ajaxRequest(url, options = {}, successCallback, errorCallback) {
    // Default options
    const defaultOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        }
    };
    
    // Merge options
    const fetchOptions = {...defaultOptions, ...options};
    
    // Add CSRF token for non-GET requests
    if (fetchOptions.method !== 'GET') {
        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        fetchOptions.headers['X-CSRFToken'] = csrftoken;
    }
    
    // Make the request
    fetch(url, fetchOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (typeof successCallback === 'function') {
                successCallback(data);
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            if (typeof errorCallback === 'function') {
                errorCallback(error);
            }
        });
}

/**
 * Helper for showing notifications
 * @param {string} message - Message to display
 * @param {string} type - Notification type (success, error, warning, info)
 * @param {number} duration - Duration in ms
 */
function showNotification(message, type = 'info', duration = 3000) {
    // Check if notifications container exists
    let container = document.getElementById('notifications-container');
    
    // Create container if it doesn't exist
    if (!container) {
        container = document.createElement('div');
        container.id = 'notifications-container';
        container.className = 'notifications-container';
        document.body.appendChild(container);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = 'notification-message';
    messageEl.textContent = message;
    
    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'notification-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', function() {
        notification.classList.add('notification-hiding');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Append elements
    notification.appendChild(messageEl);
    notification.appendChild(closeBtn);
    container.appendChild(notification);
    
    // Add appear animation
    setTimeout(() => {
        notification.classList.add('notification-visible');
    }, 10);
    
    // Auto-hide after duration
    if (duration > 0) {
        setTimeout(() => {
            notification.classList.add('notification-hiding');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, duration);
    }
}