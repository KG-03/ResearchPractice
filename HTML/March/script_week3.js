"use strict";

//배열
let numbers = [10, 20, 30];
console.log(numbers);
console.log(numbers[0]);
console.log(numbers[1]);
console.log(numbers[2]);
for(let i = 0; i < numbers.length; i++) {
    console.log(numbers[i]);
}

let fruits = ["apple", "banana", "orange"];
console.log(fruits[0]);
console.log(fruits[2]);

let data = [10, "hello", true];
for(let i = 0; i < data.length; i++) {
    console.log(data[i]);
}

/* 15일차
 * 배열의 인덱스는 0부터 시작.
 * JavaScript는 에러를 내지 않는다.
 *  따라서 배열을 넘어서는 값을 접근하려고 하면, undefined가 출력된다.
 * JavaScript의 배열에는 자료형이 다 달라도 값을 집어넣을 수 있다.
 */