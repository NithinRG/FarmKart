const items = document.getElementsByClassName('item');
const input = document.getElementById('cat-input')

month=document.getElementById('month-list');
month.addEventListner('click',limit );
function limit()
{    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    var nextyear=today.getFullYear()+1;
 if(dd<10){
        dd='0'+dd
    } 
    if(mm<10){
        mm='0'+mm
    } 

today = yyyy+'-'+mm+'-'+dd;
next=nextyear+'-'+mm+'-31'
document.getElementById('month-list').min=today;
document.getElementById('month-list').max=next;
}

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

