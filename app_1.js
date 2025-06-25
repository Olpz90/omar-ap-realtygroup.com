// Real Estate Website JavaScript - Fixed Version

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initContactForm();
    initPropertyCards();
    initSmoothScrolling();
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('navbar-toggle');
    const navMenu = document.getElementById('navbar-menu');
    const navLinks = document.querySelectorAll('.navbar__link');

    // Toggle mobile menu
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navToggle.contains(event.target) || navMenu.contains(event.target);
            
            if (!isClickInsideNav && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Handle navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.backgroundColor = 'rgba(255, 255, 253, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
            } else {
                navbar.style.backgroundColor = 'var(--color-surface)';
                navbar.style.backdropFilter = 'none';
            }
        }
    });
}

// Smooth scrolling functionality - Fixed version
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 70;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                // Use a more reliable scrolling method
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                const duration = 800;
                let start = null;

                function step(timestamp) {
                    if (!start) start = timestamp;
                    const progress = timestamp - start;
                    const percentage = Math.min(progress / duration, 1);
                    
                    // Easing function
                    const easeInOutCubic = percentage < 0.5 
                        ? 4 * percentage * percentage * percentage 
                        : (percentage - 1) * (2 * percentage - 2) * (2 * percentage - 2) + 1;
                    
                    window.scrollTo(0, startPosition + distance * easeInOutCubic);
                    
                    if (progress < duration) {
                        window.requestAnimationFrame(step);
                    }
                }
                
                window.requestAnimationFrame(step);
            }
        });
    });
}

// Contact form functionality - Fixed validation
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear previous errors
            clearAllErrors();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formObject = {};
            
            // Convert FormData to object
            for (let [key, value] of formData.entries()) {
                formObject[key] = value.trim();
            }
            
            // Validate form - FIXED: Now properly prevents submission on validation failure
            if (validateForm(formObject)) {
                submitForm(formObject);
            }
        });
        
        // Real-time validation
        const allFields = contactForm.querySelectorAll('input, textarea, select');
        allFields.forEach(field => {
            field.addEventListener('blur', function() {
                validateField(this);
            });
            
            field.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    }
}

// Form validation - FIXED: More robust validation
function validateForm(formData) {
    let isValid = true;
    const errors = [];
    
    // Name validation
    if (!formData.name || formData.name === '') {
        errors.push('Full Name is required');
        markFieldAsError('name');
        isValid = false;
    }
    
    // Email validation
    if (!formData.email || formData.email === '') {
        errors.push('Email Address is required');
        markFieldAsError('email');
        isValid = false;
    } else if (!isValidEmail(formData.email)) {
        errors.push('Please enter a valid email address');
        markFieldAsError('email');
        isValid = false;
    }
    
    // Phone validation (if provided)
    if (formData.phone && formData.phone !== '' && !isValidPhone(formData.phone)) {
        errors.push('Please enter a valid phone number');
        markFieldAsError('phone');
        isValid = false;
    }
    
    // Display errors if any
    if (!isValid) {
        showFormErrors(errors);
        // Focus on first error field
        const firstErrorField = document.querySelector('.form-control.error');
        if (firstErrorField) {
            firstErrorField.focus();
        }
    }
    
    return isValid;
}

// Mark field as error
function markFieldAsError(fieldName) {
    const field = document.getElementById(fieldName);
    if (field) {
        field.classList.add('error');
    }
}

// Clear all errors
function clearAllErrors() {
    // Remove error classes
    const errorFields = document.querySelectorAll('.form-control.error');
    errorFields.forEach(field => field.classList.remove('error'));
    
    // Remove error messages
    const existingErrors = document.querySelectorAll('.form-error, .field-error');
    existingErrors.forEach(error => error.remove());
}

// Individual field validation - Enhanced
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    // Remove existing error styling
    field.classList.remove('error');
    removeFieldError(field);
    
    // Check if required field is empty
    if (field.required && value === '') {
        isValid = false;
        showFieldError(field, 'This field is required');
    }
    
    // Email validation
    if (field.type === 'email' && value !== '' && !isValidEmail(value)) {
        isValid = false;
        showFieldError(field, 'Please enter a valid email address');
    }
    
    // Phone validation
    if (field.type === 'tel' && value !== '' && !isValidPhone(value)) {
        isValid = false;
        showFieldError(field, 'Please enter a valid phone number');
    }
    
    if (!isValid) {
        field.classList.add('error');
    }
    
    return isValid;
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation helper
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
    return cleanPhone.length >= 10 && /^\d+$/.test(cleanPhone);
}

// Show form errors - Enhanced
function showFormErrors(errors) {
    // Remove existing error messages
    const existingErrors = document.querySelectorAll('.form-error');
    existingErrors.forEach(error => error.remove());
    
    // Create error container
    const errorContainer = document.createElement('div');
    errorContainer.className = 'form-error';
    errorContainer.style.cssText = `
        background-color: rgba(192, 21, 47, 0.1);
        border: 1px solid var(--color-error);
        border-radius: var(--radius-sm);
        padding: var(--space-12);
        margin-bottom: var(--space-16);
        color: var(--color-error);
    `;
    
    // Add error messages
    if (errors.length === 1) {
        errorContainer.textContent = errors[0];
    } else {
        const errorList = document.createElement('ul');
        errorList.style.cssText = 'margin: 0; padding-left: var(--space-16);';
        
        errors.forEach(error => {
            const errorItem = document.createElement('li');
            errorItem.textContent = error;
            errorList.appendChild(errorItem);
        });
        
        errorContainer.appendChild(errorList);
    }
    
    // Insert error container at the top of the form
    const form = document.getElementById('contact-form');
    form.insertBefore(errorContainer, form.firstChild);
    
    // Scroll to error message
    errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Show field-specific error
function showFieldError(field, message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: var(--color-error);
        font-size: var(--font-size-sm);
        margin-top: var(--space-4);
    `;
    
    field.parentNode.appendChild(errorElement);
}

// Remove field error
function removeFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Submit form - Enhanced with better feedback
function submitForm(formData) {
    const submitButton = document.querySelector('#contact-form button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Sending Message...';
    submitButton.style.opacity = '0.7';
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        submitButton.style.opacity = '1';
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        document.getElementById('contact-form').reset();
        
        // Clear any remaining errors
        clearAllErrors();
        
        // Log form data (in real app, this would be sent to server)
        console.log('Form submitted successfully:', formData);
    }, 1500);
}

// Show success message - Enhanced
function showSuccessMessage() {
    // Remove any existing success messages
    const existingSuccess = document.querySelector('.success-message');
    if (existingSuccess) {
        existingSuccess.remove();
    }
    
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.style.cssText = `
        background-color: rgba(33, 128, 141, 0.1);
        border: 1px solid var(--color-success);
        border-radius: var(--radius-sm);
        padding: var(--space-16);
        margin-bottom: var(--space-16);
        color: var(--color-success);
        text-align: center;
        font-weight: var(--font-weight-medium);
    `;
    successMessage.innerHTML = `
        <strong>Thank you!</strong> Your message has been sent successfully. 
        We'll get back to you within 24 hours.
    `;
    
    const form = document.getElementById('contact-form');
    form.insertBefore(successMessage, form.firstChild);
    
    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Remove success message after 6 seconds
    setTimeout(() => {
        if (successMessage.parentNode) {
            successMessage.remove();
        }
    }, 6000);
}

// Property cards functionality - Enhanced
function initPropertyCards() {
    const propertyCards = document.querySelectorAll('.property-card');
    
    propertyCards.forEach(card => {
        const viewButton = card.querySelector('.btn');
        const mlsNumber = card.dataset.mls;
        
        if (viewButton) {
            viewButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get property information
                const title = card.querySelector('.property-card__title').textContent;
                const location = card.querySelector('.property-card__location').textContent;
                const price = card.querySelector('.property-card__price').textContent;
                const details = Array.from(card.querySelectorAll('.detail')).map(el => el.textContent).join(', ');
                
                // Create modal-like alert with better formatting
                const propertyInfo = [
                    `Property: ${title}`,
                    `Location: ${location}`,
                    `Price: ${price}`,
                    `Details: ${details}`,
                    `MLS #: ${mlsNumber}`,
                    '',
                    'Contact Omar López for more information:',
                    'Phone: (555) 123-4567',
                    'Email: omar@aprealtygroup.com'
                ].join('\n');
                
                alert(propertyInfo);
            });
        }
    });
}

// Utility function to handle phone number formatting
function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 10) {
        return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length === 11 && cleaned[0] === '1') {
        return `+1 (${cleaned.slice(1,4)}) ${cleaned.slice(4,7)}-${cleaned.slice(7)}`;
    }
    
    return phone;
}

// Format phone numbers in contact info
document.addEventListener('DOMContentLoaded', function() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            const cursorPosition = this.selectionStart;
            const oldValue = this.value;
            const newValue = formatPhoneNumber(this.value);
            
            this.value = newValue;
            
            // Maintain cursor position
            if (newValue.length > oldValue.length) {
                this.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
            } else {
                this.setSelectionRange(cursorPosition, cursorPosition);
            }
        });
    });
});

// Handle window resize for mobile menu
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        const navToggle = document.getElementById('navbar-toggle');
        const navMenu = document.getElementById('navbar-menu');
        
        if (navToggle && navMenu) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// REMOVED: Image loading animation that was causing unintended animations
// The pulse animation was causing elements to disappear unexpectedly