let allBooks = [];
let currentCategory = 'all';

function initializeCatalog() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        window.location.href = 'auth.html';
        return;
    }

    document.getElementById('userName').textContent = currentUser.username;

    initializeBooks();
    displayBooks(allBooks);
    updateCartCount();
}

function initializeBooks() {
    if (!localStorage.getItem('books')) {
        const defaultBooks = [
            {
                id: 1,
                title: "To Kill a Mockingbird",
                author: "Harper Lee",
                genre: "fiction",
                price: 299,
                icon: "📚",
                image: "https://images.pexels.com/photos/1549198/pexels-photo-1549198.jpeg?auto=compress&cs=tinysrgb&w=400"
            },
            {
                id: 2,
                title: "1984",
                author: "George Orwell",
                genre: "fiction",
                price: 349,
                icon: "📖",
                image: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400"
            },
            {
                id: 3,
                title: "Sapiens",
                author: "Yuval Noah Harari",
                genre: "non-fiction",
                price: 499,
                icon: "📕",
                image: "https://images.pexels.com/photos/3283387/pexels-photo-3283387.jpeg?auto=compress&cs=tinysrgb&w=400"
            },
            {
                id: 4,
                title: "A Brief History of Time",
                author: "Stephen Hawking",
                genre: "science",
                price: 399,
                icon: "🔭",
                image: "https://images.pexels.com/photos/4827/nature-forest-trees-moss.jpeg?auto=compress&cs=tinysrgb&w=400"
            },
            {
                id: 5,
                title: "Clean Code",
                author: "Robert C. Martin",
                genre: "technology",
                price: 599,
                icon: "💻",
                image: "https://images.pexels.com/photos/97090/laptop-business-plan-career-97090.jpeg?auto=compress&cs=tinysrgb&w=400"
            },
            {
                id: 6,
                title: "The Great Gatsby",
                author: "F. Scott Fitzgerald",
                genre: "fiction",
                price: 279,
                icon: "📘",
                image: "https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=400"
            },
            {
                id: 7,
                title: "Educated",
                author: "Tara Westover",
                genre: "non-fiction",
                price: 449,
                icon: "📗",
                image: "https://images.pexels.com/photos/768473/pexels-photo-768473.jpeg?auto=compress&cs=tinysrgb&w=400"
            },
            {
                id: 8,
                title: "The Origin of Species",
                author: "Charles Darwin",
                genre: "science",
                price: 379,
                icon: "🧬",
                image: "https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&w=400"
            },
            {
                id: 9,
                title: "JavaScript: The Good Parts",
                author: "Douglas Crockford",
                genre: "technology",
                price: 549,
                icon: "⚡",
                image: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400"
            },
            {
                id: 10,
                title: "Pride and Prejudice",
                author: "Jane Austen",
                genre: "fiction",
                price: 259,
                icon: "📙",
                image: "https://images.pexels.com/photos/1144275/pexels-photo-1144275.jpeg?auto=compress&cs=tinysrgb&w=400"
            },
            {
                id: 11,
                title: "Thinking, Fast and Slow",
                author: "Daniel Kahneman",
                genre: "non-fiction",
                price: 479,
                icon: "🧠",
                image: "https://images.pexels.com/photos/8534866/pexels-photo-8534866.jpeg?auto=compress&cs=tinysrgb&w=400"
            },
            {
                id: 12,
                title: "Cosmos",
                author: "Carl Sagan",
                genre: "science",
                price: 429,
                icon: "🌌",
                image: "https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=400"
            }
        ];
        localStorage.setItem('books', JSON.stringify(defaultBooks));
    }

    allBooks = JSON.parse(localStorage.getItem('books'));
}

function displayBooks(books) {
    const bookGrid = document.getElementById('bookGrid');

    if (books.length === 0) {
        bookGrid.innerHTML = '<p style="text-align: center; color: #777; grid-column: 1/-1; padding: 40px;">No books found</p>';
        return;
    }

    bookGrid.innerHTML = books.map(book => `
        <div class="book-card">
            <div class="book-cover">
                <img src="${book.image}" alt="${book.title}" onerror="this.parentElement.textContent='${book.icon}'">
            </div>
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">by ${book.author}</p>
                <span class="book-genre">${book.genre}</span>
                <p class="book-price">₹${book.price}</p>
                <button class="btn-add-cart" onclick="addToCart(${book.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

function filterByCategory(category) {
    currentCategory = category;

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    event.target.classList.add('active');

    if (category === 'all') {
        displayBooks(allBooks);
    } else {
        const filtered = allBooks.filter(book => book.genre === category);
        displayBooks(filtered);
    }
}

function searchBooks() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    const filtered = allBooks.filter(book =>
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.genre.toLowerCase().includes(searchTerm)
    );

    displayBooks(filtered);
}

function addToCart(bookId) {
    const book = allBooks.find(b => b.id === bookId);

    if (!book) return;

    let cart = JSON.parse(localStorage.getItem('cart') || '[]');

    const existingItem = cart.find(item => item.id === bookId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...book, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = 'Added!';
    btn.style.background = '#27ae60';

    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
    }, 1000);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'auth.html';
}

document.getElementById('searchInput').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        searchBooks();
    }
});

initializeCatalog();
