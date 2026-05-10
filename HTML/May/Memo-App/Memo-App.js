let notes = [];

try {
    const saved = localStorage.getItem("notes");
    notes = saved ? JSON.parse(saved) : [];
} catch {
    notes = [];
}

notes = notes.map(note => ({
    ...note,
    pinned: note.pinned ?? false
}));

const titleInput = document.querySelector(".title-input");
const contentInput = document.querySelector(".content-input");
const addBtn = document.querySelector(".add-btn");
const noteList = document.querySelector(".note-list");
const searchInput = document.querySelector(".search-input");
const filterButtons = document.querySelectorAll("[data-filter]");

//지금 수정 중인지, 수정중인 메모는 어떤 것인지.
let isEditing = false;
let editingId = null;

let searchText = "";

let currentFilter = "all";

titleInput.addEventListener("keydown", function(e) {
    if(e.key === "Enter") {
        addNote();
    }
});

contentInput.addEventListener("keydown", function(e) {
    if(e.key === "Enter" && e.shiftKey) {
        addNote();
    }
});

addBtn.addEventListener("click", addNote);

searchInput.addEventListener("input", function() {
    searchText = searchInput.value.trim().toLowerCase();

    renderNotes();
});

filterButtons.forEach(button => {   
    button.addEventListener("click", function() {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(button => {
            button.classList.remove("active");

            if(button.dataset.filter === currentFilter) {
                button.classList.add("active");
            }            
        });

        renderNotes();
    });
});

//함수
function addNote() {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    //비어있으면
    if (!title && !content) return;

    if (isEditing) {
        notes = notes.map (note => {
            if(note.id === editingId) {
                return { ...note, title, content};
            }
            return note;
        });

        isEditing = false;
        editingId = null;
    } else {
        const note = {
            id:Date.now(),
            title,
            content,
            pinned: false
        };

        notes.push(note);
    }

    saveNotes();
    renderNotes();

    titleInput.value = "";
    contentInput.value = "";
    addBtn.textContent = isEditing ? "수정 완료" : "추가";
    titleInput.focus();
}

function togglePin(id) {
    notes = notes.map(note => {
        if (note.id === id) {
            return {...note, pinned: !note.pinned};
        }
        return note;
    })

    saveNotes();
    renderNotes();
}

function editNote(note) {
    titleInput.value = note.title;
    contentInput.value = note.content;

    isEditing = true;
    editingId = note.id;
    addBtn.textContent = isEditing ? "수정 완료" : "추가";

    titleInput.focus();
}

function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);

    if (editingId === id) {
        isEditing = false;
        editingId = null;

        titleInput.value = "";
        contentInput.value = "";
    }
    
    saveNotes();
    renderNotes();
}

function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

function renderNotes() {
    noteList.innerHTML = "";

    if(!notes.length) {
        noteList.innerHTML = "<p>메모가 없습니다.</p>";
        return;
    }

    const searched = notes.filter(note => {
        const titleMatch = (note.title || "").toLowerCase().includes(searchText);
        const contentMatch = note.content.toLowerCase().includes(searchText);

        return titleMatch || contentMatch;
    })

    if(!searched.length) {
        //검색 조건에 맞는 노드가 하나도 들어가지 않았다면.
        noteList.innerHTML = "<p>검색 결과가 없습니다!</p>";
        return;
    }

    const filtered = searched.filter(note => {
        if (currentFilter === "pinned") {
            return note.pinned;
        }

        if (currentFilter === "normal") {
            return !note.pinned;
        }

        return true;
    });

    const sorted = [...filtered].sort((a, b) => {
        if(b.pinned !== a.pinned) {
            //핀 기준 정렬
            return b.pinned - a.pinned;
        }
        //최신순 정렬
        return b.id - a.id;
    });

    sorted.forEach(note => {
        const card = document.createElement("div");
        card.classList.add("note-card");

        card.innerHTML = `
            <h3>${note.title || "(제목 없음)"}</h3>
            <p>${note.content || "(내용 없음)"}</p>
            <button class="child-btn pin-btn">${note.pinned ? "★" : "☆"}</button>
            <button class="child-btn edit-btn">수정</button>
            <button class="child-btn delete-btn">삭제</button>
        `;

        const delBtn = card.querySelector(".delete-btn");
        delBtn.addEventListener("click", () => deleteNote(note.id));

        const editBtn = card.querySelector(".edit-btn");
        editBtn.addEventListener("click", () => editNote(note));

        const pinBtn = card.querySelector(".pin-btn");
        pinBtn.addEventListener("click", () => togglePin(note.id));

        noteList.appendChild(card);
    });
}

//홈페이지 실행 즉시 보여져야 하는 것.
document.querySelector('[data-filter="all"]').classList.add("active");
renderNotes();

/* 1일차
 * 구조 생성
 */

/* 3일차
 * delBtn.addEventListener("click", deleteNote(note.id));   : 이 형식은 '즉시 실행'으로 이어진다.
 *                                                            이벤트 형식으로 할 거면 "click", fucntion() {...}으로 이어져야만 한다.
 *                                                            혹은 () => deleteNote(note.id)도 괜찮다.
 */

/* 4일차
 * array.map()                          : map()은 배열을 순회하면서 각 요소를 호출해, 새 배열을 만드는 함수.
 *                                        map(요소 => 변환된 값)
 *                                        array에 {1, 2, 3}이 있다고 할 때, array.map(n => n * 2)를 하면 {2, 4, 6}이 된다.
 * return { ...note, title, content};   : ...note는 '객체를 복사하는 문법'.
 *                                        note를 복사하고, title, content 값을 새 값으로 덮어쓴다.
 *                                        note = {id: 1, title: "old", content: "old"} update = {...note, title: "new", content: "new"}하게 되면 id가 1이고 title, content가 new인 update가 만들어진다.
 *                                        따라서 이 코드의 핵심은 '객체를 복사하고 특정 값만 수정'하는 방법이란 뜻이다.
 */

/* 5일차
 * JSON.parse       : 문장을 문법적 부분으로 나누고 부분을 식별. 데이터를 파싱하여 J.S 객체로 변환.
 * JSON.stringify   : JS Object를 JSON 문자열로 반환.
 * parse가 서버 > 클라이언트 상황의 데이터 전달용 파싱이라면, stringify는 클라이언트 > 서버 상황의 데이터 전달용 파싱.
 * 
 * ? :              : 삼항 연산자.
 *                    조건 ? 값1 : 값2      조건이 참이면 값1, 거짓이면 값2
 */

/* 6일차
 * const sorted = [...notes].sort((a, b) => b.pinned - a.pinned);   : notes 배열을 복사한 뒤, pinned 값 기준으로 내림차순 정렬한 새 배열 생성.
 *                                                                    [notes]   : 스프레드 문법. 배열을 복사한다.
 *                                                                    (a, b) => b.pinned - a.pinned : 음수 반환되면 a먼저, 양수 반환되면 b 먼저. 0이면 순서 유지.
 * 
 * pinned: note.pinned ?? false     : note.pinned 값이 있으면 그대로 쓰고, 아니면 false를 사용.
 *                                    ??    : null 병합 연산자.
 *                                            값1 ?? 값2    다음의 두 값이 있다면, 값1이 null 또는 underfined일 때만 값2를 사용한다.
 */

/* 7일차
 * toLowerCase(...) : 대소문자 구분 제거를 위해 사용. 문자열을 모두 소문자로 변환한다.
 * include(...)     : (...)에 들어간 내용이 해당 문자열에 포함되어 있는지 검사한다.
 * const titleMatch = (note.title || "").toLowerCase().includes(searchText);    : (note.title || "") 이것이 중요한 구조.
 *                                                                                왼쪽에 값이 있으면 그것을 사용, 값이 없다면 오른쪽 값을 사용하는 구조.
 */

/* 8일차
 * currentFilter = button.dataset.filter;   : data-filter="pinned"을 js에서 currentFilter = button.dataset.filter; 이런 식으로 부르면, 결과가 pinned가 나온다.
 *                                            button    : HTML의 버튼 요소 자체.
 *                                            dataset   : 버튼의 data-* 속성을 모아둔 객체. HTML에서 사용자 정의 데이터를 붙여야 한다.
 *                                            filter    : dataset 객체 안의 filter '값'에 접근한다.
 */

/* 10일차
 * document.querySelector('[data-filter="all"]').classList.add("active");   : data-filter="all" 속성을 가진 요소를 찾아서 active 클래스를 붙인다.
 *                                                                            document              : 웹 페이지 전체
 *                                                                            querySelector(...)   : ... 클래스를 가진 첫 요소 찾기.
 *                                                                            [data-filter="all"]   : CSS 속성 선택자. data=*의 구조에서 해당 속성을 가진 요소.
 *                                                                            
 */
