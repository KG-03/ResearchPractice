let notes = [];
let archivedNotes = [];

try {
    const saved = localStorage.getItem("notes");
    notes = saved ? JSON.parse(saved) : [];
} catch {
    notes = [];
}

try {
    const savedArchived = localStorage.getItem("archivedNotes");
    archivedNotes = savedArchived ? JSON.parse(savedArchived) : [];
} catch {
    archivedNotes = [];
}

notes = notes.map(note => ({
    ...note,
    pinned: note.pinned ?? false,
    category: note.category ?? "general",
    createdAt: note.createdAt ?? note.id,
    updatedAt: note.updatedAt ?? note.createdAt ?? note.id,
    expanded: note.expanded ?? true
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
const appMessage = document.querySelector(".app-message");
const exportBtn = document.querySelector(".export-btn");
const importInput = document.querySelector(".import-input");
const saveStatus = document.querySelector(".save-status");
const cancelEditBtn = document.querySelector(".cancel-edit-btn");
const helpBtn = document.querySelector(".help-btn");
const archiveViewBtn = document.querySelector(".archive-view-btn");

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
let currentView = "notes";

//마지막으로 제거한 데이터, 복구 가능 시간
let lastDeletedNote = null;
let undoTimer = null;

let messageTimer = null;

addBtn.addEventListener("click", addNote);

searchInput.addEventListener("input", function() {
    searchText = searchInput.value.trim().toLowerCase();

    renderNotes();
});

pinButtons.forEach(button => {   
    button.addEventListener("click", function() {
        currentPin = button.dataset.pin;
        currentView = "notes";
        localStorage.setItem("currentPin", currentPin);

        clearActiveButton();
        pinButtons.forEach(btn => {
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
    localStorage.setItem("currentCategory", currentCategory);

    if (currentView === "notes") renderNotes();
    else if (currentView === "archive") renderArchivedNotes();
});

sortSelectFilter.addEventListener("change", function() {
    currentSort = sortSelectFilter.value;
    localStorage.setItem("currentSort", currentSort);

    if (currentView === "notes") renderNotes();
    else if (currentView === "archive") renderArchivedNotes();
});

titleInput.addEventListener("input", function() {
    saveDraft();
    updateInputCounts();
    if(!isEditing) updateSaveStatus("✏️ 작성 중...");
});
contentInput.addEventListener("input", function() {
    saveDraft();
    updateInputCounts();
    autoResizeContentarea();
    if(!isEditing) updateSaveStatus("✏️ 작성 중...");
});
categorySelect.addEventListener("change", saveDraft);

exportBtn.addEventListener("click", exportNotes);

importInput.addEventListener("change", importNotes);

cancelEditBtn.addEventListener("click", cancelEdit);

helpBtn.addEventListener("click", () => {
    alert(`
        Ctrl + Enter : 저장
        / : 검색 입력
        Esc : 취소
        Ctrl + Shift + E : 내보내기
        Ctrl + Shift + I : 불러오기
    `);
});

archiveViewBtn.addEventListener("click", () => {
    currentPin = "all";
    currentView = "archive";

    localStorage.setItem("currentPin", currentPin);

    clearActiveButton();
    archiveViewBtn.classList.add("active");
    renderArchivedNotes();
});

document.addEventListener("keydown", function(e) {
    //저장 단축
    if(e.ctrlKey && e.key === "Enter") {
        addNote();
    }

    //검색 단축
    if (e.key === "/") {
        e.preventDefault();
        searchInput.focus();
    }

    //입력 취소 단축
    if(e.key === "Escape" && document.activeElement === searchInput) {
        searchInput.value = "";
        searchText = "";

        renderNotes();
    }

    if(e.key === "Escape") {
        cancelEdit();
    }

    //textarea 입력중 막는 것.
    const active = document.activeElement;

    if(active === titleInput || active === contentInput) return;

    //삭제 undo. (기본 입력 undo에 영향가지 않게)
    if(e.ctrlKey && e.key.toLowerCase() === "z" && document.activeElement !== contentInput) {
        e.preventDefault();
        if(lastDeletedNote) {
            restoreDeletedNote();
        }
    }

    //다크모드 단축
    if(e.ctrlKey && e.key.toLowerCase() === "d") {
        e.preventDefault();

        currentTheme = currentTheme === "light" ? "dark" : "light";
        applyTheme(currentTheme);

        localStorage.setItem("theme", currentTheme);
        updateThemeButton();
    }

    //export 단축
    if(e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "e") {
        e.preventDefault();
        exportNotes();
    }

    //import 단축
    if(e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") {
        //importInput을 누른 결과를 전달을 해야하는디
        e.preventDefault();
        importInput.click();

        titleInput.focus();
    }
});

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
    try {
        const saved = localStorage.getItem("noteDraft");

        if(!saved) return;

        const draft = JSON.parse(saved);

        titleInput.value = draft.title || "";
        contentInput.value = draft.content || "";
        categorySelect.value = draft.category || "general";
        autoResizeContentarea();
    } catch {
        localStorage.removeItem("noteDraft");
    }
    
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
                
                if (isChanged) {
                    showMessage("메모가 수정되었습니다.");
                }

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
        cancelEditBtn.style.display = "none";
    } else {
        const note = {
            id: Date.now(),
            title,
            content,
            pinned: false,
            category: categorySelect.value,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            expanded: true
        };

        notes.push(note);
        showMessage("메모가 저장되었습니다.");  
    }

    saveNotes();
    renderNotes();

    localStorage.removeItem("noteDraft");
    titleInput.value = "";
    contentInput.value = "";
    categorySelect.value = "general";
    addBtn.textContent = "추가";
    
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
    addBtn.textContent = "수정 완료";
    cancelEditBtn.style.display = "inline-block";

    updateInputCounts();
    updateSaveStatus("✏️ 수정 중...");
    autoResizeContentarea();

    titleInput.focus();
}

function cancelEdit() {
    isEditing = false;
    editingId = null;

    titleInput.value = "";
    contentInput.value = "";
    categorySelect.value = "general";

    addBtn.textContent = "추가";
    cancelEditBtn.style.display = "none";
    localStorage.removeItem("noteDraft");

    showMessage("입력이 취소되었습니다.");
    titleInput.focus();
}

function deleteNote(id) {
    lastDeletedNote = notes.find(note => note.id === id);

    notes = notes.filter(note => note.id !== id);

    if (editingId === id) {
        cancelEdit();
    }
    
    saveNotes();
    renderNotes();
    showMessage(`
        메모가 삭제되었습니다.
        <button class="undo-btn">실행 취소</button>
    `);

    setupUndoHandler();
}

function setupUndoHandler() {
    const undoBtn = document.querySelector(".undo-btn");
    if(undoBtn) {
        undoBtn.addEventListener("click", restoreDeletedNote);
    }

    clearTimeout(undoTimer);
    undoTimer = null;
    undoTimer = setTimeout(() => {
        lastDeletedNote = null;
    }, 3000);
}

function restoreDeletedNote() {
    if(!lastDeletedNote) return;

    notes.push(lastDeletedNote);

    saveNotes();
    renderNotes();

    clearTimeout(undoTimer);

    lastDeletedNote = null;
    showMessage("메모가 복구되었습니다.");
}

function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));

    updateSaveStatus("💾 저장되었습니다.");
}

function saveArchivedNotes() {
    localStorage.setItem("archivedNotes", JSON.stringify(archivedNotes));

    updateSaveStatus("📦 보관함에 추가되었습니다.");
}

function createNoteCard(note) {
    const card = document.createElement("div");
    card.classList.add("note-card");

    const isModified = note.updatedAt !== note.createdAt;

    card.innerHTML = `
        <h3>${note.title || "(제목 없음)"}</h3>

        <p class="note-card-category">카테고리: ${getCategoryLabel(note.category)}</p>

        ${note.expanded ? `<p>${note.content || "(내용 없음)"}</p>` : ""}
        <button class="child-btn expand-btn">${note.expanded ? "접기" : "펼치기"}</button>

        <p class="note-card-date">생성: ${formatDate(note.createdAt)}</p>
        
        ${
            isModified ?
            `<p class="note-card-date modified">✏️ 수정됨: ${formatDate(note.updatedAt)}</p>` :
            ""
        }

        <button class="child-btn pin-btn">${note.pinned ? "★" : "☆"}</button>

        <button class="child-btn edit-btn">수정</button>

        <button class="child-btn duplicate-btn">복제</button>

        <button class="child-btn archive-btn">보관</button>

        <button class="child-btn delete-btn">삭제</button>
    `;

    const delBtn = card.querySelector(".delete-btn");
    delBtn.addEventListener("click", () => deleteNote(note.id));

    const editBtn = card.querySelector(".edit-btn");
    editBtn.addEventListener("click", () => editNote(note));

    const pinBtn = card.querySelector(".pin-btn");
    pinBtn.addEventListener("click", () => togglePin(note.id));

    const expandBtn = card.querySelector(".expand-btn");
    expandBtn.addEventListener("click", () => toggleExpanded(note.id));

    const duplicateBtn = card.querySelector(".duplicate-btn");
    duplicateBtn.addEventListener("click", () => duplicateNote(note.id));

    const archiveBtn = card.querySelector(".archive-btn");
    archiveBtn.addEventListener("click", () => archiveNote(note.id));

    return card;
}

function createArchivedCard(note) {
    const card = document.createElement("div");
    card.classList.add("note-card");

    const isModified = note.updatedAt !== note.createdAt;

    card.innerHTML = `
        <h3>${note.title || "(제목 없음)"}</h3>

        <p class="note-card-category">카테고리: ${getCategoryLabel(note.category)}</p>

        ${note.expanded ? `<p>${note.content || "(내용 없음)"}</p>` : ""}
        <button class="child-btn expand-btn">${note.expanded ? "접기" : "펼치기"}</button>

        <p class="note-card-date">생성: ${formatDate(note.createdAt)}</p>
        
        ${
            isModified ?
            `<p class="note-card-date modified">✏️ 수정됨: ${formatDate(note.updatedAt)}</p>` :
            ""
        }

        <button class="child-btn restore-btn">복구</button>

        <button class="child-btn permanent-delete-btn">영구 삭제</button>
    `;

    const expandBtn = card.querySelector(".expand-btn");
    expandBtn.addEventListener("click", () => archiveToggleExpanded(note.id));

    const restoreBtn = card.querySelector(".restore-btn");
    restoreBtn.addEventListener("click", () => restoreArchivedNote(note.id));

    const permanentDelBtn = card.querySelector(".permanent-delete-btn");
    permanentDelBtn.addEventListener("click", () => permanentDeleteNote(note.id));

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
        renderStatus([]);
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
    const archivedCount = archivedNotes.length;

    noteStatus.textContent = `[${getCategoryIcon(currentCategory)} ${getCategoryLabel(currentCategory)}] 🔄${getSortLabel(currentSort)} `;
    if(currentPin === "pinned" ) {
        noteStatus.textContent += ` 📌 고정 ${filteredNotes.length}개`;
    } else if (currentPin === "normal") {
        noteStatus.textContent += ` 📝 메모 ${filteredNotes.length}개`;
    } else if (currentPin === "all") {
        noteStatus.textContent += ` 📝 메모 ${filteredNotes.length}개 / 📌 고정 ${pinnedCount}개 / 📦 보관 ${archivedCount}개`;
    }
}

function renderArchivedStatus(filteredNotes) {
    noteStatus.textContent = `[${getCategoryIcon(currentCategory)} ${getCategoryLabel(currentCategory)}] 🔄${getSortLabel(currentSort)} 📦 보관 메모 ${filteredNotes.length}개`;
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

function exportNotes() {
    if (!notes.length && !archivedNotes.length) {
        showMessage("저장할 메모가 없습니다.");
        return;
    }

    const isConfirmed = confirm("현재 메모를 내보내시겠습니까?");

    if(!isConfirmed) return;

    const exportData = {
        notes,
        archivedNotes
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {type: "application/json"});

    const url = URL.createObjectURL(blob);

    const date = new Date().toISOString().split("T")[0];
    const a = document.createElement("a");
    a.href = url;
    a.download = `note-${date}.json`;
    a.click();

    URL.revokeObjectURL(url);
    showMessage("메모를 내보냈습니다.");
    updateSaveStatus("📤 내보내기가 완료되었습니다.");
}

function importNotes(e) {
    const file = e.target.files[0];

    if (!file) return;

    const isConfirmed = confirm("현재 메모를 덮어쓰시겠습니까?");

    if (!isConfirmed) {
        importInput.value = "";
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const importedNotes = JSON.parse(event.target.result);

            //importedNote가 객체인지 검증(null도 객체로 판정하기 때문에 함께 검증)
            if(typeof importedNotes !== "object" || importedNotes === null) throw new Error;

            //배열 검증
            if(!Array.isArray(importedNotes.notes)) throw new Error();
            if(!Array.isArray(importedNotes.archivedNotes)) throw new Error();

            //객체 구조 검증
            const notesValid = importedNotes.notes.every(note => {
                return (typeof note === "object" &&
                    note !== null &&
                    typeof note.id === "number" &&
                    typeof note.title === "string" &&
                    typeof note.content === "string"
                );
            });

            const archivedValid = importedNotes.archivedNotes.every(note => {
                return (typeof note === "object" &&
                    note !== null &&
                    typeof note.id === "number" &&
                    typeof note.title === "string" &&
                    typeof note.content === "string"
                );
            });

            if (!notesValid || !archivedValid) throw new Error();

            //기존 메모 덮어쓰기
            notes = importedNotes.notes.map(note => ({
                ...note,
                pinned: note.pinned ?? false,
                category: note.category ?? "general",
                createdAt: note.createdAt ?? note.id,
                updatedAt: note.updatedAt ?? note.createdAt ?? note.id,
                expanded: note.expanded ?? true
            }));

            archivedNotes = importedNotes.archivedNotes.map(note => ({
                ...note,
                pinned: note.pinned ?? false,
                category: note.category ?? "general",
                createdAt: note.createdAt ?? note.id,
                updatedAt: note.updatedAt ?? note.createdAt ?? note.id,
                expanded: note.expanded ?? true
            }));

            isEditing = false;
            editingId = null;
            cancelEditBtn.style.display = "none";
            
            localStorage.removeItem("noteDraft");
            titleInput.value = "";
            contentInput.value = "";
            addBtn.textContent = "추가";

            saveNotes();
            saveArchivedNotes();

            clearActiveButton();
            document.querySelector('[data-pin="all"]').classList.add("active");

            currentView = "notes";
            currentSort = "latest";
            currentCategory = "all";
            currentPin = "all";

            categoryFilter.value = currentCategory;
            sortSelectFilter.value = currentSort;

            localStorage.setItem("currentSort", currentSort);
            localStorage.setItem("currentCategory", currentCategory);
            localStorage.setItem("currentPin", currentPin);
            
            renderNotes();

            showMessage("메모를 불러왔습니다.");
            updateSaveStatus("📂 불러오기가 완료되었습니다.");
        } catch {
            showMessage("올바른 메모 파일이 아닙니다.");
        }

        //같은 파일 재선택 가능
        importInput.value = "";
    };
    reader.readAsText(file);
}

function toggleExpanded(id) {
    notes = notes.map (note => {
        if(note.id === id) {
            return {
                ...note,
                expanded: !note.expanded
            };
        }

        return note;
    });

    saveNotes();
    renderNotes();
}

function archiveToggleExpanded(id) {
    archivedNotes = archivedNotes.map (note => {
        if(note.id === id) {
            return {
                ...note,
                expanded: !note.expanded
            };
        }

        return note;
    });

    saveArchivedNotes();
    renderArchivedNotes();
}

function duplicateNote(id) {
    const originalNote = notes.find(note => note.id === id);

    if(!originalNote) return;

    const duplicateNote = {
        ...originalNote,
        id: Date.now(),
        title: `${originalNote.title} (복사본)`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        expanded: true
    };

    notes.push(duplicateNote);

    saveNotes();
    renderNotes();
}

function archiveNote(id) {
    const targetNote = notes.find(note => note.id === id);

    if(!targetNote) return;

    archivedNotes.push(targetNote);

    notes = notes.filter(note => note.id !== id);

    if(editingId === id) cancelEdit();

    saveNotes();
    saveArchivedNotes();

    renderNotes();
}

function renderArchivedNotes() {
    noteList.innerHTML = "";

    if(!archivedNotes.length) {
        renderArchivedStatus([]);
        renderEmptyMessage("📦 보관된 메모가 없습니다.");
        return;
    }

    const searchedArchivedNotes = filterBySearch(archivedNotes);

    const categoryFilteredArchivedNotes = filterByCategory(searchedArchivedNotes);

    renderArchivedStatus(categoryFilteredArchivedNotes);

    if(!categoryFilteredArchivedNotes.length) {
        renderEmptyMessage("📦 보관된 메모가 없습니다.");
        return;
    }

    const sortedArchivedNotes = sortNotes(categoryFilteredArchivedNotes);

    sortedArchivedNotes.forEach(note => {
        const card = createArchivedCard(note);

        noteList.appendChild(card);
    });
}

function restoreArchivedNote(id) {
    const targetNote = archivedNotes.find(note => note.id === id);

    if(!targetNote) return;

    notes.push(targetNote);

    archivedNotes = archivedNotes.filter(note => note.id !== id);

    saveNotes();
    saveArchivedNotes();

    renderArchivedNotes();
    showMessage("메모가 복구되었습니다.");
}

function permanentDeleteNote(id) {
    archivedNotes = archivedNotes.filter(note => note.id !== id);

    saveArchivedNotes();
    renderArchivedNotes();
    showMessage("메모가 영구 삭제되었습니다.");
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

        //최근 수정순 정렬
        if(currentSort === "updated") {
            return b.updatedAt - a.updatedAt;
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

//Get func
function getCategoryLabel(category) {
    if(category === "general") return "일반";
    if(category === "study") return "공부";
    if(category === "work") return "작업";
    if(category === "idea") return "아이디어";

    return "전체";
}

function getCategoryIcon(category) {
    if(category === "general") return "📝";
    if(category === "study") return "📚";
    if(category === "work") return "💼";
    if(category === "idea") return "💡";

    return "📂";
}

function getSortLabel(sort) {
    if(sort === "latest") return "최신순";
    if(sort === "oldest") return "오래된순";
    if(sort === "title") return "제목순";
    if(sort === "updated") return "최근 수정순";
}

//Date func
function formatDate(timestamp) {
    const date = new Date(timestamp);

    return date.toLocaleString();
}

//App message func
function showMessage(message) {
    clearTimeout(messageTimer);

    appMessage.innerHTML = message;
    appMessage.classList.add("show");

    messageTimer = setTimeout(() => {
        appMessage.classList.remove("show");
        setTimeout(() => {appMessage.innerHTML = ""}, 2000);
    }, 3000);
}

//Save Status func
function updateSaveStatus(message) {
    const time = new Date().toLocaleTimeString();

    saveStatus.textContent = `${message} (${time})`;
}

//btn active func
function clearActiveButton() {
    pinButtons.forEach(btn => {
        btn.classList.remove("active");
    });

    archiveViewBtn.classList.remove("active");
}

//홈페이지 실행 즉시 보여져야 하는 것.
document.querySelector('[data-pin="all"]').classList.add("active");

currentSort = localStorage.getItem("currentSort") || "latest";
sortSelectFilter.value = currentSort;

currentCategory = localStorage.getItem("currentCategory") || "all";
categoryFilter.value = currentCategory;

currentPin = localStorage.getItem("currentPin") || "all";
clearActiveButton();
const activePinButton = document.querySelector(`[data-pin="${currentPin}"]`);
if(activePinButton) activePinButton.classList.add("active");

applyTheme(currentTheme);
updateThemeButton();
loadDraft();
updateInputCounts();
autoResizeContentarea();
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
 * ★수정 버튼을 누르고 취소 버튼도 고려할 것.
 */

/* 22일차
 * 메모 글자수 제한 표기.
 * content 말고도 title 쪽도 줄바꿈이 이루어지면 좋을 것 같으나, 이렇게 하려면 고려될 지점이 많아질 것 같아 보류.
 */

/* 24일차
 * setTimeout()     : 예약. 일정 시간이 지난 뒤, 함수를 실행 예약하는 함수. setTimeout(실행할 함수, 시간(ms));
 *                    console.log(A), setTimeout(() => { console.log("B");}, 1000), console.log("C")가 있다면, A C B 순서로 출력.
 *                    timeout id를 반환. 나중에 취소하기 위해서 반환된다.
 * clearTimeout()   : 예약 취소. 예약된 setTimeout 실행 취소. 인자로 'id'를 넣어야 한다.
 */

/* 25일차
 *  clearTimeout(undoTimer);                                            : 기존 타이머 취소. 삭제를 반복하면 이전 타이머가 살아있을 수 있기 때문.
 *                                                                        이러한 제거가 이루어지지 않으면 lastDeletedNote = null이 예상치 못한 시점에 실행될 수 있음.
 *  undoTimer = null;                                                   : 현재 타이머 변수 초기화. 사실 필요없지만, 명확한 표현을 위해 추가.
 *  undoTimer = setTimeout(() => { lastDeletedNote = null; }, 2000);    : 2초 뒤에 lastDeletedNote를 제거하는 새 타이머 생성
 *                                                                        타이머 ID를 저장한 뒤, 복구된 시점에서 clearTimeout(undoTimer)할 수 있음.
 */

/* 26일차
 * const json = JSON.stringify(notes, null, 2); : 배열에서 JSON 문자열 반환.
 *                                                null, 2 옵션: 가독성
 * new Blob(...)                                : 파일처럼 다룰 수 있는 데이터 생성.
 * URL.createObjectURL(blob)                    : 브라우저 내부 임시 파일 URL 생성.
 * a.download = "notes.json";                   : 다운로드 파일 이름 지정.
 * URL.revokeObjectURL(url);                    : 임시 URL 정리.
 * new Date().toLocaleDateString()              : 현재 날짜를 사용자가 읽기 쉬운 날짜 문자열로 변환.
 *                                                new Date().toISOString().split("T")[0]을 이용해서 날짜를 표기하는 것도 가능.
 *                                                      .split("T")의 결과는 배열. [0]은 해당 결과의 첫 번째 요소를 가져오는 것.
 *                                                      ex: 2026-04-04T12:30:00.000Z의 결과에서 T 아래로를 모두 잘라내, 날짜 부분만 가져오는 형식.
 * 
 * 차후 export 전에 confirm 문구('내보내시겠습니까?' 문구) 출력도 고민해볼 것.
 */

/* 27일차
 * 파일 불러오기.
 * const file = e.target.files[0];  : 선택한 첫 번째 파일
 * new FileReader()                 : 파일 내용을 읽는 객체
 * reader.readAsText(file)          : 파일 > 문자열 변환
 * JSON.parse(...)                  : 문자열 > 배열/객체 복원
 * 파일 선택 > 파일 읽기 > 문자열 획득 > JSON.parse > notes 복원 > localStorage 저장 > render
 * 
 * "id" in note &&                  : note 객체 안에 id 속성이 존재하는지 확인. 값이 존재하기만 하면 통과된다.
 * typeof note.id === "number"      : note 객체 안의 id 속성이 '숫자' 속성인지 검사. 속성이 동일해야 통과된다.
 * 
 * import 전 자동 백업 고려, import 성공시 메모 수 표시 고려.
 */

/* 28일차
 * 현재 상태 표기.
 * renderStatus([]);    : 생성했던 함수가 받는 인자가 배열.
 *                        notes.filter(...)도 새로운 배열을 결과로 전달함. 원본 배열을 수정하지는 않는다.
 *                        빈 배열도 배열로 간주하기 때문에 오류가 나지 않고, 비어있는 결과만 보여줄 수 있다. undefined와는 다르다.
 * 
 * 안내 문구를 잠깐 띄웠다가 다시 없애는 것도 고려할 것. (텍스트 애니메이션)
 */

/* 29일차
 * 단축키 지정.
 * e.preventDefault();  : 브라우저의 기본 동작을 막는 함수. '기본 행동 취소'.
 * importInput.click(); : 사용자 액션으로만 열 수 있는 것을 강제로 클릭시키는 것.
 * 
 * ★단축키 목룍 표시하는 것도 고려해볼 것.
 */

/* 31일차
 * 카테고리 고정/일반에 따라 메모 수 달리 보이게 설정
 * 수정 버튼 누르고 수정 취소 버튼 생성
 */

/* 32일차
 * 메모 카드 접기/펼치기 + 최근 수정순 정렬
 * 
 * ★메모 내용 복사 기능도 고려해볼 것.
 */

/* 33일차
 * 메모 복제 기능
 * 단축키 버튼 생성
 * 카테고리 표기 변경
 * 
 * 버튼 누르고나서 '진짜 하겠습니까?' 하는 창 띄우는 것도 고려해볼 것.
 */

/* 34일차
 * 보관함(아카이브) 기능.
 * 보관함에 넣고 > 복구 or 완전삭제
 */

/* 35일차
 * 보관함에 들어간 메모 수 표시. / import, export 시, 보관함이 작동하는지 확인.
 * ★보관함 카테고리를 어떻게 해결할 것인지 확인 필요.
 * ★나중에 보관함은 전체/고정/일반에서 뜯어서 관리하는 게 낫다.
 * 
 * if(typeof importedNotes !== "object" || importedNotes === null) throw new Error;     : importedNotes가 객체인지, 그리고 null은 아닌지 확인하는 것.
 *                                                                                        typeof로 importedNote의 값 타입을 문자열로 반환한다.
 *                                                                                        js에서는 typeof null이 object으로 표현된다. 따라서 null을 따로 검사해야 한다.
 */

/* 36일차
 * 보관함 카테고리 오류 해결
 * 상태바 (전체 카테고리 메모 n개 고정 n개) 수정. '전체 카테고리 메모 n개 고정 n개 보관 n개'로 표시됨
 * export 시 comfirm 문구가 나오도록 설정.
 * 사용하지 않는 함수 제거(showNotesView())
 * import 시, expanded: note.expanded ?? true 설정을 추가
 * archiveNote()에서 수정 취소시의 동작 수정.
 */

/* 38일차
 * 상태 메시지 통일 '메모가'로 시작하도록 통일
 * 상태바에 현재 정렬순 표기
 * 정렬 기준 오류(보관함에서 정렬 기준을 바꾸면 보관함 바깥으로 나와지는 현상) 해결
 */

/* 39일차
 * currentSort, currentCategory, currentPin 고정. (설정값 고정)
 * renderArchivedNotes() 안에 있던 오류 수정.
 * 
 * 수정 중 새로고침하면 '수정되던 것'에서 빠져나와서 새 메모로 간주됨. 해결해야 할지 말아야 할지 확인.
 */
