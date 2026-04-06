"use strict";

let input = document.querySelectorAll(".input");
let btn = document.querySelectorAll(".btn");
let result = document.querySelectorAll(".result");

btn[0].addEventListener("click", function() {
    if (input[0].value === "") {
        result[0].textContent = "값을 입력하세요.";
    } else {
        result[0].textContent = input[0].value + "님 안녕하세요.";
        console.log(input[0].value);

        input[0].value = "";
        input[0].focus();
    }
});

btn[1].addEventListener("click", function(){
    let name = input[1].value.trim();

    if(name === "") {
        result[1].textContent = "이름을 입력하세요.";
    } else if (name === "관리자") {
        result[1].textContent = "관리자님 환영합니다.";
    } else if (name === "guest") {
        result[1].textContent = "손님입니다.";
    } else {
        result[1].textContent = name + "님 안녕하세요!";
    }

    input[1].value = "";
    input[1].focus();
});

btn[2].addEventListener("click", function() {
    let num = Number(input[2].value);

    if(input[2].value.trim() === "") {
        result[2].textContent = "숫자를 입력하세요.";
    } else if(num === 0) {
        result[2].textContent = "0입니다."
    } else {
        if(num > 0) {
            result[2].textContent = "양수, ";
        } else {
            result[2].textContent = "음수, ";
        }

        if(num >= 10) {
            result[2].textContent = "10 이상, ";
        }

        evenOddDetermination(num);
    }
    
    input[2].value = "";
    input[2].focus();
});

function evenOddDetermination(num) {
    if (num % 2 === 0) {
    result[2].textContent += "짝수입니다.";
    } else {
        result[2].textContent += "홀수입니다.";
    }
}

btn[3].addEventListener("click", function() {
    let text = input[3].value.trim();
    let index = result[3].children.length + 1;

    if(text === "") return;

    let li = document.createElement("li");
    li.textContent = index + ". ✔ " + text;

    let delBtn = document.createElement("button");
    delBtn.textContent = "삭제";

    delBtn.addEventListener("click", function() {
        li.remove();
    })

    li.appendChild(delBtn);
    result[3].appendChild(li);
    
    input[3].value = "";
});

btn[4].addEventListener("click", function() {
    let text = input[4].value.trim();
    
    if (text === "") return;

    let li = document.createElement("li");
    li.textContent = text;

    let delBtn = document.createElement("button");
    delBtn.textContent = "삭제";
    delBtn.addEventListener("click", function() {
        li.remove();
    });

    let doneBtn = document.createElement("button");
    doneBtn.textContent = "완료";
    doneBtn.addEventListener("click", function() {
        if(!li.querySelector(".done-text")) {            
            let doneText = document.createElement("p");
            doneText.textContent = "ㄴ완료되었음!";
            doneText.classList.add("done-text");
            doneText.style.display = "block";
            li.appendChild(doneText);
        }
    });

    li.appendChild(delBtn);
    li.appendChild(doneBtn);
    result[4].appendChild(li);

    input[4].value = "";
});


/* 1일차
 * input    : textContent로 접근하는 게 아닌, value로 접근되어야 한다.
 *            input.focus() 함수를 사용하면 입력하고 버튼 누른 뒤에도
 *              해당 입력창을 '다시 눌러둔 효과'를 만들 수 있는 것으로 보인다.
 */

/* 2일차
 * trim()   : 문자열의 앞뒤(양끝)에 있는 공백을 제거해, 새 문자열을 반환하는 메서드.
 */

/* 3일차
 * document.createElement("li");    : 생성
 * li.textContent = text;           : 내용 넣기
 * result[3].appendChild(li);       : 화면에 추가
 * li, result는 변수명임을 기억할 것.
 * 버튼 함수 내에서 변수명 선언해서 관리하는 것도 좋은 방법.
 */

/* 4일차 휴식, 5일차
 * remove()         : 제거
 * appendChild()    : 오로지 node 객체만 자식 요소로 추가 가능.
 *                    하나의 노드를 특정 부모 노드 안쪽 끝 부분(마지막 자식)에 추가.
 */

/* 6일차
 * (변수명).style.display = "block"     : 줄 나누는 방법
 * (변수명).classList.add("(태그명)")   : 태그 다는 방법
 *      '완료'시, li 등에 "done" 태그를 추가하고
 *      css로 .done {text-decoration: line-through; color: gray;}
 *      이렇게 하면 가독성은 좋음. '완료됨' 이라는 문구 하나 넣고 싶어서 쓰진 않음.
 */
