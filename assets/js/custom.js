/**
 * Optivra - Custom JavaScript
 * Enhanced interactions and form handling
 */

(function() {
  "use strict";

  // Configuration - UPDATE THIS WITH YOUR GOOGLE APPS SCRIPT WEB APP URL
  const FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycby_NuDLU4gq87JJQOPHPxaoG5i-DpU4QNcNKq4MVGIYjDR8cg7Bzw_RoTUSgzhQSC0V/exec';

  /**
   * Initialize all functionality
   */
  function init() {
    initScrollEffects();
    initFormHandlers();
    initAnimations();
    initNavigation();
  }

  /**
   * Switch between Quote and Callback forms
   */
  window.switchFormType = function(type) {
    const quoteContainer = document.getElementById('quoteFormContainer');
    const callbackContainer = document.getElementById('callbackFormContainer');
    
    if (type === 'quote') {
      quoteContainer.classList.add('active');
      callbackContainer.classList.remove('active');
    } else {
      callbackContainer.classList.add('active');
      quoteContainer.classList.remove('active');
    }
  };

  /**
   * Scroll effects for header
   */
  function initScrollEffects() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }
    });
  }

  /**
   * Initialize form handlers
   */
  function initFormHandlers() {
    // Quote Request Form
    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
      quoteForm.addEventListener('submit', handleQuoteSubmit);
    }

    // Callback Request Form
    const callbackForm = document.getElementById('callbackForm');
    if (callbackForm) {
      callbackForm.addEventListener('submit', handleCallbackSubmit);
    }

    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', handleContactSubmit);
    }
  }

  /**
   * Handle Quote Request Form Submission
   */
  async function handleQuoteSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    
    // Get form data
    const formData = {
      type: 'quote_request',
      name: form.querySelector('#quoteName').value,
      email: form.querySelector('#quoteEmail').value,
      phone: form.querySelector('#quotePhone').value,
      company: form.querySelector('#quoteCompany')?.value || '',
      service: form.querySelector('#quoteService').value,
      budget: form.querySelector('#quoteBudget').value,
      timeline: form.querySelector('#quoteTimeline').value,
      message: form.querySelector('#quoteMessage')?.value || ''
    };

    // Validate
    if (!validateEmail(formData.email)) {
      showMessage(form, 'Please enter a valid email address', 'error');
      return;
    }

    if (!validatePhone(formData.phone)) {
      showMessage(form, 'Please enter a valid phone number', 'error');
      return;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Sending...';

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      // Show success message
      showMessage(form, 'Thank you! We\'ll send you a quote within 2 hours.', 'success');
      form.reset();
      
      // Track conversion (if analytics is set up)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'quote_request', {
          'event_category': 'form_submission',
          'event_label': formData.service
        });
      }

    } catch (error) {
      console.error('Error:', error);
      showMessage(form, 'Something went wrong. Please try again or email us directly at hello@optivra.com', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }

  /**
   * Handle Callback Request Form Submission
   */
  async function handleCallbackSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    
    // Get form data
    const formData = {
      type: 'callback_request',
      name: form.querySelector('#callbackName').value,
      email: form.querySelector('#callbackEmail').value,
      phone: form.querySelector('#callbackPhone').value,
      company: form.querySelector('#callbackCompany')?.value || '',
      interest: form.querySelector('#callbackInterest')?.value || 'General Inquiry',
      preferredTime: form.querySelector('#callbackTime')?.value || 'Anytime',
      message: form.querySelector('#callbackMessage')?.value || ''
    };

    // Validate
    if (!validateEmail(formData.email)) {
      showMessage(form, 'Please enter a valid email address', 'error');
      return;
    }

    if (!validatePhone(formData.phone)) {
      showMessage(form, 'Please enter a valid phone number', 'error');
      return;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Requesting...';

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      // Show success message
      showMessage(form, 'Thank you! We\'ll call you back within 1 hour.', 'success');
      form.reset();
      
      // Track conversion
      if (typeof gtag !== 'undefined') {
        gtag('event', 'callback_request', {
          'event_category': 'form_submission',
          'event_label': formData.interest
        });
      }

    } catch (error) {
      console.error('Error:', error);
      showMessage(form, 'Something went wrong. Please try again or call us at +91 74390-71619', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }

  /**
   * Handle Contact Form Submission
   */
  async function handleContactSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    
    // Get form data
    const formData = {
      type: 'contact_form',
      name: form.querySelector('#contactName').value,
      email: form.querySelector('#contactEmail').value,
      phone: form.querySelector('#contactPhone')?.value || '',
      company: form.querySelector('#contactCompany')?.value || '',
      subject: form.querySelector('#contactSubject')?.value || 'General Inquiry',
      message: form.querySelector('#contactMessage').value
    };

    // Validate
    if (!validateEmail(formData.email)) {
      showMessage(form, 'Please enter a valid email address', 'error');
      return;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Sending...';

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      // Show success message
      showMessage(form, 'Thank you for contacting us! We\'ll respond within 24 hours.', 'success');
      form.reset();
      
      // Track conversion
      if (typeof gtag !== 'undefined') {
        gtag('event', 'contact_form', {
          'event_category': 'form_submission',
          'event_label': formData.subject
        });
      }

    } catch (error) {
      console.error('Error:', error);
      showMessage(form, 'Something went wrong. Please email us at hello@optivra.com', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }

  /**
   * Show form message
   */
  function showMessage(form, message, type) {
    // Remove existing messages
    const existingMsg = form.querySelector('.form-message');
    if (existingMsg) {
      existingMsg.remove();
    }

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message alert alert-${type === 'success' ? 'success' : 'danger'} mt-3`;
    messageDiv.innerHTML = `
      <i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
      ${message}
    `;
    
    form.appendChild(messageDiv);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      messageDiv.style.opacity = '0';
      setTimeout(() => messageDiv.remove(), 300);
    }, 5000);

    // Scroll to message
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /**
   * Validate email
   */
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  /**
   * Validate phone
   */
  function validatePhone(phone) {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    // Check if it has at least 10 digits
    return cleaned.length >= 10;
  }

  /**
   * Initialize animations
   */
  function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
      observer.observe(section);
    });
  }

  /**
   * Enhanced navigation
   */
  function initNavigation() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });

    // Active nav link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navmenu a[href^="#"]');

    window.addEventListener('scroll', () => {
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 100) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    });
  }

  /**
   * Modal functionality for forms
   */
  window.openQuoteModal = function() {
    const modal = document.getElementById('quoteModal');
    if (modal) {
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }
  };

  window.openCallbackModal = function() {
    const modal = document.getElementById('callbackModal');
    if (modal) {
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  };

  // Close modal on outside click
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      e.target.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });

  /**
   * Number counter animation
   */
  function animateCounters() {
    const counters = document.querySelectorAll('.purecounter');
    
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-purecounter-end'));
      const duration = parseInt(counter.getAttribute('data-purecounter-duration')) * 1000;
      const start = 0;
      const increment = target / (duration / 16); // 60fps
      
      let current = start;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current);
        }
      }, 16);
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Initialize counters when stats section is visible
  const statsSection = document.querySelector('.stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
  }

})();

// Made with Bob
