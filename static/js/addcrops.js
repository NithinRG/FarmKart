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
        "Pomegranate",
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
