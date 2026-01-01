/* ========================================
   LUMEA COSMETICS - ADMIN FUNCTIONALITY
   ======================================== */

// ========== DISPLAY DASHBOARD STATS ==========
const displayDashboardStats = () => {
    const products = LumeaUtils.Storage.get('products') || [];
    const orders = LumeaUtils.Storage.get('orders') || [];
    const users = LumeaUtils.Storage.get('users') || [];

    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

    // Update stat cards
    document.getElementById('totalProducts').textContent = products.length;
    document.getElementById('totalOrders').textContent = orders.length;
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('totalRevenue').textContent = LumeaUtils.formatCurrency(totalRevenue);

    // Display recent orders
    displayRecentOrders();
};

// ========== DISPLAY RECENT ORDERS ==========
const displayRecentOrders = () => {
    const orders = LumeaUtils.Storage.get('orders') || [];
    const recentOrders = orders.slice(-5).reverse();

    const container = document.getElementById('recentOrders');
    if (!container) return;

    if (recentOrders.length === 0) {
        container.innerHTML = '<tr><td colspan="5" class="text-center">No orders yet</td></tr>';
        return;
    }

    container.innerHTML = recentOrders.map(order => `
    <tr>
      <td>#${order.id.substr(0, 8)}</td>
      <td>${order.customerName}</td>
      <td>${LumeaUtils.formatCurrency(order.total)}</td>
      <td><span class="badge-custom badge-${order.status.toLowerCase()}">${order.status}</span></td>
      <td>${new Date(order.date).toLocaleDateString()}</td>
    </tr>
  `).join('');
};

// ========== MANAGE CATEGORIES ==========
const displayCategories = () => {
    const categories = LumeaUtils.Storage.get('categories') || [];
    const container = document.getElementById('categoriesTable');

    if (!container) return;

    if (categories.length === 0) {
        container.innerHTML = '<tr><td colspan="3" class="text-center">No categories yet</td></tr>';
        return;
    }

    container.innerHTML = categories.map(category => `
    <tr>
      <td><i class="fas ${category.icon} me-2"></i>${category.name}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary" onclick="LumeaAdmin.editCategory(${category.id})">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="btn btn-sm btn-outline-danger ms-2" onclick="LumeaAdmin.deleteCategory(${category.id})">
          <i class="fas fa-trash"></i> Delete
        </button>
      </td>
    </tr>
  `).join('');
};

const addCategory = (event) => {
    event.preventDefault();

    const form = event.target;
    const categoryName = form.querySelector('#categoryName').value.trim();
    const categoryIcon = form.querySelector('#categoryIcon').value.trim();

    if (!categoryName) {
        LumeaUtils.Toast.show('Category name is required', 'error');
        return;
    }

    const categories = LumeaUtils.Storage.get('categories') || [];

    const newCategory = {
        id: LumeaUtils.generateId(),
        name: categoryName,
        icon: categoryIcon || 'fa-tag'
    };

    categories.push(newCategory);
    LumeaUtils.Storage.set('categories', categories);

    LumeaUtils.Toast.show('Category added successfully', 'success');
    form.reset();
    displayCategories();
};

const deleteCategory = (categoryId) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    let categories = LumeaUtils.Storage.get('categories') || [];
    categories = categories.filter(c => c.id !== categoryId);

    LumeaUtils.Storage.set('categories', categories);
    LumeaUtils.Toast.show('Category deleted successfully', 'success');
    displayCategories();
};

const editCategory = (categoryId) => {
    const categories = LumeaUtils.Storage.get('categories') || [];
    const category = categories.find(c => c.id === categoryId);

    if (!category) return;

    const newName = prompt('Enter new category name:', category.name);
    if (!newName) return;

    category.name = newName;
    LumeaUtils.Storage.set('categories', categories);

    LumeaUtils.Toast.show('Category updated successfully', 'success');
    displayCategories();
};

// ========== MANAGE PRODUCTS ==========
const displayAdminProducts = () => {
    const products = LumeaUtils.Storage.get('products') || [];
    const container = document.getElementById('productsTable');

    if (!container) return;

    if (products.length === 0) {
        container.innerHTML = '<tr><td colspan="7" class="text-center">No products yet</td></tr>';
        return;
    }

    container.innerHTML = products.map(product => `
    <tr>
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>${product.brand}</td>
      <td>${LumeaUtils.formatCurrency(product.price)}</td>
      <td>${product.stock}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary" onclick="LumeaAdmin.editProduct(${product.id})">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger ms-2" onclick="LumeaAdmin.deleteProduct(${product.id})">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
};

const addProduct = (event) => {
    event.preventDefault();

    const form = event.target;

    const productData = {
        id: parseInt(form.querySelector('#productId')?.value) || LumeaUtils.generateId(),
        name: form.querySelector('#productName').value.trim(),
        category: form.querySelector('#productCategory').value,
        brand: form.querySelector('#productBrand').value.trim(),
        price: parseFloat(form.querySelector('#productPrice').value),
        stock: parseInt(form.querySelector('#productStock').value),
        description: form.querySelector('#productDescription').value.trim(),
        ingredients: form.querySelector('#productIngredients').value.trim(),
        image: 'assets/images/product-placeholder.jpg',
        rating: 4.5,
        badge: form.querySelector('#productBadge')?.value || ''
    };

    // Validate
    if (!productData.name || !productData.category || !productData.brand) {
        LumeaUtils.Toast.show('Please fill all required fields', 'error');
        return;
    }

    const products = LumeaUtils.Storage.get('products') || [];

    // Check if editing existing product
    const existingIndex = products.findIndex(p => p.id === productData.id);

    if (existingIndex !== -1) {
        products[existingIndex] = productData;
        LumeaUtils.Toast.show('Product updated successfully', 'success');
    } else {
        products.push(productData);
        LumeaUtils.Toast.show('Product added successfully', 'success');
    }

    LumeaUtils.Storage.set('products', products);
    form.reset();
    displayAdminProducts();
};

const deleteProduct = (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    let products = LumeaUtils.Storage.get('products') || [];
    products = products.filter(p => p.id !== productId);

    LumeaUtils.Storage.set('products', products);
    LumeaUtils.Toast.show('Product deleted successfully', 'success');
    displayAdminProducts();
};

const editProduct = (productId) => {
    const products = LumeaUtils.Storage.get('products') || [];
    const product = products.find(p => p.id === productId);

    if (!product) return;

    // Populate form with product data
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productBrand').value = product.brand;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productIngredients').value = product.ingredients;

    // Scroll to form
    document.getElementById('productForm').scrollIntoView({ behavior: 'smooth' });
};

// ========== MANAGE ORDERS ==========
const displayOrders = () => {
    const orders = LumeaUtils.Storage.get('orders') || [];
    const container = document.getElementById('ordersTable');

    if (!container) return;

    if (orders.length === 0) {
        container.innerHTML = '<tr><td colspan="6" class="text-center">No orders yet</td></tr>';
        return;
    }

    container.innerHTML = orders.map(order => `
    <tr>
      <td>#${order.id.substr(0, 8)}</td>
      <td>${order.customerName}</td>
      <td>${order.customerEmail}</td>
      <td>${LumeaUtils.formatCurrency(order.total)}</td>
      <td>
        <select class="form-select form-select-sm" onchange="LumeaAdmin.updateOrderStatus('${order.id}', this.value)">
          <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
          <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
        </select>
      </td>
      <td>${new Date(order.date).toLocaleDateString()}</td>
    </tr>
  `).join('');
};

const updateOrderStatus = (orderId, newStatus) => {
    const orders = LumeaUtils.Storage.get('orders') || [];
    const order = orders.find(o => o.id === orderId);

    if (order) {
        order.status = newStatus;
        LumeaUtils.Storage.set('orders', orders);
        LumeaUtils.Toast.show('Order status updated', 'success');
        displayOrders();
    }
};

// ========== MANAGE USERS ==========
const displayUsers = () => {
    const users = LumeaUtils.Storage.get('users') || [];
    const container = document.getElementById('usersTable');

    if (!container) return;

    if (users.length === 0) {
        container.innerHTML = '<tr><td colspan="4" class="text-center">No users yet</td></tr>';
        return;
    }

    container.innerHTML = users.map(user => `
    <tr>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td><span class="badge-custom ${user.verified ? 'badge-delivered' : 'badge-pending'}">${user.verified ? 'Verified' : 'Pending'}</span></td>
      <td>${new Date(user.registeredDate).toLocaleDateString()}</td>
    </tr>
  `).join('');
};

// ========== POPULATE CATEGORY DROPDOWNS ==========
const populateCategoryDropdown = () => {
    const categories = LumeaUtils.Storage.get('categories') || [];
    const dropdown = document.getElementById('productCategory');

    if (dropdown) {
        dropdown.innerHTML = categories.map(cat =>
            `<option value="${cat.name}">${cat.name}</option>`
        ).join('');
    }
};

// ========== EXPORT FUNCTIONS ==========
window.LumeaAdmin = {
    displayDashboardStats,
    displayRecentOrders,
    displayCategories,
    addCategory,
    deleteCategory,
    editCategory,
    displayAdminProducts,
    addProduct,
    deleteProduct,
    editProduct,
    displayOrders,
    updateOrderStatus,
    displayUsers,
    populateCategoryDropdown
};
