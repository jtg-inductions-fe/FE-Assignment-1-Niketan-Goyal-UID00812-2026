const navLink = document.getElementById('open-special-deals');
const navLinkMobile = document.getElementById('open-special-deals-mobile');
const specialDealsContainer = document.getElementById('specialDealspopUp');
const specialDeals = document.getElementById('special-deals');
const unlockedDeals = document.getElementById('unlocked-deals');
const specialDealsclose = document.getElementById('specialDealspopUp-close');
const wheel = document.getElementById('wheel__circle');
const card = document.getElementById('card');
const count = document.getElementById('card-dealsCount');
const unlockedBtn = document.getElementById('card-unlocked');
const unlockedBackBtn = document.getElementById('unlockedDeals-back');

let deals = null;
let wheelDeals;
let previousExtra = 0;
let isSpining = false;
const fullcircle = 10;
let fetchDealsPromise = null;

navLink.addEventListener('click', () => {
    openSpecialDeals();
});
let dialogOpener = null;

navLink.addEventListener('click', (event) => {
    openSpecialDeals(event.currentTarget);
});

navLinkMobile.addEventListener('click', (event) => {
    openSpecialDeals(event.currentTarget);
});

specialDealsclose.addEventListener('click', closeMenu);

unlockedBackBtn.addEventListener('click', toggleState);

async function openSpecialDeals(opener) {
    dialogOpener = opener;

    specialDealsContainer.showModal();

    specialDealsclose.focus();

    try {
        await fetchDeals();
        createWheel();
    } catch {
        wheel.textContent = 'Unable to load deals.';
    }
}

function closeMenu() {
    if (specialDealsContainer.open) {
        specialDealsContainer.close();
    }

    dialogOpener?.focus();
    dialogOpener = null;
}

async function fetchDeals() {
    if (deals != null) return deals;
    if (!fetchDealsPromise) {
        fetchDealsPromise = (async () => {
            try {
                const response = await fetch(
                    'https://gist.githubusercontent.com/ameer-wajid-ali/1f29ebee4295cede36f8d74b45e576df/raw/122966c9a123861249f173911d8d93a76dc06d7a/',
                );
                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch deals: ${response.status}`,
                    );
                }
                deals = await response.json();
                return deals;
            } catch (error) {
                fetchDealsPromise = null;
                throw error;
            }
        })();
    }
    return fetchDealsPromise;
}

function getAvailableDeals() {
    try {
        const wondeals = JSON.parse(localStorage.getItem('won-deals')) ?? [];
        count.textContent = wondeals.length;
        const filteredDeals = deals
            .map((deal) => ({
                ...deal,
                validFor: deal?.validFor ?? 7,
            }))
            .filter((deal) =>
                wondeals.every((item) => item.promoCode !== deal.promoCode),
            );

        return filteredDeals;
    } catch {
        return [];
    }
}

function buildWheelDeals(filteredDeals) {
    if (filteredDeals.length >= 4) {
        return filteredDeals.slice(0, 4);
    }

    const wheelDeals = [...filteredDeals];

    for (const deal of deals) {
        if (wheelDeals.length >= 4) break;

        if (!wheelDeals.some((item) => item.promoCode === deal.promoCode)) {
            wheelDeals.push({
                ...deal,
                validFor: deal.validFor ?? 7,
            });
        }
    }

    return wheelDeals;
}

function createWheel() {
    let filteredDeals = getAvailableDeals();
    wheelDeals = buildWheelDeals(filteredDeals);

    wheel.innerHTML = ` <div
                            class="wheel__circle--item wheel__circle--first"
                            id="first"
                        >
                            <div class="wheel__circle--text1">${wheelDeals[3].label}</div>
                        </div>
                        <div
                            class="wheel__circle--item wheel__circle--second"
                            id="second"
                        >
                            <div class="wheel__circle--text2">${wheelDeals[0].label}</div>
                        </div>
                       
                         <div
                            class="wheel__circle--item wheel__circle--third"
                            id="third"
                        >
                            <div class="wheel__circle--text3">${wheelDeals[2].label}</div>
                        </div>
                        <div
                            class="wheel__circle--item wheel__circle--forth"
                            id="forth"
                        >
                            <div class="wheel__circle--text4">${wheelDeals[1].label}</div>
                        </div>
                        
                        <button
                            type="button"
                            aria-label="spin the wheel"
                            id="wheel__button"
                            class="wheel__button"
                        >
                            Spin
                        </button>
                        
                        `;
    document.getElementById('wheel__button').addEventListener('click', rotate);
}

function rotate() {
    if (isSpining) return;

    createWheel();

    wheel.style.transition = 'none';
    wheel.style.rotate = `${previousExtra}deg`;
    void wheel.offsetHeight;

    const fullRotations = Math.floor(Math.random() * fullcircle);
    const extraRotation = Math.floor(Math.random() * 360);
    const spinButton = document.getElementById('wheel__button');

    previousExtra = extraRotation;
    isSpining = true;
    spinButton.disabled = true;

    wheel.style.transition = 'rotate 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
    wheel.style.rotate = `${(fullRotations + 1) * 360 + extraRotation}deg`;

    const wondeal = 3 - Math.floor(extraRotation / 90);

    setTimeout(() => {
        isSpining = false;
        spinButton.disabled = false;

        card.innerHTML = `
             <p class="card__state">You Won!</p>
             <div class="card__main" id="card-main"> 
            <div class="card__details">
        <p class="card__label">${wheelDeals[wondeal].label}</p>
        <p class="card__expires">Expires in ${wheelDeals[wondeal].validFor} days</p>
                    </div>
                    <div class="card__couponDetails">

                        <div class="card__coupon">
                            ${wheelDeals[wondeal].promoCode}
                        </div>
                        <button type="button" class="card__copy" id="card__copy" type="button" aria-label="copy coupon code"> 
                            <img src="/assets/icons/copy.svg" alt="" aria-hidden='true'>
                        </button>
                    </div>
                    </div>`;

        document
            .getElementById('card__copy')
            .addEventListener('click', (event) => {
                copy(wheelDeals[wondeal].promoCode);
                event.target.src = '/assets/icons/copied.svg';
                setTimeout(() => {
                    event.target.src = '/assets/icons/copy.svg';
                }, 3000);
            });

        storeInLocal(wondeal);
    }, 4000);
}

function getRemainingDays(expiredOn) {
    const remaining = new Date(expiredOn).getTime() - Date.now();
    return Math.ceil(remaining / (1000 * 60 * 60 * 24));
}

function storeInLocal(wondeal) {
    const items = JSON.parse(localStorage.getItem('won-deals')) ?? [];
    const date = new Date();
    date.setDate(date.getDate() + (wheelDeals[wondeal].validFor ?? 7));
    items.push({ ...wheelDeals[wondeal], expiredOn: date });
    localStorage.setItem('won-deals', JSON.stringify(items));
    count.textContent = items.length;
}

async function copy(code) {
    await navigator.clipboard.writeText(code);
}

unlockedBtn.addEventListener('click', function () {
    toggleState();
    updateUnlocked();
});

function toggleState() {
    specialDeals.classList.toggle('hidden');
    unlockedDeals.classList.toggle('hidden');
}

function updateUnlocked() {
    const unlockedDealsCards = document.getElementById('unlockedDeals-cards');
    const items = JSON.parse(localStorage.getItem('won-deals')) ?? [];
    if (items.length == 0) {
        unlockedDealsCards.textContent =
            'you have not any deals. spin to win the deal';
    } else {
        items.sort((a, b) => {
            const dateA = new Date(a.expiredOn);
            const dateB = new Date(b.expiredOn);
            const now = Date.now();
            const expiredA = dateA.getTime() < now;
            const expiredB = dateB.getTime() < now;

            if (expiredA && !expiredB) return 1;
            if (!expiredA && expiredB) return -1;

            return dateA - dateB;
        });

        let string = '';

        items.forEach((element) => {
            const isExpired =
                new Date(element.expiredOn).getTime() < Date.now();
            string += `
        <div class="card__main ${isExpired ? 'expired__main' : ''}">
            <div class="card__details ${isExpired ? 'expired__details' : ''}">
                <p class="card__label ${isExpired ? 'expired__label' : ''}">${element.label}</p>
                <p class="card__expires ${isExpired ? 'expired__expires' : ''}">
                     ${isExpired ? 'Deal Expired' : 'Expires in ' + getRemainingDays(element.expiredOn) + ' days'}
                </p>
            </div>

            <div class="card__couponDetails ${isExpired ? 'expired__couponDetails' : ''}">
                <div class="card__coupon ${isExpired ? 'expired__coupon' : ''}">
                    ${element.promoCode}
                </div>

                <button 
                    class="card__copy ${isExpired ? 'expired__copy' : ''}"
                    ${isExpired ? 'disabled' : ''}
                    type="button"
                    aria-label="copy coupon code"
                    data-code="${element.promoCode}"
                >
                    <img src="/assets/icons/copy.svg" alt=""  aria-hidden="true" class="card__copy">
                </button>
            </div>
        </div>
    `;
        });

        unlockedDealsCards.innerHTML = string;
        unlockedDealsCards.addEventListener('click', (event) => {
            const parent = event.target.parentElement;
            copy(parent.dataset.code);
            event.target.src = '/assets/icons/copied.svg';
            setTimeout(() => {
                event.target.src = '/assets/icons/copy.svg';
            }, 3000);
        });
    }
}
