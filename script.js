// DOM Elements
const form = document.getElementById('job-form');
const submitBtn = document.querySelector('button[type="submit"]');
const previewModal = document.getElementById('preview-modal');
const successModal = document.getElementById('success-modal');
const previewContent = document.getElementById('preview-content');
const skillsInput = document.getElementById('skills-input');
const skillsTags = document.getElementById('skills-tags');
const experienceSlider = document.getElementById('experience');
const experienceValue = document.getElementById('experience-value');
const coverLetter = document.getElementById('cover-letter');
const charCount = document.getElementById('char-count');
const cvInput = document.getElementById('cv');
const fileNameSpan = document.querySelector('.file-name');
const fullNameInput = document.getElementById('full-name');
const emailInput = document.getElementById('email');
const themeToggle = document.getElementById('theme-toggle');
const skillsCount = document.getElementById('skills-count');
const autocompleteDropdown = document.getElementById('autocomplete-dropdown');
const countryCodeSelect = document.getElementById('country-code');

// Global variables
let skills = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    initFormValidation();
    initSkillsInput();
    initExperienceSlider();
    initCoverLetterCounter();
    initFileUpload();
    initScrollReveal();
    initStickyProgress();
    loadSavedData();
    initPhoneValidation();
    initIconInteractions();
});

// Accordion functionality
function toggleAccordion(header) {
    const content = header.nextElementSibling;
    const icon = header.querySelector('i');

    if (content.style.maxHeight) {
        content.style.maxHeight = null;
        icon.style.transform = 'rotate(0deg)';
    } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        icon.style.transform = 'rotate(180deg)';
    }
}

// Smooth scroll to form
function scrollToForm() {
    document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' });
}

// Form validation
function initFormValidation() {
    const requiredFields = ['full-name', 'email', 'phone', 'cv', 'cover-letter'];

    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        field.addEventListener('input', validateField);
        field.addEventListener('blur', validateField);
    });

    // Also validate skills (marked as required in HTML)
    const skillsInput = document.getElementById('skills-input');
    skillsInput.addEventListener('input', validateSkills);
    skillsInput.addEventListener('blur', validateSkills);

    form.addEventListener('submit', handleSubmit);
}

function validateField(event) {
    const field = event.target;
    const errorSpan = field.closest('.form-group').querySelector('.error-message');
    let isValid = true;
    let errorMessage = '';

    switch (field.id) {
        case 'full-name':
            if (!field.value.trim()) {
                isValid = false;
                errorMessage = 'Full name is required';
            } else if (field.value.trim().length < 2) {
                isValid = false;
                errorMessage = 'Full name must be at least 2 characters';
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!field.value.trim()) {
                isValid = false;
                errorMessage = 'Email is required';
            } else if (!emailRegex.test(field.value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;
        case 'phone':
            const phoneRegex = /^\d{10,10}$/;
            if (!field.value.trim()) {
                isValid = false;
                errorMessage = 'Phone number is required';
            } else if (!phoneRegex.test(field.value.replace(/[\s\-\(\)]/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number (9-10 digits)';
            }
            break;
        case 'cv':
            if (!field.files[0]) {
                isValid = false;
                errorMessage = 'CV upload is required';
            } else if (field.files[0].type !== 'application/pdf') {
                isValid = false;
                errorMessage = 'Please upload a PDF file only';
            }
            break;
        case 'cover-letter':
            if (!field.value.trim()) {
                isValid = false;
                errorMessage = 'Cover letter is required';
            } else if (field.value.length < 10) {
                isValid = false;
                errorMessage = 'Cover letter must be at least 10 characters';
            }
            break;
    }

    if (isValid) {
        field.classList.remove('invalid');
        field.classList.add('valid');
        field.setAttribute('aria-invalid', 'false');
        if (errorSpan) errorSpan.textContent = '';
    } else {
        field.classList.remove('valid');
        field.classList.add('invalid');
        field.setAttribute('aria-invalid', 'true');
        if (errorSpan) errorSpan.textContent = errorMessage;
    }

    updateSubmitButton();
}

function validateSkills() {
    const skillsErrorSpan = skillsInput.closest('.form-group').querySelector('.error-message');
    let isValid = skills.length > 0;

    if (isValid) {
        skillsInput.classList.remove('invalid');
        skillsInput.classList.add('valid');
        skillsInput.setAttribute('aria-invalid', 'false');
        if (skillsErrorSpan) skillsErrorSpan.textContent = '';
    } else {
        skillsInput.classList.remove('valid');
        skillsInput.classList.add('invalid');
        skillsInput.setAttribute('aria-invalid', 'true');
        if (skillsErrorSpan) skillsErrorSpan.textContent = 'At least one skill is required';
    }

    updateSubmitButton();
}

function updateSubmitButton() {
    // Check all required fields
    const nameValid = document.getElementById('full-name').classList.contains('valid');
    const emailValid = document.getElementById('email').classList.contains('valid');
    const phoneValid = document.getElementById('phone').classList.contains('valid');
    const cvValid = document.getElementById('cv').classList.contains('valid');
    const coverValid = document.getElementById('cover-letter').classList.contains('valid');
    const skillsValid = skills.length > 0;

    // Enable button only when ALL required fields are valid AND at least one skill is added
    const shouldEnable = nameValid && emailValid && phoneValid && cvValid && coverValid && skillsValid;

    submitBtn.disabled = !shouldEnable;

    console.log('Submit button status:', {
        nameValid, emailValid, phoneValid, cvValid, coverValid, skillsValid,
        skillsCount: skills.length,
        buttonEnabled: shouldEnable
    });
}

// Skills input functionality with autocomplete
function initSkillsInput() {
    const suggestions = [
        'HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'PHP', 'MySQL', 'Git', 'GitHub',
        'REST API', 'UI/UX', 'Figma', 'Python', 'Java', 'C++', 'TypeScript', 'Vue.js',
        'Angular', 'Express.js', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS', 'Linux'
    ];

    let selectedIndex = -1;

    skillsInput.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        autocompleteDropdown.innerHTML = '';
        selectedIndex = -1;

        if (value.length > 0) {
            const filtered = suggestions.filter(skill =>
                skill.toLowerCase().includes(value) && !skills.includes(skill)
            );

            if (filtered.length > 0) {
                filtered.slice(0, 5).forEach((skill, index) => {
                    const item = document.createElement('div');
                    item.className = 'autocomplete-item';
                    item.textContent = skill;
                    item.addEventListener('click', () => selectSkill(skill));
                    autocompleteDropdown.appendChild(item);
                });
                autocompleteDropdown.style.display = 'block';
            } else {
                autocompleteDropdown.style.display = 'none';
            }
        } else {
            autocompleteDropdown.style.display = 'none';
        }

        updateSkillsCount();
    });

    skillsInput.addEventListener('keydown', function(event) {
        const items = autocompleteDropdown.querySelectorAll('.autocomplete-item');

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
            updateSelection(items);
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            selectedIndex = Math.max(selectedIndex - 1, -1);
            updateSelection(items);
        } else if (event.key === 'Enter') {
            event.preventDefault();
            if (selectedIndex >= 0 && items[selectedIndex]) {
                selectSkill(items[selectedIndex].textContent);
            } else {
                const skill = skillsInput.value.trim();
                if (skill && !skills.includes(skill)) {
                    addSkillTag(skill);
                    skillsInput.value = '';
                    autocompleteDropdown.style.display = 'none';
                }
            }
        } else if (event.key === 'Escape') {
            autocompleteDropdown.style.display = 'none';
            selectedIndex = -1;
        }
    });

    function selectSkill(skill) {
        if (!skills.includes(skill)) {
            addSkillTag(skill);
        }
        skillsInput.value = '';
        autocompleteDropdown.style.display = 'none';
        updateSkillsCount();
    }

    function updateSelection(items) {
        items.forEach((item, index) => {
            if (index === selectedIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    function addSkillTag(skill) {
        if (skills.length >= 15) return;

        skills.push(skill);
        const tag = document.createElement('div');
        tag.className = 'skill-tag';
        tag.innerHTML = `${skill} <span class="remove-tag" onclick="removeSkill('${skill}')">&times;</span>`;
        skillsTags.appendChild(tag);
        updateSkillsCount();
    }

    window.removeSkill = function(skill) {
        skills = skills.filter(s => s !== skill);
        const tags = skillsTags.querySelectorAll('.skill-tag');
        tags.forEach(tag => {
            if (tag.textContent.includes(skill)) {
                tag.remove();
            }
        });
        updateSkillsCount();
    };

    function updateSkillsCount() {
        skillsCount.textContent = skills.length;
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (!skillsInput.contains(event.target) && !autocompleteDropdown.contains(event.target)) {
            autocompleteDropdown.style.display = 'none';
        }
    });
}

// Experience slider
function initExperienceSlider() {
    experienceSlider.addEventListener('input', function() {
        experienceValue.textContent = this.value;
    });
}

// Cover letter character counter
function initCoverLetterCounter() {
    coverLetter.addEventListener('input', function() {
        charCount.textContent = this.value.length;
        if (this.value.length > 800) {
            this.value = this.value.substring(0, 800);
            charCount.textContent = 800;
        }
    });
}

// File upload
function initFileUpload() {
    cvInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            if (file.type === 'application/pdf') {
                fileNameSpan.textContent = file.name;
                fileNameSpan.style.color = 'var(--success-color)';
            } else {
                fileNameSpan.textContent = 'Please select a PDF file';
                fileNameSpan.style.color = 'var(--error-color)';
                this.value = '';
            }
        } else {
            fileNameSpan.textContent = '';
        }
        validateField({ target: this });
    });
}

// Preview application
function previewApplication() {
    console.log('previewApplication called!');
    const formData = new FormData(form);
    let previewHTML = '<div class="preview-card">';

    previewHTML += '<h4><i class="fas fa-user"></i> Personal Information</h4>';
    previewHTML += `<p><strong>Name:</strong> ${formData.get('full-name') || 'Not provided'}</p>`;
    previewHTML += `<p><strong>Email:</strong> ${formData.get('email') || 'Not provided'}</p>`;
    previewHTML += `<p><strong>Phone:</strong> ${formData.get('phone') || 'Not provided'}</p>`;
    previewHTML += `<p><strong>City/Country:</strong> ${formData.get('city') || 'Not provided'}</p>`;

    previewHTML += '<h4><i class="fas fa-link"></i> Links & Skills</h4>';
    previewHTML += `<p><strong>LinkedIn:</strong> ${formData.get('linkedin') || 'Not provided'}</p>`;
    previewHTML += `<p><strong>Portfolio/GitHub:</strong> ${formData.get('portfolio') || 'Not provided'}</p>`;
    previewHTML += `<p><strong>Position:</strong> ${formData.get('position') || 'Not provided'}</p>`;
    previewHTML += `<p><strong>Experience:</strong> ${experienceValue.textContent} years</p>`;

    // Get skills from the global skills array instead of DOM elements
    previewHTML += `<p><strong>Skills:</strong> ${skills.length > 0 ? skills.join(', ') : 'None'}</p>`;

    previewHTML += '<h4><i class="fas fa-file-pdf"></i> Documents</h4>';
    previewHTML += `<p><strong>CV:</strong> ${cvInput.files[0] ? cvInput.files[0].name : 'Not uploaded'}</p>`;

    previewHTML += '<h4><i class="fas fa-pen-to-square"></i> Cover Letter</h4>';
    previewHTML += `<p>${formData.get('cover-letter') || 'Not provided'}</p>`;

    previewHTML += '</div>';

    previewContent.innerHTML = previewHTML;
    previewModal.style.display = 'block';
}

// Handle form submission
function handleSubmit(event) {
    console.log('handleSubmit called!');
    event.preventDefault();

    // Final validation check
    const requiredFields = ['full-name', 'email', 'phone', 'cv', 'cover-letter'];
    let allValid = true;
    let missingFields = [];

    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        const isValid = field.classList.contains('valid');
        console.log(`Field ${fieldId} valid:`, isValid);
        if (!isValid) {
            allValid = false;
            missingFields.push(fieldId);
        }
    });

    const skillsValid = skills.length > 0;
    console.log('Skills valid:', skillsValid, 'Skills count:', skills.length);
    if (!skillsValid) {
        allValid = false;
        missingFields.push('skills');
    }

    console.log('All fields valid:', allValid, 'Missing fields:', missingFields);

    if (!allValid) {
        alert(`Please complete the following required fields: ${missingFields.join(', ')}`);
        return;
    }

    console.log('Form validation passed, proceeding with submission...');

    // Show loading state
    submitBtn.innerHTML = '<span class="loading"></span> Submitting...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Save data to localStorage
        const formData = new FormData(form);
        localStorage.setItem('jobAppName', formData.get('full-name'));
        localStorage.setItem('jobAppEmail', formData.get('email'));

        // Log FormData to console (as requested)
        console.log('Form submitted with data:');
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
        console.log('Skills:', skills);

        // Show success modal
        successModal.style.display = 'block';
        submitBtn.innerHTML = 'Submit Application';
        submitBtn.disabled = false;

        // Reset form
        form.reset();
        skills = []; // Clear the global skills array
        skillsTags.innerHTML = '';
        fileNameSpan.textContent = '';
        charCount.textContent = '0';
        experienceValue.textContent = '0';
        updateSubmitButton();
    }, 2000);
}

// Close modal
function closeModal() {
    previewModal.style.display = 'none';
    successModal.style.display = 'none';
}

// Scroll reveal animation
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.card');
    revealElements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

// Sticky progress highlighting
function initStickyProgress() {
    const sections = [
        { id: 'hero', step: 1 },
        { id: 'job-details', step: 2 },
        { id: 'form-section', step: 3 }
    ];

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const section = sections.find(s => s.id === entry.target.id);
                if (section) {
                    updateProgress(section.step);
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element) {
            observer.observe(element);
        }
    });
}

function updateProgress(activeStep) {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        if (index + 1 <= activeStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// Theme toggle functionality
function initThemeToggle() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Phone validation
function initPhoneValidation() {
    const phoneInput = document.getElementById('phone');

    countryCodeSelect.addEventListener('change', function() {
        validateField({ target: phoneInput });
    });

    phoneInput.addEventListener('input', function() {
        // Remove non-numeric characters except spaces, dashes, parentheses
        this.value = this.value.replace(/[^0-9\s\-\(\)]/g, '');
        validateField({ target: this });
    });
}

// Icon interactions
function initIconInteractions() {
    const inputContainers = document.querySelectorAll('.input-container');

    inputContainers.forEach(container => {
        const icon = container.querySelector('i');
        const input = container.querySelector('input, select, textarea');

        if (icon && input) {
            // Hover effect
            container.addEventListener('mouseenter', function() {
                icon.style.color = 'var(--primary-color)';
                icon.style.transform = 'scale(1.05)';
            });

            container.addEventListener('mouseleave', function() {
                icon.style.color = '';
                icon.style.transform = '';
            });

            // Focus effect
            input.addEventListener('focus', function() {
                icon.style.color = 'var(--primary-color)';
                icon.style.transform = 'scale(1.05)';
            });

            input.addEventListener('blur', function() {
                icon.style.color = '';
                icon.style.transform = '';
            });

            // Validation state
            input.addEventListener('input', function() {
                if (input.classList.contains('valid')) {
                    icon.style.color = 'var(--success-color)';
                } else if (input.classList.contains('invalid')) {
                    icon.style.color = 'var(--error-color)';
                } else {
                    icon.style.color = 'var(--primary-color)';
                }
            });
        }
    });
}

// Edit section
function editSection(section) {
    closeModal();

    let targetElement;
    switch (section) {
        case 'personal':
            targetElement = document.getElementById('step-personal');
            break;
        case 'links':
            targetElement = document.getElementById('skills-input');
            break;
        case 'upload':
            targetElement = document.getElementById('cv');
            break;
        default:
            return;
    }

    if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
            targetElement.focus();
        }, 500);
    }
}

// Download PDF
function downloadPDF() {
    // Create a printable version
    const printContent = document.createElement('div');
    printContent.innerHTML = previewContent.innerHTML;
    printContent.style.display = 'none';
    document.body.appendChild(printContent);

    // Hide everything except print content
    const originalBody = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;

    // Print
    window.print();

    // Restore original content
    document.body.innerHTML = originalBody;
    document.body.removeChild(printContent);
}

// Load saved data from localStorage
function loadSavedData() {
    const savedName = localStorage.getItem('jobAppName');
    const savedEmail = localStorage.getItem('jobAppEmail');

    if (savedName) {
        fullNameInput.value = savedName;
        validateField({ target: fullNameInput });
    }

    if (savedEmail) {
        emailInput.value = savedEmail;
        validateField({ target: emailInput });
    }
}
