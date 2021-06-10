// Search

const input = document.getElementById('search-box')

const search = () => {
    const filter = input.value.toUpperCase()
    const itemgrid = document.getElementById('itemgrid')
    const items = itemgrid.getElementsByTagName('a')

    for (i = 0; i < items.length; i++) {
        const itemname = items[i].getElementsByClassName('item-name')[0]
        const farmername = items[i].getElementsByClassName('farmer-name')[0]
        if (itemname.innerText.toUpperCase().indexOf(filter) > -1 || farmername.innerText.toUpperCase().indexOf(filter) > -1) {
            items[i].style.display = ''
            const substring = new RegExp(filter, 'gi')
            itemname.innerHTML = itemname.innerText.replace(substring, (match) => `<mark>${match}</mark>`);
            farmername.innerHTML = farmername.innerText.replace(substring, (match) => `<mark>${match}</mark>`);
        } else {
            items[i].style.display = 'none'
        }
    }
}

input.addEventListener('keyup', search)