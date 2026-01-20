let books = [];
let orders = [];
let editingBookId = null;

function initializeAdmin() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser || currentUser.role !== 'admin') {
        alert('Access denied. Admin only.');
        window.location.href = 'auth.html';
        return;
    }

    document.getElementById('adminName').textContent = currentUser.username;

    loadData();
    displayBooks();
    displayOrders();
}

function loadData() {
    books = JSON.parse(localStorage.getItem('books') || '[]');
    orders = JSON.parse(localStorage.getItem('orders') || '[]');
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    event.target.classList.add('active');

    if (tabName === 'books') {
        document.getElementById('booksTab').classList.add('active');
    } else if (tabName === 'orders') {
        document.getElementById('ordersTab').classList.add('active');
    }
}

function displayBooks() {
    const booksList = document.getElementById('booksList');

    if (books.length === 0) {
        booksList.innerHTML = '<p style="text-align: center; color: #777; padding: 40px;">No books in inventory</p>';
        return;
    }

    booksList.innerHTML = books.map(book => `
        <div class="book-row">
            <div class="book-info">
                <div class="book-icon-large">${book.icon}</div>
                <div class="book-details">
                    <h3>${book.title}</h3>
                    <div class="book-meta">by ${book.author} • ${book.genre}</div>
                </div>
            </div>
            <div class="book-price-large">₹${book.price}</div>
            <div class="book-actions">
                <button class="btn-edit" onclick="editBook(${book.id})">Edit</button>
                <button class="btn-delete" onclick="deleteBook(${book.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function showAddBookForm() {
    editingBookId = null;
    document.getElementById('modalTitle').textContent = 'Add New Book';
    document.getElementById('bookTitle').value = '';
    document.getElementById('bookAuthor').value = '';
    document.getElementById('bookGenre').value = 'fiction';
    document.getElementById('bookPrice').value = '';
    document.getElementById('bookIcon').value = '📚';
    document.getElementById('bookId').value = '';

    document.getElementById('bookModal').classList.add('active');
}

function editBook(bookId) {
    const book = books.find(b => b.id === bookId);

    if (!book) return;

    editingBookId = bookId;
    document.getElementById('modalTitle').textContent = 'Edit Book';
    document.getElementById('bookTitle').value = book.title;
    document.getElementById('bookAuthor').value = book.author;
    document.getElementById('bookGenre').value = book.genre;
    document.getElementById('bookPrice').value = book.price;
    document.getElementById('bookIcon').value = book.icon;
    document.getElementById('bookId').value = book.id;

    document.getElementById('bookModal').classList.add('active');
}

function saveBook(event) {
    event.preventDefault();

    const bookData = {
        title: document.getElementById('bookTitle').value,
        author: document.getElementById('bookAuthor').value,
        genre: document.getElementById('bookGenre').value,
        price: parseInt(document.getElementById('bookPrice').value),
        icon: document.getElementById('bookIcon').value
    };

    if (editingBookId) {
        const bookIndex = books.findIndex(b => b.id === editingBookId);

        if (bookIndex !== -1) {
            books[bookIndex] = { ...books[bookIndex], ...bookData };
        }
    } else {
        const newBook = {
            id: Date.now(),
            ...bookData
        };
        books.push(newBook);
    }

    localStorage.setItem('books', JSON.stringify(books));
    displayBooks();
    closeModal();

    alert(editingBookId ? 'Book updated successfully!' : 'Book added successfully!');
}

function deleteBook(bookId) {
    if (!confirm('Are you sure you want to delete this book?')) {
        return;
    }

    books = books.filter(b => b.id !== bookId);
    localStorage.setItem('books', JSON.stringify(books));
    displayBooks();

    alert('Book deleted successfully!');
}

function closeModal() {
    document.getElementById('bookModal').classList.remove('active');
}

function displayOrders() {
    const ordersList = document.getElementById('ordersList');

    if (orders.length === 0) {
        ordersList.innerHTML = '<p style="text-align: center; color: #777; padding: 40px;">No orders yet</p>';
        return;
    }

    ordersList.innerHTML = orders.slice().reverse().map(order => `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <div class="order-id">${order.orderId}</div>
                    <div class="order-date">${new Date(order.date).toLocaleString()}</div>
                </div>
                <div style="text-align: right;">
                    <div><strong>Status:</strong> ${order.status}</div>
                </div>
            </div>
            <div class="order-customer">
                <strong>Customer:</strong> ${order.userName} (${order.shippingInfo.email})
            </div>
            <div class="order-customer">
                <strong>Shipping:</strong> ${order.shippingInfo.address}, ${order.shippingInfo.city} - ${order.shippingInfo.pincode}
            </div>
            <div class="order-customer">
                <strong>Phone:</strong> ${order.shippingInfo.phone}
            </div>
            <div class="order-items">
                <strong>Items:</strong>
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.title} × ${item.quantity}</span>
                        <span>₹${item.price * item.quantity}</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">
                Total: ₹${order.total}
            </div>
        </div>
    `).join('');
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'auth.html';
}

initializeAdmin();
