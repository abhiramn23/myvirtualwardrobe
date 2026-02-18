// My Virtual Wardrobe - Chrome Extension Popup Script
// Replace these with your actual Supabase project values
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

let accessToken = null;
let currentProduct = null;

// DOM elements
const loginView = document.getElementById('login-view');
const productView = document.getElementById('product-view');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const loginStatus = document.getElementById('login-status');
const productCard = document.getElementById('product-card');
const noProduct = document.getElementById('no-product');
const productImage = document.getElementById('product-image');
const productTitle = document.getElementById('product-title');
const productUrlDisplay = document.getElementById('product-url-display');
const productPrice = document.getElementById('product-price');
const categorySelect = document.getElementById('category-select');
const saveBtn = document.getElementById('save-btn');
const saveStatus = document.getElementById('save-status');
const logoutBtn = document.getElementById('logout-btn');

// Check if user is already logged in
chrome.storage.local.get(['access_token', 'user_id'], (result) => {
    if (result.access_token) {
        accessToken = result.access_token;
        showProductView();
        detectProduct();
    }
});

// Login handler
loginBtn.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        showStatus(loginStatus, 'Please enter email and password', 'error');
        return;
    }

    loginBtn.disabled = true;
    loginBtn.textContent = 'Signing in...';

    try {
        const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (data.access_token) {
            accessToken = data.access_token;
            chrome.storage.local.set({
                access_token: data.access_token,
                user_id: data.user.id,
            });
            showProductView();
            detectProduct();
        } else {
            showStatus(loginStatus, data.error_description || 'Login failed', 'error');
        }
    } catch (err) {
        showStatus(loginStatus, 'Network error. Please try again.', 'error');
    }

    loginBtn.disabled = false;
    loginBtn.textContent = 'Sign In';
});

// Logout handler
logoutBtn.addEventListener('click', () => {
    chrome.storage.local.remove(['access_token', 'user_id']);
    accessToken = null;
    loginView.style.display = 'block';
    productView.style.display = 'none';
});

// Save to wishlist handler
saveBtn.addEventListener('click', async () => {
    if (!currentProduct || !accessToken) return;

    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    try {
        const { user_id } = await new Promise((resolve) => {
            chrome.storage.local.get(['user_id'], resolve);
        });

        const res = await fetch(`${SUPABASE_URL}/rest/v1/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${accessToken}`,
                'Prefer': 'return=minimal',
            },
            body: JSON.stringify({
                user_id: user_id,
                title: currentProduct.title,
                image_url: currentProduct.image,
                price: currentProduct.price || 0,
                category: categorySelect.value,
                status: 'wishlist',
                product_link: currentProduct.url,
            }),
        });

        if (res.ok) {
            showStatus(saveStatus, '✓ Saved to wishlist!', 'success');
        } else {
            const errData = await res.json();
            showStatus(saveStatus, errData.message || 'Failed to save', 'error');
        }
    } catch (err) {
        showStatus(saveStatus, 'Network error. Please try again.', 'error');
    }

    saveBtn.disabled = false;
    saveBtn.textContent = 'Save to Wishlist';
});

// Detect product on current tab
function detectProduct() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'getProductInfo' }, (response) => {
                if (chrome.runtime.lastError || !response) {
                    noProduct.style.display = 'block';
                    productCard.style.display = 'none';
                    saveBtn.disabled = true;
                    return;
                }

                if (response.title) {
                    currentProduct = response;
                    productTitle.textContent = response.title;
                    productImage.src = response.image || '';
                    productImage.style.display = response.image ? 'block' : 'none';
                    productPrice.textContent = response.price ? `$${response.price}` : 'Price not detected';
                    productUrlDisplay.textContent = new URL(response.url).hostname;
                    productCard.style.display = 'flex';
                    noProduct.style.display = 'none';
                    saveBtn.disabled = false;
                }
            });
        }
    });
}

// Helper functions
function showProductView() {
    loginView.style.display = 'none';
    productView.style.display = 'block';
}

function showStatus(element, message, type) {
    element.className = `status ${type}`;
    element.textContent = message;
    element.style.display = 'block';
    setTimeout(() => {
        element.style.display = 'none';
    }, 3000);
}
