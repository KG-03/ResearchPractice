//===== Today =====
const today = document.querySelector(".today");

//===== Calendar =====
const calendarGrid = document.querySelector(".calendar-grid");
const currentDateText = document.querySelector(".current-date-text");
const weekRow = document.querySelector(".week-row");
const prevMonthBtn = document.querySelector(".prev-month-btn");
const nextMonthBtn = document.querySelector(".next-month-btn");

//===== Input ======
const titleInput = document.querySelector(".title-input");
const categorySelect = document.querySelector(".category-select");
const prioritySelect = document.querySelector(".priority-select");
const descriptionInput = document.querySelector(".description-input");
const addBtn = document.querySelector(".add-btn");
const cancelEditBtn = document.querySelector(".cancel-edit-btn");
const selectedDate = document.querySelector(".selected-date");

//===== Filter =====
const searchInput = document.querySelector(".search-input");
const categoryFilter = document.querySelector(".category-filter");
const priorityFilter = document.querySelector(".priority-filter");
const completedFilter = document.querySelector(".completed-filter");
const sortFilter = document.querySelector(".sort-filter");

//===== List =====
const scheduleList = document.querySelector(".schedule-list");

const statsList = document.querySelector(".stats-list");

//===== Storage =====
const exportBtn = document.querySelector(".export-btn");
const importBtn = document.querySelector(".import-btn");
const importInput = document.querySelector(".import-input");

//===== Toast =====
const toast = document.querySelector(".toast");

//===== theme =====
const themeToggleBtn = document.querySelector(".theme-toggle-btn");


const CATEGORY_OPTIONS = {
    study: "공부",
    work: "업무",
    personal: "개인",
    exercise: "운동",
    etc: "기타"
};

const PRIORITY_OPTIONS = {
    high: "높음",
    medium: "보통",
    low: "낮음"
};

const WEEK_NAMES = [ "일", "월", "화", "수", "목", "금", "토" ];

const PRIORITY_VALUE = {
    high: 3,
    medium: 2,
    low: 1
};


let schedules = JSON.parse(localStorage.getItem("schedules")) || [];

const todayDate = new Date();
let currentDateData = new Date();
let selectedDateData = null;

let currentCategory = "all";
let currentPriority = "all";
let currentCompleted = "all";
let currentSort = "latest";
let currentKeyword = "";
let currentCell = null;

let isEditing = false;
let editingId = null;

let toastTimer = null;


prevMonthBtn.addEventListener("click", () => {
    currentDateData.setMonth(currentDateData.getMonth() - 1);

    if(currentCell) resetCell();
    renderCalendar();
});

nextMonthBtn.addEventListener("click", () => {
    currentDateData.setMonth(currentDateData.getMonth() + 1);

    if(currentCell) resetCell();
    renderCalendar();
});

addBtn.addEventListener("click", () => {
    if(!selectedDateData) {
        alert("날짜를 선택해 주십시오.");
        return;
    }

    if (isEditing) {
        updateSchedule();
    } else {
        addSchedule();
    }
});

cancelEditBtn.addEventListener("click", cancelEdit);

categoryFilter.addEventListener("change", () => {
    currentCategory = categoryFilter.value;
    renderSchedules();
});

priorityFilter.addEventListener("change", () => {
    currentPriority = priorityFilter.value;
    renderSchedules();
});

completedFilter.addEventListener("change", () => {
    currentCompleted = completedFilter.value;
    renderSchedules();
});

searchInput.addEventListener("input", () => {
    currentKeyword = searchInput.value.trim().toLowerCase();
    renderSchedules();
});

sortFilter.addEventListener("change", () => {
    currentSort = sortFilter.value;
    renderSchedules();
});

exportBtn.addEventListener("click", exportCSV);

importBtn.addEventListener("click", () => {
    importInput.click();
});

importInput.addEventListener("change", importCSV);

descriptionInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter") {
        e.preventDefault();
    }

});


function addSchedule() {
    if(!selectedDateData) return;

    const title = titleInput.value.trim();

    if(title === "") {
        alert("제목을 입력해 주십시오.");
        return;
    }

    const category = categorySelect.value;
    const priority = prioritySelect.value;
    const description = descriptionInput.value.trim();

    const schedule = {
        id: Date.now(),
        title,
        category,
        priority,
        description,
        date: selectedDateData.getTime(),
        completed: false,
        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    schedules.push(schedule);

    refreshSchedules();
    resetScheduleForm();
    titleInput.focus();

    showToast("일정이 추가되었습니다.");
}

function startEdit(id) {
    const editSchedule = schedules.find(schedule => schedule.id === id);

    if(!editSchedule) return;

    isEditing = true;
    editingId = id;

    titleInput.value = editSchedule.title;
    categorySelect.value = editSchedule.category;
    prioritySelect.value = editSchedule.priority;
    descriptionInput.value = editSchedule.description;

    addBtn.textContent = "수정 완료";
    cancelEditBtn.style.display = "inline-block";

    titleInput.focus();
}

function updateSchedule() {
    const editSchedule = schedules.find(schedule => schedule.id === editingId);

    if(!editSchedule) return;

    editSchedule.title = titleInput.value.trim();

    if(editSchedule.title === "") {
        alert("제목을 입력해 주십시오.");
        return;
    }

    editSchedule.category = categorySelect.value;
    editSchedule.priority = prioritySelect.value;
    editSchedule.description = descriptionInput.value.trim();
    editSchedule.date = selectedDateData.getTime();
    editSchedule.updatedAt = Date.now();

    isEditing = false;
    editingId = null;

    refreshSchedules();
    resetScheduleForm();

    titleInput.focus();

    showToast("일정이 수정되었습니다.");
}

function cancelEdit() {
    isEditing = false;
    editingId = null;

    resetScheduleForm();
    titleInput.focus();

    showToast("수정이 취소되었습니다.");
}

function deleteSchedule(id) {
    if(!confirmMessage("정말 삭제하시겠습니까?")) return;

    schedules = schedules.filter(schedule => schedule.id !== id);

    refreshSchedules();

    showToast("일정이 삭제되었습니다.");
}

function saveSchedules() {
    localStorage.setItem("schedules", JSON.stringify(schedules));
}

function createScheduleCard(schedule) {
    const card = document.createElement("div");
    card.classList.add("schedule-card");

    if(schedule.completed) {
        card.classList.add("completed");
    }

    const header = document.createElement("div");
    header.classList.add("card-header");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = schedule.completed;
        checkbox.addEventListener("change", () => {
            checkboxToggle(schedule, checkbox);

            if(schedule.completed) {
                card.classList.add("completed");
            } else {
                card.classList.remove("completed");
            }

            renderSchedules();
        });
        header.append(checkbox);    
    
        const title = document.createElement("h4");
        title.textContent = `${schedule.title}`;
        header.append(title);

    card.append(header);

    const classification = document.createElement("div");
    classification.classList.add("card-classification");

        const category = document.createElement("p");
        category.textContent = `카테고리: ${CATEGORY_OPTIONS[schedule.category]}`;
        classification.append(category);
        
        const priority = document.createElement("p");
        priority.textContent = `우선순위: ${PRIORITY_OPTIONS[schedule.priority]}`;
        classification.append(priority);

    card.append(classification);

    if(schedule.description) {
        const description = document.createElement("p");
        description.textContent = `${schedule.description}`;
        card.append(description);
    }

    const date = document.createElement("p");
    date.classList.add("card-date-text");
    date.textContent = `생성일: ${formatDate(schedule.createdAt)}`;
    if(schedule.createdAt !== schedule.updatedAt) {
        date.textContent += `\n수정일: ${formatDate(schedule.updatedAt)}`;
    }
    card.append(date);
   
    const editBtn = document.createElement("button");
    editBtn.textContent = "✎ 수정";
    editBtn.addEventListener("click", () => {
        startEdit(schedule.id);
    })
    card.append(editBtn);

    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑 삭제"
    delBtn.addEventListener("click", () => {
        deleteSchedule(schedule.id);
    });
    card.append(delBtn);

    return card;
}

function checkboxToggle(schedule, checkbox) {
    schedule.completed = checkbox.checked;
    saveSchedules();
}

//===== Render ======
function renderCalendar() {
    calendarGrid.innerHTML = "";
    weekRow.innerHTML = "";

    const year = currentDateData.getFullYear();
    const month = currentDateData.getMonth();
    
    currentDateText.textContent = `${year}년 ${String(month + 1).padStart(2, "0")}월`;
    
    WEEK_NAMES.forEach(day => {
        const cell = document.createElement("div");
        cell.textContent = day;

        weekRow.append(cell);
    });

    const lastDate = new Date(year, month + 1, 0).getDate();

    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay();

    for(let i = 0; i < firstDayOfWeek; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.classList.add("empty-cell");
        calendarGrid.append(emptyCell);
    }

    for (let date = 1; date <= lastDate; date++) {
        const dateCell = document.createElement("div");
        dateCell.classList.add("date-cell");

            const dateNumber = document.createElement("span");
            dateNumber.textContent = date;
            dateCell.append(dateNumber);

            const countSchedule = schedules.filter(schedule => {
                const scheduleDate = new Date(schedule.date);

                return scheduleDate.getFullYear() === year &&
                    scheduleDate.getMonth() === month &&
                    scheduleDate.getDate() === date;
            }).length;

            if (countSchedule > 0) {
                const badge = document.createElement("span");
                badge.classList.add("count-schedule");
                badge.textContent = countSchedule;
                dateCell.append(badge);
            }

        dateCell.addEventListener("click", () => {
            selectCalendarCell(dateCell, year, month, date);
        });
        calendarGrid.append(dateCell);

        if(year === todayDate.getFullYear() &&
        month === todayDate.getMonth() &&
        date === todayDate.getDate()) {
            dateCell.classList.add("today-cell");
        }
    }
}

function renderSchedules() {
    scheduleList.innerHTML = "";
    statsList.innerHTML = "";

    if(!selectedDateData) {
        scheduleList.textContent = "날짜를 선택해 주세요.";
        return;
    }

    let filteredSchedule = [...schedules];

    if(!schedules.length) {
        scheduleList.textContent = `📅 등록된 일정이 아무 것도 없습니다.
            달력에서 날짜를 선택해서 새 일정을 등록해 보세요.`;
        return;
    }

    filteredSchedule = filterByDate(filteredSchedule);

    filteredSchedule = filterByCategory(filteredSchedule);

    filteredSchedule = filterByPriority(filteredSchedule);

    filteredSchedule = filterByCompleted(filteredSchedule);

    filteredSchedule = filterByKeyword(filteredSchedule);

    filteredSchedule = sortSchedules(filteredSchedule);

    if(filteredSchedule.length === 0 &&
        currentCategory === "all" &&
        currentPriority === "all" &&
        currentCompleted === "all" &&
        currentKeyword === "") {
        scheduleList.textContent = `📅 오늘 날짜에 등록된 일정이 없습니다. 새 일정을 등록해 보세요.`;
        return;
    } else if (filteredSchedule.length === 0 && currentCategory !== "all") {
        scheduleList.textContent = `📅 해당 카테고리에 해당하는 일정이 없습니다.`;
        return;
    } else if (filteredSchedule.length === 0 && currentPriority !== "all") {
        scheduleList.textContent = `📅 해당 우선순위에 해당하는 일정이 없습니다.`;
        return;
    } else if (filteredSchedule.length === 0 && currentCompleted !== "all") {
        scheduleList.textContent = `📅 해당 완료 상황에 해당하는 일정이 없습니다.`;
        return;
    } else if (filteredSchedule.length === 0 && currentCompleted !== "all") {
        scheduleList.textContent = `📅 해당 완료 상황에 해당하는 일정이 없습니다.`;
        return;
    } else if (filteredSchedule.length === 0 &&  currentKeyword !== "") {
        scheduleList.textContent = `📅 해당 키워드에 해당하는 일정이 없습니다.`;
        return;
    }
    
    filteredSchedule.forEach(schedule => {
        scheduleList.append(createScheduleCard(schedule));
    });

    renderStatistics(filteredSchedule);
}

function renderTodaysDate() {
    const year = todayDate.getFullYear();
    const month = String(todayDate.getMonth() + 1).padStart(2, "0");
    const day = String(todayDate.getDate()).padStart(2, "0");
    today.innerHTML = `Today: ${year}년 ${month}월 ${day}일`;
}

function renderStatistics(schedule) {
    let completeStats = 0;
    let uncompleteStats = 0;

    let studyStats = 0;
    let workStats = 0;
    let personalStats = 0;
    let exerciseStats = 0;
    let etcStats = 0;

    schedule.forEach(scheduleStats => {
        if(scheduleStats.completed === true) {
            completeStats++;
        } else {
            uncompleteStats++;
        }

        switch(scheduleStats.category) {
            case "study":
                studyStats++;
                break;
            case "work":
                workStats++;
                break;
            case "personal":
                personalStats++;
                break;
            case "exercise":
                exerciseStats++;
                break;
            case "etc":
                etcStats++;
                break;
        }
    });

    statsList.innerHTML = "";
    statsList.classList.add("statistics-area");

    renderStatisticsSection("전체 일정", completeStats + uncompleteStats);
    renderStatisticsSection("완료", completeStats);
    renderStatisticsSection("미완료", uncompleteStats);
    renderStatisticsSection("공부", studyStats);
    renderStatisticsSection("업무", workStats);
    renderStatisticsSection("개인", personalStats);
    renderStatisticsSection("운동", exerciseStats);
    renderStatisticsSection("기타", etcStats);
    
}

function renderStatisticsSection(title, count) {
    const stats = document.createElement("p");
    stats.textContent = `${title} : ${count}`;
    stats.classList.add("statistics-box");
    statsList.append(stats);
}

function selectCalendarCell(cell, year, month, date) {
    if (currentCell) {
        currentCell.classList.remove("click-cell");
    }

    currentCell = cell;
    currentCell.classList.add("click-cell");

    selectedDateData = new Date(year, month, date);
    selectedDate.textContent = `선택 날짜: ${year}년 ${month + 1}월 ${date}일`;

    renderSchedules();
}

//===== Reset =====
function resetCell() {
    if(!currentCell) return; 
    
    currentCell.classList.remove("click-cell");

    selectedDateData = null;
    currentCell = null;
    
    selectedDate.textContent = `선택 날짜:`

    renderSchedules();
}

function resetScheduleForm() {
    titleInput.value = "";
    descriptionInput.value = "";
    categorySelect.value = "study";
    prioritySelect.value = "high";

    addBtn.textContent = "✓ 추가";
    cancelEditBtn.style.display = "none";
}

//===== Filter =====
function filterByDate(filteredSchedule) {
    return filteredSchedule.filter(schedule => schedule.date === selectedDateData.getTime());
}

function filterByCategory(filteredSchedule) {
    if(currentCategory !== "all") {
        filteredSchedule = filteredSchedule.filter(schedule => schedule.category === currentCategory);
    }

    return filteredSchedule;
}

function filterByPriority(filteredSchedule) {
    if(currentPriority !== "all") {
        filteredSchedule = filteredSchedule.filter(schedule => schedule.priority === currentPriority);
    }
    return filteredSchedule;
}

function filterByCompleted(filteredSchedule) {
    if(currentCompleted === "completed") {
        filteredSchedule = filteredSchedule.filter(schedule => schedule.completed);
    } else if (currentCompleted === "uncompleted") {
        filteredSchedule = filteredSchedule.filter(schedule => !schedule.completed);
    }

    return filteredSchedule;
}

function filterByKeyword(filteredSchedule) {
    if(currentKeyword === "") return filteredSchedule;

    return filteredSchedule.filter(schedule => {
        const titleMatch = (schedule.title || "").toLowerCase().includes(currentKeyword);
        const descriptionMatch = (schedule.description || "").toLowerCase().includes(currentKeyword);

        return titleMatch || descriptionMatch;
    });
}

function sortSchedules(filteredSchedule) {
    return [...filteredSchedule].sort((a,b) => {
        if(b.completed !== a.completed) {
            return a.completed - b.completed;
        }

        switch(currentSort) {
            case "latest":
                return b.createdAt - a.createdAt;
                break;

            case "oldest":
                return a.createdAt - b.createdAt;
                break;

            case "priority-desc":
                return PRIORITY_VALUE[b.priority] - PRIORITY_VALUE[a.priority];
                break;

            case "priority-asc":
                return PRIORITY_VALUE[a.priority] - PRIORITY_VALUE[b.priority];
                break;
        }

        return 0;
    })
}

//===== Storage(CSV) =====
function exportCSV() {
    if(!schedules.length) {
        alert("내보낼 일정이 없습니다.");
        return;
    }

    const rows = [
        [
            "id",
            "title",
            "category",
            "priority",
            "description",
            "date",
            "completed",
            "createdAt",
            "updatedAt"
        ]
    ];

    schedules.forEach(schedule => {
        rows.push([
            schedule.id,
            escapeCSV(schedule.title),
            escapeCSV(schedule.category),
            escapeCSV(schedule.priority),
            escapeCSV(schedule.description),
            schedule.date,
            schedule.completed,
            schedule.createdAt,
            schedule.updatedAt
        ])
    });

    const csv = "\uFEFF" + rows.map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `schedule-${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, "0")}-${String(todayDate.getDate()).padStart(2, "0")}.csv`;
    a.click();

    URL.revokeObjectURL(url);

    showToast("CSV를 내보냈습니다.")
}

function escapeCSV(value) {
    return `"${String(value ?? "")
        .replace(/\r\n/g, "\\n")
        .replace(/\n/g, "\\n")
        .replace(/"/g, '""')}"`
}

function importCSV(event) {
    const file = event.target.files[0];

    if(!file) {
        alert("파일이 선택되지 않았습니다.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        const csv = e.target.result;

        const lines = csv.split("\n");
        lines.shift();

        if (!validateCSV(lines)) {
            return;
        }

        const importedSchedules = [];

        lines.forEach(line => {
            if(!line.trim()) return;

            const values = line.split(",");

            importedSchedules.push({
                id: Number(values[0]),
                title: unescapeCSV(values[1]),
                category: unescapeCSV(values[2]),
                priority: unescapeCSV(values[3]),
                description: unescapeCSV(values[4]),
                date: Number(values[5]),
                completed: values[6] === "true",
                createdAt: Number(values[7]),
                updatedAt: Number(values[8])
            });
        });

        schedules = importedSchedules;

        refreshSchedules();
    };

    reader.readAsText(file, "utf-8");

    showToast("CSV를 불러왔습니다.")
}

function unescapeCSV(value) {
    value = value.trim();

    if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
    }

    return value
        .replace(/""/g, '"')
        .replace(/\\n/g, "\n");
}

function validateCSV(lines) {
    for (const line of lines) {
        if (!line.trim()) continue;

        const values = line.split(",");

        if (values.length !== 9) {
            alert("CSV 형식이 올바르지 않습니다.");
            return false;
        }

        if (!values[0].trim()) {
            alert("ID가 비어 있습니다.");
            return false;
        }

        if (isNaN(Number(values[0]))) {
            alert("ID 형식이 잘못되었습니다.");
            return false;
        }

        if (!values[1].trim()) {
            alert("제목이 비어 있습니다.");
            return false;
        }

        if (!(unescapeCSV(values[2]) in CATEGORY_OPTIONS)) {
            alert("카테고리 값이 올바르지 않습니다.");
            return false;
        }

        if (!(unescapeCSV(values[3]) in PRIORITY_OPTIONS)) {
            alert("우선순위 값이 올바르지 않습니다.");
            return false;
        }

        if (isNaN(Number(values[5]))) {
            alert("날짜 형식이 올바르지 않습니다.");
            return false;
        }

        const completed = values[6].trim().toLowerCase();
        if (completed !== "true" && completed !== "false") {
            alert("완료 여부 값이 올바르지 않습니다.");
            return false;
        }

        if (isNaN(Number(values[7]))) {
            alert("createdAt 값이 올바르지 않습니다.");
            return false;
        }

        if (isNaN(Number(values[8]))) {
            alert("updatedAt 값이 올바르지 않습니다.");
            return false;
        }
    }

    return true;
}

//===== ETC =====
function formatDate(timestamp) {
    if(!timestamp) return "";

    const date = new Date(timestamp);

    return date.toLocaleString("ko-KR");
}

function confirmMessage(message) {
    return confirm(message);
}

function preventComma(input) {
    input.addEventListener("keydown", (e) => {
        if(e.key === ",") {
            alert("쉼표(,)는 사용할 수 없습니다.");
            e.preventDefault();
        }
    });

    input.addEventListener("input", () => {
        input.value = input.value.replace(/,/g, "");
    });
}

function refreshSchedules() {
    saveSchedules();
    renderCalendar();
    renderSchedules();
}

function showToast(message) {
    clearTimeout(toastTimer);

    toast.innerHTML = message;
    toast.classList.add("show");

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => { toast.innerHTML = ""; }, 2000);
    }, 3000);
}


preventComma(titleInput);
preventComma(descriptionInput);

renderTodaysDate();
renderCalendar();
renderSchedules();

/* 5일차
 * getTime()    : 해당 날짜와 시간을 n년 n월 n일 00:00:00 UTC부터 지난 시간을 밀리초로 반환하는 함수.
 *                Date 객체를 저장해도 JSON으로 저장하면 문자열이 된다.
 *                따라서 해당 방식으로 저장하여 차후 new Date(schedule.date)처럼 쓸 수 있도록 한다. (새 Date 객체를 만들기 위해)
 */

/* 7일차
 * forEach()    : 반환값이 없다는 것을 기억할 것.
 *                따라서 a = a.forEach(...)를 사용하면 a에 무슨 값이 있었든 undefine이 된다.
 */

/* 12일차
 * \uFEFF       : \u는 유니코드 문자라는 의미. FEFF는 16진수 4자리 코드로, BOM(Byte Order Mark), UTF-8 파일 앞에 붙이는 경우가 많다.
 *                  BOM     : 이 파일이 어떤 문자 인코딩으로 저장되어 있는지를 알려주는 표시.
 *                            CSV에서 엑셀이 한글을 올바르게 읽도록 할 때 자주 사용한다.
 * 
 * join()       : 배열의 메서드. 배열의 모든 요소를 하나의 문자열로 합치는 함수.
 *                '배열.join("구분자")'와 같은 형태.
 *                const arr = ["A", "B", "C"]; 일 때, arr.join(",")으로 하면 "A,B,C"가 된다.
 *                중첩되어 사용하는 지금의 경우, "이름,나이",\n"김철수,20",\n"이영희,25"와 같은 형식이 된다.
 * 
 * `"${String(value).replace(/"/g, '""')}"`     : replace()는 문자열의 일부를 다른 문자열로 바꾸는 함수.
 *                                                '/"/g'의 경우, '/찾을내용/옵션'의 형식. g는 globel으로, 
 *                                                  해당 수식은 문자열 안의 "를 찾는데, 모든 따옴표를 대상으로 한다는 의미.
 *                                                '""'는 큰따옴표 두 개짜리 문자열을 의미.
 *                                                replace(/"/g, '""')는 모든 문자열의 "를 대상으로 "를 ""으로 바꾼단 의미다.
 *                                                저장될 때 "a" 형식으로 저장되는데, "안녕하세요 "저"입니다"와 같이 저장되면 문자열이 끝난 것으로 오해할 수 있기 때문.
 *                                                  따라서 "안녕하세요 ""저""입니다"로 저장하는 것.
 */

/* 13일차
 * .replace(/\r\n/g, "\\n")     : Windows 줄바꿈. /\r\n/g는 'Windows의 줄바꿈을 모두 찾는다'라는 의미. 찾아서 문자 "\n"으로 변환.
 * .replace(/\n/g, "\\n")       : Unix 줄바꿈. /\n/g는 'Unix, Liunx, MacOS의 줄바꿈을 모두 찾는다'라는 의미. 찾아서 문자 "\n"으로 변환.
 * 
 * .replace(/""/g, '"')         : 큰 따옴표 두 개를 큰 따옴표 하나로 바꾼다는 의미.
 *                                저장할 때 "이것"을 ""이것""으로 저장했다가, 다시 불러올 때 "이것"으로 불러내기 위해서 사용.
 * .replace(/\\n/g, "\n");      : 문자 두 개 \와 n을 실제 줄바꿈 문자로 바꾼다는 의미. \\n와 \n은 다르기 때문.
 *                                \n은 줄바꿈이 이루어지지만, \\n은 줄바꿈이 이루어지지 않는다.
 * 
 * if (value.startsWith('"') && value.endsWith('"')) {
 *      value = value.slice(1, -1);
 *  }
 *      : startsWith()  : 문자열이 특정 문자열로 시작하는지 확인.
 *        endsWith()    : 문자열이 특정 문자열로 끝나는지 확인.
 *        slice(1, -1)  : 문자열의 앞과 뒤의 문자를 잘라낸다. slice(인덱스의 1부터 시작해서, 마지막 글자는 제외)한다는 의미.
 */

/* 14일차
 * for (const line of lines)    : lines 배열의 첫 번째 줄을 가져와서 검사 후, 검사가 끝나면 두 번째 줄을 가져와서 검사.
 *                                lines 배열의 요소를 하나씩 꺼내어 line에 넣고, 처음부터 끝까지 반복하는 문법.
 *                                for...of는 배열을 처음부터 끝까지 순회하면서 각 요소를 하나씩 꺼내서 처리하는 반복문.
 */
