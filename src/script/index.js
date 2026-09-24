import Splide from '@splidejs/splide';
import '@splidejs/splide/css';
const links = document.querySelectorAll('.header__link');
const focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(',');
const targets = [...links]
    .map((link) => {
        const href = link.getAttribute('href');
        if (!href || href === '/') return null;
        return document.querySelector(href);
    })
    .filter(Boolean);

function updateActiveLink(hash) {
    links.forEach((element) => {
        element.classList.toggle(
            'header__link--active',
            element.getAttribute('href') === hash ||
                (!hash && element.getAttribute('href') === '/'),
        );
    });
}

const observer = new IntersectionObserver(
    (entries) => {
        const visibleTargets = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visibleTargets.length) {
            updateActiveLink(`#${visibleTargets[0].target.id}`);
        }
    },
    {
        threshold: [0, 0.5, 0.75, 1],
    },
);

targets.forEach((target) => {
    observer.observe(target);
});
window.addEventListener('scroll', () => {
    if (window.scrollY === 0) {
        updateActiveLink('');
    }
});

updateActiveLink();

window.addEventListener('hashchange', () => {
    updateActiveLink(window.location.hash);
});

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
    let response = await fetch('assets/json/rating.json');
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

const menu = document.querySelector('#header-menu-button');
const hamburger = document.querySelector('#header-menu');
const backdrop = document.querySelector('#backdrop');
const close = document.querySelector('.header__close');
const mobilenavlink = document.querySelectorAll('.header__mobile-link');

menu.addEventListener('click', () => {
    openMenu();
});

mobilenavlink.forEach((element) => {
    element.addEventListener('click', () => {
        closeMenu();
    });
});

backdrop.addEventListener('click', () => {
    closeMenu();
});

close.addEventListener('click', () => {
    closeMenu();
});

function openMenu() {
    const isActive = hamburger.classList.toggle('header__mobile-menu--active');
    menu.setAttribute('aria-expanded', isActive);
    menu.setAttribute('aria-label', isActive ? 'Close menu' : 'Open menu');
    backdrop.classList.toggle('backdrop--active', isActive);
    document.body.classList.toggle('no-scroll', isActive);
    if (isActive) {
        close.focus();
    }
}

function closeMenu() {
    hamburger.classList.remove('header__mobile-menu--active');
    backdrop.classList.remove('backdrop--active');
    menu.setAttribute('aria-label', 'Open menu');
    menu.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    menu.focus();
}

hamburger.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const focusableElements = [
        ...hamburger.querySelectorAll(focusableSelector),
    ].filter((element) => {
        return (
            element.offsetParent !== null &&
            !element.hasAttribute('hidden') &&
            getComputedStyle(element).visibility !== 'hidden'
        );
    });
    if (!focusableElements.length) return;

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

window.addEventListener('resize', updateDom);

const icons = document.querySelector('.header__icons');
const logo = document.querySelector('.header__logo');
const menuicon = document.querySelector('.header__menu');

function updateDom() {
    if (window.innerWidth > 430) {
        icons.append(menuicon, logo);
    } else {
        icons.append(logo, menuicon);
    }
}
