"use strict";

let input = document.querySelector("#input");
let btn = document.querySelector("#btn");
let result = document.querySelector("#result");

btn.addEventListener("click", function() {
    if (input.value === "") {
        result.textContent = "값을 입력하세요.";
    } else {
        result.textContent = input.value + "님 안녕하세요.";
        console.log(input.value);

        input.value = "";
        input.focus();
    }
});

/* 1일차
 * input    : textContent로 접근하는 게 아닌, value로 접근되어야 한다.
 *            input.focus() 함수를 사용하면 입력하고 버튼 누른 뒤에도
 *              해당 입력창을 '다시 눌러둔 효과'를 만들 수 있는 것으로 보인다.
 */
