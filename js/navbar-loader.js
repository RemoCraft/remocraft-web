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
        'Main guides': 'Todas las guías',
        'Contact': 'Contacto',
        'Shop': 'Tienda',
        'EN': 'EN',
        'ES': 'ES'
    }
};

const footerTranslations = {
    es: {
        'https://www.tiktok.com/@remocraftnetwork': 'https://www.tiktok.com/@remocraft_owner',
        'https://www.instagram.com/remocraftnetwork/': 'https://www.instagram.com/remocraft_owner/',
        'https://www.youtube.com/@remocraftnetwork': 'https://www.youtube.com/@remocraft_owner'
    }
};

// Get current page info
function normalizePath(path) {
    let normalized = path.replace(/\/index\.html$/, '').replace(/\/$/, '');
    if (normalized === '') normalized = '/';
    return normalized;
}

function getCurrentPageInfo() {
    const pathname = window.location.pathname;
    const currentLang = pathname.startsWith('/es/') ? 'es' : 'en';
    let currentPath = pathname;

    if (currentLang === 'es') {
        currentPath = pathname.replace(/^\/es/, '') || '/';
    }

    if (currentPath === '') currentPath = '/';

    return {
        pathname,
        currentLang,
        currentPath,
        normalizedPath: normalizePath(currentPath)
    };
}

function getRelativeRootPath() {
    const pathname = window.location.pathname;
    const segments = pathname.split('/').filter(Boolean);
    const depth = pathname.endsWith('/') ? segments.length : Math.max(0, segments.length - 1);
    return '../'.repeat(depth);
}

async function loadNavbar() {
    try {
        const { currentLang } = getCurrentPageInfo();
        const navbarPath = getRelativeRootPath() + 'navbar.html';
        
        const response = await fetch(navbarPath);
        if (!response.ok) throw new Error('Failed to load navbar');
        
        let navbarHTML = await response.text();
        
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
        
        // Fix internal nav URLs for the current language
        fixNavbarLinksForLanguage();
        
        // Reinitialize navbar functionality
        initializeNavbarFunctionality();
    } catch (error) {
        console.error('Error loading navbar:', error);
    }
}

async function loadFooter() {
    try {
        const { currentLang } = getCurrentPageInfo();
        const footerPath = getRelativeRootPath() + 'footer.html';
        const response = await fetch(footerPath);
        if (!response.ok) throw new Error('Failed to load footer');

        let footerHTML = await response.text();
        if (currentLang === 'es') {
            footerHTML = translateFooter(footerHTML, 'es');
        }

        const footerContainer = document.createElement('div');
        footerContainer.id = 'footer-container';
        footerContainer.innerHTML = footerHTML;
        const firstScript = document.body.querySelector('script');
        document.body.insertBefore(footerContainer, firstScript || null);
    } catch (error) {
        console.error('Error loading footer:', error);
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

function translateFooter(html, language) {
    if (!footerTranslations[language]) return html;
    
    let translatedHtml = html;
    const translations = footerTranslations[language];
    Object.keys(translations).forEach(englishUrl => {
        translatedHtml = translatedHtml.replaceAll(englishUrl, translations[englishUrl]);
    });
    return translatedHtml;
}

function markCurrentPage() {
    const { normalizedPath } = getCurrentPageInfo();
    
    const navLinks = document.querySelectorAll('.navbar .link, .navbar .dropdown-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (!href) return;

        const linkPath = normalizePath(new URL(href, window.location.origin).pathname);
        if (linkPath === normalizedPath) {
            link.classList.add('active');
        }
    });
}

function fixLanguageSwitcherLinks() {
    const { pathname, currentLang } = getCurrentPageInfo();
    const langLinks = document.querySelectorAll('.lang-link');
    const langBtn = document.querySelector('.lang-btn');
    const localePath = pathname.startsWith('/es/') ? pathname.replace(/^\/es/, '') || '/' : pathname || '/';
    
    langLinks.forEach(link => {
        link.classList.remove('active');
        const lang = link.getAttribute('data-lang');
        if (lang === 'en') {
            if (currentLang === 'en') {
                link.classList.add('active');
            }
            link.setAttribute('href', localePath);
        } else if (lang === 'es') {
            const esPath = localePath.startsWith('/') ? `/es${localePath}` : `/es/${localePath}`;
            if (currentLang === 'es') {
                link.classList.add('active');
            }
            link.setAttribute('href', esPath);
        }
    });
    
    // Update language button text
    if (langBtn) {
        const langText = langBtn.querySelector('.lang-text');
        const langFlag = langBtn.querySelector('.lang-flag');
        if (langText && langFlag) {
            if (currentLang === 'es') {
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

function fixNavbarLinksForLanguage() {
    const { currentLang } = getCurrentPageInfo();
    if (currentLang !== 'es') return;

    document.querySelectorAll('.navbar a:not(.lang-link)').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#') || href.startsWith('//')) {
            return;
        }

        if (href.startsWith('/es/')) {
            return;
        }

        if (href.startsWith('/')) {
            link.setAttribute('href', `/es${href}`);
        }
    });
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
        
        // Close menu when clicking on a destination link, but not on dropdown toggles
        const navItems = document.querySelectorAll('.navbar .link:not(.dropdown-toggle), .navbar .dropdown-link:not(.dropdown-submenu > .dropdown-link)');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navbar.classList.remove('active');
                navbarLinks.classList.remove('active');
            });
        });
    }

    // Mobile dropdown open/close behavior for touch devices
    const dropdownToggles = document.querySelectorAll('.navbar .nav-dropdown > .dropdown-toggle, .navbar .dropdown-submenu > .dropdown-link');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            if (window.innerWidth > 867) return;

            const dropdown = toggle.closest('.nav-dropdown, .dropdown-submenu');
            if (!dropdown) return;

            const isOpen = dropdown.classList.contains('open');
            if (!isOpen) {
                e.preventDefault();
                e.stopPropagation();
                dropdown.classList.add('open');
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-dropdown') && !e.target.closest('.dropdown-submenu') && !e.target.closest('.lang-switcher')) {
            document.querySelectorAll('.navbar .nav-dropdown.open, .navbar .dropdown-submenu.open').forEach(openDropdown => {
                openDropdown.classList.remove('open');
            });
        }
    });
    
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

// Load navbar and footer when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        loadNavbar();
        loadFooter();
    });
} else {
    loadNavbar();
    loadFooter();
}
