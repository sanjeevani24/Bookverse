function initializeOrders() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        window.location.href = 'auth.html';
        return;
    }

    displayUserOrders(currentUser.id);
}

function displayUserOrders(userId) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const userOrders = orders.filter(order => order.userId === userId);

    const container = document.getElementById('ordersContainer');

    if (userOrders.length === 0) {
        container.innerHTML = `
            <div class="empty-orders">
                <h3>No Orders Yet</h3>
                <p>You haven't placed any orders yet. Start shopping to see your orders here.</p>
                <a href="catalog.html">Continue Shopping</a>
            </div>
        `;
        return;
    }

    container.innerHTML = userOrders.reverse().map(order => `
        <div class="order-card">
            <div class="order-header">
                <div class="order-id-section">
                    <h3>${order.orderId}</h3>
                    <p class="order-date">${new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div class="order-status">
                    <span class="status-badge status-${order.status}">${capitalizeStatus(order.status)}</span>
                </div>
            </div>

            <div class="timeline">
                <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <h4>Order Confirmed</h4>
                        <p>${new Date(order.date).toLocaleDateString()}</p>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <h4>Processing</h4>
                        <p>Your order is being prepared</p>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <h4>Shipped</h4>
                        <p>Tracking number will be provided soon</p>
                    </div>
                </div>
            </div>

            <div class="order-items">
                <h4>Order Items</h4>
                <div class="order-item-list">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <div class="item-info">
                                <div class="item-name">${item.title}</div>
                                <div class="item-qty">Qty: ${item.quantity}</div>
                            </div>
                            <div class="item-price">₹${item.price * item.quantity}</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="order-summary">
                <div class="summary-row">
                    <span>Subtotal:</span>
                    <span>₹${order.subtotal}</span>
                </div>
                <div class="summary-row">
                    <span>Shipping:</span>
                    <span>₹${order.shipping}</span>
                </div>
                <div class="summary-row total">
                    <span>Total:</span>
                    <span>₹${order.total}</span>
                </div>
            </div>

            <div class="order-actions">
                <button onclick="viewDetails('${order.orderId}')" class="btn-action btn-action-primary">View Details</button>
                <button onclick="downloadInvoice('${order.orderId}')" class="btn-action btn-action-secondary">Download Invoice</button>
            </div>
        </div>
    `).join('');
}

function capitalizeStatus(status) {
    return status.charAt(0).toUpperCase() + status.slice(1);
}

function viewDetails(orderId) {
    alert(`Viewing details for order: ${orderId}`);
}

function downloadInvoice(orderId) {
    alert(`Downloading invoice for order: ${orderId}`);
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'auth.html';
}

initializeOrders();
