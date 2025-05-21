// static/js/image_selection.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize image selection components
    initImageSourceSelector();
    initImageUploadArea();
    initGallerySelections();
    initFolderTabs();
    
    // Initial check for existing image
    checkForExistingImage();
});

/**
 * Initializes the image source selector tabs
 */
function initImageSourceSelector() {
    const uploadOption = document.getElementById('option-upload');
    const galleryOption = document.getElementById('option-gallery');
    const uploadContainer = document.getElementById('upload-container');
    const galleryContainer = document.getElementById('gallery-container');
    
    if (!uploadOption || !galleryOption || !uploadContainer || !galleryContainer) return;
    
    // Set initial active state
    uploadOption.classList.add('active');
    
    // Upload option click handler
    uploadOption.addEventListener('click', function() {
        // Update active class
        uploadOption.classList.add('active');
        galleryOption.classList.remove('active');
        
        // Show/hide containers
        uploadContainer.style.display = 'block';
        galleryContainer.style.display = 'none';
        
        // Add fade-in animation
        uploadContainer.style.opacity = '0';
        setTimeout(() => {
            uploadContainer.style.opacity = '1';
            uploadContainer.style.transition = 'opacity 0.3s ease';
        }, 10);
        
        // Reset gallery selection radio
        const galleryRadios = document.querySelectorAll('.image-selection-radio');
        galleryRadios.forEach(radio => {
            radio.checked = false;
        });
        
        // Reset selection indicators
        const galleryImages = document.querySelectorAll('.gallery-image-wrapper');
        galleryImages.forEach(img => {
            img.classList.remove('selected');
        });
    });
    
    // Gallery option click handler
    galleryOption.addEventListener('click', function() {
        // Update active class
        galleryOption.classList.add('active');
        uploadOption.classList.remove('active');
        
        // Show/hide containers
        galleryContainer.style.display = 'block';
        uploadContainer.style.display = 'none';
        
        // Add fade-in animation
        galleryContainer.style.opacity = '0';
        setTimeout(() => {
            galleryContainer.style.opacity = '1';
            galleryContainer.style.transition = 'opacity 0.3s ease';
        }, 10);
        
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.value = '';
        }
        
        // Hide preview if present
        const previewContainer = document.getElementById('image-preview-container');
        if (previewContainer) {
            previewContainer.innerHTML = '';
        }
    });
    
    // Check if there's a preselected option
    const predefinedImageValue = document.querySelector('input[name="predefined_image"]:checked');
    if (predefinedImageValue) {
        galleryOption.click();
        
        // Highlight selected gallery image
        const selectedImage = document.querySelector(`.gallery-image-wrapper input[value="${predefinedImageValue.value}"]`);
        if (selectedImage) {
            selectedImage.parentElement.classList.add('selected');
        }
    }
}

/**
 * Initializes the image upload area with drag and drop functionality
 */
function initImageUploadArea() {
    const uploadArea = document.getElementById('image-upload-area');
    const fileInput = document.querySelector('input[type="file"]');
    const previewContainer = document.getElementById('image-preview-container');
    
    if (!uploadArea || !fileInput || !previewContainer) return;
    
    // Click to browse
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });
    
    // File selection changed
    fileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            
            // File type validation
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                showErrorToast('Please select a valid image file (JPEG, PNG, GIF, SVG, or WebP)');
                this.value = '';
                return;
            }
            
            // Size validation (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showErrorToast('Image file size must be less than 5MB');
                this.value = '';
                return;
            }
            
            // Create file reader to show preview
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // Clear existing preview
                previewContainer.innerHTML = '';
                
                // Create preview elements
                const previewWrapper = document.createElement('div');
                previewWrapper.className = 'preview-container';
                
                const previewImage = document.createElement('img');
                previewImage.className = 'preview-image';
                previewImage.src = e.target.result;
                previewImage.alt = file.name;
                
                const previewOverlay = document.createElement('div');
                previewOverlay.className = 'preview-overlay';
                previewOverlay.innerHTML = `
                    <i class="bi bi-arrow-repeat"></i>
                    <span>Change image</span>
                `;
                
                const removeButton = document.createElement('div');
                removeButton.className = 'remove-preview';
                removeButton.id = 'remove-preview';
                removeButton.innerHTML = '<i class="bi bi-x"></i>';
                
                // Add elements to the preview
                previewWrapper.appendChild(previewImage);
                previewWrapper.appendChild(previewOverlay);
                previewWrapper.appendChild(removeButton);
                previewContainer.appendChild(previewWrapper);
                
                // Click preview to browse new image
                previewOverlay.addEventListener('click', function() {
                    fileInput.click();
                });
                
                // Remove preview when clicking remove button
                removeButton.addEventListener('click', function(e) {
                    e.stopPropagation();
                    previewContainer.innerHTML = '';
                    fileInput.value = '';
                });
                
                // Add fadeIn animation
                previewWrapper.style.opacity = '0';
                setTimeout(() => {
                    previewWrapper.style.opacity = '1';
                    previewWrapper.style.transition = 'opacity 0.3s ease';
                }, 10);
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    // Drag and drop support
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Highlight drop area when dragging over
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, function() {
            uploadArea.classList.add('drag-over');
        });
    });
    
    // Remove highlight when dragging leaves
    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, function() {
            uploadArea.classList.remove('drag-over');
        });
    });
    
    // Handle file drop
    uploadArea.addEventListener('drop', function(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            fileInput.files = files;
            
            // Trigger change event manually
            const event = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(event);
        }
    });
}

/**
 * Initializes gallery image selections
 */
function initGallerySelections() {
    const galleryImages = document.querySelectorAll('.gallery-image-wrapper');
    
    galleryImages.forEach(imageWrapper => {
        // Add click handler to each image
        imageWrapper.addEventListener('click', function() {
            // Remove selected class from all images
            galleryImages.forEach(img => {
                img.classList.remove('selected');
            });
            
            // Add selected class to clicked image
            this.classList.add('selected');
            
            // Check the radio button
            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
            }
        });
    });
    
    // Check if there's already a selected image
    const selectedRadio = document.querySelector('.image-selection-radio:checked');
    if (selectedRadio) {
        const imageWrapper = selectedRadio.closest('.gallery-image-wrapper');
        if (imageWrapper) {
            imageWrapper.classList.add('selected');
        }
    }
}

/**
 * Initializes folder tabs for gallery view
 */
function initFolderTabs() {
    const folderTabs = document.querySelectorAll('.folder-tab');
    const galleryImages = document.querySelectorAll('.gallery-image-wrapper');
    
    if (!folderTabs.length || !galleryImages.length) return;
    
    folderTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active tab
            folderTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const folder = this.getAttribute('data-folder');
            
            // Show/hide images based on folder
            galleryImages.forEach(img => {
                if (folder === 'all' || img.getAttribute('data-type') === folder) {
                    img.style.display = 'block';
                    
                    // Add staggered fade-in animation
                    img.style.opacity = '0';
                    img.style.transform = 'translateY(10px)';
                    
                    setTimeout(() => {
                        img.style.opacity = '1';
                        img.style.transform = 'translateY(0)';
                        img.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    }, Math.random() * 200);
                } else {
                    img.style.display = 'none';
                }
            });
            
            // Show empty message if no images in current folder
            const visibleImages = Array.from(galleryImages).filter(img => 
                img.style.display !== 'none'
            ).length;
            
            let emptyGallery = document.querySelector('.empty-gallery');
            
            if (visibleImages === 0) {
                if (!emptyGallery) {
                    emptyGallery = document.createElement('div');
                    emptyGallery.className = 'empty-gallery';
                    emptyGallery.innerHTML = `<p>No images available in this category</p>`;
                    document.querySelector('.image-gallery').appendChild(emptyGallery);
                }
                emptyGallery.style.display = 'block';
            } else if (emptyGallery) {
                emptyGallery.style.display = 'none';
            }
        });
    });
    
    // Set initial active tab
    const activeTab = document.querySelector('.folder-tab.active') || document.querySelector('.folder-tab');
    if (activeTab) {
        activeTab.click();
    }
}

/**
 * Checks for existing image and initializes preview
 */
function checkForExistingImage() {
    const previewContainer = document.getElementById('image-preview-container');
    
    // If there's already content in the preview container from the server-rendered template,
    // add event listeners to the existing elements
    if (previewContainer && previewContainer.querySelector('.preview-container')) {
        const previewOverlay = previewContainer.querySelector('.preview-overlay');
        const removeButton = previewContainer.querySelector('.remove-preview');
        
        if (previewOverlay) {
            previewOverlay.addEventListener('click', function() {
                const fileInput = document.querySelector('input[type="file"]');
                if (fileInput) fileInput.click();
            });
        }
        
        if (removeButton) {
            removeButton.addEventListener('click', function() {
                previewContainer.innerHTML = '';
                const fileInput = document.querySelector('input[type="file"]');
                if (fileInput) fileInput.value = '';
            });
        }
    }
}

/**
 * Shows an error toast message
 */
function showErrorToast(message) {
    // Create toast element if not exists
    let toast = document.getElementById('error-toast');
    
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'error-toast';
        toast.className = 'error-toast';
        document.body.appendChild(toast);
        
        // Add styles for toast
        const style = document.createElement('style');
        style.textContent = `
            .error-toast {
                position: fixed;
                top: 20px;
                right: 20px;
                background-color: #f8d7da;
                color: #721c24;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                z-index: 9999;
                opacity: 0;
                transform: translateY(-20px);
                transition: all 0.3s ease;
                font-size: 14px;
                max-width: 300px;
                display: flex;
                align-items: center;
            }
            
            .error-toast.show {
                opacity: 1;
                transform: translateY(0);
            }
            
            .error-toast::before {
                content: "⚠️";
                margin-right: 10px;
                font-size: 16px;
            }
            
            @media (prefers-color-scheme: dark) {
                .error-toast {
                    background-color: #2c1215;
                    color: #f8d7da;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Set message and show toast
    toast.textContent = message;
    toast.classList.add('show');
    
    // Hide after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000); 
}