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

//배열에 값 추가 및 제거 방법
arr.length = 0;

arr.push(1);
console.log(arr);

arr.pop();
console.log(arr);

arr.unshift(0);
console.log(arr);

arr.shift();
console.log(arr);

arr = [1, 2, 3];
let x = arr.shift();
console.log(x);
x = arr.pop();
console.log(x);

arr.length = 0;
arr = [1, 2, 3];
x = arr.unshift(0);
console.log(x);
x = arr.push(4);
console.log(x);

//함수
function add(a, b) {
    return a + b;
}
let result = add(3, 5);
console.log(result);

function printNumber(n) {
    console.log(n);
}
printNumber(10);

function pringLength(arr) {
    console.log(arr.length);
}
pringLength([1,2,3]);

function multiply(a,b) {
    return a * b;
}
console.log(multiply(3,4));

function sayHello(name) {
    return "Hello " + name;
}
console.log(sayHello("john"));

function test() {
    console.log("A");
    return 10;
    console.log("B");
}
test();

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

/* 17일차
 * push      : 뒤에 값 추가. 새로운 length 반환.
 * pop       : 뒤쪽 값 삭제 및 반환(빼내기)
 * unshift   : 앞에 값 추가. 새로운 length 반환.
 * shift     : 앞쪽 값 삭제 및 반환(빼내기)
 */

/* 18일차
 * function : 함수. function 함수명(매개변수) { 실행코드 + return 결과 }
 *            구조는 다른 프로그래밍 언어와 동일.
 *            return 이후의 코드들은 실행되지 않는 것에 유의.
 */
