let todos = [];
const saved = localStorage.getItem("todos");

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
let filterSearchText = "";

addBtn.addEventListener("click", function() {
    addList();
});

delAllBtn.addEventListener("click", function() {
    let items = document.querySelectorAll("li");
    items.forEach(item => {
        item.classList.remove("show");
        item.classList.remove("fade-in");        
        item.classList.add("fade-out");
    })

    setTimeout(function() {
        list.innerHTML = "";
        todos = [];
        saveTodos();
        updateGuide();
    }, 200);
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

input.addEventListener("input", function() {
    filterSearchText = input.value.toLowerCase();
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

        input.value = "";
        filterSearchText = "";
        renderList();
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

//할 일 추가 함수 (입력 > 데이터 생성 > 렌더링)
function addList() {
    let inputText = input.value.trim();

    if(inputText === "") {
        guide.textContent = "입력해 주십시오.";
        return;
    }

    let todo = {
        id: Date.now(),
        text: inputText,
        done: false
    };

    todos.push(todo);

    filterSearchText = "";
    renderList();
    saveTodos();
    updateGuide();

    input.value = "";
    input.focus();
    isEditing = false;
}

//요소 생성 (addList() > renderList() > createItem())
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
        todoItem.classList.remove("show");
        todoItem.classList.remove("fade-in");

        todoItem.classList.add("fade-out");
        setTimeout(function() {
            todos = todos.filter(item => item.id !== todo.id);
            saveTodos();            
            todoItem.remove();
            updateGuide();
        }, 200);
    });

    let editBtn = document.createElement("button");
    editBtn.textContent = "수정";
    editBtn.classList.add("child-btn");
    editBtn.addEventListener("click", function() {
        if(isEditing) {
            guide.textContent = "수정 중입니다. 먼저 완료하거나 취소해주세요.";
            return;
        }
        input.value = todo.text;

        isEditing = true;
        editingTodo = todo;
        
        todos = todos.filter(item => item.id !== todo.id);
        saveTodos();

        todoItem.remove();
        updateGuide();
        input.focus();
    });

    let doneBtn = document.createElement("button");
    doneBtn.textContent = "완료";
    doneBtn.classList.add("child-btn");
    doneBtn.addEventListener("click", function() {
        todo.done = !todo.done;
        saveTodos();
        todoItem.classList.toggle("done");
    });

    todoItem.append(delBtn, editBtn, doneBtn);
    list.appendChild(todoItem);

    todoItem.classList.add("fade-in");
    requestAnimationFrame(() => {
        todoItem.classList.add("show");
    });
}

//저장
function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

//리스트 전체 렌더링 (필터 + 정렬)
function renderList() {
    list.innerHTML = "";

    updateFilterUI();

    let filtered = todos.filter(todo => {
        if (!todo.text.toLowerCase().includes(filterSearchText)) return false;

        if (currentFilter === "filter-done") return todo.done;
        if (currentFilter === "filter-notDone") return !todo.done;

        return true;
    })

    filtered.sort((a, b) => b.done - a.done);
    filtered.forEach(todo => createItem(todo));

    updateGuide();
}

//필터 버튼
function updateFilterUI() {
    filterAllBtn.classList.toggle("active", currentFilter === "filter-all");
    filterDoneBtn.classList.toggle("active", currentFilter === "filter-done");
    filterNotDoneBtn.classList.toggle("active", currentFilter === "filter-notDone");    
}

//상태 표시
function updateGuide() {
    if (!list.children.length && !isEditing) {
        guide.textContent = "할 일을 추가해보세요!";
    } else if (isEditing === true) {
        guide.textContent = "수정 후 확인 버튼을 누르거나 Enter를 누르세요. (ESC 취소)";
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
 */

/* 17일차
 * 텍스트로 필터 기능 생성.
 * !todo.text.toLowerCase().includes(filterSearchText)
 *      todo의 텍스트를 모두 소문자로 변환하고, todo의 텍스트에 filterSearchText가 포함되어 있지 않다면 true.
 *      검색어 없으면 건너뛰라는 의미. (실행에 continue를 적어놨으니까)
 *      toLowerCase()   : 문자열을 전부 소문자로 바꿔주는 함수.
 */

/* 19일차
 * setTimeout()             : 지정된 시간이 지난 뒤 실행된다.
 *                            setTimeout(function() {...}, 1000); 이와 같은 코드가 있다면, 1초 뒤 실행된다.
 *                            밀리 초(ms) 단위로, 한 번만 실행된다.
 * requestAnimationFrame()  : 화면 기준으로 실행. 다음 화면 그리기 직전에 실행된다.
 *                            브라우저가 '지금 그릴 타이밍'에 맞춰서 실행하며, 초당 60번 실행 가능하다.
 *                            ex: 클래스 적용 -> 이를 한 프레임 뒤에 변화.
 *                                todoItem.classList.add("fade-in");
 *                                todoItem.classList.add("show");
 *                                위의 방식으로 코드를 짜면, 애니메이션이 보이지 않는다. 브라우저가 한 번에 처리하기 때문.
 */

/* 20일차
 * 안정성 + 구조 정리
 *      let text = input.value.trim();
 *      let todo = {
 *          id: Date.now(),
 *          text: inputText,
 *          done: false
 *      };
 * 
 *      todos.pust({
 *          id: Date.now(),
 *          text,
 *          done: false
 *      });
 * 
 *      여기서 push할 때, text를 text로 넣을 수 있음. 변수 이름과 속성 이름이 같으면 축약 가능.
 */

/* 21일차
 * 수정 중 UX 완성. 텍스트 몇 가지만 변경.
 * 수정을 하다가 ESC로 빠져나오면 할일이 보이지 않는 문제 해결.
 * filtered.sort((a, b) => b.done - a.done);로 정렬.
 *      b.done - a.done (완료(true) === 1, 미완료(false) === 0), 따라서 양수면 위로 올라간다. (1 - 0 = 양수)
 *      데이터 자체(todos)를 정렬하는 것도 가능하지만, 이 경우 순서가 계속 바뀌고 원본 데이터가 훼손될 가능성이 있다.
 * 수정버튼을 누르고 또 다른 수정 버튼을 누르면 이전의 할일이 없어지는 문제 발견.
 * 수정 중일 때는 수정 버튼에 접근하지 못하도록 설정하여 해걸.
 */

/* 22일차
 * 코드 몇 가지 수정
 */
