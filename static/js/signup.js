const form = document.querySelector('form');
const message = document.querySelector('#message')
const password = document.querySelector('#password');
const confirm = document.querySelector('#confirm');

form.addEventListener('submit', event => {
    if (password.value != confirm.value) {
        event.preventDefault();
        console.log(`Form submission cancelled.`);
    }
});

const check = () => {
    if (confirm.value == '') {
        message.innerHTML = ''
    } else if (password.value == confirm.value) {
        message.style.color = '#006700'
        message.innerHTML = '&#x2713; Confirm password matches'
    } else {
        message.style.color = '#ff073a'
        message.innerHTML = '&#x2717; Confirm password does not match' 
    }
}

password.addEventListener('keyup', check)

confirm.addEventListener('keyup', check)