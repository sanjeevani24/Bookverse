function handleContactForm(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    const contactMessage = {
        id: Date.now(),
        name,
        email,
        subject,
        message,
        date: new Date().toISOString()
    };

    let messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    messages.push(contactMessage);
    localStorage.setItem('contactMessages', JSON.stringify(messages));

    const formNote = document.getElementById('formNote');
    formNote.textContent = 'Thank you! Your message has been sent successfully. Our team will get back to you soon.';
    formNote.classList.add('success');

    event.target.reset();

    setTimeout(() => {
        formNote.classList.remove('success');
    }, 5000);
}
