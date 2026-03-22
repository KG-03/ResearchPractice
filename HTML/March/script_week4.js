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


/* 22일차
 * let title = document.querySelector("h1");
 *             document : 전체 HTML
 *             querySelector(선택자) : 원하는 요소 찾기
 *             이 방법으로 값을 가져오면 '첫 번째 요소'를 가져온다.
 * 
 * textContent  : HTML 전체가 아닌, 내용만 가져오도록 하는 방법.
 */