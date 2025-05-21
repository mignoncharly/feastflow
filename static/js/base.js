/**
 * FeastFlow - Base JavaScript File
 * Handles interactions for the base template
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize components
  initializeAOS();
  initializeNavbar();
  initializeSearchBar();
  initializeAlerts();
  initializeBackToTop();
  initializeLanguageSelector();
});

/**
* Initialize AOS (Animate On Scroll) library 
*/
function initializeAOS() {
  // Check if AOS is available
  if (typeof AOS !== 'undefined') {
      AOS.init({
          duration: 800,
          easing: 'ease-out',
          once: true,
          offset: 100,
          delay: 100,
          disable: 'mobile' 
      });
  }
}

/**
* Initialize navbar behavior
*/
function initializeNavbar() {
  const header = document.querySelector('.header');
  const toggler = document.querySelector('.navbar-toggler');
  const navbarCollapse = document.querySelector('.navbar-collapse');
  
  // Navbar scroll effect
  window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
          header.classList.add('scrolled');
      } else {
          header.classList.remove('scrolled');
      }
  });
  
  // Auto-collapse navbar on item click on mobile
  if (navbarCollapse) {
      const navLinks = navbarCollapse.querySelectorAll('.nav-link');
      
      navLinks.forEach(link => {
          link.addEventListener('click', () => {
              if (window.innerWidth < 992) {
                  navbarCollapse.classList.remove('show');
                  toggler.setAttribute('aria-expanded', 'false');
              }
          });
      });
  }
  
  // Close navbar when clicking outside on mobile
  document.addEventListener('click', (event) => {
      const isClickInsideNavbar = navbarCollapse?.contains(event.target) || toggler?.contains(event.target);
      
      if (!isClickInsideNavbar && navbarCollapse?.classList.contains('show') && window.innerWidth < 992) {
          navbarCollapse.classList.remove('show');
          toggler.setAttribute('aria-expanded', 'false');
      }
  });
}

/**
* Initialize search bar functionality
*/
function initializeSearchBar() {
  const searchInput = document.getElementById('search-input');
  const searchClear = document.querySelector('.search-clear');
  const searchForm = document.querySelector('.search-form');
  
  if (!searchInput || !searchClear || !searchForm) return;
  
  // Clear search input
  searchClear.addEventListener('click', () => {
      searchInput.value = '';
      searchInput.focus();
  });
  
  // Keyboard shortcut to focus search
  document.addEventListener('keydown', (event) => {
      // Check if the pressed key is '/' and no input or textarea is currently focused
      if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
          event.preventDefault();
          searchInput.focus();
      }
      
      // Close search on escape key
      if (event.key === 'Escape' && document.activeElement === searchInput) {
          searchInput.blur();
      }
  });
  
  // Add custom validation
  searchForm.addEventListener('submit', (event) => {
      if (searchInput.value.trim() === '') {
          event.preventDefault();
          searchInput.classList.add('invalid');
          setTimeout(() => {
              searchInput.classList.remove('invalid');
          }, 500);
      }
  });
}

/**
* Initialize alerts behavior
*/
function initializeAlerts() {
  const alerts = document.querySelectorAll('.alert');
  
  alerts.forEach(alert => {
      // Auto-dismiss alerts after 5 seconds
      setTimeout(() => {
          dismissAlert(alert);
      }, 5000);
      
      // Dismiss alert on close button click
      const closeBtn = alert.querySelector('.alert-close');
      if (closeBtn) {
          closeBtn.addEventListener('click', () => {
              dismissAlert(alert);
          });
      }
  });
}

/**
* Dismisses an alert with animation
* @param {HTMLElement} alert - The alert element to dismiss
*/
function dismissAlert(alert) {
  if (!alert || alert.classList.contains('dismissing')) return;
  
  alert.classList.add('dismissing');
  alert.style.transition = 'all 0.3s ease-out';
  alert.style.opacity = '0';
  alert.style.transform = 'translateY(-20px)';
  
  setTimeout(() => {
      alert.remove();
  }, 300);
}

/**
* Initialize back to top button
*/
function initializeBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  
  if (!backToTopBtn) return;
  
  // Show/hide button based on scroll position
  window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
          backToTopBtn.classList.add('visible');
      } else {
          backToTopBtn.classList.remove('visible');
      }
  });
  
  // Scroll to top when button is clicked
  backToTopBtn.addEventListener('click', (event) => {
      event.preventDefault();
      window.scrollTo({
          top: 0,
          behavior: 'smooth'
      });
  });
}

/**
* Initialize language selector
*/
function initializeLanguageSelector() {
  const languageForms = document.querySelectorAll('.language-form');
  
  languageForms.forEach(form => {
      const button = form.querySelector('button');
      
      button.addEventListener('click', () => {
          // Show loading indicator
          button.innerHTML = '<i class="bi bi-arrow-repeat spin"></i>';
          
          // Submit form after visual feedback
          setTimeout(() => {
              form.submit();
          }, 300);
      });
  });
}

/**
* Adds a ripple effect to buttons
* Called by elements with data-ripple attribute
* @param {Event} event - The click event
*/
function createRippleEffect(event) {
  const button = event.currentTarget;
  
  const circle = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;
  
  // Position the ripple
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
  circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
  circle.classList.add('ripple');
  
  // Remove existing ripples
  const ripple = button.querySelector('.ripple');
  if (ripple) {
      ripple.remove();
  }
  
  // Add the ripple to the button
  button.appendChild(circle);
  
  // Remove the ripple after animation completes
  setTimeout(() => {
      circle.remove();
  }, 600);
}

// Add ripple effect to buttons with data-ripple attribute
document.querySelectorAll('[data-ripple]').forEach(button => {
  button.addEventListener('click', createRippleEffect);
});

/**
* Handles form submissions with AJAX
* For forms with data-ajax attribute
*/
function handleAjaxForm() {
  const ajaxForms = document.querySelectorAll('form[data-ajax]');
  
  ajaxForms.forEach(form => {
      form.addEventListener('submit', async (event) => {
          event.preventDefault();
          
          const submitBtn = form.querySelector('[type="submit"]');
          const originalBtnText = submitBtn.innerHTML;
          const formData = new FormData(form);
          
          // Change button state
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<i class="bi bi-arrow-repeat spin"></i> Processing...';
          
          try {
              const response = await fetch(form.action, {
                  method: form.method || 'POST',
                  body: formData,
                  headers: {
                      'X-Requested-With': 'XMLHttpRequest'
                  }
              });
              
              const data = await response.json();
              
              if (data.success) {
                  // Show success message
                  showNotification(data.message || 'Success!', 'success');
                  
                  // Reset form if needed
                  if (form.dataset.reset === 'true') {
                      form.reset();
                  }
                  
                  // Custom success callback
                  if (typeof window[form.dataset.successCallback] === 'function') {
                      window[form.dataset.successCallback](data);
                  }
              } else {
                  // Show error message
                  showNotification(data.message || 'An error occurred. Please try again.', 'error');
              }
          } catch (error) {
              console.error('Form submission error:', error);
              showNotification('An unexpected error occurred. Please try again.', 'error');
          } finally {
              // Restore button state
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalBtnText;
          }
      });
  });
}

/**
* Shows a notification message
* @param {string} message - The message to display
* @param {string} type - The type of notification (success, error, warning, info)
*/
function showNotification(message, type = 'info') {
  const alertsContainer = document.querySelector('.alerts-container');
  
  if (!alertsContainer) return;
  
  // Create alert element
  const alert = document.createElement('div');
  alert.className = `alert alert-${type} alert-animated`;
  alert.role = 'alert';
  
  // Set icon based on type
  let icon = '';
  switch (type) {
      case 'success':
          icon = '<i class="bi bi-check-circle-fill"></i>';
          break;
      case 'error':
      case 'danger':
          icon = '<i class="bi bi-x-circle-fill"></i>';
          break;
      case 'warning':
          icon = '<i class="bi bi-exclamation-triangle-fill"></i>';
          break;
      default:
          icon = '<i class="bi bi-info-circle-fill"></i>';
  }
  
  // Set alert content
  alert.innerHTML = `
      <div class="alert-icon">${icon}</div>
      <div class="alert-content">${message}</div>
      <button type="button" class="alert-close" aria-label="Close">
          <i class="bi bi-x"></i>
      </button>
  `;
  
  // Add to container
  alertsContainer.appendChild(alert);
  
  // Add dismiss functionality
  const closeBtn = alert.querySelector('.alert-close');
  if (closeBtn) {
      closeBtn.addEventListener('click', () => {
          dismissAlert(alert);
      });
  }
  
  // Auto-dismiss after 5 seconds
  setTimeout(() => {
      dismissAlert(alert);
  }, 5000);
  
  // Animate in
  alert.style.opacity = '0';
  alert.style.transform = 'translateY(-20px)';
  setTimeout(() => {
      alert.style.transition = 'all 0.3s ease-out';
      alert.style.opacity = '1';
      alert.style.transform = 'translateY(0)';
  }, 10);
}

/**
* Handle theme toggling (light/dark mode)
* This is a placeholder - actual implementation would depend on backend support
*/
function toggleTheme() {
  // This would typically involve setting a cookie or localStorage value
  // and adding/removing a class from the document body
  document.body.classList.toggle('dark-theme');
  
  // Update toggle button if exists
  const themeToggle = document.querySelector('.dark-mode-toggle');
  if (themeToggle) {
      themeToggle.classList.toggle('active');
  }
}

/**
* Detect user's preferred color scheme
*/
function detectColorScheme() {
  // Check for saved user preference
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme) {
      // Apply saved preference
      document.body.classList.toggle('dark-theme', savedTheme === 'dark');
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Apply system preference if no saved preference
      document.body.classList.add('dark-theme');
  }
  
  // Update toggle button if exists
  const themeToggle = document.querySelector('.dark-mode-toggle');
  if (themeToggle) {
      themeToggle.classList.toggle('active', document.body.classList.contains('dark-theme'));
  }
}

// Execute additional initialization for dynamic content
document.addEventListener('load-dynamic-content', () => {
  // Re-initialize interactive elements for dynamically loaded content
  initializeAOS();
  
  // Add ripple effect to new buttons
  document.querySelectorAll('[data-ripple]').forEach(button => {
      button.addEventListener('click', createRippleEffect);
  });
  
  // Initialize ajax forms
  handleAjaxForm();
});

// Initialize dynamic content handlers
handleAjaxForm();