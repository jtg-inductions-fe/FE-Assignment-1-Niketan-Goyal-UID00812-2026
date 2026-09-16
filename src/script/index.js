import Splide from '@splidejs/splide';
import '@splidejs/splide/css';
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

const splide = new Splide('.splide', {
    type: 'loop',
    perPage: 1,
    arrows: true,
    pagination: true,
    classes: {
        pagination: 'splide__pagination my-pagination',
        page: 'splide__pagination__page dots',
        arrows: 'splide__arrows my-arrows',
        arrow: 'splide__arrow my-arrow',
        prev: 'splide__arrow--prev my-prev',
        next: 'splide__arrow--next my-next',
    },
});

async function showRating() {
    let response = await fetch('src/script/rating.json');
    let reviews = await response.json();
    const list = document.querySelector('.splide__list');
    reviews.forEach((review) => {
        list.innerHTML += ` <li class="splide__slide">
                                    <article class="testimonial__content">
                                  
                                        <div class="testimonial__img">
                                            <img
                                                src=${review.img}
                                                alt="" aria-hidden="true"
                                                class="testimonial__image"
                                            />
                                        </div>
                                        <div class="testimonial__footer">
                                            <div class="testimonial__author">
                                                <span class="color-orange"
                                                    >${review.name}
                                            </span>

                                                <span class="testimonial__role">
                                                     ${review.role}
                                                </span>
                                            </div>

                                            <div class="testimonial__rating" role="img" aria-label="rating ${review.rating} out of 5">
                                             ${Array(review.rating).fill('<img src="/assets/icons/rating-star.svg" alt="" aria-hidden="true" />').join('')}
                                               
                                            </div>
                                            <blockquote class="testimonial__text">
                                               ${review.content}
                                            </blockquote>
                                        </div>
                                    </article>
                                </li>`;
    });
    splide.mount();
}
showRating();

const arrow = document.querySelectorAll('.footer__accordian-button');
arrow.forEach((button) => {
    button.addEventListener('click', () => {
        const isExpanded =
            button.firstElementChild.classList.toggle('footer__rotate');
        const navelement = button.getAttribute('aria-controls');
        button.setAttribute('aria-expanded', isExpanded);
        document
            .getElementById(navelement)
            .classList.toggle('footer__columns--active');
    });
});

const menu = document.querySelector('#header-menu');
const hamburger = document.querySelector('#header-hamburger');
const backdrop = document.querySelector('#backdrop');
const close = document.querySelector('.header__close');
const mobilenavlink = document.querySelectorAll('.header__mobile-link');

mobilenavlink.forEach((element) => {
    element.addEventListener('click', () => {
        closeMenu();
    });
});

menu.addEventListener('click', () => {
    const isActive = hamburger.classList.toggle('header__hamburger--active');

    backdrop.classList.toggle('backdrop--active', isActive);

    document.body.classList.toggle('no-scroll', isActive);
});

backdrop.addEventListener('click', () => {
    closeMenu();
});

close.addEventListener('click', () => {
    closeMenu();
});

function closeMenu() {
    hamburger.classList.remove('header__hamburger--active');
    backdrop.classList.remove('backdrop--active');
    document.body.classList.remove('no-scroll');
}

hamburger.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const focusableElements = [
        ...hamburger.querySelectorAll(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
    ].filter((element) => {
        return (
            element.offsetParent !== null &&
            !element.hasAttribute('hidden') &&
            getComputedStyle(element).visibility !== 'hidden'
        );
    });

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
    }
});
