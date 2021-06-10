const minusBtn = document.getElementsByClassName("minus-btn")
const plusBtn = document.getElementsByClassName("plus-btn")
const itemCount = document.getElementsByClassName("item-count")

const minVal = 0.25
const step = 0.25
let maxVal = []

for (const i of itemCount) {
    maxVal.push(i.getAttribute('max'))
}


// Change item count
for (let i=0; i<itemCount.length; i++) {
    itemCount[i].addEventListener('focusout', (e)=>{
        let thisElement = e.target
        if(thisElement.value < minVal) {
            console.log("low")
            thisElement.value = minVal;
        }
        if(thisElement.value > parseFloat(maxVal[i])) {
            console.log("high")
            thisElement.value = maxVal[i];
        }
        updatePriceDetails()
    })
}


for (let i=0; i<itemCount.length; i++){
    minusBtn[i].addEventListener('click', (e)=>{
        let thisElement = e.target
        if (thisElement.nextElementSibling == null) {
            thisElement = thisElement.parentNode
        }
        inputBox = thisElement.nextElementSibling
        if(parseFloat(inputBox.value) > minVal) {
            inputBox.value -= step;
        }
        updatePriceDetails()
    })
}


for (let i=0; i<itemCount.length; i++){
    plusBtn[i].addEventListener('click', (e)=>{
        let thisElement = e.target
        if (thisElement.previousElementSibling == null) {
            thisElement = thisElement.parentNode
        }
        console.log(thisElement)
        inputBox = thisElement.previousElementSibling
        if(parseFloat(inputBox.value) < parseFloat(maxVal[i])) {
            inputBox.value = parseFloat(inputBox.value) + step;
        }
        updatePriceDetails()
    })
}


// Delete button

$(document).ready(function () {
    updatePriceDetails()
    $(".del-btn").click(function () {
        const cart_id = $(document).find('.container').attr("data-cart-id")
        const item_id = $(this).attr("data-item-id")
        req = $.ajax({
           url: '/delete',
           type: 'POST',
           data: {cart_id: cart_id, item_id: item_id}
        });
        req.done(function () {
            $('#item-'+item_id).remove()
            $('#cart-count').text($('.item').length)
            if ($('.item').length == 0) {
                window.location.href = "/cart";
            }
            updatePriceDetails()
        });
    }); 
});

// Price details

const numItems = document.getElementById('num-items')
const MRP = document.getElementById('MRP')
const totalPrice = document.getElementById('total-price')
const items = document.getElementsByClassName('item')

const numItemsInput = document.getElementById('num-items-input')
const MRPInput = document.getElementById('MRP-input')
const totalPriceInput = document.getElementById('total-price-input')

const updatePriceDetails = () => {
    if (numItems != null) {
        numItems.innerText = items.length
        MRP.innerText = (() => {
            mrp = 0
            for (let i = 0; i < items.length; i++) {
                price = parseFloat(items[i].getAttribute('data-price'))
                quantity = items[i].getElementsByClassName('item-count')[0].value
                mrp += price*quantity
            }
            return mrp
        })()
        totalPrice.innerText = parseFloat(MRP.innerText) + 30
        numItemsInput.value = numItems.innerText;
        MRPInput.value = MRP.innerText;
        totalPriceInput.value = totalPrice.innerText;
    }
}