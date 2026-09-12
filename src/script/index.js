const links = document.querySelectorAll('.header__link');

links.forEach((element) => {
    element.addEventListener('click', () => {
        let prevactive = document.querySelector('.header__link--active');
        if (prevactive) prevactive.classList.toggle('header__link--active');
        element.classList.toggle('header__link--active');
    });
});
