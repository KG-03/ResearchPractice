//===== Today =====
const today = document.querySelector(".today");

//===== Calendar =====
const calendarGrid = document.querySelector(".calendar-grid");
const currentDateText = document.querySelector(".current-date-text");
const weekRow = document.querySelector(".week-row");
const prevMonthBtn = document.querySelector(".prev-month-btn");
const nextMonthBtn = document.querySelector(".next-month-btn");
const calendarTooltip = document.querySelector(".calendar-tooltip");

//===== Input ======
const titleInput = document.querySelector(".title-input");
const timeInput = document.querySelector(".time-input");
const categorySelect = document.querySelector(".category-select");
const prioritySelect = document.querySelector(".priority-select");
const repeatSelect = document.querySelector(".repeat-select");
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
const deletedFilter = document.querySelector(".deleted-filter");

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


const WEEK_NAMES = [ "일", "월", "화", "수", "목", "금", "토" ];

const CATEGORY_OPTIONS = {
    study: "공부",
    work: "업무",
    personal: "개인",
    exercise: "운동",
    etc: "기타"
};

const CATEGORY_ICON = {
    study: "📚",
    work: "💼",
    personal: "👤",
    exercise: "⚽",
    etc: "📂"    
};

const PRIORITY_OPTIONS = {
    high: "높음",
    medium: "보통",
    low: "낮음"
};

const PRIORITY_VALUE = {
    high: 3,
    medium: 2,
    low: 1
};

const REPEAT_OPTIONS = {
    none: "반복 안 함",
    daily: "매일",
    weekly: "매주",
    monthly: "매월",
    yearly: "매년"
};

const CSV = {
    ID: 0,
    TITLE: 1,
    CATEGORY: 2,
    PRIORITY: 3,
    DESCRIPTION: 4,
    DATE: 5,
    TIME: 6,
    REPEAT: 7,
    DELETED: 8,
    COMPLETED_DATES: 9,
    DELETED_DATES: 10,
    EXCEPTIONS: 11,
    CREATED_AT: 12,
    UPDATED_AT: 13
};

const CSV_LENGTH = Object.values(CSV).length;


let schedules = JSON.parse(localStorage.getItem("schedules")) || [];

schedules = schedules.map(schedule => ({
    ...schedule,
    repeat: schedule.repeat ?? "none",
    deleted: schedule.deleted ?? false,
    completedDates: schedule.completedDates ?? [],
    deletedDates: schedule.deletedDates ?? [],
    exceptions: schedule.exceptions ?? {}
}));

const todayDate = new Date();
let currentDateData = new Date();
let selectedDateData = new Date();

let currentCategory = "all";
let currentPriority = "all";
let currentCompleted = "all";
let currentSort = "latest";
let currentKeyword = "";
let currentCell = null;
let currentTheme = localStorage.getItem("theme") || "light";

let showDeleted = false;

let isEditing = false;
let editingId = null;
let editingMode = "all";

let toastTimer = null;
let toastRemoveTimer = null;


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

themeToggleBtn.addEventListener("click", () => {
    currentTheme = currentTheme === "light" ? "dark" : "light";

    localStorage.setItem("theme", currentTheme);

    applyTheme(currentTheme);
    updateThemeButton();
});

deletedFilter.addEventListener("change", () => {
    showDeleted = deletedFilter.checked;
    renderSchedules();
});

document.addEventListener("keydown", function(e) {
    if(e.ctrlKey && e.key === "Enter") {
        if(!isEditing) addTransaction();
        else updateTransaction();
    }

    if(e.key === "Escape" && (titleInput.value !== "" ||
                                timeInput.value !== "" ||
                                categorySelect.value !== "study" ||
                                prioritySelect.value !== "high" ||
                                descriptionInput.value !== "")) {
        cancelEdit();
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
        time: timeInput.value,

        repeat: repeatSelect.value,
        deleted: false,

        completedDates: [],
        deletedDates: [],
        exceptions: {},

        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    schedules.push(schedule);

    refreshSchedules();
    resetScheduleForm();
    titleInput.focus();

    showToast("일정이 추가되었습니다.");
}

function startEdit(id, editMode = "all") {
    const editSchedule = schedules.find(schedule => schedule.id === id);

    if(!editSchedule) return;

    isEditing = true;
    editingId = id;
    editingMode = editMode;

    titleInput.value = editSchedule.title;
    categorySelect.value = editSchedule.category;
    prioritySelect.value = editSchedule.priority;
    repeatSelect.value = editSchedule.repeat;
    descriptionInput.value = editSchedule.description;
    timeInput.value = editSchedule.time;

    addBtn.textContent = "수정 완료";
    cancelEditBtn.style.display = "inline-block";

    titleInput.focus();
}

function updateSchedule() {
    const editSchedule = schedules.find(schedule => schedule.id === editingId);

    if(!editSchedule) return;

    const isChanged = editSchedule.title !== titleInput.value.trim() ||
                      editSchedule.category !== categorySelect.value ||
                      editSchedule.priority !== prioritySelect.value ||
                      editSchedule.repeat !== repeatSelect.value ||
                      editSchedule.description !== descriptionInput.value.trim() ||
                      editSchedule.date !== selectedDateData.getTime() ||
                      editSchedule.time !== timeInput.value;

    if(!isChanged) {
        refreshSchedules();
        resetScheduleForm();
        titleInput.focus();

        showToast("수정된 일정이 없습니다.");
        return;
    }

    if(titleInput.value.trim() === "") {
        alert("제목을 입력해 주십시오.");
        return;
    }

    if(editingMode === "single") {
        const key = getDateKey(selectedDateData);

        editSchedule.exceptions[key] = {
            title: titleInput.value.trim(),
            category: categorySelect.value,
            priority: prioritySelect.value,
            description: descriptionInput.value.trim(),
            time: timeInput.value,
            updatedAt: Date.now()
        }
    } else {
        editSchedule.title = titleInput.value.trim();
        editSchedule.category = categorySelect.value;
        editSchedule.priority = prioritySelect.value;
        editSchedule.repeat = repeatSelect.value;
        editSchedule.description = descriptionInput.value.trim();
        editSchedule.date = selectedDateData.getTime();
        editSchedule.time = timeInput.value;
        editSchedule.updatedAt = Date.now();
    }

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

    showToast("취소되었습니다.");
}

function copySchedule(id) {
    const copySchedule = schedules.find(schedule => schedule.id === id);

    if(!copySchedule) return;

    const newSchedule = {
        ...copySchedule,

        id: Date.now(),
        title: copySchedule.title + " (복사)",
        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    schedules.push(newSchedule);

    refreshSchedules();
    resetScheduleForm();
    titleInput.focus();

    showToast("일정이 복제되었습니다.");
}

function deleteSchedule(id) {
    const delTargetSchedule = schedules.find(schedule => schedule.id === id);

    if(!delTargetSchedule) return;

    if(delTargetSchedule.repeat === "none") {
        deleteNormalSchedule(id);
        return;
    }

    const onlyCurrent = confirm("이번 일정만 삭제하시겠습니까?\n취소를 누르면 반복 일정 전체를 삭제합니다.");
    if(onlyCurrent) {
        deleteRepeatOccurrence(delTargetSchedule, selectedDateData);
    } else {
        delTargetSchedule.deleted = true;
        refreshSchedules();
    }
}

function deleteNormalSchedule(id) {
    if(!confirmMessage("일정을 휴지통으로 보내겠습니까?")) return;

    const schedule = schedules.find(s => s.id === id);

    if(!schedule) return;
    
    schedule.deleted = true;

    refreshSchedules();

    showToast("일정을 휴지통으로 보냈습니다.");
}

function deleteRepeatOccurrence(schedule, targetDate) {
    const key = getDateKey(targetDate);

    if(!schedule.deletedDates.includes(key)) {
        schedule.deletedDates.push(key);
    }

    refreshSchedules();

    showToast("이번 일정만 삭제되었습니다.");
}

function permanentDeleteSchedule(schedule, targetDate = null) {
    if(!confirm("완전히 삭제하시겠습니까?")) return;

    if(targetDate) {
        const key = getDateKey(targetDate);
        schedule.deletedDates = schedule.deletedDates.filter(date => date !== key);
    } else {
        schedules = schedules.filter(s => s.id !== schedule.id);
    }

    refreshSchedules();
    showToast("완전히 삭제되었습니다.");
}

function deleteAllSchedule() {
    schedules = schedules.filter(schedule => {
        if(schedule.repeat === "none") return !schedule.deleted;

        if(schedule.deleted) return false;

        return true;
    })
}

function restoreSchedule(schedule, targetDate = null) {
    if(targetDate) {
        const key = getDateKey(targetDate);
        schedule.deletedDates = schedule.deletedDates.filter(date => date !== key);
    } else {
        schedule.deleted = false;
    }

    refreshSchedules();
    showToast("일정이 복구되었습니다.");
}

function restoreException(schedule, targetDate) {
    const key = getDateKey(targetDate);

    if(!schedule.exceptions[key]) return;

    delete schedule.exceptions[key];

    saveSchedules();
    refreshSchedules();

    showToast("원래 반복 일정으로 복구되었습니다.");
}

function saveSchedules() {
    localStorage.setItem("schedules", JSON.stringify(schedules));
}

function createScheduleCard(schedule) {
    const card = document.createElement("div");
    card.classList.add("schedule-card");

    if(isCompleted(schedule, selectedDateData)) {
        card.classList.add("completed");
    }

    const header = document.createElement("div");
    header.classList.add("card-header");

        if(!showDeleted) {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = isCompleted(schedule, selectedDateData);
            checkbox.addEventListener("change", () => {
                checkboxToggle(schedule, checkbox);

                if(isCompleted(schedule, selectedDateData)) {
                    card.classList.add("completed");
                } else {
                    card.classList.remove("completed");
                }

                renderSchedules();
            });
            header.append(checkbox); 
        } else {
            card.classList.remove("complete");
        }
    
        const title = document.createElement("h4");
        title.textContent = `${schedule.title}`;
        header.append(title);

    card.append(header);

    if(schedule.time) {
        const time = document.createElement("p");
        time.textContent = `🕒 ${schedule.time}`;
        card.append(time);

        if(isExpiredSchedule(schedule)) {
            card.classList.add("expired-schedule");
        }
    }

    const classification = document.createElement("div");
    classification.classList.add("card-classification");

        const category = document.createElement("p");
        category.textContent = `카테고리: ${CATEGORY_OPTIONS[schedule.category]}`;
        classification.append(category);
        
        const priority = document.createElement("p");
        priority.textContent = `우선순위: ${PRIORITY_OPTIONS[schedule.priority]}`;
        classification.append(priority);

        const repeat = document.createElement("p");
        repeat.textContent = `🔁 ${REPEAT_OPTIONS[schedule.repeat]}`;
        classification.append(repeat);

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

    if(showDeleted) {
        const restoreBtn = document.createElement("button");
        restoreBtn.textContent = "♻️ 복구";
        restoreBtn.addEventListener("click", () => {
            restoreSchedule(schedule, selectedDateData);
        });
        card.append(restoreBtn);

        const permanentDelBtn = document.createElement("button");
        permanentDelBtn.textContent = "❌ 완전 삭제";
        permanentDelBtn.addEventListener("click", () => {
            permanentDeleteSchedule(schedule, selectedDateData);
        })
        card.append(permanentDelBtn);

    } else{
        const editBtn = document.createElement("button");
        editBtn.textContent = "✏️ 수정";
        editBtn.addEventListener("click", () => {
            if(schedule.repeat === "none") {
                startEdit(schedule.id, "all");
                return;
            }

            const answer = prompt(`1: 이번 일정만 수정
2: 반복 일정 전체 수정`);

            if(answer === "1") startEdit(schedule.id, "single");

            if(answer === "2") startEdit(schedule.id, "all");
        });
        card.append(editBtn);

        if (schedule.repeat !== "none" &&
            hasException(schedule, selectedDateData)) {
                const restoreRepeatBtn = document.createElement("button");
                restoreRepeatBtn.textContent = "↩ 원래 일정 복원";

                restoreRepeatBtn.addEventListener("click", () => {
                    restoreException(schedule, selectedDateData);
                });

            card.append(restoreRepeatBtn);
        }

        const copyBtn = document.createElement("button");
        copyBtn.textContent = "📋 복제";
        copyBtn.addEventListener("click", () => {
            copySchedule(schedule.id);
        });
        card.append(copyBtn);

        const delBtn = document.createElement("button");
        delBtn.textContent = "🗑️ 삭제"
        delBtn.addEventListener("click", () => {
            deleteSchedule(schedule.id);
        });
        card.append(delBtn);
    }

    return card;
}

function checkboxToggle(schedule, checkbox) {
    //originalSchedule는 getVisibleSchedulesForDate()에서부터 받을 수 있다.
    const original = schedule.originalSchedule || schedule;
    const key = getDateKey(selectedDateData);

    if(checkbox.checked) {
        if(!original.completedDates.includes(key)) {
            original.completedDates.push(key);
        }
    } else {
        original.completedDates = original.completedDates.filter(date => date !== key);
    }

    saveSchedules();
}

function isExpiredSchedule(schedule) {
    if (!schedule.time) return false;

    const now = new Date();

    const [hour, minute] = schedule.time.split(":");
    
    const scheduleCardDate = new Date(schedule.date);

    scheduleCardDate.setHours(hour);
    scheduleCardDate.setMinutes(minute);
    scheduleCardDate.setSeconds(0);
    scheduleCardDate.setMilliseconds(0);

    return scheduleCardDate < now && !isCompleted(schedule, selectedDateData);
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

            const countSchedule = getVisibleSchedulesForDate(new Date(year, month, date)).length;

            if (countSchedule > 0) {
                const badge = document.createElement("span");
                badge.classList.add("count-schedule");
                badge.textContent = countSchedule;
                dateCell.append(badge);
            }

        dateCell.addEventListener("mouseenter", () => {
            showTooltip(dateCell, year, month, date);
        });

        dateCell.addEventListener("mouseleave", () => {
            hideTooltip();
        });            

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

    filteredSchedule = getVisibleSchedulesForDate(selectedDateData, showDeleted);

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

    if(!showDeleted) renderStatistics(filteredSchedule);
}

function renderTodaysDate() {
    const year = todayDate.getFullYear();
    const month = String(todayDate.getMonth() + 1).padStart(2, "0");
    const day = String(todayDate.getDate()).padStart(2, "0");
    today.innerHTML = `Today: ${year}년 ${month}월 ${day}일`;
}

function renderStatistics(schedules) {
    let completeStats = 0;
    let uncompleteStats = 0;

    let studyStats = 0;
    let workStats = 0;
    let personalStats = 0;
    let exerciseStats = 0;
    let etcStats = 0;

    schedules.forEach(scheduleStats => {
        if(isCompleted(scheduleStats, selectedDateData) === true) {
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

function showTooltip(dateCell, year, month, date) {
    const daySchedules = getVisibleSchedulesForDate(new Date(year, month, date));

    if(daySchedules.length === 0) return;

    daySchedules.sort((a,b) => {
        if(!a.time && !b.time) return 0;
        if(!a.time) return 1;
        if(!b.time) return -1;

        return a.time.localeCompare(b.time);
    });

    calendarTooltip.innerHTML = "";

    const title = document.createElement("storng");
    title.textContent = `${month + 1}월 ${date}일`;
    calendarTooltip.append(title);

    const previewSchedules = daySchedules.slice(0, 4);

    previewSchedules.forEach(schedule => {
        const p = document.createElement("p");
        const previewTargetDate = new Date(year, month, date);
        p.textContent = `🕒${schedule.time || "--:--"} ${CATEGORY_ICON[schedule.category]}${schedule.title.length > 10 ? schedule.title.slice(0,10) + "..." : schedule.title} ${isCompleted(schedule, previewTargetDate) === true ? "✔️" : ""} `;
        calendarTooltip.append(p);
    });

    const remainCount = daySchedules.length - previewSchedules.length;
    if(remainCount > 0) {
        const p = document.createElement("p");
        p.textContent = `+${remainCount}개의 일정`;
        calendarTooltip.append(p);
    }

    const rect = dateCell.getBoundingClientRect();
    calendarTooltip.style.left = rect.left + window.scrollX + "px";
    calendarTooltip.style.top = rect.bottom + window.scrollY + 5 + "px";

    calendarTooltip.style.display = "block";
}

function hideTooltip() {
    calendarTooltip.style.display = "none";
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
    repeatSelect.value = "none";
    timeInput.value = "";

    addBtn.textContent = "✓ 추가";
    cancelEditBtn.style.display = "none";
}

//===== Filter =====
function getVisibleSchedulesForDate(targetDate, includeDeleted = false) {
    const key = getDateKey(targetDate);

    return schedules.filter(schedule => {
        if(!isRepeatSchedule(schedule, targetDate)) return false;

        //일반
        if(schedule.repeat === "none") return includeDeleted ? schedule.deleted : !schedule.deleted;

        //반복일정 전체삭제
        if(schedule.deleted) return includeDeleted;
        
        //반복일정 특정날짜삭제
        const deleted = schedule.deletedDates.includes(key);
        return includeDeleted ? deleted : !deleted;
    }).map(schedule => {
        if(schedule.exceptions[key]) {
            return {
                ...schedule,
                ...schedule.exceptions[key],

                originalSchedule: schedule
            };
        }

        return schedule;
    });
}

function isRepeatSchedule(schedule, targetDate) {
    if(!targetDate) return false;
    
    const scheduleDate = new Date(schedule.date);

    switch(schedule.repeat) {
        case "none":
            return schedule.date === targetDate.getTime();

        case "daily":
            return targetDate >= scheduleDate;

        case "weekly":
            return (
                targetDate >= scheduleDate &&
                targetDate.getDay() === scheduleDate.getDay()
            );

        case "monthly":
            return (
                targetDate >= scheduleDate &&
                targetDate.getDate() === scheduleDate.getDate()
            );

        case "yearly":
            return (
                targetDate >= scheduleDate &&
                targetDate.getMonth() === scheduleDate.getMonth() &&
                targetDate.getDate() === scheduleDate.getDate()
            );

        default:
            return false;
    }

    return false;
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
        filteredSchedule = filteredSchedule.filter(schedule => isCompleted(schedule, selectedDateData));
    } else if (currentCompleted === "uncompleted") {
        filteredSchedule = filteredSchedule.filter(schedule => !isCompleted(schedule, selectedDateData));
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
        const completedA = isCompleted(a, selectedDateData);
        const completedB = isCompleted(b, selectedDateData);

        if(completedA !== completedB) {
            return completedA - completedB;
        }

        switch(currentSort) {
            case "time-desc":
                if(!a.time && !b.time) return 0;
                if(!a.time) return 1;
                if(!b.time) return -1;

                return a.time.localeCompare(b.time);

            case "time-asc":
                if(!a.time && !b.time) return 0;
                if(!a.time) return 1;
                if(!b.time) return -1;

                return b.time.localeCompare(a.time);

            case "latest":
                return b.createdAt - a.createdAt;

            case "oldest":
                return a.createdAt - b.createdAt;

            case "priority-desc":
                return PRIORITY_VALUE[b.priority] - PRIORITY_VALUE[a.priority];

            case "priority-asc":
                return PRIORITY_VALUE[a.priority] - PRIORITY_VALUE[b.priority];
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
            "time",
            "repeat",
            "deleted",
            "completedDates",
            "deletedDates",
            "exceptions",
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
            escapeCSV(schedule.time),
            escapeCSV(schedule.repeat),
            escapeCSV(schedule.deleted),
            escapeCSV(schedule.completedDates.join("|")),
            escapeCSV(schedule.deletedDates.join("|")),
            escapeCSV(JSON.stringify(schedule.exceptions)),
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

function importCSV(event) {
    const file = event.target.files[0];

    if(!file) {
        alert("파일이 선택되지 않았습니다.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        const csv = e.target.result;

        const lines = csv.split(/\r?\n/);
        lines.shift();
        
        if (!validateCSV(lines)) {
            return;
        }

        const importedSchedules = [];

        lines.forEach(line => {
            if(!line.trim()) return;

            const values = parseCSVLine(line);

            importedSchedules.push({
                id: Number(values[CSV.ID]),
                title: unescapeCSV(values[CSV.TITLE]),
                category: unescapeCSV(values[CSV.CATEGORY]),
                priority: unescapeCSV(values[CSV.PRIORITY]),
                description: unescapeCSV(values[CSV.DESCRIPTION]),
                date: Number(values[CSV.DATE]),
                time: unescapeCSV(values[CSV.TIME]) === "0" ? null : unescapeCSV(values[CSV.TIME]),
                repeat: unescapeCSV(values[CSV.REPEAT]),
                deleted: unescapeCSV(values[CSV.DELETED]).toLowerCase() === "true",
                completedDates: unescapeCSV(values[CSV.COMPLETED_DATES]).split("|").filter(Boolean),
                deletedDates: unescapeCSV(values[CSV.DELETED_DATES]).split("|").filter(Boolean),
                exceptions: values[CSV.EXCEPTIONS] ? JSON.parse(values[CSV.EXCEPTIONS]) : {},
                createdAt: Number(values[CSV.CREATED_AT]),
                updatedAt: Number(values[CSV.UPDATED_AT])
            });
        });

        schedules = importedSchedules;

        refreshSchedules();
    };

    reader.readAsText(file, "utf-8");

    showToast("CSV를 불러왔습니다.")
}

function parseCSVLine(line) {
    const values = [];

    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const ch = line[i];

        if (ch === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }

            continue;
        }

        if (ch === "," && !inQuotes) {
            values.push(current);
            current = "";
            continue;
        }

        current += ch;
    }

    values.push(current);

    return values;
}

//===== Theme =====
function applyTheme(theme) {
    document.body.classList.remove("light-theme", "dark-theme");
    document.body.classList.add(`${theme}-theme`);
}

function updateThemeButton() {
    themeToggleBtn.textContent = currentTheme === "light" ? "🌙" : "☀️";
}

//===== Utils =====
function formatDate(timestamp) {
    if(!timestamp) return "";

    const date = new Date(timestamp);

    return date.toLocaleString("ko-KR");
}

function confirmMessage(message) {
    return confirm(message);
}

function escapeCSV(value) {
    return `"${String(value ?? "")
        .replace(/\r\n/g, "\\n")
        .replace(/\n/g, "\\n")
        .replace(/"/g, '""')}"`
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

        const values = parseCSVLine(line);

        if (values.length !== Object.values(CSV).length) {
            console.log(values);
            console.log(values.length);

            alert("CSV 형식이 올바르지 않습니다.");
            return false;
        }

        if (values.length !== CSV_LENGTH) {
            alert("CSV 형식이 올바르지 않습니다.");
            return false;
        }

        if (!values[CSV.ID].trim()) {
            alert("ID가 비어 있습니다.");
            return false;
        }

        if (isNaN(Number(values[CSV.ID]))) {
            alert("ID 형식이 잘못되었습니다.");
            return false;
        }

        if (!values[CSV.TITLE].trim()) {
            alert("제목이 비어 있습니다.");
            return false;
        }

        if (!(unescapeCSV(values[CSV.CATEGORY]) in CATEGORY_OPTIONS)) {
            alert("카테고리 값이 올바르지 않습니다.");
            return false;
        }

        if (!(unescapeCSV(values[CSV.PRIORITY]) in PRIORITY_OPTIONS)) {
            alert("우선순위 값이 올바르지 않습니다.");
            return false;
        }

        if (isNaN(Number(values[CSV.DATE]))) {
            alert("날짜 형식이 올바르지 않습니다.");
            return false;
        }

        try {
            const importCompletedDates = unescapeCSV(values[CSV.COMPLETED_DATES]).split("|").filter(Boolean);
            
            if(!Array.isArray(importCompletedDates)) {
                alert("completedDates 형식이 올바르지 않습니다.");
                return false;
            }
        } catch {
            alert("completedDates 형식이 올바르지 않습니다.");
            return false;
        }

        try {
            JSON.parse(values[CSV.EXCEPTIONS] || "{}");
        } catch {
            alert("exceptions 형식이 올바르지 않습니다.");
            return false;
        }

        if (isNaN(Number(values[CSV.CREATED_AT]))) {
            alert("createdAt 값이 올바르지 않습니다.");
            return false;
        }

        if (isNaN(Number(values[CSV.UPDATED_AT]))) {
            alert("updatedAt 값이 올바르지 않습니다.");
            return false;
        }
    }

    return true;
}

function hasException(schedule, targetDate) {
    const key = getDateKey(targetDate);

    return !!schedule.exceptions[key];
}

//===== ETC =====
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
    clearTimeout(toastRemoveTimer);

    toast.classList.remove("show");

    void toast.offsetWidth;

    toast.textContent = message;
    toast.classList.add("show");

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");

        toastRemoveTimer = setTimeout(() => {
            toast.textContent = "";
        }, 300);
    }, 3000);
}

function getDateKey(date) {
    if(!date) return null;

    return date.toISOString().split("T")[0];
}

function isCompleted(schedule, targetDate) {
    const key = getDateKey(targetDate);

    return (schedule.completedDates ?? []).includes(key);
}


preventComma(titleInput);
preventComma(descriptionInput);

renderTodaysDate();
renderCalendar();
renderSchedules();
selectedDate.textContent = `선택 날짜: ${selectedDateData.getFullYear()}년 ${selectedDateData.getMonth()+1}월 ${selectedDateData.getDate()}일`;

applyTheme(currentTheme);
updateThemeButton();


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

/* 18일차
 * a.time.localeCompare(b.time) : 문자열을 사전 순서로 비교하는 함수.
 *                                언어(Locale)의 정렬 규칙을 고려하여 두 문자열의 순서를 비교.
 */

/* 19일차
 * const now = new Date();
 *
 * const [hour, minute] = schedule.time.split(":");
 *
 * const scheduleDate = new Date(schedule.date);
 * scheduleDate.setHours(hour);
 * scheduleDate.setMinutes(minute);
 *          이 코드에서 const [hour, minute] = schedule.time.split(":");가 필요한 이유는
 *          shedule.date에 time이 설정되지 않았기(ex: 2026-07-27 00:00으로 저장되어 있는 등) 때문.
 */

/* 20일차
 * getBoundingClientRect()  : HTML의 요소의 위치, 크기를 알려주는 함수.
 *                            해당 요소가 현재 화면(Viewport)에서 어디에 있고, 얼마나 큰지 알려준다.
 *                            HTML 요소의 현재 화면 기준 위치와 크기를 나타내는 객체를 반환하는 함수.
 *                            스크롤 애니메이션, 드래그 앤 드롭, 툴팁 및 Toast 위치 계산 등에서 자주 사용.
 *                            const rect = box.getBoundingClientRect(); 일 때,
 *                              rect.top    : 화면 위에서 요소까지의 거리
 *                              rect.left   : 화면 왼쪽에서 요소까지의 거리
 *                              rect.width  : 요소의 너비
 *                              rect.height : 요소의 높이
 *                              rect.right  : 요소의 오른쪽 좌표
 *                              rect.bottom : 요소의 아래쪽 좌표
 */

/* 21일차
 * void toast.offsetWidth;  : offsetWidth는 요소의 현재 너비를 반환하는 속성.
 *                            offsetWidth를 알려면 현재 레이아웃이 정확해야 하기 때문에 Reflow를 강제로 수행.
 *                            요소의 크기 계산, 위치 계산, 스타일 적용 등을 끝낸 뒤, 값을 반환.
 * 
 *                            void는 표현식을 실행하지만 결과값을 버린다는 의미.
 *                            따라서 void toast.offsetWidth는 toast.offsetWidth를 읽고, 브라우저가 레이아웃을 계산한 뒤, 반환된 너비는 버린다는 의미가 된다.
 *                            toast.classList.remove("show") > void toast.offsetWidth > toast.classList.add("show"); 순서대로 하면
 *                              'show 제거 > 레이아웃 다시 계산 > show 다시 추가'를 각각 다른 단계로 인식.
 *                              show 클래스 제거를 브라우저가 확실하게 반영한 뒤, 다시 show 클래스를 추가하여 애니메이션을 처음부터 실행한다.
 */

/* 23일차
 * return date.toISOString().split("T")[0];     : toISOStiring()은 날짜와 시간을 ISO 8601 형식의 문자열로 변환한다.
 *                                                  2026-04-04T06:30:20.000Z 처럼 변환된다.
 *                                                  T는 날짜와 시간을 구분하는 문자다.
 *                                                split("T")는 T를 기준으로 문자열을 나누어 배열로 반환한다.
 *                                                여기서 [0]번째 배열을 불러냄으로써 '날짜'를 받을 수 있다.
 * filter(Boolean)      : 배열에서 거짓 같은 값을 제거하는 용도.
 *                        filter()는 배열의 각 요소를 검사해서 true면 남기고 false면 제거한다.
 *                        Boolean(value)는 실행되면 value가 참인지 거짓인지 판단한다.
 *                          false, 0, "", null, undefined, NaN은 거짓으로 판별된다.
 *                        filter(Boolean)은 filter(value => Boolean(value))와 같으므로, 따라서 해당 코드는 '잘못 추가된 값, 혹은 빈 값을 제거하는 용도'로 기능한다.
 *                          "apple", "", "banana"가 들어가 있다면, 해당 함수로 "apple", "banana"만 남길 수 있다.
 */

/* 25일차
 * const exception = schedule.exception?.[key];     : ?의 의미는 앞의 값이 null 또는 undefined가 아니면 뒤를 계속 실행하고, 맞다면 undefined를 반환한다.
 *                                                    따라서 schedule에 exception 객체가 있으면 key에 해당하는 값을 가져오고, exception 객체가 없다면 오류를 내지 말고 undefined를 반환한다.
 *                                                    지금은 사용하지 않는 방식이나, 차후 사용할 수 있으니 잘 확인할 것.
 * 
 * Object.values(CSV).length;       : Object.values()는 객체의 값만 뽑아서 배열로 반환하는 함수.
 *                                    지금의 CSV에 Object.values(CSV)를 적용하면 [0, 1, 2, 3, 4, ...]를 가져올 수 있다.
 *                                    반대로 Object.keys(CSV)는 ["ID", "TITLE", "CATEGORY", ...]를 가져올 수 있다.
 *                                    여기에 length 옵션을 추가하면 CSV 객체 안에 있는 값으 개수(속성 개수)를 구할 수 있다. 
 */

/* 26일차
 * function getSchedulesByDate(targetDate, includeDeleted = false)  : includeDeleted = false는 매개변수.
 *                                                                    함수를 호출할 때 두 번째 인자를 전달받지 않으면 includeDeleted 값을 false로 사용.
 * 
 * 27일차: 현재 함수명을 resolveRepeatSchedulesForDate()로 변경.
 * 28일차: 현재 함수명을 getVisibleSchedulesForDate()로 변경.
 */

/* 30일차
 * !!schedule.exceptions[key];      : 값의 존재 여부를 boolean으로 변환하는 표현식.
 *                                    값이 존재하면 true, 존재하지 않으면(undefined, null 등) false.
 *                                    해당 날짜에 예외 일정 데이터가 있는지 확인할 때 사용중.
 */
