let notes = [];

const titleInput = document.querySelector(".title-input");
const contentInput = document.querySelector(".content-input");
const addBtn = document.querySelector(".add-btn");
const noteList = document.querySelector(".note-list");

addBtn.addEventListener("click", addNote);

function addNote() {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    //비어있으면
    if (!title && !content) return;

    const note = {
        id:Date.now(),
        title,
        content
    };

    notes.push(note);

    renderNotes();

    titleInput.value = "";
    contentInput.value = "";
    console.log("addNote");
}

function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    renderNotes();
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
            <button class="delete-btn">삭제</button>
        `;

        const delBtn = card.querySelector(".delete-btn");
        delBtn.addEventListener("click", () => deleteNote(note.id));

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
