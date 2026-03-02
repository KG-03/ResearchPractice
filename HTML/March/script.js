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
const name = "John Doe";
console.log(name);
//name = "Jane Doe";

let age = 27;
age = 28;
console.log(age);

const age2 = 27;
//age2 = 28;

const numbers = [1,2,3];
numbers.push(4);

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
