//===== Today =====
const today = document.querySelector(".today");

//===== Calendar =====
const calendarGrid = document.querySelector(".calendar-grid");
const currentDateText = document.querySelector(".current-date-text");
const weekRow = document.querySelector(".week-row");

//===== Input ======
const titleInput = document.querySelector(".title-input");
const categorySelect = document.querySelector(".category-select");
const prioritySelect = document.querySelector(".priority-select");
const descriptionInput = document.querySelector(".description-input");
const addBtn = document.querySelector(".add-btn");
const cancelEditBtn = document.querySelector(".cancel-edit-btn");

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


const CATEGORY_OPTIONS = [
    { value: "study", label: "공부" },
    { value: "work", label: "업무" },
    { value: "personal", label: "개인" },
    { value: "exercise", label: "운동" },
    { value: "etc", label: "기타" }
];

const PRIORITY_OPTIONS = [
    { value: "high", label: "높음" },
    { value: "medium", label: "보통" },
    { value: "low", label: "낮음" }
];


let schedules = JSON.parse(localStorage.getItem("schedules")) || [];

let currentDateData = new Date();
let selectedDate = null;

let currentCategory = "all";
let currentPriority = "all";
let currentCompleted = "all";
let currentSort = "latest";
let currentKeyword = "";

let isEditing = false;
let editingId = null;


function addSchedule() {

}

function updateSchedule() {

}

function deleteSchedule() {

}

function saveSchedules() {

}

//===== Render ======
function renderCalendar() {
    calendarGrid.innerHTML = "";
    weekRow.innerHTML = "";

    const year = currentDateData.getFullYear();
    const month = currentDateData.getMonth();
    const day = currentDateData.getDate();
    
    currentDateText.textContent = `${year}년 ${String(month + 1).padStart(2, "0")}월`;
    
    const weekNames = ["일", "월", "화", "수", "목", "금", "토"];
    weekNames.forEach(day => {
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
        calendarGrid.append(dateCell);
    }
}

function renderSchedules() {

}

function renderCategoryOptions() {

}

function renderPriorityOptions() {

}

function renderTodaysDate() {
    const year = currentDateData.getFullYear();
    const month = String(currentDateData.getMonth() + 1).padStart(2, "0");
    const day = String(currentDateData.getDate()).padStart(2, "0");
    today.innerHTML = `Today: ${year}년 ${month}월 ${day}일`;
}

//===== Filter =====
function renderCategoryFilter() {

}

function renderPriorityFilter() {

}

function renderCompletedFilter() {

}

renderCategoryOptions();
renderPriorityOptions();

renderTodaysDate();
renderCalendar();
renderSchedules();
