const minusBtn = document.getElementById("minus-btn")
const plusBtn = document.getElementById("plus-btn")
const itemCount = document.getElementById("item-count")
const modal = document.getElementsByClassName("modal")[0]

const minVal = 0
const maxVal = parseFloat(document.getElementById("quantity").innerText)
const step = 0.25


// Added to cart modal
if(!!modal){
    modal.style.display = 'block'
    setTimeout(() => {
        modal.classList.add('hidden')
    }, 2000);
    setTimeout(() => {
        modal.style.display = 'none'
    }, 3000);
}



// Change item count
itemCount.addEventListener('focusout', ()=>{
    if(itemCount.value < minVal) {
        itemCount.value = minVal;
    }
    if(itemCount.value > maxVal) {
        itemCount.value = maxVal;
    }
})

minusBtn.addEventListener('click', ()=>{
    if(parseFloat(itemCount.value) > minVal) {
        itemCount.value -= step;
    }
})

plusBtn.addEventListener('click', ()=>{
    if(parseFloat(itemCount.value) < maxVal) {
        itemCount.value = parseFloat(itemCount.value) + step;
    }
})