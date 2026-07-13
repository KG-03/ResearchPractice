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
const sortSelect = document.querySelector(".sort-select");

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
    addSchedule();
});


function addSchedule() {
    if(!selectedDateData) return;

    const title = titleInput.value.trim();

    if(title === "") return;

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
    saveSchedules();
    renderSchedules();

    resetScheduleForm();
    titleInput.focus();
}

function startEdit(id) {

}

function updateSchedule() {

}

function deleteSchedule(id) {

}

function saveSchedules() {
    localStorage.setItem("schedules", JSON.stringify(schedules));
}

function createScheduleCard(schedule) {
    const card = document.createElement("div");
    card.classList.add("schedule-card");

    const title = document.createElement("p");
    title.textContent = `제목: ${schedule.title}`;
    card.append(title);

    const category = document.createElement("p");
    category.textContent = `카테고리: ${CATEGORY_OPTIONS[schedule.category]}`;
    card.append(category);
    
    const priority = document.createElement("p");
    priority.textContent = `우선순위: ${PRIORITY_OPTIONS[schedule.priority]}`;
    card.append(priority);
    
    const description = document.createElement("p");
    description.textContent = `메모: ${schedule.description}`;
    card.append(description);
   
    const delBtn = document.createElement("button");
    delBtn.textContent = "삭제"
    delBtn.addEventListener("click", () => {
        deleteSchedule(schedule.id);
    });
    card.append(delBtn);
   
    const editBtn = document.createElement("button");
    editBtn.textContent = "수정";
    editBtn.addEventListener("click", () => {
        startEdit(schedule.id);
    })
    card.append(editBtn);

    return card;
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
        dateCell.textContent = date;
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

    if(!selectedDateData) {
        scheduleList.textContent = "날짜를 선택해 주세요.";
        return;
    }

    let filteredSchedule = [...schedules];

    if(filteredSchedule.length === 0) return;

    let hasSchedule = false;

    filteredSchedule.forEach(schedule => {
        if(schedule.date !== selectedDateData.getTime()) return;

        hasSchedule = true;
        scheduleList.append(createScheduleCard(schedule));
    });

    if(!hasSchedule) {
        scheduleList.textContent = "등록된 일정이 없습니다."
    }
}

function renderTodaysDate() {
    const year = todayDate.getFullYear();
    const month = String(todayDate.getMonth() + 1).padStart(2, "0");
    const day = String(todayDate.getDate()).padStart(2, "0");
    today.innerHTML = `Today: ${year}년 ${month}월 ${day}일`;
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
}

//===== Filter =====
function renderCategoryFilter() {

}

function renderPriorityFilter() {

}

function renderCompletedFilter() {

}

renderTodaysDate();
renderCalendar();
renderSchedules();

/* 5일차
 * getTime()    : 해당 날짜와 시간을 n년 n월 n일 00:00:00 UTC부터 지난 시간을 밀리초로 반환하는 함수.
 *                Date 객체를 저장해도 JSON으로 저장하면 문자열이 된다.
 *                따라서 해당 방식으로 저장하여 차후 new Date(schedule.date)처럼 쓸 수 있도록 한다. (새 Date 객체를 만들기 위해)
 */
