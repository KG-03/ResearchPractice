let notes = [];

const titleInput = document.querySelector(".title-input");
const contentInput = document.querySelector(".content-input");
const addBtn = document.querySelector(".add-btn");
const noteList = document.querySelector(".note-list");

//지금 수정 중인지, 수정중인 메모는 어떤 것인지.
let isEditing = false;
let editingId = null;

addBtn.addEventListener("click", addNote);

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
            content
        };

        notes.push(note);
    }

    renderNotes();

    titleInput.value = "";
    contentInput.value = "";
}

function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);

    if (editingId === id) {
        isEditing = false;
        editingId = null;

        titleInput.value = "";
        contentInput.value = "";
    }
    
    renderNotes();
}

function editNote(note) {
    titleInput.value = note.title;
    contentInput.value = note.content;

    isEditing = true;
    editingId = note.id;
}

function renderNotes() {
    noteList.innerHTML = "";

    if(!notes.length) {
        noteList.innerHTML = "<p>메모가 없습니다.</p>";
        return;
    }

    notes.forEach(note => {
        const card = document.createElement("div");
        card.classList.add("note-card");

        card.innerHTML = `
            <h3>${note.title || "(제목 없음)"}</h3>
            <p>${note.content || "(내용 없음)"}</p>
            <button class="edit-btn">수정</button>
            <button class="delete-btn">삭제</button>
        `;

        const delBtn = card.querySelector(".delete-btn");
        delBtn.addEventListener("click", () => deleteNote(note.id));

        const editBtn = card.querySelector(".edit-btn");
        editBtn.addEventListener("click", () => editNote(note));

        noteList.appendChild(card);
    });
}

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
