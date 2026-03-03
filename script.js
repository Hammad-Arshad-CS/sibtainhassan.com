// ============================================
// DOM Elements
// ============================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const themeToggle = document.getElementById('themeToggle');
const scrollTopBtn = document.getElementById('scrollTop');
const appointmentForm = document.getElementById('appointmentForm');
const dateInput = document.getElementById('date');
const serviceSearch = document.getElementById('serviceSearch');
const searchClear = document.getElementById('searchClear');
const servicesGrid = document.getElementById('servicesGrid');
const serviceCards = document.querySelectorAll('.service-card');
const reviewCards = document.querySelectorAll('.review-card');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const carouselDots = document.getElementById('carouselDots');
const faqItems = document.querySelectorAll('.faq-item');
const toastContainer = document.getElementById('toastContainer');
const navbar = document.querySelector('.navbar');
const sections = document.querySelectorAll('section[id]');

// ============================================
// Mobile Navigation Toggle
// ============================================
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ============================================
// Dark Mode / Theme Toggle
// ============================================
// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Add animation effect
    themeToggle.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        themeToggle.style.transform = '';
    }, 500);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// ============================================
// Navbar Scroll Effect
// ============================================
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ============================================
// Active Navigation Link on Scroll
// ============================================
function activateNavLink() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', activateNavLink);

// ============================================
// Smooth Scrolling for Navigation Links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Scroll to Top Button
// ============================================
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ============================================
// Services Search Functionality
// ============================================
serviceSearch.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (searchTerm) {
        searchClear.style.display = 'block';
    } else {
        searchClear.style.display = 'none';
    }
    
    serviceCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.classList.remove('hidden');
            card.style.animation = 'fadeInUp 0.5s ease';
        } else {
            card.classList.add('hidden');
        }
    });
    
    // Show message if no results
    const visibleCards = Array.from(serviceCards).filter(card => !card.classList.contains('hidden'));
    if (visibleCards.length === 0 && searchTerm) {
        showToast('No services found matching your search.', 'warning');
    }
});

searchClear.addEventListener('click', () => {
    serviceSearch.value = '';
    searchClear.style.display = 'none';
    serviceCards.forEach(card => {
        card.classList.remove('hidden');
        card.style.animation = 'fadeInUp 0.5s ease';
    });
});

// ============================================
// Appointment Form Handling
// ============================================
// Set minimum date to today
const today = new Date().toISOString().split('T')[0];
dateInput.setAttribute('min', today);

appointmentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = {
        fullName: document.getElementById('fullName').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        email: document.getElementById('email').value.trim(),
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        service: document.getElementById('service').value,
        place: document.getElementById('place').value,
        message: document.getElementById('message').value.trim()
    };
    
    // Validate form
    if (!validateForm(formData)) {
        return;
    }
    
    // Show loading state
    const submitBtn = appointmentForm.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;
    
    // Build WhatsApp URL and open it after a short delay
    setTimeout(() => {
        // Create WhatsApp message
        const whatsappMessage = `Hello, I would like to book an appointment:\n\n` +
            `Name: ${formData.fullName}\n` +
            `Phone: ${formData.phone}\n` +
            `Email: ${formData.email}\n` +
            `Date: ${formatDate(formData.date)}\n` +
            `Time: ${formData.time}\n` +
            `Place: ${formData.place}\n` +
            `Service: ${getServiceName(formData.service)}\n` +
            (formData.message ? `Message: ${formData.message}` : '');
        
        const phoneNumber = '03158595790';
        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappUrl = `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${encodedMessage}&type=phone_number&app_absent=0`;
        
        // Update floating WhatsApp button href so it stays in sync
        const whatsappBtn = document.querySelector('.whatsapp-btn');
        whatsappBtn.setAttribute('href', whatsappUrl);
        
        // Open WhatsApp with pre-filled message in a new tab
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        
        // Show success message
        showToast('Appointment request submitted! WhatsApp is opening with your details.', 'success');
        
        // Reset form
        appointmentForm.reset();
        dateInput.setAttribute('min', today);
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 800);
});

function validateForm(data) {
    // Validate name
    if (data.fullName.length < 2) {
        showToast('Please enter a valid name (at least 2 characters).', 'error');
        return false;
    }
    
    // Validate phone
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(data.phone) || data.phone.length < 10) {
        showToast('Please enter a valid phone number.', 'error');
        return false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showToast('Please enter a valid email address.', 'error');
        return false;
    }
    
    // Validate date (should not be in the past)
    const selectedDate = new Date(data.date);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    
    if (selectedDate < todayDate) {
        showToast('Please select a future date for your appointment.', 'error');
        return false;
    }
    
    // Validate time
    if (!data.time) {
        showToast('Please select a preferred time.', 'error');
        return false;
    }
    
    // Validate service
    if (!data.service) {
        showToast('Please select a service.', 'error');
        return false;
    }
    
    // Validate place (hospital)
    if (!data.place) {
        showToast('Please select a preferred place (hospital).', 'error');
        return false;
    }
    
    return true;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function getServiceName(serviceValue) {
    const serviceMap = {
        'general': 'General Consultation',
        'cardiology': 'Cardiology',
        'pediatrics': 'Pediatrics',
        'diagnostics': 'Diagnostics',
        'pharmacy': 'Pharmacy',
        'emergency': 'Emergency Care'
    };
    return serviceMap[serviceValue] || serviceValue;
}

// ============================================
// Reviews Carousel
// ============================================
let currentReview = 0;
let carouselInterval;

// Create dots for carousel
reviewCards.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.className = 'dot';
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToReview(index));
    carouselDots.appendChild(dot);
});

const dots = document.querySelectorAll('.dot');

function showReview(index) {
    reviewCards.forEach((card, i) => {
        card.classList.remove('active');
        dots[i].classList.remove('active');
    });
    
    reviewCards[index].classList.add('active');
    dots[index].classList.add('active');
    currentReview = index;
}

function goToReview(index) {
    showReview(index);
    resetCarouselInterval();
}

function nextReview() {
    currentReview = (currentReview + 1) % reviewCards.length;
    showReview(currentReview);
}

function prevReview() {
    currentReview = (currentReview - 1 + reviewCards.length) % reviewCards.length;
    showReview(currentReview);
}

function resetCarouselInterval() {
    clearInterval(carouselInterval);
    carouselInterval = setInterval(nextReview, 5000);
}

nextBtn.addEventListener('click', () => {
    nextReview();
    resetCarouselInterval();
});

prevBtn.addEventListener('click', () => {
    prevReview();
    resetCarouselInterval();
});

// Auto-play carousel
carouselInterval = setInterval(nextReview, 5000);

// Pause carousel on hover
const reviewsContainer = document.querySelector('.reviews-container');
reviewsContainer.addEventListener('mouseenter', () => {
    clearInterval(carouselInterval);
});

reviewsContainer.addEventListener('mouseleave', () => {
    resetCarouselInterval();
});

// Keyboard navigation for carousel
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevReview();
        resetCarouselInterval();
    }
    if (e.key === 'ArrowRight') {
        nextReview();
        resetCarouselInterval();
    }
});

// ============================================
// FAQ Accordion
// ============================================
faqItems.forEach((item, index) => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all FAQ items
        faqItems.forEach(faqItem => {
            faqItem.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// ============================================
// Toast Notifications
// ============================================
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    const titles = {
        success: 'Success!',
        error: 'Error!',
        warning: 'Warning!',
        info: 'Info'
    };
    
    toast.innerHTML = `
        <i class="fas ${icons[type] || icons.info}"></i>
        <div class="toast-content">
            <h4>${titles[type] || titles.info}</h4>
            <p>${message}</p>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Remove toast after duration
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, duration);
}

// ============================================
// Animate on Scroll
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
const animateElements = document.querySelectorAll('.service-card, .stat-item, .info-card, .contact-item');
animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ============================================
// Counter Animation for Stats
// ============================================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + '+';
        }
    }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            const statNumber = entry.target.querySelector('.stat-number');
            const text = statNumber.textContent;
            const target = parseInt(text.replace(/\D/g, ''));
            if (target) {
                animateCounter(statNumber, target);
                entry.target.classList.add('animated');
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(stat => {
    statsObserver.observe(stat);
});

// ============================================
// Form Input Animations
// ============================================
const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
formInputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
        this.parentElement.style.transition = 'transform 0.3s ease';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});

// ============================================
// Parallax Effect for Hero Section
// ============================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// ============================================
// Add Click Animation to Service Cards
// ============================================
serviceCards.forEach(card => {
    card.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
    });
});

// ============================================
// Initialize on Page Load
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Set active nav link on page load
    activateNavLink();
    
    // Add fade-in animation to hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '1';
    }
    
    // Initialize first review as active
    if (reviewCards.length > 0) {
        showReview(0);
    }
    
    console.log('Dr. Sibtain Ul Hassan Clinic website loaded successfully!');
});

// ============================================
// Gallery: Category-based albums + lightbox
// ============================================
// Album data: id (matches data-album-id), title, cover image, array of images for that category.
// Replace paths with your own; these use placeholder paths (images/img1–9) for demo.
const GALLERY_ALBUMS = [
    { id: 'uk-conference', title: 'UK Conference', cover: 'images/img3.jpeg', images: ['images/british/img1.jpeg', 'images/british/img2.jpeg', 'images/british/img3.jpeg'] },
    { id: 'clinic-view', title: 'Clinic View', cover: 'images/clinicview/clinic.jpeg', images: ['images/clinicview/clinic.jpeg', 'images/clinicview/clinic3.png', 'images/clinicview/clinic1.jpg', 'images/clinicview/clinic2.jpeg'] },
    { id: 'convocation', title: 'Convocation', cover: 'images/convo/img1.jpeg', images: ['images/convo/img2.jpeg', 'images/convo/img3.jpeg', 'images/convo/img4.jpeg', 'images/convo/img6.jpeg'] },
    { id: 'awards', title: 'awards', cover: 'images/icmf.jpeg', images: ['images/icmf.jpeg'] },
    { id: 'events', title: 'Events', cover: 'images/singapore.jpeg', images: ['images/singapore.jpeg'] },
    { id: 'team', title: 'Team', cover: 'images/turkey.jpeg', images: ['images/turkey.jpeg'] },
    { id: 'facilities', title: 'Facilities', cover: 'images/mentor.jpeg', images: ['images/mentor.jpeg'] },
    { id: 'patient-care', title: 'Patient Care', cover: 'images/washington/img1.jpeg', images: ['images/washington/img1.jpeg', 'images/washington/img2.jpeg', 'images/washington/img3.jpeg', 'images/washington/img4.jpeg', 'images/washington/img5.jpeg', 'images/washington/img6.jpeg', 'images/washington/img7.jpeg' ] },
    { id: 'certifications', title: 'Certifications', cover: 'images/cert1.jpeg', images: ['images/cert1.jpeg', 'images/cert2.jpeg'] }
];

(function initGallery() {
    const albumsWrap = document.getElementById('galleryAlbumsWrap');
    const albumView = document.getElementById('galleryAlbumView');
    const backBtn = document.getElementById('galleryBackBtn');
    const albumViewTitle = document.getElementById('galleryAlbumViewTitle');
    const albumImagesContainer = document.getElementById('galleryAlbumImages');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    if (!albumsWrap || !albumView || !albumImagesContainer || !lightbox || !lightboxImg) return;

    let currentAlbumImages = [];
    let currentLightboxIndex = 0;

    // Open album: show only images for this category
    function openAlbum(albumId) {
        const album = GALLERY_ALBUMS.find(a => a.id === albumId);
        if (!album) return;
        currentAlbumImages = album.images.slice();
        albumViewTitle.textContent = album.title;
        albumImagesContainer.innerHTML = '';
        album.images.forEach((src, index) => {
            const photo = document.createElement('div');
            photo.className = 'gallery-album-photo';
            photo.setAttribute('role', 'button');
            photo.setAttribute('tabindex', '0');
            const img = document.createElement('img');
            img.src = src;
            img.alt = album.title + ' - ' + (index + 1);
            img.loading = 'lazy';
            photo.appendChild(img);
            photo.addEventListener('click', () => openLightbox(index));
            photo.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(index); } });
            albumImagesContainer.appendChild(photo);
        });
        albumsWrap.classList.add('hidden');
        albumView.removeAttribute('hidden');
        albumView.setAttribute('aria-hidden', 'false');
    }

    function closeAlbum() {
        albumView.setAttribute('hidden', '');
        albumView.setAttribute('aria-hidden', 'true');
        albumsWrap.classList.remove('hidden');
    }

    function openLightbox(index) {
        currentLightboxIndex = index;
        const src = currentAlbumImages[index];
        if (!src) return;
        lightboxImg.src = src;
        lightboxImg.alt = albumViewTitle.textContent + ' - ' + (index + 1);
        lightbox.removeAttribute('hidden');
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('hidden', '');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function showLightboxImage(delta) {
        currentLightboxIndex = (currentLightboxIndex + delta + currentAlbumImages.length) % currentAlbumImages.length;
        const src = currentAlbumImages[currentLightboxIndex];
        lightboxImg.src = src;
        lightboxImg.alt = albumViewTitle.textContent + ' - ' + (currentLightboxIndex + 1);
    }

    // Album cover clicks (covers already in HTML with data-album-id)
    document.querySelectorAll('.gallery-album-cover').forEach(cover => {
        cover.addEventListener('click', () => {
            const id = cover.getAttribute('data-album-id');
            if (id) openAlbum(id);
        });
        cover.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const id = cover.getAttribute('data-album-id');
                if (id) openAlbum(id);
            }
        });
    });

    backBtn.addEventListener('click', closeAlbum);
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => showLightboxImage(-1));
    lightboxNext.addEventListener('click', () => showLightboxImage(1));

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
        if (lightbox.classList.contains('active')) {
            if (e.key === 'ArrowLeft') showLightboxImage(-1);
            if (e.key === 'ArrowRight') showLightboxImage(1);
        }
    });
})();

// ============================================
// Handle Window Resize
// ============================================
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 968) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }, 250);
});

// ============================================
// Prevent Form Resubmission on Page Reload
// ============================================
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}
