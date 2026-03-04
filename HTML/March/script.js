"use strict";
console.log("Hello March");

let message = "3월 시작";
console.log(message);

message = "자바스크립트 시작";
console.log(message);

let number = 10;
number = number + 5;
console.log(number);


//아래로 const 테스트
const name_1 = "John Doe";
console.log(name_1);
//name = "Jane Doe";

let age_1 = 27;
age_1 = 28;
console.log(age_1);

const age_2 = 27;
//age_2 = 28;

const numbers = [1,2,3];
numbers.push(4);


//number 테스트
let a = 10;
let b = 3;

console.log(a + b);
console.log(a - b);
console.log(a * b);
console.log(a / b);

//string 테스트
let drink = "cocacola";
console.log(drink);
console.log(drink + " drink");
console.log("10" + 5);

//boolean 테스트
let isStudent = true;
console.log(isStudent);
console.log(10 > 5);
console.log(3 > 7);

//typeof 테스트
console.log(typeof 10);
console.log(typeof "Hello");
console.log(typeof true);

//number와 string 추가 테스트
let x =  "5";
let y = 2;

console.log(x + y);
console.log(x * y);

//string에서 number로 바꾸는 방법
let input = "10";
let numberInput = Number(input);

console.log(numberInput + 5);


//템플릿 리터럴
let name_2 = "Hong gli dong";
let age_3 = 25;

console.log(`이름은 ${name_2}이고 나이는 ${age_3}입니다.`);

let n_1 = 10;
let n_2 = 3;

console.log(`더하기: ${a + b}`);
console.log(`빼기: ${a - b}`);
console.log(`곱하기: ${a * b}`);
console.log(`나누기: ${a / b}`);

/* 1일차
 * let      : 변수 선언.
 * const    : 상수 선언.
 * 
 * "use strict";    : 자바 스크립트를 더 엄격하고 안전하게 실행하라는 선언.
 *                    최근에는 기본적으로 strict 모드가 적용된다고는 하지만,
 *                    배우는 단계라서 적용중.
 */

/* 2일차
 * const    : 기본적으로 const를 쓴다. (생년월일 등)
 * let      : 바뀔 가능성이 있을 때만 사용한다. (점수 등)
 * 
 * js의 배열은 동적 배열. 길이가 자동으로 늘어나며 크기가 미리 지정되지 않는다.
 * 따라서 const 배열에 값을 추가로 넣을 수는 있지만, 들어간 값을 다른 값으로 수정할 수는 없다.
 */

/* 3일차
 * number   : 숫자. 사칙연산 모두 적용 가능.
 * string   : 문자. "문자"+5와 같은 연산을 하게 되면, "문자5"라는 결과를 받는다.
 * boolean  : 참/거짓. 참이면 true, 거짓이면 false.
 * typeof로 자료형이 무엇인지 확인 가능.
 * 
 * string과 number의 연산에서 문자열이라도 숫자로 바꿀 수 있으면 자동으로 바꿔서 계산.
 * + 연산의 특이점이라고 할 수 있다. 숫자끼리는 덧셈하고 문자열이 끼면 문자열 이어붙이기로 판단한다.
 * 단, string에 숫자가 들어있을 때만 이러한 계산이 일어날 수 있다.
 * String(...)과 Number(...)로 형변환이 가능하니 참고.
 */

/* 4일차
 * 템플릿 리터럴
 * ``   : 백틱
 * ${변수}, 혹은 ${계산식} 가능.
 * 문자열 안에서 변수와 계산을 자연스럽게 넣는 방법을 확인. 단순 출력이 아니라, 계산 결과를 바로 넣을 수 있는 방식.
 * console.log(`안녕하세요 ${name}입니다.`);    와 같은 방식.
 */
