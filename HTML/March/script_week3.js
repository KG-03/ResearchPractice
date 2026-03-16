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

//배열 + for문
for(let i = 0; i < fruits.length; i++) {
    console.log(fruits[i]);
}

let arr = [2, 4, 6, 8];
for(let i = 0; i < arr.length; i++) {
    console.log(arr[i] * 2);
}

/* 15일차
 * 배열의 인덱스는 0부터 시작.
 * JavaScript는 에러를 내지 않는다.
 *  따라서 배열을 넘어서는 값을 접근하려고 하면, undefined가 출력된다.
 * JavaScript의 배열에는 자료형이 다 달라도 값을 집어넣을 수 있다.
 */

/* 16일차
 * 배열 출력하는 방법으로 for문이 자주 사용되는 것으로 보인다.
 * arr.length = 0;  : 배열 초기화하는 방법으로 이용 가능.
 *                    arr = []; 으로도 초기화 가능.
 *                    JavaScript 배열이 length 기준으로 잘리기 때문에 가능.
 *                    arr.length = 2; 같은 형식으로도 사용 가능.
 *                      이렇게 되면 arr[0], arr[1] 제외하고 초기화.
 */
