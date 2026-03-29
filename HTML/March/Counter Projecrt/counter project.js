"use strict";

let plusBtn = document.querySelector("#plus");
let minusBtn = document.querySelector("#minus");
let count = document.querySelector("#num")
let num = 0;

plusBtn.addEventListener("click", function() {
    num++;
    count.textContent = num;
})

minusBtn.addEventListener("click", function() {
    num--;
    count.textContent = num;
})