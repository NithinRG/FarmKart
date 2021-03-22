const carouselSlider = document.querySelector('.carousel-slider');
const carouselImages = document.querySelectorAll('.carousel-slider img');

const prevBtn = document.querySelector('#prevBtn');
const nextBtn = document.querySelector('#nextBtn');

let counter = 1;

let flag = 0;

const size = 1080;
carouselSlider.style.transform = 'translateX(' + (-size * counter) + 'px)';

const prevImg = () => {
    if (counter <= 0) {
        return;
    }
    carouselSlider.style.transition = 'transform 0.5s ease-in-out';
    counter--;
    carouselSlider.style.transform = 'translateX(' + (-size * counter) + 'px)';
}

const nextImg = () => {
    if (counter >= carouselImages.length - 1) {
        return;
    }
    carouselSlider.style.transition = 'transform 0.5s ease-in-out';
    counter++;
    carouselSlider.style.transform = 'translateX(' + (-size * counter) + 'px)';
}

prevBtn.addEventListener('click', () => {
    flag = 1;
    prevImg();
});

nextBtn.addEventListener('click', () => {
    flag = 1;
    nextImg();
});

carouselSlider.addEventListener('transitionend',() => {
    if (carouselImages[counter].id === 'lastClone') {
        carouselSlider.style.transition = 'none';
        counter = carouselImages.length - 2;
        carouselSlider.style.transform = 'translateX(' + (-size * counter) + 'px)';        
    }
    if (carouselImages[counter].id === 'firstClone') {
        carouselSlider.style.transition = 'none';
        counter = carouselImages.length - counter;
        carouselSlider.style.transform = 'translateX(' + (-size * counter) + 'px)';        
    }
});

setInterval(() => {
    if (flag !== 0) {
        flag = 0
    } else {
        nextImg();
    }
}, 4000);