/**
 * legal-pages.js - JavaScript functionality for Privacy Policy and Terms of Service pages
 * 
 * This script handles:
 * - Table of contents navigation
 * - Active section highlighting based on scroll position
 * - Smooth scrolling to sections when clicking on TOC links
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get all section elements
    const sections = document.querySelectorAll('.legal-section');
    // Get all table of contents links
    const tocLinks = document.querySelectorAll('.toc-link');
    
    // Initialize active section highlighting
    initActiveSectionHighlighting();
    
    // Initialize smooth scrolling for TOC links
    initSmoothScrolling();
    
    // Create mobile table of contents toggle if on small screens
    initMobileTocToggle();
    
    /**
     * Highlights the active section in the table of contents based on scroll position
     */
    function initActiveSectionHighlighting() {
        // Exit if no sections or TOC links found
        if (!sections.length || !tocLinks.length) return;
        
        // Set initial active section based on URL hash or first section
        setInitialActiveSection();
        
        // Update active section on scroll
        window.addEventListener('scroll', debounce(updateActiveSection, 100));
        
        // Update sections data with their positions
        updateSectionsData();
        
        // Update sections data when window is resized
        window.addEventListener('resize', debounce(updateSectionsData, 200));
    }
    
    /**
     * Stores section positions for faster lookup during scroll
     */
    let sectionsData = [];
    function updateSectionsData() {
        sectionsData = Array.from(sections).map(section => {
            const rect = section.getBoundingClientRect();
            return {
                id: section.id,
                top: rect.top + window.pageYOffset,
                bottom: rect.bottom + window.pageYOffset
            };
        });
    }
    
    /**
     * Sets the initial active section based on URL hash or defaults to first section
     */
    function setInitialActiveSection() {
        // Check if URL has a hash
        if (window.location.hash) {
            const targetId = window.location.hash.substring(1);
            const targetLink = document.querySelector(`.toc-link[href="#${targetId}"]`);
            
            if (targetLink) {
                tocLinks.forEach(link => link.classList.remove('active'));
                targetLink.classList.add('active');
                return;
            }
        }
        
        // Default to first section if no hash or hash section not found
        if (tocLinks.length > 0) {
            tocLinks[0].classList.add('active');
        }
    }
    
    /**
     * Updates which section is active based on current scroll position
     */
    function updateActiveSection() {
        // Get current scroll position
        const scrollPosition = window.pageYOffset + 100; // Adding offset for better UX
        
        // Find the current section
        let currentSection = null;
        
        // Using the pre-calculated sections data for better performance
        for (let i = 0; i < sectionsData.length; i++) {
            const section = sectionsData[i];
            const nextSection = sectionsData[i + 1];
            
            // Check if we're within this section or before the next one
            if (
                (scrollPosition >= section.top && (!nextSection || scrollPosition < nextSection.top)) ||
                (i === 0 && scrollPosition < section.top)
            ) {
                currentSection = section.id;
                break;
            }
        }
        
        // Update active class on TOC links
        if (currentSection) {
            tocLinks.forEach(link => {
                const href = link.getAttribute('href').substring(1);
                
                if (href === currentSection) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    }
    
    /**
     * Initializes smooth scrolling behavior for TOC links
     */
    function initSmoothScrolling() {
        tocLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    // Update active link
                    tocLinks.forEach(link => link.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Scroll to target section
                    window.scrollTo({
                        top: targetSection.offsetTop - 40,
                        behavior: 'smooth'
                    });
                    
                    // Update URL hash without scrolling
                    history.pushState(null, null, `#${targetId}`);
                }
            });
        });
    }
    
    /**
     * Creates a mobile toggle for table of contents on small screens
     */
    function initMobileTocToggle() {
        const legalSidebar = document.querySelector('.legal-sidebar');
        const legalDocument = document.querySelector('.legal-document');
        
        // Only create mobile toggle if sidebar exists and screen is small
        if (!legalSidebar || !legalDocument || window.innerWidth >= 992) return;
        
        // Create toggle button
        const tocToggle = document.createElement('button');
        tocToggle.className = 'toc-toggle';
        tocToggle.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
            </svg>
            Table of Contents
        `;
        
        // Add styles for mobile TOC
        const style = document.createElement('style');
        style.textContent = `
            .toc-toggle {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                background-color: white;
                border: 1px solid var(--gray-light);
                border-radius: 8px;
                padding: 0.75rem 1rem;
                margin-bottom: 1.5rem;
                width: 100%;
                font-size: 0.95rem;
                font-weight: 500;
                color: var(--text-color);
                cursor: pointer;
                box-shadow: var(--card-shadow);
            }
            
            .legal-sidebar {
                display: none;
                margin-bottom: 1.5rem;
            }
            
            .legal-sidebar.show {
                display: block;
            }
            
            @media (min-width: 992px) {
                .toc-toggle {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Insert toggle button before legal document
        legalDocument.parentNode.insertBefore(tocToggle, legalDocument);
        
        // Toggle sidebar visibility when button is clicked
        tocToggle.addEventListener('click', function() {
            legalSidebar.classList.toggle('show');
        });
        
        // Hide sidebar when a link is clicked
        tocLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth < 992) {
                    legalSidebar.classList.remove('show');
                }
            });
        });
    }
    
    /**
     * Debounce function to limit how often a function is called
     * @param {Function} func - The function to debounce
     * @param {number} wait - The debounce wait time in milliseconds
     * @returns {Function} - Debounced function
     */
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }
});