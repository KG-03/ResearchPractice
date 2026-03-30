"use strict";

let plusBtn = document.querySelector("#plus");
let minusBtn = document.querySelector("#minus");
let resetBtn = document.querySelector("#reset");
let count = document.querySelector("#num")
let num = 0;

plusBtn.addEventListener("click", function() {
    if (num < 100){
        num++;
        update();
    }
})

minusBtn.addEventListener("click", function() {
    if(num > -100) {
        num--;
        update();
    }
})

resetBtn.addEventListener("click", function(){
    num = 0;
    update();
})

function update() {
    count.textContent = num;

    if (num > 0) {
        count.style.color = "green";
    } else if (num < 0) {
        count.style.color = "red";
    } else {
        count.style.color = "black";
    }
}
