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

const arrow = document.querySelectorAll('.footer__accordianBtn');
arrow.forEach((element) => {
    element.addEventListener('click', () => {
        element.firstElementChild.classList.toggle('footer__rotate');
        if (element.getAttribute('aria-expanded') == 'true') {
            element.setAttribute('aria-expanded', false);
        } else {
            element.setAttribute('aria-expanded', true);
        }
        let closest = element.previousElementSibling;
        closest.classList.toggle('footer__columns--active');
    });
});
