document.addEventListener('DOMContentLoaded', () => {
    const parallaxContainer = document.querySelector('.parallax-container');
    const heroSection = document.querySelector('.hero-section');
    const backgroundBack = document.querySelector('.parallax-layer-back');
    const backgroundBase = document.querySelector('.parallax-layer-base');
    const contentForeground = document.querySelector('.parallax-layer-foreground');

    // Set initial heights to match the content layer.
    // This ensures background layers cover the entire scrollable area.
    function updateParallaxLayerHeights() {
        const contentHeight = contentForeground.scrollHeight;
        backgroundBack.style.height = `${contentHeight}px`;
        backgroundBase.style.height = `${contentHeight}px`;
    }

    // Initial height update
    updateParallaxLayerHeights();

    // Update heights on window resize to ensure responsiveness
    window.addEventListener('resize', updateParallaxLayerHeights);

    // Parallax effect on scroll
    parallaxContainer.addEventListener('scroll', () => {
        const scrollTop = parallaxContainer.scrollTop;

        // Adjust the translation values for desired parallax speed
        // The larger the multiplier, the faster the background moves relative to scroll.
        // Parallax-layer-back moves slowest (further away), foreground moves fastest (at 0)
        backgroundBack.style.transform = `translateZ(-2px) scale(3) translateY(${scrollTop * 0.5}px)`;
        backgroundBase.style.transform = `translateZ(-1px) scale(2) translateY(${scrollTop * 0.7}px)`;
        // Content layer is at z=0, so no transform needed for parallax effect here.
        // Its position is naturally handled by the container's scroll.
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Scroll to the target element within the parallax container
                parallaxContainer.scrollTo({
                    top: targetElement.offsetTop - heroSection.offsetHeight, // Adjust for hero section height
                    behavior: 'smooth'
                });
            }
        });
    });

    // Fallback for image loading errors
    document.querySelectorAll('.parallax-layer').forEach(layer => {
        const currentBackgroundImage = layer.style.backgroundImage;
        let imageUrl = '';

        // Extract URL if background-image is set
        if (currentBackgroundImage && currentBackgroundImage !== 'none') {
            const urlMatch = currentBackgroundImage.match(/url\(['"]?(.*?)['"]?\)/i);
            if (urlMatch && urlMatch[1]) {
                imageUrl = urlMatch[1];
            }
        }

        // Only attempt to load image if a valid URL was found
        if (imageUrl) {
            const img = new Image();
            img.src = imageUrl;
            img.onerror = () => {
                layer.style.backgroundImage = 'none'; // Remove background image
                layer.style.backgroundColor = '#6B8E23'; // Set a solid fallback color
                console.error(`Failed to load image for parallax layer: ${imageUrl}. Using fallback color.`);
            };
        } else {
            // If no valid URL, apply fallback directly and log a warning
            layer.style.backgroundImage = 'none';
            layer.style.backgroundColor = '#6B8E23';
            console.warn(`Parallax layer has no valid background image URL. Using fallback color for:`, layer);
        }
    });
});
