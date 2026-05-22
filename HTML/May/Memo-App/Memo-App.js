let notes = [];

try {
    const saved = localStorage.getItem("notes");
    notes = saved ? JSON.parse(saved) : [];
} catch {
    notes = [];
}

notes = notes.map(note => ({
    ...note,
    pinned: note.pinned ?? false,
    category: note.category ?? "general",
    createdAt: note.createdAt ?? note.id,
    updatedAt: note.updatedAt ?? note.createdAt ?? note.id
}));

//DOM link
const titleInput = document.querySelector(".title-input");
const contentInput = document.querySelector(".content-input");
const addBtn = document.querySelector(".add-btn");
const noteList = document.querySelector(".note-list");
const searchInput = document.querySelector(".search-input");
const pinButtons = document.querySelectorAll("[data-pin]");
const themeToggleBtn = document.querySelector(".theme-toggle-btn");
const categorySelect = document.querySelector(".category-select");
const categoryFilter = document.querySelector(".category-filter");
const noteStatus = document.querySelector(".note-status");
const sortSelectFilter = document.querySelector(".sort-select-filter");
const titleCount = document.querySelector(".title-count");
const contentCount = document.querySelector(".content-count");

//지금 수정 중인지, 수정중인 메모는 어떤 것인지.
let isEditing = false;
let editingId = null;

let searchText = "";

//pin       : 전체, 고정, 일반
//Category  : 전체, 일반, 공부, 작업, 아이디어
let currentPin = "all";
let currentTheme = localStorage.getItem("theme") || "light";
let currentCategory = "all";
let currentSort = "latest";

titleInput.addEventListener("keydown", function(e) {
    if(e.key === "Enter") {
        addNote();
    }
});

contentInput.addEventListener("keydown", function(e) {
    if(e.key === "Enter" && e.ctrlKey) {
        addNote();
    }
});

addBtn.addEventListener("click", addNote);

searchInput.addEventListener("input", function() {
    searchText = searchInput.value.trim().toLowerCase();

    renderNotes();
});

pinButtons.forEach(button => {   
    button.addEventListener("click", function() {
        currentPin = button.dataset.pin;

        pinButtons.forEach(btn => {
            btn.classList.remove("active");

            if(btn.dataset.pin === currentPin) {
                btn.classList.add("active");
            }            
        });

        renderNotes();
    });
});

themeToggleBtn.addEventListener("click", function() {
    currentTheme = currentTheme === "light" ? "dark" : "light";

    applyTheme(currentTheme);
    localStorage.setItem("theme", currentTheme);

    updateThemeButton();
});

categoryFilter.addEventListener("change", function() {
    currentCategory = categoryFilter.value;

    renderNotes();
});

sortSelectFilter.addEventListener("change", function() {
    currentSort = sortSelectFilter.value;

    renderNotes();
});

titleInput.addEventListener("input", function() {
    saveDraft();
    updateInputCounts();
});
contentInput.addEventListener("input", function() {
    saveDraft();
    updateInputCounts();
    autoResizeContentarea();
});
categorySelect.addEventListener("change", saveDraft);

//func
//draft func
function saveDraft() {
    const draft = {
        title: titleInput.value,
        content: contentInput.value,
        category: categorySelect.value
    };

    localStorage.setItem("noteDraft", JSON.stringify(draft));
}

function loadDraft() {
    const saved = localStorage.getItem("noteDraft");

    if(!saved) return;

    const draft = JSON.parse(saved);

    titleInput.value = draft.title || "";
    contentInput.value = draft.content || "";
    categorySelect.value = draft.category || "general";
    autoResizeContentarea();
}

//note func
function addNote() {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    //비어있으면
    if (!title && !content) return;

    if (isEditing) {
        notes = notes.map (note => {
            if(note.id === editingId) {
                const isChanged =
                    note.title !== title ||
                    note.content !== content ||
                    note.category !== categorySelect.value;
                    
                return {
                     ...note,
                     title,
                     content,
                     category: categorySelect.value,
                     updatedAt: isChanged ?
                        Date.now() :
                        note.updatedAt
                };
            }
            return note;
        });

        isEditing = false;
        editingId = null;
    } else {
        const note = {
            id: Date.now(),
            title,
            content,
            pinned: false,
            category: categorySelect.value,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        notes.push(note);
    }

    saveNotes();
    renderNotes();

    localStorage.removeItem("noteDraft");
    titleInput.value = "";
    contentInput.value = "";
    categorySelect.value = "general";
    addBtn.textContent = isEditing ? "수정 완료" : "추가";
    updateInputCounts();
    autoResizeContentarea();

    titleInput.focus();
}

function editNote(note) {
    titleInput.value = note.title;
    contentInput.value = note.content;
    categorySelect.value = note.category || "general";

    isEditing = true;
    editingId = note.id;
    addBtn.textContent = isEditing ? "수정 완료" : "추가";

    updateInputCounts();
    autoResizeContentarea();
    titleInput.focus();
}

function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);

    if (editingId === id) {
        isEditing = false;
        editingId = null;

        titleInput.value = "";
        contentInput.value = "";
        addBtn.textContent = "추가";
    }
    
    saveNotes();
    renderNotes();
}

function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

function createNoteCard(note) {
    const card = document.createElement("div");
    card.classList.add("note-card");

    const isModified = note.updatedAt !== note.createdAt;

    card.innerHTML = `
        <h3>${note.title || "(제목 없음)"}</h3>

        <p class="note-card-category">카테고리: ${getCategoryLabel(note.category)}</p>

        <p>${note.content || "(내용 없음)"}</p>

        <p class="note-card-date">생성: ${formatDate(note.createdAt)}</p>
        
        ${
            isModified ?
            `<p class="note-card-date modified">✏️ 수정됨: ${formatDate(note.updatedAt)}</p>` :
            ""
        }
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

    return card;
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

function renderNotes() {
    noteList.innerHTML = "";

    if(!notes.length) {
        renderEmptyMessage("메모가 없습니다!");
        return;
    }

    const searchedNotes = filterBySearch(notes);

    const categoryFilteredNotes = filterByCategory(searchedNotes);

    const pinnedNotes = filterByPin(categoryFilteredNotes);

    renderStatus(pinnedNotes);

    if(!pinnedNotes.length) {
        if (currentPin === "pinned" && searchText === "") {
            renderEmptyMessage("고정된 메모가 없습니다!");
        } else if (currentPin === "normal" && searchText === "") {
            renderEmptyMessage("일반 메모가 없습니다!");
        } else {
            renderEmptyMessage("검색 결과가 없습니다!");
        }

        return;
    }

    const sortedNotes = sortNotes(pinnedNotes);

    sortedNotes.forEach(note => {
        const card = createNoteCard(note);

        noteList.appendChild(card);
    });
}

function renderEmptyMessage(message) {
    noteList.innerHTML = `
        <div class="empty-message">
            <p>${message}</p>
        </div>
    `;
}

function renderStatus(filteredNotes) {
    const pinnedCount = filteredNotes.filter(note => note.pinned).length;

    //가능하다면 '전체, 고정, 일반'의 상태에 따라 값을 달리 출력하는 것도 괜찮아 보인다.
    noteStatus.textContent = `
        [카테고리: ${getCategoryLabel(currentCategory)}] 
        📝 메모 ${filteredNotes.length}개
        / 📌 고정 ${pinnedCount}개
    `;
}

function updateInputCounts() {
    titleCount.textContent = `${titleInput.value.length} / 50`;
    contentCount.textContent = `${contentInput.value.length} / 500`;

    if(titleInput.value.length > 45) titleCount.classList.add("warning");
    else titleCount.classList.remove("warning");

    if(contentInput.value.length > 490) contentCount.classList.add("warning");
    else contentCount.classList.remove("warning");
}

function autoResizeContentarea() {
    //줄 삭제 후 높이가 줄어들지 않는 문제가 생길 수 있어, auto부터 대입.
    contentInput.style.height = "auto";
    contentInput.style.height = contentInput.scrollHeight + "px";
}

//filter func
function filterBySearch(notes) {
    return notes.filter(note => {
        const titleMatch = (note.title || "").toLowerCase().includes(searchText);
        const contentMatch = (note.content || "").toLowerCase().includes(searchText);

        return titleMatch || contentMatch;
    });
}

function filterByCategory(notes) {
    return notes.filter(note => {
        if (currentCategory === "all") return true;

        return note.category === currentCategory;
    });
}

function filterByPin(notes) {
    return notes.filter(note => {
        if (currentPin === "pinned") {
            return note.pinned;
        }

        if (currentPin === "normal") {
            return !note.pinned;
        }

        return true;
    });
}

//sorting
function sortNotes(notes) {
    return [...notes].sort((a, b) => {
        if(b.pinned !== a.pinned) {
            //핀 기준 정렬
            return b.pinned - a.pinned;
        }

        //최신순 정렬 (05/18: id에서 createdAt으로 변경.)
        if (currentSort === "latest") {
            return b.createdAt - a.createdAt;
        }

        //오래된순 정렬
        if (currentSort === "oldest") {
            return a.createdAt - b.createdAt;
        }

        //제목순 정렬
        if (currentSort === "title") {
            return (a.title || "").localeCompare(b.title || "");
        }

        return 0;
    });
}

//Light-Dark mode func
function applyTheme(theme) {
    document.body.classList.remove("light-theme", "dark-theme");

    document.body.classList.add(`${theme}-theme`);
}

function updateThemeButton() {
    themeToggleBtn.textContent = currentTheme === "light" ? "🌙 다크모드" : "☀️ 라이트모드";
}

//Category func
function getCategoryLabel(category) {
    if(category === "general") return "일반"
    if(category === "study") return "공부";
    if(category === "work") return "작업";
    if(category === "idea") return "아이디어";

    return "전체";
}

//Date func
function formatDate(timestamp) {
    const date = new Date(timestamp);

    return date.toLocaleDateString();
}

//홈페이지 실행 즉시 보여져야 하는 것.
document.querySelector('[data-pin="all"]').classList.add("active");
applyTheme(currentTheme);
updateThemeButton();
loadDraft();
updateInputCounts();
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
 * 14일차에서 currentFilter를 currentPin으로 교체.
 */

/* 10일차
 * document.querySelector('[data-filter="all"]').classList.add("active");   : data-filter="all" 속성을 가진 요소를 찾아서 active 클래스를 붙인다.
 *                                                                            document              : 웹 페이지 전체
 *                                                                            querySelector(...)   : ... 클래스를 가진 첫 요소 찾기.
 *                                                                            [data-filter="all"]   : CSS 속성 선택자. data=*의 구조에서 해당 속성을 가진 요소.
 * 14일차에서 Filter 이름을 전부 Pin으로 교체.
 */

/* 11일차
 * renderEmptyMessage() 생성, renderNotes()에서 검색 결과 및 메모가 없을 때의 조건문 변경.
 * 확인해야 할 함수나 코드가 없어서 생략.
 */

/* 12일차
 * let currentTheme = localStorage.getItem("theme") || "light"; : 새로고침 이후에도 현재의 모드를 유지하기 위해서.
 *                                                                저장되어 있는 theme 값을 가져오는데, theme에 값이 아무것도 없다면 light를 쓴다.
 */

/* 13일차
 * categorySelect.value = note.category || "general";   : 이전 localStorage, 혹은 새로 페이지를 열 때는 category 값이 없기 때문.
 */

/* 14일차
 * addEvnetListener("change", ...)  : select는 보통 click이 아니라 change를 사용한다.
 *                                    값이 변경되었을 때 반응하는 것이 목적이기 때문.
 */

/* 15일차
 * filterBy...(notes) 함수  : renderNotes()에서 분리. return (note)를 해야 정상동작하는 것을 기억할 것.
 */

/* 17일차
 * 현재 몇 개의 메모가 있는지 알려주는 status란을 만듦.
 * '필터된 결과'를 기준으로 현재 상태를 알려주는 것이 좋음.
 * 따라서 '검색 결과 몇 개의 메모'인지, 아니면 '저장한 메모가 몇 개인지'를 명시하는 게 좋아 보임.
 */

/* 18일차
 * 내용에 줄바꿈도 넣어서 메모를 저장할 수 있을지 모르음.
 * id:Date.now()        : 식별자
 * createdAt: Date.now() : 생성 시각
 * 
 * date.toLocaleDateString()    : 전제는 const date = new Date(timestamp);      < timestamp를 Date 객체로 변환한다.
 *                                JavaScript의 날짜(Date) 객체를 사용자 지역 형식(lacale)에 맞는 날짜 문자열로 변환하는 함수.
 *                                인자로 지역을 직접 설정 가능. date.toLocaleDateString("ko-KR")    < 다음과 같은 형식.
 *                                인자로 옵션 설정도 가능. date.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
 *                                  numeric : 5
 *                                  2-digit : 05
 *                                  short   : May
 *                                  long    : May
 *                                반환값은 문자열(string)
 *                                미국 환경이라면 5/18/2026 등으로 보임.
 *                                비슷한 함수   : date.toDateString()   해당 함수는 고정 영어 형식.
 */

/* 19일차
 * (a.title || "").localeCompare(b.title || ""));   : localeCompare : 문자열끼리 사전 순서를 비교하는 함수.
 *                                                                    문자열1.localeCompare(문자열2)라고 할 때, 두 문자열의 사전 순서를 비교.
 *                                                                    결과가 음수면 문자열 1이 앞, 결과가 양수면 문자열 2가 앞, 결과가 0이면 같음으로 처리.
 *                                                    (a.title || "")   : title에 값이 없으면 빈 문자열을 사용한다는 의미.
 *                                                                        왜냐하면 undefined로 localeCompare() 함수가 실행되면 오류가 일어날 확률이 높기 때문.
 *                                                    a > b로도 해당 기능이 구현될 수 있지만, 지역/언어 규칙에 맞는 문자열을 비교하려면 localeCompare가 더 좋음.
 *                                                    내림차순을 하려면 b.title.localeCompare(a.title)으로 적으면 됨.
 * 
 * 수정 중, 혹은 그 외의 상황에서 esc를 누르면 수정 도중 빠져나오는 기능이 있으면 좋지 않을까 싶음.
 */

/* 20일차
 * localStorage.satItem("noteDraft", JSON.stringify(draft));    : 현재 작성 중 상태 저장. draft 변수에는 저장하고 싶은 값을 담는다.
 *                                                                이번 기능의 경우, '작성 중 상태를 저장'하기 위함이므로, draft에 입력창의 값을 전달받는다.
 * localStorage.removeItem("noteDraft");    : noteDraft라는 아이템을 제거.
 * 
 * 1. 입력 자동저장의 저장 빈도 관리
 * 2. '수정' 상태에서 새로고침 후, 입력이 임시저장되는 것은 확인되었으나, '수정' 상태가 유지되지 않고 풀려나, 새로운 입력으로 간주되는 중.
 * 3. draft timestamp 저장하는 것도 고려.
 */

/* 21일차
 * 수정 날짜 표기.
 * const isChanged = note.title !== title || note.content !== content || note.category !== categorySelect.value; 해당 코드는
 *      const isChanged = ["title", "content"].some(...)으로 만들 수도 있음을 기억할 것.
 * 
 * 수정 버튼을 누르고 취소 버튼도 고려할 것.
 */

/* 22일차
 * 메모 글자수 제한 표기.
 * content 말고도 title 쪽도 줄바꿈이 이루어지면 좋을 것 같으나, 이렇게 하려면 고려될 지점이 많아질 것 같아 보류.
 */
