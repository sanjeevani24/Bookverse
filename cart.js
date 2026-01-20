let cart = [];

function initializeCart() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        window.location.href = 'auth.html';
        return;
    }

    loadCart();
    displayCart();
}

function loadCart() {
    cart = JSON.parse(localStorage.getItem('cart') || '[]');
}

function displayCart() {
    const cartItemsContainer = document.getElementById('cartItems');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is empty</h3>
                <a href="catalog.html" class="btn-nav">Start Shopping</a>
            </div>
        `;
        updateSummary();
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="item-icon">${item.icon}</div>
            <div class="item-details">
                <h3 class="item-title">${item.title}</h3>
                <p class="item-author">by ${item.author}</p>
                <p class="item-price">₹${item.price}</p>
                <div class="item-controls">
                    <div class="quantity-control">
                        <button class="btn-qty" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="btn-qty" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="btn-remove" onclick="removeItem(${item.id})">Remove</button>
                </div>
            </div>
        </div>
    `).join('');

    updateSummary();
}

function updateQuantity(itemId, change) {
    const item = cart.find(i => i.id === itemId);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeItem(itemId);
        return;
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

function removeItem(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

function updateSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = cart.length > 0 ? 50 : 0;
    const total = subtotal + shipping;

    document.getElementById('subtotal').textContent = `₹${subtotal}`;
    document.getElementById('shipping').textContent = `₹${shipping}`;
    document.getElementById('total').textContent = `₹${total}`;
}

function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    window.location.href = 'checkout.html';
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'auth.html';
}

initializeCart();
