const items = document.getElementsByClassName('item');
const input = document.getElementById('cat-input')

var d = new Date(),
month = '' + (d.getMonth() + 1),
day = '' + d.getDate(),
year =''+ d.getFullYear(),
nextyear=''+(d.getFullYear()+1);
if (month.length < 2) 
month = '0' + month;
if (day.length < 2) 
day = '0' + day;
today=year+'-'+month+'-'+day
next=nextyear+'-'+month+'-31'
document.getElementById("month-list").setAttribute("min",today);
document.getElementById("month-list").setAttribute("max",next);

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

