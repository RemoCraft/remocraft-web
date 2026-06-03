/**
 * Dynamic Navbar Loader
 * Loads navbar from navbar.html and automatically marks the current page as active
 * This eliminates the need to update navbar in every single HTML file
 */

async function loadNavbar() {
    try {
        // Determine if we're in a subdirectory (es/)
        const isSubdirectory = window.location.pathname.includes('/es/');
        const navbarPath = isSubdirectory ? '../navbar.html' : 'navbar.html';
        
        // Fetch the navbar HTML
        const response = await fetch(navbarPath);
        if (!response.ok) throw new Error('Failed to load navbar');
        
        const navbarHTML = await response.text();
        
        // Insert navbar at the top of body
        const navbarContainer = document.createElement('div');
        navbarContainer.id = 'navbar-container';
        navbarContainer.innerHTML = navbarHTML;
        document.body.insertBefore(navbarContainer, document.body.firstChild);
        
        // Mark current page as active
        markCurrentPage();
        
        // Reinitialize navbar functionality (hamburger menu)
        initializeNavbarFunctionality();
        
    } catch (error) {
        console.error('Error loading navbar:', error);
    }
}

function markCurrentPage() {
    // Get current page filename
    let currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Get all navbar links
    const navLinks = document.querySelectorAll('.navbar .link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Remove all active classes first
        link.classList.remove('active');
        
        // Check if this link matches current page
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html') ||
            (currentPage.includes('index.html') && href === 'index.html')) {
            link.classList.add('active');
        }
    });
    
    // Also handle language-specific pages
    const currentLang = window.location.pathname.includes('/es/') ? 'es' : 'en';
    const langLinks = document.querySelectorAll('.lang-link');
    
    langLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        // Check if language matches
        if ((currentLang === 'es' && href.includes('../')) || 
            (currentLang === 'es' && !href.includes('../'))) {
            link.classList.add('active');
        } else if ((currentLang === 'en' && !href.includes('../')) || 
                   (currentLang === 'en' && href.includes('../'))) {
            link.classList.add('active');
        }
    });
}

function initializeNavbarFunctionality() {
    // Mobile navbar functionality
    const navbar = document.querySelector('.navbar');
    const navbarLinks = document.querySelector('.links');
    const hamburger = document.querySelector('.hamburger');
    
    if (hamburger && navbar && navbarLinks) {
        hamburger.addEventListener('click', () => {
            navbar.classList.toggle('active');
            navbarLinks.classList.toggle('active');
        });
    }
    
    // Language switcher functionality
    const langBtn = document.querySelector('.lang-btn');
    const langMenu = document.querySelector('.lang-menu');
    
    if (langBtn && langMenu) {
        langBtn.addEventListener('click', () => {
            const isExpanded = langBtn.getAttribute('aria-expanded') === 'true';
            langBtn.setAttribute('aria-expanded', !isExpanded);
            langMenu.setAttribute('aria-hidden', isExpanded);
            langMenu.style.display = isExpanded ? 'none' : 'block';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.lang-switcher')) {
                langBtn.setAttribute('aria-expanded', 'false');
                langMenu.setAttribute('aria-hidden', 'true');
                langMenu.style.display = 'none';
            }
        });
    }
}

// Load navbar when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNavbar);
} else {
    loadNavbar();
}
