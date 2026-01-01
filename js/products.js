// ========== DISPLAY PRODUCTS ==========
/* ========================================
 LUMEA COSMETICS - PRODUCT FUNCTIONALITY
 ======================================== */

const LumeaProducts = {
// 1. Core Display Logic
    displayProducts: function (products, containerId, basePath = '') {
        const container = document.getElementById(containerId);
        if (!container)
            return;
        if (products.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-search" style="font-size: 3rem; color: var(--primary-blush); opacity: 0.5;"></i>
                    <h4 class="mt-3">No products found</h4>
                    <p class="text-muted">Try adjusting your filters</p>
                </div>`;
            return;
        }

        container.innerHTML = products.map(product => `
            <div class="col-md-6 col-lg-4">
                <div class="product-card">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/280x280/B02A5B/FFFFFF?text=${encodeURIComponent(product.name)}'">
                        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                    </div>
                    <div class="product-info">
                        <div class="product-category">${product.category}</div>
                        <h5 class="product-title">${product.name}</h5>
                        <div class="product-rating">
                            ${this.generateStarRating(product.rating)}
                            <span class="ms-2 text-muted">(${product.rating})</span>
                        </div>
                        <div class="product-price">${LumeaUtils.formatCurrency(product.price)}</div>
                        <button class="add-to-cart-btn" onclick="LumeaCart.addToCart(${product.id})">
                            <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                        </button>
                        <a href="${basePath}product-details.html?id=${product.id}" class="btn btn-secondary-custom w-100 mt-2">
                            View Details
                        </a>
                    </div>
                </div>
            </div>`).join('');
    },
    // 2. Filter Logic
    filterProducts: function () {
        const products = LumeaUtils.Storage.get('products') || [];
        const categoryFilter = document.getElementById('categoryFilter')?.value || 'all';
        const brandFilter = document.getElementById('brandFilter')?.value || 'all';
        const minPrice = parseFloat(document.getElementById('minPrice')?.value || 0);
        const maxPrice = parseFloat(document.getElementById('maxPrice')?.value || 1000);
        const searchQuery = document.getElementById('searchInput')?.value.toLowerCase() || '';
        return products.filter(p => {
            const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
            const matchesBrand = brandFilter === 'all' || p.brand === brandFilter;
            const matchesPrice = p.price >= minPrice && p.price <= maxPrice;
            const matchesSearch = !searchQuery ||
                    p.name.toLowerCase().includes(searchQuery) ||
                    p.description.toLowerCase().includes(searchQuery);
            return matchesCategory && matchesBrand && matchesPrice && matchesSearch;
        });
    },
    // 3. Apply everything (Used by HTML events)
    applyFilters: function () {
        let filtered = this.filterProducts();
        // Handle Sorting
        const sortBy = document.getElementById('sortBy')?.value || 'default';
        filtered = this.sortProducts(filtered, sortBy);
        this.displayProducts(filtered, 'productGrid');
        const resultCount = document.getElementById('resultCount');
        if (resultCount) {
            resultCount.textContent = `${filtered.length} products found`;
        }
    },
    // 4. Sorting Logic
    sortProducts: function (products, sortBy) {
        const sorted = [...products];
        switch (sortBy) {
            case 'price-low':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price-high':
                return sorted.sort((a, b) => b.price - a.price);
            case 'name-az':
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case 'name-za':
                return sorted.sort((a, b) => b.name.localeCompare(a.name));
            case 'rating':
                return sorted.sort((a, b) => b.rating - a.rating);
            default:
                return sorted;
        }
    },
    // 5. Star Rating UI
    generateStarRating: function (rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        let stars = '';
        for (let i = 0; i < fullStars; i++)
            stars += '<i class="fas fa-star"></i>';
        if (hasHalfStar)
            stars += '<i class="fas fa-star-half-alt"></i>';
        for (let i = 0; i < emptyStars; i++)
            stars += '<i class="far fa-star"></i>';
        return stars;
    },
    // 6. Product Details Logic
    displayProductDetails: function () {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));
        if (!productId) {
            window.location.href = '../index.html';
            return;
        }

        const products = LumeaUtils.Storage.get('products') || [];
        const product = products.find(p => p.id === productId);
        if (!product) {
            LumeaUtils.Toast.show('Product not found', 'error');
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1500);
            return;
        }

        document.title = `${product.name} - Lumea Cosmetics`;
        const productInfo = document.getElementById('productInfo');
        if (productInfo) {
            productInfo.innerHTML = `
                <div class="product-category mb-2">${product.category}</div>
                <h1 class="product-title mb-3">${product.name}</h1>
                <div class="product-rating mb-3">
                    ${this.generateStarRating(product.rating)}
                    <span class="ms-2 text-muted">(${product.rating} / 5.0)</span>
                </div>
                <div class="product-price mb-4">${LumeaUtils.formatCurrency(product.price)}</div>
                <p class="mb-4">${product.description}</p>
                <div class="mb-4"><h5>Ingredients</h5><p class="text-muted">${product.ingredients}</p></div>
                <div class="d-grid gap-2">
                    <button class="btn btn-primary-custom btn-lg" onclick="LumeaProducts.addProductToCart()">
                        <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                    </button>
                </div>`;
            const productImage = document.getElementById('productImage');
            if (productImage)
                productImage.src = product.image;
        }
    },
    // 7. Quantity and Cart Helpers
    currentQuantity: 1,
    changeQuantity: function (delta) {
        this.currentQuantity = Math.max(1, this.currentQuantity + delta);
        const display = document.getElementById('quantityDisplay');
        if (display)
            display.textContent = this.currentQuantity;
    },
    addProductToCart: function () {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));
        LumeaCart.addToCart(productId, this.currentQuantity);
        this.currentQuantity = 1;
    },

// 8. Handle Search from URL (Home Page Search)
    handleUrlSearch: function () {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        if (query) {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = query; // Put the text in the search box
                this.applyFilters(); // Trigger the search logic automatically
            }
        }
    }
};
// Make it global
window.LumeaProducts = LumeaProducts;