"use strict";

let title = document.querySelector("h1");
console.log(title);
console.log(title.textContent);

let p = document.querySelector("p");
console.log(p.textContent);

let h2 = document.querySelector("h2");
console.log(h2.textContent);

let div = document.querySelector("div");
console.log(div.textContent);

let intro = document.querySelector("#intro");
console.log(intro.textContent);

let weekCards = document.querySelector(".week-card");
console.log(weekCards.textContent);

weekCards = document.querySelectorAll(".week-card");
console.log(weekCards);
for (let i = 0; i < weekCards.length; i++) {
    console.log(weekCards[i].textContent);
}

/* 아래의 내용부터는 html에서 존재하지 않는 값을 호출하기 때문에 각주 처리.
let main = document.querySelector("#main");
console.log(main.textContent);

let items = document.querySelectorAll(".item");
for (let i = 0; i < items.length; i++) {
    console.log(items[i].textContent);
}

let boxs = document.querySelectorAll(".box");
for (let i = 0; i < boxs.length; i++) {
    boxs[i].textContent = boxs[i].textContent * 2;
}
*/



/* 22일차
 * let title = document.querySelector("h1");
 *             document : 전체 HTML
 *             querySelector(선택자) : 원하는 요소 찾기
 *             이 방법으로 값을 가져오면 '첫 번째 요소'를 가져온다.
 * 
 * textContent  : HTML 전체가 아닌, 내용만 가져오도록 하는 방법.
 */

/* 23일차
 * querySelector    : 1개
 * querySelectorAll : 여러 개
 *                    여기서 호출된 값은 여기서 값을 바꿔서 변경할 수 있다.
 */
