import Splide from '@splidejs/splide';
import '@splidejs/splide/css';

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

splide.mount();
