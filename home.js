function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
}

function goToCategory(category) {
    sessionStorage.setItem('selectedCategory', category);
    window.location.href = 'auth.html';
}
