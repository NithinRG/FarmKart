function openPage(elmnt) {
    pageName = elmnt.getElementsByTagName("h2")[0].innerText;
    var i, cropdetail, crops;
    cropdetail = document.getElementsByClassName("cropdetail");
    for (i = 0; i < cropdetail.length; i++) {
        cropdetail[i].style.display = "none";
    }
    crops = document.getElementsByClassName("crop");
    for (i = 0; i < crops.length; i++) {
        crops[i].classList.remove("crop-active");
    }
    document.getElementsByClassName(pageName)[0].style.display = "block";
    elmnt.classList.add("crop-active");
}

document.getElementsByClassName("crop-active")[0].click();
