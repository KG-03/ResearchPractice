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

let introP = document.querySelectorAll(".intro p");
introP[1].textContent = "Hello JS";

let num = 10;
introP[2].textContent = num;

/* 아래의 내용부터는 html에서 존재하지 않는 값을 호출하기 때문에 각주 처리.
let msg = document.querySelector("#msg");
msg.textContent = "반갑습니다!"; 

let nums = document.querySelectorAll(".num");
for(let i = 0; i <nums.length; i++) {
    nums[i].textContent = Number(nums[i].textContent) + 1;
}

let boxs = document.querySelectorAll(".box");
for (let i = 0; i < boxs.length; i++) {
    boxs[i].textContent = boxs[i].textContent + "!";
}
*/

let btn = document.querySelector(".intro button");
btn.addEventListener("click", function() {
    console.log("클릭됨!");
    introP[3].textContent = "바뀜!";
});

/* 아래의 내용부터는 html에서 존재하지 않는 값을 호출하기 때문에 각주 처리.
let btn = document.querySelector("#btn");
let p = document.querySelector("#msg");
btn.addEventListener("click", function(){
    p.textContent = "반가워!";
});

let btn = document.querySelector("#btn");
let p = document.querySelector("#num");
btn.addEventListener("click", function(){
    p.textContent = Number(p.textContent) + 1;
});

let btn = document.querySelector("#btn");
let p = document.querySelector("#text");
btn.addEventListener("click", function(){
    if(p.textContent === "ON") p.textContent = "OFF";
    else p.textContent = "ON";
});

위의 3번 문제의 조건문은 다음과 같이 요약 가능.
p.textContent = p.textContent === "ON" ? "OFF" : "ON";

문제 풀이였기 때문에 모든 변수명을 btn, p 등으로 일괄처리 했으나, 실전에서는 이러한 형식을 쓰면 안 된다는 것을 인지하고 있음.
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

/* 24일차
 * let introP = document.querySelectorAll(".intro p"); : 
 *                  id, class 안에 있는 p를 불러오기 위해서 쓰는 방법.
 * 
 * 불러낸 값 안에 다른 값을 집어넣는 게 가능.
 */

/* 25일차
 * let btn = document.querySelector("#btn");
 * btn.addEventListener("click", function() { ... })
 *      위의 방식은 버튼에 이벤트 넣는 방법.
 *      만일, addEventListener("click", console.log(...) ) 이와 같은 형식으로 코드를 작성하면, 즉시 실행되어 문제가 생김.
 *              따라서, 이벤트를 넣을 때는 function()을 이용해야 함.
 */
