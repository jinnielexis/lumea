/* ========================================
 LUMEA COSMETICS - MAIN UTILITIES
 ======================================== */

// ========== LOCALSTORAGE HELPERS ==========
const Storage = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },

    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    },

    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },

    clear: () => {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }
};

// ========== TOAST NOTIFICATIONS ==========
const Toast = {
    show: (message, type = 'info') => {
        // Remove existing toasts
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }

        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
      <span>${message}</span>
    `;

        // Add styles
        toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#28A745' : type === 'error' ? '#DC3545' : '#17A2B8'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 15px;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: 500;
      animation: slideInRight 0.3s ease-out;
    `;

        document.body.appendChild(toast);

        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ========== FORM VALIDATION ==========
const Validator = {
    email: (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    password: (password) => {
        // At least 6 characters
        return password.length >= 6;
    },

    phone: (phone) => {
        const regex = /^[0-9]{10}$/;
        return regex.test(phone.replace(/[\s-]/g, ''));
    },

    required: (value) => {
        return value.trim() !== '';
    },

    match: (value1, value2) => {
        return value1 === value2;
    },

    showError: (input, message) => {
        const formGroup = input.closest('.mb-3') || input.parentElement;
        let errorDiv = formGroup.querySelector('.invalid-feedback');

        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            formGroup.appendChild(errorDiv);
        }

        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        input.classList.add('is-invalid');
    },

    clearError: (input) => {
        const formGroup = input.closest('.mb-3') || input.parentElement;
        const errorDiv = formGroup.querySelector('.invalid-feedback');

        if (errorDiv) {
            errorDiv.style.display = 'none';
        }

        input.classList.remove('is-invalid');
    }
};

// ========== SAMPLE PRODUCT DATA ==========
const initializeSampleData = () => {
    // Check if products already exist
    if (!Storage.get('products')) {
        const sampleProducts = [
            {
                id: 1,
                name: 'Radiant Glow Serum',
                category: 'Skincare',
                brand: 'Lumea',
                price: 45.99,
                stock: 50,
                description: 'A luxurious serum that gives your skin a radiant, youthful glow. Infused with vitamin C and hyaluronic acid.',
                ingredients: 'Water, Vitamin C, Hyaluronic Acid, Glycerin, Niacinamide',
                image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=500&fit=crop',
                rating: 4.8,
                badge: 'New'
            },
            {
                id: 2,
                name: 'Velvet Matte Lipstick',
                category: 'Makeup',
                brand: 'Lumea',
                price: 24.99,
                stock: 100,
                description: 'Long-lasting velvet matte lipstick with rich, vibrant color. Comfortable wear all day.',
                ingredients: 'Castor Oil, Beeswax, Carnauba Wax, Vitamin E, Natural Pigments',
                image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&h=500&fit=crop',
                rating: 4.9,
                badge: 'Best Seller'
            },
            {
                id: 3,
                name: 'Hydrating Face Cream',
                category: 'Skincare',
                brand: 'Lumea',
                price: 38.50,
                stock: 75,
                description: 'Deep hydration cream that nourishes and protects your skin. Perfect for all skin types.',
                ingredients: 'Shea Butter, Jojoba Oil, Aloe Vera, Vitamin E, Ceramides',
                image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop',
                rating: 4.7,
                badge: 'Featured'
            },
            {
                id: 4,
                name: 'Rose Gold Eyeshadow Palette',
                category: 'Makeup',
                brand: 'Lumea',
                price: 52.00,
                stock: 60,
                description: '12 stunning rose gold shades for every occasion. Highly pigmented and blendable.',
                ingredients: 'Mica, Talc, Titanium Dioxide, Iron Oxides, Vitamin E',
                image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&h=500&fit=crop',
                rating: 5.0,
                badge: 'Best Seller'
            },
            {
                id: 5,
                name: 'Nourishing Hair Mask',
                category: 'Haircare',
                brand: 'Lumea',
                price: 32.99,
                stock: 80,
                description: 'Intensive hair treatment that repairs and strengthens damaged hair. Leaves hair silky smooth.',
                ingredients: 'Argan Oil, Keratin, Coconut Oil, Shea Butter, Protein Complex',
                image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&h=500&fit=crop',
                rating: 4.6,
                badge: 'New'
            },
            {
                id: 6,
                name: 'Floral Essence Perfume',
                category: 'Fragrance',
                brand: 'Lumea',
                price: 68.00,
                stock: 40,
                description: 'Elegant floral fragrance with notes of rose, jasmine, and vanilla. Long-lasting scent.',
                ingredients: 'Alcohol, Fragrance, Rose Extract, Jasmine Oil, Vanilla',
                image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&h=500&fit=crop',
                rating: 4.9,
                badge: 'Featured'
            },
            {
                id: 7,
                name: 'Brightening Eye Cream',
                category: 'Skincare',
                brand: 'Lumea',
                price: 41.50,
                stock: 55,
                description: 'Reduces dark circles and puffiness. Brightens and firms the delicate eye area.',
                ingredients: 'Caffeine, Vitamin K, Peptides, Hyaluronic Acid, Niacinamide',
                image: 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=500&h=500&fit=crop',
                rating: 4.7,
                badge: 'New'
            },
            {
                id: 8,
                name: 'Luminous Foundation',
                category: 'Makeup',
                brand: 'Lumea',
                price: 44.99,
                stock: 90,
                description: 'Lightweight foundation with buildable coverage. Gives a natural, luminous finish.',
                ingredients: 'Water, Titanium Dioxide, Glycerin, Vitamin E, SPF 15',
                image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&h=500&fit=crop',
                rating: 4.8,
                badge: 'Best Seller'
            }
        ];

        Storage.set('products', sampleProducts);
    }

    // Initialize categories
    if (!Storage.get('categories')) {
        const categories = [
            {id: 1, name: 'Skincare', icon: 'fa-spa'},
            {id: 2, name: 'Makeup', icon: 'fa-palette'},
            {id: 3, name: 'Haircare', icon: 'fa-cut'},
            {id: 4, name: 'Fragrance', icon: 'fa-spray-can'}
        ];
        Storage.set('categories', categories);
    }

    // Initialize empty arrays if they don't exist
    if (!Storage.get('users')) {
        Storage.set('users', []);
    }

    if (!Storage.get('orders')) {
        Storage.set('orders', []);
    }

    if (!Storage.get('cart')) {
        Storage.set('cart', []);
    }
};

// ========== UPDATE CART BADGE ==========
const updateCartBadge = () => {
    const cart = Storage.get('cart') || [];
    const badge = document.querySelector('.cart-badge');

    if (badge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
};

// ========== CHECK AUTHENTICATION ==========
const checkAuth = () => {
    const currentUser = Storage.get('currentUser');
    return currentUser !== null;
};

const getCurrentUser = () => {
    return Storage.get('currentUser');
};

const logout = () => {
    Storage.remove('currentUser');
    Toast.show('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 1000);
};

// ========== UPDATE USER PROFILE ICON ==========
const updateProfileIcon = () => {
    const currentUser = getCurrentUser();
    const profileIcon = document.querySelector('.profile-icon');

    if (profileIcon && currentUser) {
        profileIcon.innerHTML = `<i class="fas fa-user-circle"></i>`;
        profileIcon.title = currentUser.name;
    }
};

// ========== FORMAT CURRENCY ==========
const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
};

// ========== GENERATE UNIQUE ID ==========
const generateId = () => {
    return Date.now() + Math.random().toString(36).substr(2, 9);
};

// ========== INITIALIZE ON PAGE LOAD ==========
document.addEventListener('DOMContentLoaded', () => {
    initializeSampleData();
    updateCartBadge();
    updateProfileIcon();

    // --- GLOBAL SEARCH LOGIC ---
    const globalSearchInput = document.querySelector('#navSearchInput');
    if (globalSearchInput) {
        console.log("Search Bar Found in DOM");

        globalSearchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // STOP THE FORM FROM RELOADING
                const query = globalSearchInput.value.trim();
                console.log("Enter pressed. Query:", query);

                if (query) {
                    // Check if we are already in the 'pages' folder
                    const isInsidePages = window.location.pathname.includes('/pages/');
                    const targetPath = isInsidePages ? 'search.html' : 'pages/search.html';

                    const finalUrl = `${targetPath}?q=${encodeURIComponent(query)}`;
                    console.log("Redirecting to:", finalUrl);
                    window.location.href = finalUrl;
                }
            }
        });
    }
});

// ========== EXPORT FOR USE IN OTHER FILES ==========
window.LumeaUtils = {
    Storage,
    Toast,
    Validator,
    updateCartBadge,
    checkAuth,
    getCurrentUser,
    logout,
    updateProfileIcon,
    formatCurrency,
    generateId
};
