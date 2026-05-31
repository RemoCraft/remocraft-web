const setupHoverImageCards = () => {
    const normalizeHoverPath = (file) => {
        if (typeof file !== 'string') return null;

        const trimmed = file.trim();
        if (!trimmed) return null;

        if (/^(https?:)?\/\//.test(trimmed) || trimmed.startsWith('/')) {
            return trimmed;
        }

        return getAssetPath(`images/${trimmed}`);
    };

    document.querySelectorAll('img[data-hover-prefix], img[data-hover-images]').forEach(img => {
        let hoverFiles = [];

        if (img.dataset.hoverImages) {
            try {
                hoverFiles = JSON.parse(img.dataset.hoverImages || '[]');
            } catch (e) {
                hoverFiles = [];
            }
        }

        const prefix = img.dataset.hoverPrefix;
        const count = parseInt(img.dataset.hoverCount, 10);
        const customExtension = img.dataset.hoverExtension ? img.dataset.hoverExtension.trim() : '';

        if (!hoverFiles.length && prefix && Number.isInteger(count) && count > 0) {
            const rawPrefix = prefix.trim();
            let extension = '';

            if (customExtension) {
                extension = customExtension.startsWith('.') ? customExtension : `.${customExtension}`;
            } else {
                extension = rawPrefix.match(/\.(jpe?g|png|webp|gif|avif)$/i);
                extension = extension ? extension[0] : (img.src.match(/\.(jpe?g|png|webp|gif|avif)$/i) || ['.jpg'])[0];
            }

            const baseName = extension ? rawPrefix.replace(new RegExp(`${extension}$`), '') : rawPrefix;
            hoverFiles = Array.from({ length: count }, (_, index) => `${baseName}${index + 1}${extension}`);
        }

        const hoverPaths = hoverFiles
            .map(normalizeHoverPath)
            .filter(Boolean);

        if (!hoverPaths.length) return;

        const originalSrc = img.src;
        let fadeTimeout = null;
        const fadeDuration = 200;

        hoverPaths.forEach(src => {
            const preloaded = new Image();
            preloaded.src = src;
        });

        const fadeToSrc = (newSrc) => {
            if (!newSrc || img.src === newSrc) return;
            if (fadeTimeout) {
                clearTimeout(fadeTimeout);
            }

            img.style.transition = `opacity ${fadeDuration}ms ease`;
            img.style.opacity = '0';

            fadeTimeout = setTimeout(() => {
                img.src = newSrc;
                img.style.opacity = '1';
                fadeTimeout = null;
            }, fadeDuration);
        };

        img.addEventListener('mouseenter', () => {
            const randomIndex = Math.floor(Math.random() * hoverPaths.length);
            const randomSrc = hoverPaths[randomIndex];
            fadeToSrc(randomSrc);
        });

        img.addEventListener('mouseleave', () => {
            fadeToSrc(originalSrc);
        });
    });
};

setupHoverImageCards();
