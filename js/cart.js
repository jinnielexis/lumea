/* ========================================
   LUMEA COSMETICS - CART FUNCTIONALITY
   ======================================== */

// ========== ADD TO CART ==========
const addToCart = (productId, quantity = 1) => {
    const products = LumeaUtils.Storage.get('products') || [];
    const product = products.find(p => p.id === productId);

    if (!product) {
        LumeaUtils.Toast.show('Product not found', 'error');
        return;
    }

    if (product.stock < quantity) {
        LumeaUtils.Toast.show('Insufficient stock', 'error');
        return;
    }

    let cart = LumeaUtils.Storage.get('cart') || [];
    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            productId: productId,
            quantity: quantity,
            addedAt: new Date().toISOString()
        });
    }

    LumeaUtils.Storage.set('cart', cart);
    LumeaUtils.updateCartBadge();
    LumeaUtils.Toast.show('Added to cart!', 'success');
};

// ========== REMOVE FROM CART ==========
const removeFromCart = (productId) => {
    let cart = LumeaUtils.Storage.get('cart') || [];
    cart = cart.filter(item => item.productId !== productId);

    LumeaUtils.Storage.set('cart', cart);
    LumeaUtils.updateCartBadge();
    LumeaUtils.Toast.show('Item removed from cart', 'success');

    // Refresh cart display if on cart page
    if (typeof displayCart === 'function') {
        displayCart();
    }
};

// ========== UPDATE CART QUANTITY ==========
const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }

    const products = LumeaUtils.Storage.get('products') || [];
    const product = products.find(p => p.id === productId);

    if (!product) {
        LumeaUtils.Toast.show('Product not found', 'error');
        return;
    }

    if (product.stock < newQuantity) {
        LumeaUtils.Toast.show('Insufficient stock', 'error');
        return;
    }

    let cart = LumeaUtils.Storage.get('cart') || [];
    const item = cart.find(item => item.productId === productId);

    if (item) {
        item.quantity = newQuantity;
        LumeaUtils.Storage.set('cart', cart);
        LumeaUtils.updateCartBadge();

        // Refresh cart display if on cart page
        if (typeof displayCart === 'function') {
            displayCart();
        }
    }
};

// ========== GET CART ITEMS WITH PRODUCT DETAILS ==========
const getCartItems = () => {
    const cart = LumeaUtils.Storage.get('cart') || [];
    const products = LumeaUtils.Storage.get('products') || [];

    return cart.map(item => {
        const product = products.find(p => p.id === item.productId);
        return {
            ...item,
            product: product
        };
    }).filter(item => item.product); // Filter out items with deleted products
};

// ========== CALCULATE CART TOTALS ==========
const calculateCartTotals = () => {
    const cartItems = getCartItems();

    const subtotal = cartItems.reduce((sum, item) => {
        return sum + (item.product.price * item.quantity);
    }, 0);

    const tax = subtotal * 0.1; // 10% tax
    const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
    const total = subtotal + tax + shipping;

    return {
        subtotal: subtotal,
        tax: tax,
        shipping: shipping,
        total: total,
        itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    };
};

// ========== CLEAR CART ==========
const clearCart = () => {
    LumeaUtils.Storage.set('cart', []);
    LumeaUtils.updateCartBadge();
};

// ========== DISPLAY CART (for cart.html) ==========
const displayCart = () => {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');

    if (!cartItemsContainer) return;

    const cartItems = getCartItems();

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = `
      <div class="text-center py-5">
        <i class="fas fa-shopping-cart" style="font-size: 4rem; color: var(--primary-blush); opacity: 0.5;"></i>
        <h3 class="mt-3">Your cart is empty</h3>
        <p class="text-muted">Add some beautiful products to get started!</p>
        <a href="../index.html" class="btn btn-primary-custom mt-3">Continue Shopping</a>
      </div>
    `;
        if (cartSummary) {
            cartSummary.style.display = 'none';
        }
        return;
    }

    // Display cart items
    cartItemsContainer.innerHTML = cartItems.map(item => `
    <div class="cart-item" data-product-id="${item.productId}">
      <img src="../${item.product.image}" alt="${item.product.name}" class="cart-item-image" onerror="this.src='https://via.placeholder.com/100x100/F4B6C2/FFFFFF?text=Product'">
      <div class="flex-grow-1">
        <h5 class="mb-1">${item.product.name}</h5>
        <p class="text-muted mb-1">${item.product.category}</p>
        <p class="text-primary-custom fw-bold">${LumeaUtils.formatCurrency(item.product.price)}</p>
      </div>
      <div class="quantity-control">
        <button class="quantity-btn" onclick="LumeaCart.updateCartQuantity(${item.productId}, ${item.quantity - 1})">
          <i class="fas fa-minus"></i>
        </button>
        <span class="quantity-display">${item.quantity}</span>
        <button class="quantity-btn" onclick="LumeaCart.updateCartQuantity(${item.productId}, ${item.quantity + 1})">
          <i class="fas fa-plus"></i>
        </button>
      </div>
      <div class="text-end">
        <p class="fw-bold mb-2">${LumeaUtils.formatCurrency(item.product.price * item.quantity)}</p>
        <button class="btn btn-sm btn-outline-danger" onclick="LumeaCart.removeFromCart(${item.productId})">
          <i class="fas fa-trash"></i> Remove
        </button>
      </div>
    </div>
  `).join('');

    // Display cart summary
    if (cartSummary) {
        const totals = calculateCartTotals();
        cartSummary.innerHTML = `
      <div class="bg-white rounded-custom p-4 shadow-custom">
        <h4 class="mb-4">Order Summary</h4>
        <div class="d-flex justify-content-between mb-2">
          <span>Subtotal (${totals.itemCount} items)</span>
          <span>${LumeaUtils.formatCurrency(totals.subtotal)}</span>
        </div>
        <div class="d-flex justify-content-between mb-2">
          <span>Tax (10%)</span>
          <span>${LumeaUtils.formatCurrency(totals.tax)}</span>
        </div>
        <div class="d-flex justify-content-between mb-3">
          <span>Shipping</span>
          <span>${totals.shipping === 0 ? 'FREE' : LumeaUtils.formatCurrency(totals.shipping)}</span>
        </div>
        <hr>
        <div class="d-flex justify-content-between mb-4">
          <strong>Total</strong>
          <strong class="text-primary-custom fs-4">${LumeaUtils.formatCurrency(totals.total)}</strong>
        </div>
        <a href="checkout.html" class="btn btn-primary-custom w-100 mb-2">
          Proceed to Checkout
        </a>
        <a href="../index.html" class="btn btn-secondary-custom w-100">
          Continue Shopping
        </a>
      </div>
    `;
    }
};

// ========== DISPLAY CHECKOUT SUMMARY ==========
const displayCheckoutSummary = () => {
    const summaryContainer = document.getElementById('orderSummary');

    if (!summaryContainer) return;

    const cartItems = getCartItems();
    const totals = calculateCartTotals();

    summaryContainer.innerHTML = `
    <div class="bg-white rounded-custom p-4 shadow-custom">
      <h4 class="mb-4">Order Summary</h4>
      <div class="mb-3">
        ${cartItems.map(item => `
          <div class="d-flex justify-content-between mb-2">
            <span>${item.product.name} x ${item.quantity}</span>
            <span>${LumeaUtils.formatCurrency(item.product.price * item.quantity)}</span>
          </div>
        `).join('')}
      </div>
      <hr>
      <div class="d-flex justify-content-between mb-2">
        <span>Subtotal</span>
        <span>${LumeaUtils.formatCurrency(totals.subtotal)}</span>
      </div>
      <div class="d-flex justify-content-between mb-2">
        <span>Tax</span>
        <span>${LumeaUtils.formatCurrency(totals.tax)}</span>
      </div>
      <div class="d-flex justify-content-between mb-3">
        <span>Shipping</span>
        <span>${totals.shipping === 0 ? 'FREE' : LumeaUtils.formatCurrency(totals.shipping)}</span>
      </div>
      <hr>
      <div class="d-flex justify-content-between mb-3">
        <strong>Total</strong>
        <strong class="text-primary-custom fs-4">${LumeaUtils.formatCurrency(totals.total)}</strong>
      </div>
    </div>
  `;
};

// ========== HANDLE CHECKOUT ==========
const handleCheckout = (event) => {
    event.preventDefault();

    const form = event.target;
    const shippingData = {
        fullName: form.querySelector('#fullName').value.trim(),
        email: form.querySelector('#email').value.trim(),
        phone: form.querySelector('#phone').value.trim(),
        address: form.querySelector('#address').value.trim(),
        city: form.querySelector('#city').value.trim(),
        postalCode: form.querySelector('#postalCode').value.trim(),
        country: form.querySelector('#country').value
    };

    // Validate all fields
    let isValid = true;
    Object.entries(shippingData).forEach(([key, value]) => {
        const input = form.querySelector(`#${key}`);
        if (!LumeaUtils.Validator.required(value)) {
            LumeaUtils.Validator.showError(input, 'This field is required');
            isValid = false;
        } else {
            LumeaUtils.Validator.clearError(input);
        }
    });

    if (!isValid) return;

    // Save shipping data
    LumeaUtils.Storage.set('shippingData', shippingData);

    // Redirect to payment
    window.location.href = 'payment.html';
};

// ========== EXPORT FUNCTIONS ==========
window.LumeaCart = {
    addToCart,
    removeFromCart,
    updateCartQuantity,
    getCartItems,
    calculateCartTotals,
    clearCart,
    displayCart,
    displayCheckoutSummary,
    handleCheckout
};
