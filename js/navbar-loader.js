/**
 * Dynamic Navbar Loader
 * Loads navbar from navbar.html and automatically marks the current page as active
 * Handles asset paths, language switching, and mobile menu
 */

// Translation dictionary for navbar
const navbarTranslations = {
    es: {
        'Home': 'Inicio',
        'Rules': 'Reglas',
        'Team': 'Equipo',
        'Announcements': 'Anuncios',
        'Guides': 'Guías',
        'Contact': 'Contacto',
        'Shop': 'Tienda',
        'EN': 'EN',
        'ES': 'ES'
    }
};

// Get current page info
function getCurrentPageInfo() {
    const pathname = window.location.pathname;
    const isSubdirectory = pathname.includes('/es/');
    const currentPage = pathname.split('/').pop() || 'index.html';
    const currentLang = isSubdirectory ? 'es' : 'en';
    
    return { isSubdirectory, currentPage, currentLang };
}

async function loadNavbar() {
    try {
        const { isSubdirectory, currentLang } = getCurrentPageInfo();
        const navbarPath = isSubdirectory ? '../navbar.html' : 'navbar.html';
        
        // Fetch the navbar HTML
        const response = await fetch(navbarPath);
        if (!response.ok) throw new Error('Failed to load navbar');
        
        let navbarHTML = await response.text();
        
        // Fix asset paths if in subdirectory
        if (isSubdirectory) {
            // Replace image paths for Spanish pages
            navbarHTML = navbarHTML.replace(/src="images\//g, 'src="../images/');
        }
        
        // Translate navbar if on Spanish page
        if (currentLang === 'es') {
            navbarHTML = translateNavbar(navbarHTML, 'es');
        }
        
        // Insert navbar at the top of body
        const navbarContainer = document.createElement('div');
        navbarContainer.id = 'navbar-container';
        navbarContainer.innerHTML = navbarHTML;
        document.body.insertBefore(navbarContainer, document.body.firstChild);
        
        // Mark current page as active
        markCurrentPage();
        
        // Fix language switcher links
        fixLanguageSwitcherLinks();
        
        // Reinitialize navbar functionality
        initializeNavbarFunctionality();
        
    } catch (error) {
        console.error('Error loading navbar:', error);
    }
}

function translateNavbar(html, language) {
    if (!navbarTranslations[language]) return html;
    
    let translatedHtml = html;
    const translations = navbarTranslations[language];
    
    // Translate text content of links
    Object.keys(translations).forEach(englishText => {
        const spanishText = translations[englishText];
        // Use word boundaries to match exact words
        const regex = new RegExp(`>\\s*${englishText}\\s*<`, 'g');
        translatedHtml = translatedHtml.replace(regex, `> ${spanishText} <`);
    });
    
    return translatedHtml;
}

function markCurrentPage() {
    const { currentPage, currentLang } = getCurrentPageInfo();
    
    // Mark active page in navigation
    const navLinks = document.querySelectorAll('.navbar .link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        // Check if this link matches current page
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html') ||
            (currentPage.includes('index.html') && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

function fixLanguageSwitcherLinks() {
    const { isSubdirectory, currentPage } = getCurrentPageInfo();
    const langLinks = document.querySelectorAll('.lang-link');
    const langBtn = document.querySelector('.lang-btn');
    
    langLinks.forEach(link => {
        link.classList.remove('active');
        const lang = link.getAttribute('data-lang');
        
        if (lang === 'en') {
            // English link
            if (!isSubdirectory) {
                // Already on EN page - mark as active
                link.classList.add('active');
                link.setAttribute('href', currentPage);
            } else {
                // On ES page - point to EN version
                link.setAttribute('href', '../' + currentPage);
            }
        } else if (lang === 'es') {
            // Spanish link
            if (isSubdirectory) {
                // Already on ES page - mark as active
                link.classList.add('active');
                link.setAttribute('href', currentPage);
            } else {
                // On EN page - point to ES version
                link.setAttribute('href', 'es/' + currentPage);
            }
        }
    });
    
    // Update language button text
    if (langBtn) {
        const langText = langBtn.querySelector('.lang-text');
        const langFlag = langBtn.querySelector('.lang-flag');
        if (langText && langFlag) {
            if (isSubdirectory) {
                langText.textContent = 'ES';
                langFlag.classList.remove('en');
                langFlag.classList.add('es');
            } else {
                langText.textContent = 'EN';
                langFlag.classList.remove('es');
                langFlag.classList.add('en');
            }
        }
    }
}

function initializeNavbarFunctionality() {
    const navbar = document.querySelector('.navbar');
    const navbarLinks = document.querySelector('.links');
    const hamburger = document.querySelector('.hamburger');
    
    // Mobile hamburger menu
    if (hamburger && navbar && navbarLinks) {
        // Remove previous event listeners by cloning
        const newHamburger = hamburger.cloneNode(true);
        hamburger.parentNode.replaceChild(newHamburger, hamburger);
        
        const hamburgerNew = document.querySelector('.hamburger');
        hamburgerNew.addEventListener('click', (e) => {
            e.stopPropagation();
            navbar.classList.toggle('active');
            navbarLinks.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navItems = document.querySelectorAll('.navbar .link');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navbar.classList.remove('active');
                navbarLinks.classList.remove('active');
            });
        });
    }
    
    // Language switcher menu
    const langBtn = document.querySelector('.lang-btn');
    const langMenu = document.querySelector('.lang-menu');
    
    if (langBtn && langMenu) {
        // Remove previous event listeners
        const newLangBtn = langBtn.cloneNode(true);
        langBtn.parentNode.replaceChild(newLangBtn, langBtn);
        
        const langBtnNew = document.querySelector('.lang-btn');
        const langMenuNew = document.querySelector('.lang-menu');
        
        langBtnNew.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = langBtnNew.getAttribute('aria-expanded') === 'true';
            langBtnNew.setAttribute('aria-expanded', !isExpanded);
            langMenuNew.setAttribute('aria-hidden', isExpanded);
            langMenuNew.style.display = isExpanded ? 'none' : 'block';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.lang-switcher')) {
                langBtnNew.setAttribute('aria-expanded', 'false');
                langMenuNew.setAttribute('aria-hidden', 'true');
                langMenuNew.style.display = 'none';
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
