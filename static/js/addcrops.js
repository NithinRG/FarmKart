// Added to cart modal
const modal = document.getElementsByClassName("modal")[0];
if (!!modal) {
    modal.style.display = "block";
    setTimeout(() => {
        modal.classList.add("hidden");
    }, 2000);
    setTimeout(() => {
        modal.style.display = "none";
    }, 3000);
}

// Form select
var lookup = {
    Vegetables: [
        "Bitter gourd",
        "Brinjal",
        "Cucumber",
        "Ginger",
        "Chillies",
        "Snake gourd",
        "Tapioca",
        "Tomato",
    ],
    Fruits: [
        "Chikoo",
        "Gooseberry",
        "Grapes",
        "Guava",
        "Lemon",
        "Mango",
        "Papaya",
        "Pineapple",
    ],
    Pulses: ["Black gram", "Cow pea", "Green gram", "Red gram", "Rice"],
};

$("#category").on("change", function () {
    var selectValue = $(this).val();

    $("#product").empty();

    for (i = 0; i < lookup[selectValue].length; i++) {
        $("#product").append(
            "<option value='" +
                lookup[selectValue][i] +
                "'>" +
                lookup[selectValue][i] +
                "</option>"
        );
    }
});

var dict={
"Bitter gourd": 43.16,
"Brinjal": 26.65, 
"Cucumber": 21.27, 
"Ginger": 83.26,
"Chillies": 40.69,
"Snake gourd": 26.22,
"Tapioca":16.77,
"Tomato": 26.58,
"Chikoo": 47.93,
"Gooseberry": 48.90, 
"Grapes": 75.66,
"Guava": 38.78,
"Lemon": 63.03,
"Mango": 34.59, 
"Papaya": 23.82,
"Pineapple": 31.78,
// "Black gram":
// "Cow pea":
// "Green gram":
// "Red gram":
// "Rice":
}

$("#product").on("change", function(){
    var selectValue = $(this).val();
    document.getElementById("price").max= dict[selectValue]+10;
})
