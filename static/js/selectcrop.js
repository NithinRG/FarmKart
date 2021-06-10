const items = document.getElementsByClassName('item');
const input = document.getElementById('cat-input')

for (let i = 0; i < items.length; i++) {
    items[i].addEventListener('click', () => {
        for (let j = 0; j < items.length; j++) {
            const itemImg = items[j].getElementsByTagName('img')[0]
            itemImg.classList.remove('img-selected')
        }
        items[i].getElementsByTagName('img')[0].classList.add('img-selected')
        input.value = items[i].id
    }) 
}