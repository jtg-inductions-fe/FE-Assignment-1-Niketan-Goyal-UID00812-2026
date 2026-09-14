const links = document.querySelectorAll('.header__link');

function updateActiveLink() {
    const currentHash = window.location.hash;
    links.forEach((element) => {
        element.classList.toggle(
            'header__link--active',
            element.getAttribute('href') === currentHash ||
                (!currentHash && element.getAttribute('href') === '/'),
        );
    });
}

updateActiveLink();

window.addEventListener('hashchange', updateActiveLink);
