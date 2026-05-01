let notes = [];

const titleInput = document.querySelector(".title-input");
const contentInput = document.querySelector(".content-input");
const addBtn = document.querySelector(".add-btn");
const noteList = document.querySelector(".note-list");

addBtn.addEventListener("click", addNote);

function addNote() {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    //비어있으면 생략
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

function renderNotes() {
    noteList.innerHTML = "";

    notes.forEach(note => {
        const card = document.createElement("div");
        card.classList.add("note-card");

        card.innerHTML = `
            <h3>${note.title || "(제목 없음)"}</h3>
            <p>${note.content || "(내용 없음)"}</p>
        `;

        noteList.appendChild(card);
    });
}
