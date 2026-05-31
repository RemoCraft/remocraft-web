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
        const fadeDuration = 300;

        const wrapper = document.createElement('div');
        wrapper.classList.add('hover-image-wrapper');
        wrapper.style.position = 'relative';
        wrapper.style.overflow = 'hidden';

        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);

        img.classList.add('hover-image-primary');
        img.style.display = 'block';
        img.style.width = '100%';
        img.style.height = '300px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '40px 3px';
        img.style.transition = `opacity ${fadeDuration}ms ease`;
        img.style.position = 'relative';
        img.style.zIndex = '1';

        const secondaryImg = img.cloneNode();
        secondaryImg.src = '';
        secondaryImg.classList.remove('hover-image-primary');
        secondaryImg.classList.add('hover-image-secondary');
        secondaryImg.style.position = 'absolute';
        secondaryImg.style.top = '0';
        secondaryImg.style.left = '0';
        secondaryImg.style.width = '100%';
        secondaryImg.style.height = '300px';
        secondaryImg.style.objectFit = 'cover';
        secondaryImg.style.borderRadius = '40px 3px';
        secondaryImg.style.opacity = '0';
        secondaryImg.style.pointerEvents = 'none';
        secondaryImg.style.zIndex = '2';
        secondaryImg.style.transition = `opacity ${fadeDuration}ms ease`;
        secondaryImg.removeAttribute('data-hover-prefix');
        secondaryImg.removeAttribute('data-hover-count');
        secondaryImg.removeAttribute('data-hover-extension');
        secondaryImg.removeAttribute('data-hover-images');

        wrapper.appendChild(secondaryImg);

        hoverPaths.forEach(src => {
            const preloaded = new Image();
            preloaded.src = src;
        });

        let currentSrc = originalSrc;
        let activeFade = null;

        const crossfadeTo = (newSrc) => {
            if (!newSrc || currentSrc === newSrc) return;
            secondaryImg.style.opacity = '0';
            secondaryImg.src = newSrc;

            const onLoaded = () => {
                secondaryImg.removeEventListener('load', onLoaded);
                if (activeFade) {
                    clearTimeout(activeFade);
                }

                secondaryImg.style.opacity = '1';
                activeFade = setTimeout(() => {
                    img.src = newSrc;
                    currentSrc = newSrc;
                    secondaryImg.style.opacity = '0';
                    activeFade = null;
                }, fadeDuration);
            };

            secondaryImg.addEventListener('load', onLoaded);
        };

        wrapper.addEventListener('mouseenter', () => {
            const randomIndex = Math.floor(Math.random() * hoverPaths.length);
            const randomSrc = hoverPaths[randomIndex];
            crossfadeTo(randomSrc);
        });

        wrapper.addEventListener('mouseleave', () => {
            crossfadeTo(originalSrc);
        });
    });
};

setupHoverImageCards();
