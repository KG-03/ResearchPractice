let todos = [];
let saved = localStorage.getItem("todos");

let input = document.querySelector(".input");
let btn = document.querySelector(".btn");
let delall = document.querySelector(".delall");
let list = document.querySelector(".list");
let guide = document.querySelector(".guide");

let isEditing = false;
let editingTodo = null;

btn.addEventListener("click", function() {
    isEditing = false;
    addList();
});

delall.addEventListener("click", function() {
    list.innerHTML = "";

    todos = [];
    localStorage.setItem("todos", JSON.stringify(todos));

    updateGuide();
});

input.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        isEditing = false;
        addList();
    }

    if (e.key === "Escape") {
        if (isEditing) {
            createItem(editingTodo);
            todos.push(editingTodo);
            localStorage.setItem("todos", JSON.stringify(todos));

            isEditing = false;
            editingTodo = null;
        }

        input.value = "";
        updateGuide();
    }
});

if (saved) {
    todos = JSON.parse(saved);
    for(let i = 0; i < todos.length; i++) {
        createItem(todos[i]);
        updateGuide();
    }
}

function addList() {
    let text = input.value.trim();

    if(text === "") {
        guide.textContent = "입력해 주십시오.";
        return;
    } else {
        guide.textContent = "";
    }

    let todo = {text: text, done: false};

    createItem(todo);
    updateGuide();
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));

    input.value = "";
    input.focus();
};

function createItem(todo) {
    let li = document.createElement("li");
    li.textContent = todo.text;
    if (todo.done) {
        li.classList.add("done");
    }

    let delbtn = document.createElement("button");
    delbtn.textContent = "삭제";
    delbtn.classList.add("child-btn");
    delbtn.addEventListener("click", function() {
        todos = todos.filter(item => item !== todo);
        localStorage.setItem("todos", JSON.stringify(todos));

        li.remove();
        updateGuide();
    })

    let editbtn = document.createElement("button");
    editbtn.textContent = "수정";
    editbtn.addEventListener("click", function() {
        input.value = todo.text;

        isEditing = true;
        editingTodo = todo;
        
        todos = todos.filter(item => item !== todo);
        localStorage.setItem("todos", JSON.stringify(todos));

        li.remove();
        updateGuide();
        input.focus();
    })

    let donebtn = document.createElement("button");
    donebtn.textContent = "완료";
    donebtn.addEventListener("click", function() {
        todo.done = !todo.done;
        localStorage.setItem("todos", JSON.stringify(todos));
        li.classList.toggle("done");
    })

    li.appendChild(delbtn);
    li.appendChild(editbtn);
    li.appendChild(donebtn);
    list.appendChild(li);
}

function updateGuide() {
    if (isEditing === true) {
        guide.textContent = "수정 중입니다...";
        return;
    } else if (list.children.length) {
        guide.textContent = list.children.length + "개의 할 일이 있습니다.";
        return;
    } 

    guide.textContent = "";
}

/* 8일차
 * todolist 설계
 */

/* 9일차
 * 편의성 추가 (기능확장, ux 개선)
 */

/* 10일차
 * 값 저장
 * localStorage : 문자열만 저장된다. 따라서 JSON.stringify(), JSON.parse()가 꼭 필요하다.
 */

/* 12일차
 * '완료'된 것을 저장할 수 있도록 함.
 * 그러기 위해서 'doto'라는 변수를 생성.
 * 
 * todos = todos.filter(item => item !== text); 다시 확인.
 * todos = ["공부", "운동", "게임"];    text = "운동"; 일 때, '운동'인 부분을 제거하는 것.
 */

/* 13일차
 * 수정 버튼 생성.
 * esc로 수정 탈출 시키는 방법 추가.
 *      + esc로 입력 초기화 하는 방법 추가.
 */
