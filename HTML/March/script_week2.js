"use strict";

//if문
let age = 20;
if (age >= 18) {
    console.log("age은 성인입니다.");
}

age = 15;
if(age >= 18) {
    console.log("age는 성인입니다.");
}

//아래의 number_1을 3, 7, 5로 변경해가며 확인.
let number = 5;
if(number > 5) {
    console.log("number은 5보다 큽니다.");
}

let x = 10;
if(x === "10") {
    console.log("x은 \"10\"과 같습니다.");
}

//if - else
age = 20;
if (age >= 18) {
    console.log("성인");
} else {
    console.log("미성년자");
}

age = 15;
if (age >= 18) {
    console.log("성인");
} else {
    console.log("미성년자");
}

number = 8;
if(number % 2 === 0) {
    console.log("짝수");
} else {
    console.log("홀수");
}

let score = 40;
if(score >= 60) {
    console.log("합격");
} else {
    console.log("불합격");
}

//if - else if - else
score = 85;
if(score >= 90) {
    console.log("A");
} else if(score >= 80) {
    console.log("B");
} else {
    console.log("C");
}

number = 0;
if(number > 0) {
    console.log("양수");
} else if(number < 0) {
    console.log("음수");
} else {
    console.log("0");
}

//문제가 되는 코드
score = 95;
if(score >= 60) {
    console.log("합격");
} else if(score >= 90) {
    console.log("우수");
}

score = 72;
if(score >= 90){
    console.log("A");
} else if(score >= 80) {
    console.log("B");
} else if(score >= 70) {
    console.log("C");
} else {
    console.log("F");
}

//and
age = 25;
if (age >= 18 && age <= 30) {
    console.log("청년 범위");
}

//or
let day = "토";
if(day === "토" || day === "일") {
    console.log("주말");
}

//not
let isLoggedIn = false;
if(!isLoggedIn) {
    console.log("로그인 필요");
}
//isLoggedIn이 false, !false === true

age = 20;
let hasTicket = true;
if(age >= 18 && hasTicket) {
    console.log("입장 가능");
}

x = 5;
if (x > 10 || x < 3) {
    console.log("조건 만족");
} else {
    console.log("조건 불만족");
}

//for문
for (let i = 1; i <=10; i++) {
    console.log(i);
}

for (let i = 0; i < 5; i++) {
    console.log(i);
}

for(let i = 1; i <= 3; i++) {
    console.log("Hello");
}

for(let i = 5; i >= 1; i--) {
    console.log(i);
}

//if문 + for문
for(let i = 1; i <= 10; i++) {
    if(i % 2 === 0) {
        console.log(i);
    }
}

for(let i = 1; i <= 20; i++) {
    if(i % 3 === 0) {
        console.log(i);
    }
}

for(let i = 1; i <= 10; i++) {
    if(i % 2 === 0) {
        console.log(i + " 짝수");
    } else {
        console.log(i + " 홀수");
    }
}

for(let i = 1; i <= 10; i++) {
    if(i % 3 === 0) {
        console.log("3의 배수");
    } else {
        console.log(i);
    }
}

for(let i = 1; i <= 5; i++) {
    if(i === 3) {
        console.log("세");
    } else {
        console.log(i);
    }
}

/* 8일차
 * if (조건문) {실행문} : if문 구조
 *                       조건문이 참일 때 실행문 실행.
 */

/* 9일차
 * if(조건문) {실행문1}
 * else {실행문2}       : if + else
 *                        조건문이 참일 때 실행문1이 실행, 아닐 때 실행문2 실행.
 * if(조건문1) {실행문1}
 * else if(조건문2) {실행문2}
 * else {실행문3}       : if + else if + else
 *                        위쪽의 조건문이 참이 되면 바로 실행문이 실행.
 *                        따라서 조건문을 지정할 때는 서순이 중요하다.
 */

/* 10일차
 * &&   : and
 * ||   : or
 * !    : not
 */

/* 11일차
 * for(초기값; 조건문; 증감;) {실행문;}
 */

/* 12일차
 * if문과 for문 같이 쓰기
 */
