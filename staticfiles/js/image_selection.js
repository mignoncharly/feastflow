// static/js/image_selection.js - Fixed version

document.addEventListener('DOMContentLoaded', function() {
    console.log('Image selection script loaded');
    
    // Log predefined images to debug
    logPredefinedImages();
    
    // Initialize image selection
    initializeImageSelection();
    
    // Initialize image upload preview
    initializeImageUpload();
    
    // Initialize source selector
    initializeSourceSelector();
    
    // Initialize folder tabs - must be after source selector
    initializeFolderTabs();
});

/**
 * Debug function to log available predefined images
 */
function logPredefinedImages() {
    const galleryImages = document.querySelectorAll('.gallery-image-wrapper');
    console.log('===== PREDEFINED IMAGES DEBUG =====');
    console.log('Total gallery image wrappers found:', galleryImages.length);
    
    // Log details about each wrapper
    galleryImages.forEach((wrapper, index) => {
        const radioBtn = wrapper.querySelector('input[type="radio"]');
        const imgElement = wrapper.querySelector('img');
        const nameElement = wrapper.querySelector('.image-name');
        
        console.log(`Image ${index + 1}:`);
        console.log(' - Name:', nameElement ? nameElement.textContent : 'N/A');
        console.log(' - Image src:', imgElement ? imgElement.src : 'No image found');
        console.log(' - Data type:', wrapper.getAttribute('data-type') || 'Not set');
        console.log(' - Radio value:', radioBtn ? radioBtn.value : 'No radio button');
        console.log(' - Is visible:', wrapper.style.display !== 'none');
    });
    
    // Check if empty gallery message exists
    const emptyGallery = document.querySelector('.empty-gallery');
    console.log('Empty gallery message:', emptyGallery ? 'Found' : 'Not found');
    
    // Log form data
    const form = document.querySelector('form');
    if (form) {
        const predefinedImageField = form.elements['predefined_image'];
        console.log('Predefined image field:', predefinedImageField ? 'Found' : 'Not found');
        if (predefinedImageField) {
            console.log(' - Type:', predefinedImageField.type);
            console.log(' - Value:', predefinedImageField.value);
            
            if (predefinedImageField.options) {
                console.log(' - Options:', predefinedImageField.options.length);
                for (let i = 0; i < predefinedImageField.options.length; i++) {
                    console.log(`   Option ${i}: ${predefinedImageField.options[i].value} - ${predefinedImageField.options[i].text}`);
                }
            }
        }
    }
    
    console.log('==================================');
}

/**
 * Initialize source selector (Upload vs Gallery)
 */
function initializeSourceSelector() {
    const uploadOption = document.getElementById('option-upload');
    const galleryOption = document.getElementById('option-gallery');
    const uploadContainer = document.getElementById('upload-container');
    const galleryContainer = document.getElementById('gallery-container');
    
    // Check if elements exist
    if (!uploadOption || !galleryOption || !uploadContainer || !galleryContainer) {
        console.log('Source selector elements not found');
        return;
    }
    
    // Set initial state based on if there's an existing image preview or selected gallery image
    const hasPreview = document.querySelector('#image-preview-container .preview-image');
    const hasSelectedGalleryImage = document.querySelector('.image-selection-radio:checked');
    
    if (hasSelectedGalleryImage && hasSelectedGalleryImage.value) {
        setActiveSource('gallery');
    } else if (hasPreview) {
        setActiveSource('upload');
    } else {
        // Default to upload
        setActiveSource('upload');
    }
    
    // Add event listeners
    uploadOption.addEventListener('click', function() {
        setActiveSource('upload');
    });
    
    galleryOption.addEventListener('click', function() {
        setActiveSource('gallery');
    });
    
    function setActiveSource(source) {
        if (source === 'upload') {
            uploadOption.classList.add('active');
            galleryOption.classList.remove('active');
            uploadContainer.style.display = 'block';
            galleryContainer.style.display = 'none';
        } else {
            uploadOption.classList.remove('active');
            galleryOption.classList.add('active');
            uploadContainer.style.display = 'none';
            galleryContainer.style.display = 'block';
            
            // DEBUG: Log gallery container visibility state
            console.log('Gallery container display:', galleryContainer.style.display);
            console.log('Gallery container has children:', galleryContainer.children.length);
            
            // Ensure the filter is applied
            const activeTab = document.querySelector('.folder-tab.active');
            if (activeTab) {
                const folder = activeTab.getAttribute('data-folder');
                filterImagesByFolder(folder);
            } else {
                // If no active tab, select the appropriate one based on context
                updateActiveFolderTab();
            }
            
            // Check if we have any gallery images at all
            const hasGalleryImages = document.querySelectorAll('.gallery-image-wrapper').length > 0;
            if (!hasGalleryImages) {
                console.log('No gallery images found, checking for empty gallery message');
                const emptyGallery = document.querySelector('.empty-gallery');
                if (emptyGallery) {
                    emptyGallery.style.display = 'block';
                } else {
                    // Create empty gallery message if it doesn't exist
                    const imageGallery = document.querySelector('.image-gallery');
                    if (imageGallery) {
                        console.log('Creating empty gallery message');
                        const emptyMessage = document.createElement('div');
                        emptyMessage.className = 'empty-gallery';
                        emptyMessage.innerHTML = '<p>No predefined images available</p>';
                        imageGallery.appendChild(emptyMessage);
                    }
                }
            }
        }
    }
}

/**
 * Initialize folder tabs for filtering images
 */
function initializeFolderTabs() {
    const folderTabs = document.querySelectorAll('.folder-tab');
    const galleryImages = document.querySelectorAll('.gallery-image-wrapper');
    
    // DEBUG: Log the number of gallery images found
    console.log('Found', galleryImages.length, 'gallery images');
    
    // Ensure all gallery images have a data-type attribute
    galleryImages.forEach(wrapper => {
        // Debug: Log original attributes
        console.log('Image wrapper:', wrapper.querySelector('.image-name')?.textContent, 
                   'Current data-type:', wrapper.getAttribute('data-type'));
        
        // If data-type attribute is missing, try to determine it
        if (!wrapper.getAttribute('data-type') || wrapper.getAttribute('data-type') === '') {
            let imageType = determineImageType(wrapper);
            wrapper.setAttribute('data-type', imageType);
            console.log('Set data-type to:', imageType);
        }
    });
    
    // Add click event to tabs
    folderTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            folderTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Get selected folder
            const folder = this.getAttribute('data-folder');
            console.log('Selected folder tab:', folder);
            
            // Filter images
            filterImagesByFolder(folder);
        });
    });
    
    // Initialize with the appropriate tab
    updateActiveFolderTab();
}

/**
 * Helper function to determine image type
 */
function determineImageType(wrapper) {
    // First try to get it from the radio input value if available
    const radioInput = wrapper.querySelector('input[type="radio"]');
    if (radioInput && radioInput.id) {
        const idMatch = radioInput.id.match(/image-(\d+)/);
        if (idMatch) {
            // This is a predefined image ID, now try to infer type from context
            // For simplicity, we'll use page context
            const path = window.location.pathname;
            
            if (path.includes('/event/')) {
                return 'event';
            } else if (path.includes('/category/')) {
                return 'category';
            } else if (path.includes('/item/')) {
                return 'item';
            }
        }
    }
    
    // Try to get it from the image name
    const imageName = wrapper.querySelector('.image-name')?.textContent.toLowerCase() || '';
    
    if (imageName.includes('event')) {
        return 'event';
    } else if (imageName.includes('category')) {
        return 'category';
    } else if (imageName.includes('item')) {
        return 'item';
    }
    
    // Use image path as a last resort
    const imgSrc = wrapper.querySelector('img')?.src || '';
    if (imgSrc.includes('/events/')) {
        return 'event';
    } else if (imgSrc.includes('/categories/')) {
        return 'category';
    } else if (imgSrc.includes('/items/')) {
        return 'item';
    }
    
    // Default to current page context
    const path = window.location.pathname;
    if (path.includes('/event/')) {
        return 'event';
    } else if (path.includes('/category/')) {
        return 'category';
    } else if (path.includes('/item/')) {
        return 'item';
    }
    
    // Final fallback
    return 'all';
}

/**
 * Determine and update the active folder tab based on context
 */
function updateActiveFolderTab() {
    const folderTabs = document.querySelectorAll('.folder-tab');
    let contextType = 'all';
    
    // Determine context from URL
    const path = window.location.pathname;
    if (path.includes('/event/')) {
        contextType = 'event';
    } else if (path.includes('/category/')) {
        contextType = 'category';
    } else if (path.includes('/item/')) {
        contextType = 'item';
    }
    
    console.log('Context type from URL:', contextType);
    
    // Find matching tab
    let tabToActivate = null;
    folderTabs.forEach(tab => {
        const tabFolder = tab.getAttribute('data-folder');
        if (tabFolder === contextType) {
            tabToActivate = tab;
        }
    });
    
    // If no matching tab found, use the active one or the first one
    if (!tabToActivate) {
        tabToActivate = document.querySelector('.folder-tab.active') || 
                        document.querySelector('.folder-tab[data-folder="all"]') || 
                        (folderTabs.length > 0 ? folderTabs[0] : null);
    }
    
    if (tabToActivate) {
        // Remove active class from all tabs
        folderTabs.forEach(t => t.classList.remove('active'));
        
        // Add active class to the selected tab
        tabToActivate.classList.add('active');
        
        // Filter images based on the selected tab
        const folder = tabToActivate.getAttribute('data-folder');
        filterImagesByFolder(folder);
        
        // If no images were found in the selected tab, try the "all" tab
        const visibleImages = document.querySelectorAll('.gallery-image-wrapper[style=""]');
        if (visibleImages.length === 0 && folder !== 'all') {
            console.log('No images found in selected tab, switching to "all" tab');
            const allTab = document.querySelector('.folder-tab[data-folder="all"]');
            if (allTab) {
                folderTabs.forEach(t => t.classList.remove('active'));
                allTab.classList.add('active');
                filterImagesByFolder('all');
            }
        }
    }
}

/**
 * Filter gallery images by folder
 */
function filterImagesByFolder(folder) {
    console.log('Filtering by folder:', folder);
    
    // Get all gallery image wrappers
    const galleryImages = document.querySelectorAll('.gallery-image-wrapper');
    console.log('Total gallery images:', galleryImages.length);
    
    // Force the gallery container to be visible for filtering
    const galleryContainer = document.getElementById('gallery-container');
    if (galleryContainer && galleryContainer.style.display === 'none') {
        console.log('Temporarily showing gallery for filtering');
        // We'll restore visibility state after filtering
    }
    
    let visibleCount = 0;
    let showAllIfNoneMatch = true; // Flag to show all images if none match the filter
    
    galleryImages.forEach(wrapper => {
        const imgType = wrapper.getAttribute('data-type') || determineImageType(wrapper);
        console.log('Image type:', imgType, 'for image:', wrapper.querySelector('.image-name')?.textContent);
        
        if (folder === 'all') {
            // Show all images
            wrapper.style.display = '';
            visibleCount++;
        } else if (imgType === folder) {
            // Show images of the selected type
            wrapper.style.display = '';
            visibleCount++;
            showAllIfNoneMatch = false; // We found at least one match
        } else {
            // Hide other images initially
            wrapper.style.display = 'none';
        }
    });
    
    // If no images match the filter, show all images as a fallback
    if (visibleCount === 0 && folder !== 'all' && showAllIfNoneMatch) {
        console.log('No images match the filter. Showing all as fallback.');
        galleryImages.forEach(wrapper => {
            wrapper.style.display = '';
            visibleCount++;
        });
    }
    
    console.log('Visible images after filtering:', visibleCount);
    
    // Show empty message if no images are visible
    const emptyGallery = document.querySelector('.empty-gallery');
    if (emptyGallery) {
        if (visibleCount === 0) {
            emptyGallery.style.display = 'block';
        } else {
            emptyGallery.style.display = 'none';
        }
    }
}

/**
 * Initialize image selection functionality
 */
function initializeImageSelection() {
    const galleryImages = document.querySelectorAll('.gallery-image-wrapper');
    
    // Mark the image that's already selected (if any)
    const checkedRadio = document.querySelector('.image-selection-radio:checked');
    if (checkedRadio) {
        const wrapper = checkedRadio.closest('.gallery-image-wrapper');
        if (wrapper) {
            wrapper.classList.add('selected');
        }
    }
    
    // Add click event to gallery images
    galleryImages.forEach(wrapper => {
        wrapper.addEventListener('click', function() {
            // Find the radio button
            const radio = this.querySelector('input[type="radio"]');
            if (!radio) return;
            
            console.log('Selected image:', this.querySelector('.image-name')?.textContent);
            
            // Check the radio button
            radio.checked = true;
            
            // Remove selected class from all wrappers
            galleryImages.forEach(w => w.classList.remove('selected'));
            
            // Add selected class to this wrapper
            this.classList.add('selected');
            
            // Clear any uploaded file
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) {
                fileInput.value = '';
            }
            
            // Clear preview container
            const previewContainer = document.getElementById('image-preview-container');
            if (previewContainer) {
                previewContainer.innerHTML = '';
            }
            
            // Make sure gallery tab is active
            const galleryOption = document.getElementById('option-gallery');
            if (galleryOption && !galleryOption.classList.contains('active')) {
                galleryOption.click();
            }
        });
    });
}

/**
 * Initialize image upload functionality
 */
function initializeImageUpload() {
    const uploadArea = document.getElementById('image-upload-area');
    if (!uploadArea) return;
    
    const fileInput = uploadArea.querySelector('input[type="file"]');
    if (!fileInput) return;
    
    const previewContainer = document.getElementById('image-preview-container');
    if (!previewContainer) return;
    
    // Enable click to browse
    uploadArea.addEventListener('click', function(e) {
        if (e.target.id !== 'remove-preview') {
            fileInput.click();
        }
    });
    
    // Handle file change
    fileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                previewContainer.innerHTML = `
                    <div class="preview-container">
                        <img src="${e.target.result}" alt="Preview" class="preview-image">
                        <div class="preview-overlay">
                            <i class="bi bi-arrow-repeat"></i>
                            <span>Change image</span>
                        </div>
                        <div class="remove-preview" id="remove-preview">
                            <i class="bi bi-x"></i>
                        </div>
                    </div>
                `;
                
                // Add remove button functionality
                const removeButton = document.getElementById('remove-preview');
                if (removeButton) {
                    removeButton.addEventListener('click', function(e) {
                        e.stopPropagation();
                        fileInput.value = '';
                        previewContainer.innerHTML = '';
                    });
                }
            };
            
            reader.readAsDataURL(this.files[0]);
            
            // Uncheck all gallery images
            document.querySelectorAll('.image-selection-radio').forEach(radio => {
                radio.checked = false;
            });
            
            document.querySelectorAll('.gallery-image-wrapper').forEach(wrapper => {
                wrapper.classList.remove('selected');
            });
            
            // Switch to upload tab
            const uploadOption = document.getElementById('option-upload');
            if (uploadOption && !uploadOption.classList.contains('active')) {
                uploadOption.click();
            }
        }
    });
    
    // Enable drag and drop
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', function() { 
        this.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            
            // Trigger change event
            const event = new Event('change', { bubbles: true }); 
            fileInput.dispatchEvent(event);
        }
    });
    
    // Setup remove button if preview already exists
    const existingRemoveButton = document.getElementById('remove-preview'); 
    if (existingRemoveButton) {
        existingRemoveButton.addEventListener('click', function(e) {
            e.stopPropagation();
            fileInput.value = '';
            previewContainer.innerHTML = '';
        });
    }
}