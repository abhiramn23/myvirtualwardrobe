// My Virtual Wardrobe - Chrome Extension Content Script
// Extracts product information from web pages using Open Graph / meta tags

(function () {
    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'getProductInfo') {
            const productInfo = extractProductInfo();
            sendResponse(productInfo);
        }
        return true; // Keep message channel open for async response
    });

    function extractProductInfo() {
        const info = {
            title: null,
            price: null,
            image: null,
            url: window.location.href,
        };

        // 1. Try Open Graph meta tags
        info.title =
            getMetaContent('og:title') ||
            getMetaContent('twitter:title') ||
            document.title;

        info.image =
            getMetaContent('og:image') ||
            getMetaContent('twitter:image') ||
            getMetaContent('product:image');

        // 2. Try to extract price
        const ogPrice = getMetaContent('og:price:amount') || getMetaContent('product:price:amount');
        if (ogPrice) {
            info.price = parseFloat(ogPrice);
        } else {
            // Try common price selectors
            const priceSelectors = [
                '[data-price]',
                '.price',
                '.product-price',
                '#price',
                '.price-current',
                '[itemprop="price"]',
                '.a-price .a-offscreen', // Amazon
                '.price--main',
            ];

            for (const selector of priceSelectors) {
                const el = document.querySelector(selector);
                if (el) {
                    const priceText = el.getAttribute('data-price') || el.getAttribute('content') || el.textContent;
                    const match = priceText?.match(/[\d,.]+/);
                    if (match) {
                        info.price = parseFloat(match[0].replace(/,/g, ''));
                        break;
                    }
                }
            }
        }

        // 3. Fallback for image: try to find the main product image
        if (!info.image) {
            const imgSelectors = [
                '[itemprop="image"]',
                '.product-image img',
                '.product__image img',
                '#main-image',
                '.gallery img',
            ];

            for (const selector of imgSelectors) {
                const el = document.querySelector(selector);
                if (el) {
                    info.image = el.src || el.getAttribute('data-src');
                    if (info.image) break;
                }
            }
        }

        // Clean up title
        if (info.title) {
            // Remove common suffixes like " | Store Name" or " - Store Name"
            info.title = info.title.split(/\s*[|\-–—]\s*/)[0].trim();
        }

        return info;
    }

    function getMetaContent(property) {
        const el =
            document.querySelector(`meta[property="${property}"]`) ||
            document.querySelector(`meta[name="${property}"]`);
        return el?.getAttribute('content') || null;
    }
})();
