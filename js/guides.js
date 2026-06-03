document.addEventListener('DOMContentLoaded', () => {
    const tiers = Array.from(document.querySelectorAll('.recipe-tier[data-tier]'));
    const recipes = Array.from(document.querySelectorAll('.recipe[data-tier]'));
    const previewImage = document.querySelector('.recipe-preview-image img');
    const previewTitle = document.querySelector('.preview-title');
    const previewBadge = document.querySelector('.preview-badge');
    const previewText = document.querySelector('.preview-text');
    const defaultTier = 'tier-f';

    if (!tiers.length || !recipes.length || !previewImage || !previewTitle || !previewBadge || !previewText) {
        return;
    }

    function formatPreviewContent(contentHtml) {
        const lines = contentHtml
            .split(/<br\s*\/?>/i)
            .map(line => line.trim())
            .filter(line => line.length > 0);

        const ingredients = [];
        let resultLine = null;

        lines.forEach(line => {
            if (line.startsWith('🛠️') || line.startsWith('🛠')) {
                resultLine = line;
            } else {
                ingredients.push(line.replace(/^\+?\s*/g, ''));
            }
        });

        let result = '';
        if (ingredients.length) {
            result += '<ul class="recipe-bullet-list">';
            ingredients.forEach(item => {
                result += `<li>${item}</li>`;
            });
            result += '</ul>';
        }
        if (resultLine) {
            result += `<p class="recipe-result">${resultLine}</p>`;
        }
        return result;
    }

    function updatePreview(tierId) {
        const selectedTier = tiers.find(t => t.dataset.tier === tierId) || tiers[0];
        const recipe = recipes.find(r => r.dataset.tier === tierId) || recipes[0];

        if (!selectedTier || !recipe) return;

        tiers.forEach(t => t.classList.toggle('active', t === selectedTier));

        const tierImg = selectedTier.querySelector('img');
        if (tierImg) {
            previewImage.src = tierImg.src;
            previewImage.alt = tierImg.alt;
        }

        const titleText = recipe.querySelector('.recipe-header h4')?.textContent || '';
        const badgeText = recipe.querySelector('.recipe-output')?.textContent || '';
        const contentHtml = recipe.querySelector('.recipe-content')?.innerHTML || '';
        const badgeClass = recipe.querySelector('.recipe-output')?.className || '';

        previewTitle.textContent = titleText;
        previewBadge.textContent = badgeText;
        previewBadge.className = `recipe-output preview-badge ${badgeClass}`;
        previewText.innerHTML = formatPreviewContent(contentHtml);
    }

    document.body.classList.add('js-active');

    tiers.forEach(tier => {
        tier.addEventListener('click', () => updatePreview(tier.dataset.tier));
        tier.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                updatePreview(tier.dataset.tier);
            }
        });
    });

    updatePreview(defaultTier);
});
