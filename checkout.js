let cart = [];
let currentUser = null;

function initializeCheckout() {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        window.location.href = 'auth.html';
        return;
    }

    cart = JSON.parse(localStorage.getItem('cart') || '[]');

    if (cart.length === 0) {
        alert('Your cart is empty!');
        window.location.href = 'catalog.html';
        return;
    }

    document.getElementById('email').value = currentUser.email;

    displayOrderSummary();
}

function displayOrderSummary() {
    const orderItemsContainer = document.getElementById('orderItems');

    orderItemsContainer.innerHTML = cart.map(item => `
        <div class="order-item">
            <div class="item-info">
                <div class="item-name">${item.title}</div>
                <div class="item-qty">Quantity: ${item.quantity}</div>
            </div>
            <div class="item-price">₹${item.price * item.quantity}</div>
        </div>
    `).join('');

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 50;
    const total = subtotal + shipping;

    document.getElementById('subtotal').textContent = `₹${subtotal}`;
    document.getElementById('shipping').textContent = `₹${shipping}`;
    document.getElementById('total').textContent = `₹${total}`;
}

function placeOrder(event) {
    event.preventDefault();

    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        pincode: document.getElementById('pincode').value,
        paymentMethod: document.querySelector('input[name="payment"]:checked').value
    };

    const orderId = 'ORD' + Date.now();

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 50;
    const total = subtotal + shipping;

    const order = {
        orderId,
        userId: currentUser.id,
        userName: currentUser.username,
        items: cart,
        shippingInfo: formData,
        subtotal,
        shipping,
        total,
        status: 'confirmed',
        date: new Date().toISOString()
    };

    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    localStorage.removeItem('cart');

    showConfirmation(orderId);
}

function showConfirmation(orderId) {
    document.getElementById('orderId').textContent = orderId;

    const modal = document.getElementById('confirmationModal');
    modal.classList.add('active');
}

function goToCatalog() {
    window.location.href = 'catalog.html';
}

initializeCheckout();
