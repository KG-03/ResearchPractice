let todos = [];
let saved = localStorage.getItem("todos");

let input = document.querySelector(".input");
let addBtn = document.querySelector(".btn");
let delAllBtn = document.querySelector(".delall");
let list = document.querySelector(".list");
let guide = document.querySelector(".guide");

let isEditing = false;
let editingTodo = null;

let currentFilter = "filter-all"
let filterAllBtn = document.querySelector("#filter-all");
let filterDoneBtn = document.querySelector("#filter-done");
let filterNotDoneBtn = document.querySelector("#filter-notDone");

addBtn.addEventListener("click", function() {
    addList();
});

delAllBtn.addEventListener("click", function() {
    list.innerHTML = "";

    todos = [];
    saveTodos();

    updateGuide();
});

filterAllBtn.addEventListener("click", function() {
    currentFilter = "filter-all";
    renderList();
});

filterDoneBtn.addEventListener("click", function() {
    currentFilter = "filter-done";
    renderList();
});

filterNotDoneBtn.addEventListener("click", function() {
    currentFilter = "filter-notDone";
    renderList();
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
            saveTodos();

            isEditing = false;
            editingTodo = null;
        }

        updateGuide();
        input.value = "";
        input.focus();
    }
});

if (saved) {
    try {
        todos = JSON.parse(saved);
    } catch {
        todos = [];
    }

    renderList();
    updateGuide();
}

function addList() {
    let inputText = input.value.trim();

    if(inputText === "") {
        guide.textContent = "입력해 주십시오.";
        return;
    }

    let todo = {text: inputText, done: false};

    todos.push(todo);
    renderList();
    saveTodos();
    updateGuide();

    input.value = "";
    input.focus();
    isEditing = false;
}

function createItem(todo) {
    let todoItem = document.createElement("li");
    todoItem.textContent = todo.text;
    if (todo.done) {
        todoItem.classList.add("done");
    }

    let delBtn = document.createElement("button");
    delBtn.textContent = "삭제";
    delBtn.classList.add("child-btn");
    delBtn.addEventListener("click", function() {
        todos = todos.filter(item => item !== todo);
        saveTodos();

        todoItem.remove();
        updateGuide();
    })

    let editBtn = document.createElement("button");
    editBtn.textContent = "수정";
    editBtn.classList.add("child-btn");
    editBtn.addEventListener("click", function() {
        input.value = todo.text;

        isEditing = true;
        editingTodo = todo;
        
        todos = todos.filter(item => item !== todo);
        saveTodos();

        todoItem.remove();
        updateGuide();
        input.focus();
    })

    let doneBtn = document.createElement("button");
    doneBtn.textContent = "완료";
    doneBtn.classList.add("child-btn");
    doneBtn.addEventListener("click", function() {
        todo.done = !todo.done;
        saveTodos();
        todoItem.classList.toggle("done");
    })

    todoItem.append(delBtn, editBtn, doneBtn);
    list.appendChild(todoItem);
}

function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

function renderList() {
    list.innerHTML = "";

    for (let i = 0; i < todos.length; i++) {
        let todo = todos[i];

        if (currentFilter === "filter-all") {
            filterAllBtn.classList.add("active");
            filterDoneBtn.classList.remove("active");
            filterNotDoneBtn.classList.remove("active");
            createItem(todo);
        } else if (currentFilter === "filter-done" && todo.done) {
            filterAllBtn.classList.remove("active");
            filterDoneBtn.classList.add("active");
            filterNotDoneBtn.classList.remove("active");
            createItem(todo);
        } else if (currentFilter === "filter-notDone" && !todo.done) {
            filterAllBtn.classList.remove("active");
            filterDoneBtn.classList.remove("active");
            filterNotDoneBtn.classList.add("active");
            createItem(todo);
        }
    }

    updateGuide();
}

function updateGuide() {
    if (isEditing === true) {
        guide.textContent = "수정 중입니다...";
        return;
    } else if (currentFilter === "filter-done") {
        guide.textContent = "현재 완료된 일은 다음과 같습니다.";
        return;
    } else if (currentFilter === "filter-notDone") {
        guide.textContent = "현재 해야 하는 일은 다음과 같습니다.";
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

/* 14일차
 * css를 많이 손보게 됨.
 */

/* 15일차
 * 코드 리팩토링
 * try catch    : try 시도했을 때 catch 만약 실패했다면 이 안의 코드 실행
 * JSON.parse   : 문자열 > 객체로 번역하는 작업.
 */

/* 16일차 
 * 필터
 * 데이터 기준으로 화면을 다시 그리기 위해 createItme()에서 renderList()를 통한 출력으로 변경.
 * 
 */
