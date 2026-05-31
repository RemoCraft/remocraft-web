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

        if (!hoverFiles.length && prefix && Number.isInteger(count) && count > 0) {
            const rawPrefix = prefix.trim();
            let extension = rawPrefix.match(/\.(jpe?g|png|webp|gif|avif)$/i);
            extension = extension ? extension[0] : (img.src.match(/\.(jpe?g|png|webp|gif|avif)$/i) || ['.jpg'])[0];
            const baseName = extension ? rawPrefix.replace(new RegExp(`${extension}$`), '') : rawPrefix;

            hoverFiles = Array.from({ length: count }, (_, index) => `${baseName}${index + 1}${extension}`);
        }

        const hoverPaths = hoverFiles
            .map(normalizeHoverPath)
            .filter(Boolean);

        if (!hoverPaths.length) return;

        const originalSrc = img.src;

        hoverPaths.forEach(src => {
            const preloaded = new Image();
            preloaded.src = src;
        });

        img.addEventListener('mouseenter', () => {
            const randomIndex = Math.floor(Math.random() * hoverPaths.length);
            const randomSrc = hoverPaths[randomIndex];
            if (randomSrc && img.src !== randomSrc) {
                img.src = randomSrc;
            }
        });

        img.addEventListener('mouseleave', () => {
            img.src = originalSrc;
        });
    });
};

setupHoverImageCards();
