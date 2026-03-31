"use strict";

let plusBtn = document.querySelector("#plus");
let minusBtn = document.querySelector("#minus");
let resetBtn = document.querySelector("#reset");
let countText = document.querySelector("#num")
let num = 0;

plusBtn.addEventListener("click", function() {
    if (num < 100){
        num++;
        update();
        updateColor();
    }
})

minusBtn.addEventListener("click", function() {
    if(num > -100) {
        num--;
        update();
        updateColor();
    }
})

resetBtn.addEventListener("click", function(){
    num = 0;
    update();
    updateColor();
})

function update() {
    countText.textContent = num;
}

function updateColor(){
    if (num > 0) {
        countText.style.color = "green";
    } else if (num < 0) {
        countText.style.color = "red";
    } else {
        countText.style.color = "black";
    }
}
