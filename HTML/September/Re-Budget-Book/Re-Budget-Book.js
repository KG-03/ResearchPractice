
const todayDate = document.querySelector(".today-date");

const exportBtn = document.querySelector(".export-btn");
const importBtn = document.querySelector(".import-btn");
const importCSVInput = document.querySelector(".import-csv-input");

const summaryMonthList = document.querySelector(".summary-month-list");
const summaryCategoryType = document.querySelector(".summary-category-type");
const summaryCategoryTotalBudgetArea = document.querySelector(".summary-category-total-budget-area");
const summaryCategoryList = document.querySelector(".summary-category-list");

const monthltyGraphBtn = document.querySelector(".monthlty-graph-btn");
const monthlyGraphList = document.querySelector(".monthly-graph-list");
const monthlyCumulativeChangeChartGraph = document.querySelector(".monthly-cumulative-change-chart-graph");
const monthlyCumulativeChangeStartingBalance = document.querySelector(".monthly-cumulative-change-starting-balance");
const monthlyCumulativeChangeStartingBalanceResetBtn = document.querySelector(".monthly-cumulative-change-starting-balance-reset-btn");
const monthlyDailyChangeChartGraph = document.querySelector(".monthly-daily-change-chart-graph");
const monthlySpendingInsights = document.querySelector(".monthly-spending-insights");

const selectedMonth = document.querySelector(".selected-month");
const prevMonthBtn = document.querySelector(".prev-month-btn");
const nowMonthBtn = document.querySelector(".now-month-btn");
const nextMonthBtn = document.querySelector(".next-month-btn");
const dateShift = document.querySelector(".date-shift");
const shiftMonthBtn = document.querySelector(".shift-month-btn");

const summaryGraphBtn = document.querySelector(".summary-graph-btn");
const summaryGraphList = document.querySelector(".summary-graph-list");

const budgetComparisonBtn = document.querySelector(".budget-comparison-btn");
const budgetComparisonList = document.querySelector(".budget-comparison-list");

const dateInput = document.querySelector(".date-input");
const amountInput = document.querySelector(".amount-input");
const typeSelect = document.querySelector(".type-select");
const categorySelect = document.querySelector(".category-select");
const descriptionInput = document.querySelector(".description-input");
const repeatSelect = document.querySelector(".repeat-select");
const addBtn = document.querySelector(".add-btn");
const editCancelBtn = document.querySelector(".edit-cancel-btn");

const categoryAddInput = document.querySelector(".category-add-input");
const categoryAddOptionBtn = document.querySelector(".category-add-option-btn");
const categoryEditOptionBtn = document.querySelector(".category-edit-option-btn");
const categoryDeleteOptionBtn = document.querySelector(".category-delete-option-btn");
const categoryOptionSettingArea = document.querySelector(".category-option-setting-area");

const repeatOptionArea = document.querySelector(".repeat-option-area");
const repeatStartDate = document.querySelector(".repeat-start-date");
const repeatFrequencySelect = document.querySelector(".repeat-frequency-select");
const repeatIntervalSelect = document.querySelector(".repeat-interval-select");
const repeatEndOptions = document.querySelectorAll('input[name="repeatEndType"]');
const repeatEndDateInput = document.querySelector('.repeat-end-date-input');

const filterResetBtn = document.querySelector(".filter-reset-btn");
const typeFilter = document.querySelector(".type-filter");
const categoryFilter = document.querySelector(".category-filter");
const sortFilter = document.querySelector(".sort-filter");
const searchFilterInput = document.querySelector(".search-filter-input");
const displayFilteredTransactionsNumber = document.querySelector(".display-filtered-transactions-number");

const budgetList = document.querySelector(".budget-list");


const STORAGE_KEY = "reBudgetTransactions";
const MONTHLY_STARTING_BALANCES = "monthly-starting-balances";
const SUMMARY_CATEGORY_BUDGET = "summary-category-budget";

const TYPE_OPTIONS = {
    all: "전체",
    expense: "지출",
    income: "수입",
    saving: "저축",
    investment: "투자/재테크"
};

const DEFAULT_CATEGORY_OPTIONS = {
    expense: [
        {value: "food", label: "식비"},
        {value: "traffic", label: "교통비"},
        {value: "housing", label: "주거비"},
        {value: "living", label: "생활비"},

        {value: "medical", label: "의료/건강"},
        {value: "shopping", label: "쇼핑/미용"},
        {value: "leisure", label: "여가/관계"},

        {value: "etc", label: "기타"}
    ],

    income: [
        {value: "salary", label: "급여"},
        {value: "etc", label: "기타"}
    ],

    saving: [
        {value: "short-term", label: "단기저축"},
        {value: "long-term", label: "장기저축"},
        {value: "etc", label: "기타"}
    ],

    investment: [
        {value: "safe-haven-assets", label: "안전자산"},
        {value: "invest-assets", label: "투자자산"},
        {value: "real-assets", label: "실물/대체자산"},
        {value: "etc", label: "기타"}
    ]
};

const TOAST = {
    container: null,

    init() {
        if(!this.container) {
            this.container = document.createElement("div");
            this.container.classList.add("toast-container");
            document.body.append(this.container);
        }
    },

    show(message, transaction = null, duration = 5000) {
        this.init();

        const toast = document.createElement("div");
        toast.classList.add("toast");

        const messageText = document.createElement("span");
        messageText.textContent = message;
        toast.append(messageText);

        if(transaction) {
            toast.append(this.delete(transaction));
        }

        this.container.append(toast);

        setTimeout(() => {
            toast.classList.add("show");
        }, 100);

        setTimeout(() => {
            toast.classList.remove("show");

            toast.addEventListener("transitionend", () => {
                toast.remove();
            });
        }, duration);
    },

    delete(transaction) {
        const restoreBtn = document.createElement("button");
        restoreBtn.textContent = "복원";
        restoreBtn.classList.add("toast-restore-btn");

        restoreBtn.addEventListener("click", () => {
            restoreTransaction(transaction);
            restoreBtn.disabled = true;
        });
        
        return restoreBtn;
    }
};

const CSV = {
    ID: 0,
    DATE: 1,
    AMOUNT: 2,

    TYPE: 3,
    CATEGORY: 4,
    DESCRIPTION: 5,

    CREATED_AT: 6,
    UPDATED_AT: 7
}


let transactions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let categoryOptions = JSON.parse(localStorage.getItem("CATEGORY_OPTIONS")) || structuredClone(DEFAULT_CATEGORY_OPTIONS);
let monthlyStartingBalances = JSON.parse(localStorage.getItem(MONTHLY_STARTING_BALANCES)) || {};
let summaryCategoryBudgets = JSON.parse(localStorage.getItem(SUMMARY_CATEGORY_BUDGET)) || {};

transactions = transactions.map(transaction => ({
    ...transaction,
    repeat: transaction.repeat ?? false
}));

let today = new Date();
let selectedMonthDate = new Date();
let prevMonthDate = null;
let nextMonthDate = null;

let isMonthltyGraph = false;
let isSummaryGraph = false;
let isComparison = false;

let currentTypeSelect = "expense";

let currentTypeFilter = "all";
let currentCategoryFilter = "all";
let currentSortFilter = "latest";
let currentKeyword = "";
let currentCategoryAddOptionSetting = false;
let currentCategoryEditOptionSetting = false;
let currentCategoryDeleteOptionSetting = false;

let editingId = null;
let isEditing = false;
let editingOccurrenceOnly = false;      //이번 발생 내역만 수정하는지에 대한 여부
let editingOccurrenceDate = null;       //수정 대상의 원래 발생일
let editingOccurrenceData = null;       //수정 전 발생 내역의 값. 변경 여부를 비교할 때 이용.


exportBtn.addEventListener("click", exportCSV);

importBtn.addEventListener("click", () => {
    importCSVInput.click();
});

importCSVInput.addEventListener("change", importCSV);

summaryCategoryType.addEventListener("change", () => {
    renderSummary();
});

prevMonthBtn.addEventListener("click", () => {
    const year = selectedMonthDate.getFullYear();
    const month = selectedMonthDate.getMonth();
    const date = selectedMonthDate.getDate();

    selectedMonthDate = new Date(year, month-1, date);
    prevMonthDate = new Date(year, month-2, date);
    nextMonthDate = new Date(year, month, date);

    updateToday();
    renderPage();
});

nowMonthBtn.addEventListener("click", () => {
    const year = selectedMonthDate.getFullYear();
    const month = selectedMonthDate.getMonth();
    const date = selectedMonthDate.getDate();

    selectedMonthDate = new Date(today);
    prevMonthDate = new Date(year, month-1, date);
    nextMonthDate = new Date(year, month+1, date);    

    updateToday();
    renderPage();
});

nextMonthBtn.addEventListener("click", () => {
    const year = selectedMonthDate.getFullYear();
    const month = selectedMonthDate.getMonth();
    const date = selectedMonthDate.getDate();

    selectedMonthDate = new Date(year, month+1, date);
    prevMonthDate = new Date(year, month, date);
    nextMonthDate = new Date(year, month+2, date);

    updateToday();
    renderPage();
});

shiftMonthBtn.addEventListener("click", () => {
    if(dateShift.value) {
        selectedMonthDate = new Date(dateShift.value);
    }

    updateToday();
    renderPage();

    dateShift.value = "";
});

monthltyGraphBtn.addEventListener("click", () => {
    monthltyGraphBtn.style.display = "none";

    monthlyGraphList.style.display = "block";

    const hideBtn = document.createElement("button");
    hideBtn.textContent = "숨기기";
    hideBtn.classList.add("css-btn");
    hideBtn.addEventListener("click", () => {
        monthlyGraphList.style.display = "none";

        monthltyGraphBtn.style.display = "inline";
        hideBtn.remove();
    });

    monthlyGraphList.append(hideBtn);
});

monthlyCumulativeChangeStartingBalance.addEventListener("change", () => {
    const monthKey = getMonthKey(selectedMonthDate);
    const startingBalance = Number(monthlyCumulativeChangeStartingBalance.value);

    monthlyStartingBalances[monthKey] = startingBalance;
    saveMonthlyStartingBalance();
    renderPage();
});

monthlyCumulativeChangeStartingBalanceResetBtn.addEventListener("click", resetMonthlyStartingBalance);

summaryGraphBtn.addEventListener("click", () => {
    isSummaryGraph = true;
    summaryGraphBtn.style.display = "none";
    summaryGraph();
});

budgetComparisonBtn.addEventListener("click", () => {
    isComparison = true;
    budgetComparisonBtn.style.display = "none";
    budgetComparison();
});

typeSelect.addEventListener("change", () => {
    currentTypeSelect = typeSelect.value;
    updateCategoryOptions("input", currentTypeSelect, categorySelect);
});

addBtn.addEventListener("click", () => {
    if(!dateInput.value) {
        confirm("날짜란이 비어 있습니다! 날짜를 입력해 주세요");
        return;
    } else if(!Number(amountInput.value)) {
        confirm("금액란이 비어 있습니다! 금액을 입력해 주세요.")
        return;
    } else if(Number(amountInput.value) <= 0) {
        confirm("금액란에 음수를 쓸 수 없습니다! 금액을 다시 입력해 주세요.");
        return;
    } else if(categorySelect.value === "") {
        confirm("카테고리란의 값을 다시 확인해 주세요!");
        return;
    }

    if(isEditing === false) addTransaction();
    else editEnd();
});

editCancelBtn.addEventListener("click", () => {
    editingId = null;
    isEditing = false;
    resetInputForm();

    TOAST.show("수정이 취소되었습니다!");
});

categoryAddOptionBtn.addEventListener("click", () => {
    if(currentCategoryAddOptionSetting === true) return;

    categoryOptionSettingArea.innerHTML = "";
    currentCategoryEditOptionSetting = false;
    currentCategoryDeleteOptionSetting = false;

    categoryOptionHTML("추가");

    currentCategoryAddOptionSetting = true;
});

categoryEditOptionBtn.addEventListener("click", () => {
    if(currentCategoryEditOptionSetting === true) return;

    categoryOptionSettingArea.innerHTML = "";
    currentCategoryAddOptionSetting = false;
    currentCategoryDeleteOptionSetting = false;

    categoryOptionHTML("수정");

    currentCategoryEditOptionSetting = true;
});

categoryDeleteOptionBtn.addEventListener("click", () => {
    if(currentCategoryDeleteOptionSetting === true) return;

    categoryOptionSettingArea.innerHTML = "";
    currentCategoryEditOptionSetting = false;
    currentCategoryAddOptionSetting = false;
    
    categoryOptionHTML("제거");

    currentCategoryDeleteOptionSetting = true;
});

repeatSelect.addEventListener("change", () => {
    if(repeatSelect.checked) {
        repeatOptionArea.style.display = "block";
        repeatIntervalOptionHTML();
    }
    else repeatOptionArea.style.display = "none";
});

repeatFrequencySelect.addEventListener("change", () => {
    repeatIntervalOptionHTML();
});

repeatEndOptions.forEach(option => {
    option.addEventListener("change", () => {
        repeatEndDateInput.disabled = option.value !== 'date';
    });
});


filterResetBtn.addEventListener("click", () => {
    currentTypeFilter = "all";
    currentCategoryFilter = "all";
    currentSortFilter = "latest";
    currentKeyword = "";

    typeFilter.value = currentTypeFilter;
        updateCategoryOptions("filter", currentTypeFilter, categoryFilter);
    categoryFilter.value = currentCategoryFilter;
    sortFilter.value = currentSortFilter;
    searchFilterInput.value = currentKeyword;

    renderPage();
});

typeFilter.addEventListener("change", () => {
    currentTypeFilter = typeFilter.value;
        updateCategoryOptions("filter", currentTypeFilter, categoryFilter);
    currentCategoryFilter = categoryFilter.value;

    renderPage();
});

categoryFilter.addEventListener("change", () => {
    currentCategoryFilter = categoryFilter.value;

    renderPage();
});

sortFilter.addEventListener("change", () => {
    currentSortFilter = sortFilter.value;

    renderPage();
});

searchFilterInput.addEventListener("input", () => {
    currentKeyword = searchFilterInput.value;

    renderPage();
});


//거래 생성
function addTransaction() {
    const transaction = {
        id: Date.now(),
        date: dateInput.value,
        amount: Number(amountInput.value),

        type: typeSelect.value,
        category: categorySelect.value,
        description: descriptionInput.value,

        repeat: repeatSelect.checked,

        repeatType: repeatSelect.checked ? repeatFrequencySelect.value : null,
        repeatInterval : repeatSelect.checked ? Number(repeatIntervalSelect.value) : null,
        repeatEndType: repeatSelect.checked ? document.querySelector('input[name="repeatEndType"]:checked').value : null,
        repeatEndDate: repeatSelect.checked && document.querySelector('input[name="repeatEndType"]:checked').value === "date" ? repeatEndDateInput.value : null,

        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    transactions.push(transaction);

    saveTransactions();
    renderPage();

    resetInputForm();

    TOAST.show("성공적으로 생성되었습니다!");
}

//거래 제거
function deleteTransaction(targetTransaction) {
    if(targetTransaction === undefined) return;

    if(!confirm("정말 삭제하시겠습니까?")) return;

    const typeValue = TYPE_OPTIONS[targetTransaction.type];
    const categoryValue = categoryOptions[targetTransaction.type].find(
        option => option.value === targetTransaction.category
    );

    //반복 거래가 있을 때와 없을 때로 분리
    if(targetTransaction.isRecurringOccurrence === true) {
        const originalTransaction = transactions.find(transaction => transaction.id === targetTransaction.originalTransactionId);

        if(!originalTransaction) {
            console.error("원본 반복 거래를 찾을 수 없습니다.", targetTransaction);
            TOAST.show("원본 반복 거래를 찾을 수 없습니다!");
            return;
        }

        //'제거할 반복 거래를 저장해두는 배열'이 없다면
        if(!Array.isArray(originalTransaction.excludedDates)) originalTransaction.excludedDates = [];

        if(confirm("반복 거래입니다. 반복 거래 전체를 삭제하시겠습니까?")) {
            transactions = transactions.filter(transaction => transaction.id !== originalTransaction.id);
        } else if(confirm("이번 내역 이후의 거래를 모두 삭제하시겠습니까? '취소'를 누르면 이번 거래만 삭제됩니다.")) {
            //선택한 발생일의 전날을 새로운 종료일로 설정(종료일이 있는 반복 거래로 만드는 것.)
            const occurrenceDate = new Date(`${targetTransaction.date}T00:00:00`);
            occurrenceDate.setDate(occurrenceDate.getDate() - 1);

            const newEndDate = [
                occurrenceDate.getFullYear(),
                String(occurrenceDate.getMonth() + 1).padStart(2, "0"),
                String(occurrenceDate.getDate()).padStart(2, "0")
            ].join("-");

            //기존 종료일이 없거나, 새 종료일이 기존 종료일보다 빠른 경우에만 변경
            if (originalTransaction.repeatEndType !== "date" || !originalTransaction.repeatEndDate || newEndDate < originalTransaction.repeatEndDate) {
                originalTransaction.repeatEndType = "date";
                originalTransaction.repeatEndDate = newEndDate;
            }
        } else {
            //선택한 발생 날짜를 제외 목록에 추가
            if(!originalTransaction.excludedDates.includes(targetTransaction.date)) originalTransaction.excludedDates.push(targetTransaction.date);
        }
    } else {
        transactions = transactions.filter(transaction => transaction.id !== targetTransaction.id);
    }    

    saveTransactions();
    renderPage();

    TOAST.show(`${typeValue}, ${categoryValue.label} 카테고리의 ${targetTransaction.amount.toLocaleString('ko-KR')} 원 거래를 삭제했습니다!`,
                targetTransaction);

}

//거래 복원
function restoreTransaction(targetTransaction) {
    transactions.push(targetTransaction);

    saveTransactions();
    renderPage();

    TOAST.show("성공적으로 복원되었습니다!");
}

//거래 수정 시작
function editStart(targetTransaction) {
    if(targetTransaction === undefined) return;

    editingOccurrenceOnly = false;
    editingOccurrenceDate = null;
    editingOccurrenceData = null;    

    //단일 반복 거래만 수행하고자 한다면 옵션들을 활성화. 이후 editEnd()에서 옵션을 판단하고 코드를 진행.
    if(targetTransaction.isRecurringOccurrence === true) {
        editingOccurrenceOnly = confirm("이번 반복 거래만 수정하시겠습니까?");

        editingId = targetTransaction.originalTransactionId;

        if(editingOccurrenceOnly) {
            editingOccurrenceDate = targetTransaction.date;

            editingOccurrenceData = {
                date: targetTransaction.date,
                amount: Number(targetTransaction.amount),
                type: targetTransaction.type,
                category: targetTransaction.category,
                description: targetTransaction.description
            };
        }
    } else {
        editingId = targetTransaction.id;
    }

    isEditing = true;

    dateInput.value = targetTransaction.date;
    amountInput.value = Number(targetTransaction.amount);
    typeSelect.value = targetTransaction.type;
        currentTypeSelect = targetTransaction.type;
        updateCategoryOptions("input", currentTypeSelect, categorySelect);
    categorySelect.value = targetTransaction.category;
    descriptionInput.value = targetTransaction.description;
    repeatSelect.checked = targetTransaction.repeat;

    //나중에 수정될 수 있는 비활성화.
    dateInput.disabled = editingOccurrenceOnly;

    if(targetTransaction.repeat === true) {
        repeatOptionArea.style.display = "block";
        repeatFrequencySelect.value = targetTransaction.repeatType;
        
        repeatIntervalOptionHTML();

        repeatIntervalSelect.value = String(targetTransaction.repeatInterval);

        const selectedRepeatEnd = document.querySelector(`input[name="repeatEndType"][value="${targetTransaction.repeatEndType}"]`);

        if(selectedRepeatEnd) selectedRepeatEnd.checked = true;
        repeatEndDateInput.value = targetTransaction.repeatEndDate ?? "";
        repeatEndDateInput.disabled = targetTransaction.repeatEndType !== "date";
    } else {
        repeatOptionArea.style.display = "none";
        repeatEndDateInput.disabled = true;
    }

    editCancelBtn.style.display = "block";
    addBtn.textContent = "수정 완료";
    amountInput.focus();
}

//거래 수정 완료
function editEnd() {
    const editTransaction = transactions.find(transaction => transaction.id === editingId);

    if(!editTransaction) {
        console.error("수정할 거래를 찾을 수 없습니다.", {editingId, isEditing});
        TOAST.show("수정할 거래를 찾을 수 없습니다!");
        return;
    }

    if(editingOccurrenceOnly) {
        const isChanged = editingOccurrenceData.amount !== Number(amountInput.value) ||
                            editingOccurrenceData.type !== typeSelect.value ||
                            editingOccurrenceData.category !== categorySelect.value ||
                            editingOccurrenceData.description !== descriptionInput.value;

        if(!isChanged) {
            editCancelBtn.click();
            return;
        }

        //수정할 내역을 저장할 객체가 없다면
        if(!editTransaction.occurrenceOverrides || Array.isArray(editTransaction.occurrenceOverrides)) editTransaction.occurrenceOverrides = {};

        //원래 거래 발생일을 기준으로 수정 내용 저장
        editTransaction.occurrenceOverrides[editingOccurrenceDate] = {
            amount: Number(amountInput.value),
            type: typeSelect.value,
            category: categorySelect.value,
            description: descriptionInput.value
        };

        editTransaction.updatedAt = Date.now();

        editingId = null;
        isEditing = false;
        editingOccurrenceOnly = false;
        editingOccurrenceDate = null;
        editingOccurrenceData = null;

        //나중에 수정될 수 있는 활성화.
        dateInput.disabled = false;

        saveTransactions();
        renderPage();

        resetInputForm();

        TOAST.show("이번 반복 거래만 수정되었습니다!");
        return;
    }

    const selectedRepeatEnd = document.querySelector('input[name="repeatEndType"]:checked');

    const isChanged = editTransaction.date !== dateInput.value ||
                        editTransaction.amount !== Number(amountInput.value) ||
                        editTransaction.type !== typeSelect.value ||
                        editTransaction.category !== categorySelect.value ||
                        editTransaction.description !== descriptionInput.value ||
                        editTransaction.repeat !== repeatSelect.checked ||
                        editTransaction.repeatType !== repeatFrequencySelect.value ||
                        editTransaction.repeatInterval !== Number(repeatIntervalSelect.value) ||
                        editTransaction.repeatEndType !== selectedRepeatEnd.value ||
                        editTransaction.repeatEndDate !== repeatEndDateInput.value;

    if(!isChanged) {
        editCancelBtn.click();
        return;
    }

    editTransaction.date = dateInput.value;
    editTransaction.amount = Number(amountInput.value);
    editTransaction.type = typeSelect.value;
    editTransaction.category = categorySelect.value;
    editTransaction.description = descriptionInput.value;
    editTransaction.repeat = repeatSelect.checked;
    editTransaction.updatedAt = Date.now();

    if(editTransaction.repeat === true) {
        editTransaction.repeatType = repeatFrequencySelect.value;
        editTransaction.repeatInterval = Number(repeatIntervalSelect.value);
        editTransaction.repeatEndType = selectedRepeatEnd?.value ?? "never";
        editTransaction.repeatEndDate = selectedRepeatEnd.value === "date" ? repeatEndDateInput.value : null;
    } else {
        editTransaction.repeatType = null;
        editTransaction.repeatInterval = null;
        editTransaction.repeatEndType = null;
        editTransaction.repeatEndDate = null;       
    }

    editingId = null;
    isEditing = false;
    editingOccurrenceOnly = false;
    editingOccurrenceDate = null;
    editingOccurrenceData = null;

    saveTransactions();
    renderPage();

    resetInputForm();

    TOAST.show("성공적으로 수정되었습니다!");
}

//거래 복제
function copyTransaction(targetTransaction) {
    const now = Date.now();

    const copiedTransaction = {
        ...targetTransaction,
        id: now,
        createdAt: now,
        updatedAt: now
    };

    transactions.push(copiedTransaction);

    saveTransactions();
    renderPage();

    TOAST.show("성공적으로 복제했습니다!");
}

//거래 카드 생성
function createTransactionCard(transaction) {
    const card = document.createElement("div");
    card.classList.add("budget-card");

    const cardHeader = document.createElement("div");
    cardHeader.classList.add("budget-card-header");

        const dateDiv = document.createElement("div");
        dateDiv.classList.add("budget-card-new-date-card");
            const dateLable = document.createElement("p");
            dateLable.textContent = transaction.date;
            dateLable.classList.add("budget-card-header-date");
        dateDiv.addEventListener("click", () => {
            //이미 이 창이 있다면 중복 생성하지 않도록.
            if(dateDiv.querySelector("input[type='date']")) return;

            const dateSelectDiv = document.createElement("div");

            const newDateSelect = document.createElement("input");
            newDateSelect.type = "date";
            newDateSelect.value = transaction.date;

            const doneBtn = document.createElement("button");
            doneBtn.textContent = "완료";
            doneBtn.addEventListener("click", (event) => {
                event.stopPropagation();
                
                if(!newDateSelect.value) return;

                transaction.date = newDateSelect.value;

                saveTransactions();
                renderPage();
            })

            const cancelBtn = document.createElement("button");
            cancelBtn.textContent = "취소";
            cancelBtn.addEventListener("click", (event) => {
                event.stopPropagation();
                dateSelectDiv.remove();
            });

            dateSelectDiv.addEventListener("click", (event) => {
                event.stopPropagation();
            });
            
            dateSelectDiv.append(newDateSelect, doneBtn, cancelBtn);
            dateDiv.append(dateSelectDiv);
        });
        dateDiv.append(dateLable);

        const type = document.createElement("p");
        type.textContent = TYPE_OPTIONS[transaction.type];
        type.classList.add(`budget-card-header-badge-${transaction.type}`);

        const categoryOption = categoryOptions[transaction.type].find(
            option => option.value === transaction.category
        );
        const category = document.createElement("p");
        category.textContent = categoryOption.label;
        category.classList.add("budget-card-header-badge");

        const repeat = document.createElement("p");
        repeat.textContent = transaction.repeat ? `반복중 ${transaction.repeatType} ${transaction.repeatInterval}` : "반복안함";
        repeat.classList.add("budget-card-header-badge");

        cardHeader.append(dateDiv, type, category, repeat);

    card.append(cardHeader);

    const cardMain = document.createElement("div");
    cardMain.classList.add("budget-card-main");

        const amount = document.createElement("p");
        amount.textContent = `▶ ${transaction.amount.toLocaleString('ko-KR')} 원`;
        amount.classList.add("budget-card-amount");
        cardMain.append(amount);

        if(transaction.description !== "") {
            const description = document.createElement("p");
            description.textContent = transaction.description;
            description.classList.add("budget-card-description");
            cardMain.append(description);
        }
    
    card.append(cardMain);

    const cardDate = document.createElement("div");
    cardDate.classList.add("budget-card-date");

        const createdDate = document.createElement("p");
        createdDate.textContent = `생성일: ${new Date(transaction.createdAt).toLocaleString('ko-KR')}`;
        cardDate.append(createdDate);

        if(transaction.createdAt !== transaction.updatedAt) {
            const updatedDate = document.createElement("p");
            updatedDate.textContent = `수정일: ${new Date(transaction.updatedAt).toLocaleString('ko-KR')}`;
            cardDate.append(updatedDate);
        }

    card.append(cardDate);

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️ 수정";
    editBtn.addEventListener("click", () => { editStart(transaction); });
    editBtn.classList.add("budget-card-button");
    card.append(editBtn);

    const copyBtn = document.createElement("button");
    copyBtn.textContent = "📄 복제";
    copyBtn.addEventListener("click", () => { copyTransaction(transaction); });
    copyBtn.classList.add("budget-card-button");
    card.append(copyBtn);

    const delBtn = document.createElement("button");
    delBtn.textContent = "❌ 삭제";
    delBtn.addEventListener("click", () => { deleteTransaction(transaction) });
    delBtn.classList.add("budget-card-button");
    card.append(delBtn);

    return card;
}

//render function
//페이지를 렌더링
function renderPage() {
    const filteredTransactions = getVisibleTransactions();
    const groupedTransactions = groupTransactionsByDate(filteredTransactions);
    const dailySummary = calculateDailySummary(groupedTransactions);

    renderTransactions(filteredTransactions, groupedTransactions, dailySummary);
    renderSummary();

    //반복 거래와 반복하지 않는 거래를 합쳐서 날짜순으로 정렬.
    const monthTransactions = getAllTransactionByMonth(selectedMonthDate).sort((a, b) => a.date.localeCompare(b.date));
    
    //날짜별로 그룹화.
    const monthGroupedTransactions = groupTransactionsByDate(monthTransactions);

    const monthDailySummary = calculateDailySummary(monthGroupedTransactions);
    const startingBalance = getMonthlyStartingBalance(selectedMonthDate);
    monthlyCumulativeChangeStartingBalance.value = startingBalance;
    const balanceSummary = calculateBalanceSummary(monthDailySummary, startingBalance);

    renderDailyChangeChart(monthDailySummary);
    renderSpendingInsights(monthDailySummary);
    renderBalanceChart(balanceSummary);
}

function renderTransactions(filteredTransactions, groupedTransactions, dailySummary) {
    budgetList.innerHTML = "";

    displayFilteredTransactionsNumber.textContent = `현재 표시되는 거래 내역은 ${filteredTransactions.length}건 입니다.`;

    if (!filteredTransactions.length) {
        const message = transactions.length === 0
                ? "❌ 아직 등록된 거래가 없습니다!"
                : "❎ 조건에 맞는 거래가 없습니다!";

        budgetList.textContent = message;
        return;
    }

    const sortedDates = Object.keys(groupedTransactions).sort((a, b) => {
        if (currentSortFilter === "dates_desc") { return new Date(b) - new Date(a); }

        return new Date(a) - new Date(b);
    });

    sortedDates.forEach(date => {
        budgetList.append(renderSummarySubtotal(date, groupedTransactions[date], dailySummary));
    });
}

function renderSummarySubtotal(date, dateTransactions, dailySummary) {
    const groupingCard = document.createElement("div");
    groupingCard.classList.add("grouping-budget-card");

    const dateTitle = document.createElement("h3");
    dateTitle.textContent = date;
    groupingCard.append(dateTitle);

    dateTransactions.forEach(transaction => {
        groupingCard.append(createTransactionCard(transaction));
    });

    const subtotal = dailySummary[date];

    const subtotalContainer = document.createElement("div");
    subtotalContainer.classList.add("grouping-budget-card-subtotal");

    const subtotalTypeContainer = document.createElement("div");
    subtotalTypeContainer.classList.add("grouping-budget-card-type-subtotal");

        const incomeText = document.createElement("p");
        incomeText.textContent = `수입: ${subtotal.incomeAmount.toLocaleString("ko-KR")}원`;

        const expenseText = document.createElement("p");
        expenseText.textContent = `지출: ${subtotal.expenseAmount.toLocaleString("ko-KR")}원`;

        const savingText = document.createElement("p");
        savingText.textContent = `저축: ${subtotal.savingAmount.toLocaleString("ko-KR")}원`;

        const investmentText = document.createElement("p");
        investmentText.textContent = `투자: ${subtotal.investmentAmount.toLocaleString("ko-KR")}원`;

    subtotalTypeContainer.append(incomeText, expenseText, savingText, investmentText);

    const dailyChangeText = document.createElement("p");
    dailyChangeText.textContent = `일일 변동: ${subtotal.subtotalAmount.toLocaleString("ko-KR")}원`;

    const cumulativeText = document.createElement("p");
    cumulativeText.textContent = `누적: ${subtotal.cumulativeAmount.toLocaleString("ko-KR")}원`;

    subtotalContainer.append(subtotalTypeContainer, dailyChangeText,cumulativeText);
    groupingCard.append(subtotalContainer);

    return groupingCard;
}

function groupTransactionsByDate(targetTransactions) {
    return targetTransactions.reduce((result, transaction) => {
        if (!result[transaction.date]) {
            result[transaction.date] = [];
        }

        result[transaction.date].push(transaction);

        return result;
    }, {});
}

//monthly graph function
//누적 변동 그래프
function renderBalanceChart(balanceSummary) {
    const width = 800;
    const height = 300;
    const padding = 60;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.classList.add("balance-chart");

    const dates = Object.keys(balanceSummary);
    const values = dates.map(date => balanceSummary[date]);

    const maxValue = Math.max(...values, 0);
    const minValue = Math.min(...values, 0);

    const points = [];

    //0원 기준선
    const zeroY = balanceChartgetY(0, minValue, maxValue, height, padding);
    createZeroLine(svg, zeroY, padding, width);

    const tooltip = document.createElement("div");
    tooltip.classList.add("balance-chart-tooltip");
    tooltip.style.display = "none";

    //날짜별 점
    dates.forEach((date, index) => {
        const value = balanceSummary[date];

        const x = balanceChartgetX(index, dates.length, width, padding);
        const y = balanceChartgetY(value, minValue, maxValue, height, padding);

        points.push(`${x},${y}`);

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", "4");
        circle.addEventListener("mouseenter", () => {
            tooltip.textContent = `${formatChartDate(date)}: ${value.toLocaleString("ko-KR")}원`;
            tooltip.style.display = "block";
        });
        circle.addEventListener("mousemove", event => {
            const rect = monthlyCumulativeChangeChartGraph.getBoundingClientRect();
            const left = event.clientX - rect.left;
            const top = event.clientY - rect.top;
            setupChartTooltip(tooltip, left, top, index === dates.length - 1);
        });
        circle.addEventListener("mouseleave", () => {
            tooltip.style.display = "none";
        });
        svg.append(circle);

        if(shouldShowDateLabel(index, dates)) {
            svg.append(createDateText(x, height, date));
        }
    });

    const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    polyline.setAttribute("points", points.join(" "));
    polyline.setAttribute("fill", "none");
    polyline.setAttribute("stroke", "black");
    polyline.setAttribute("stroke-width", "2");

    svg.append(polyline);

    monthlyCumulativeChangeChartGraph.innerHTML = "";
    monthlyCumulativeChangeChartGraph.append(svg, tooltip);
}

//일일 변동 그래프
function renderDailyChangeChart(dailySummary) {
    const width = 800;
    const height = 300;
    const padding = 60;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.classList.add("daily-change-chart");

    const dates = Object.keys(dailySummary);
    const values = dates.map(date => dailySummary[date].subtotalAmount);
    const maxValue = Math.max(...values, 0);
    const minValue = Math.min(...values, 0);

    const zeroY = balanceChartgetY(0, minValue, maxValue, height, padding);
    createZeroLine(svg, zeroY, padding, width);

    const tooltip = document.createElement("div");
    tooltip.classList.add("balance-chart-tooltip");
    tooltip.style.display = "none";

    dates.forEach((date, index) => {
        const value = dailySummary[date].subtotalAmount;
        const x = balanceChartgetX(index, dates.length, width, padding);
        const y = balanceChartgetY(value, minValue, maxValue, height, padding);

        const barY = value >= 0 ? y : zeroY;
        const barHeight = Math.abs(y - zeroY);

        const bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        bar.setAttribute("x", x - 7);
        bar.setAttribute("y", barY);
        bar.setAttribute("width", "14");
        bar.setAttribute("height", barHeight);
        bar.addEventListener("mouseenter", () => {
            tooltip.textContent = `${formatChartDate(date)}: ${value.toLocaleString("ko-KR")}원`;
            tooltip.style.display = "block";
        });
        bar.addEventListener("mousemove", event => {
            const rect = monthlyDailyChangeChartGraph.getBoundingClientRect();
            const left = event.clientX - rect.left;
            const top = event.clientY - rect.top;
            setupChartTooltip(tooltip, left, top, index === dates.length - 1);
        });
        bar.addEventListener("mouseleave", () => {
            tooltip.style.display = "none";
        });
        svg.append(bar);

        if(shouldShowDateLabel(index, dates)) {
            svg.append(createDateText(x, height, date));
        }
    });

    monthlyDailyChangeChartGraph.innerHTML = "";
    monthlyDailyChangeChartGraph.append(svg, tooltip);
}

//월간 소비 인사이트
function renderSpendingInsights(monthDailySummary) {
    monthlySpendingInsights.innerHTML = "";

    if(getAllTransactionByMonth(selectedMonthDate).length === 0) {
        const message = "거래가 존재하지 않습니다!";
        monthlySpendingInsights.append(message);
        return;
    }

    const dates = Object.keys(monthDailySummary);
    const expenseValues = dates.map(date => monthDailySummary[date].expenseAmount);
    const incomeValues = dates.map(date => monthDailySummary[date].incomeAmount);

    const maxExpense = document.createElement("p");
    const maxExpenseAmount = Math.max(...expenseValues, 0);
    if(maxExpenseAmount === 0) {
        maxExpense.textContent = "이번 달 지출이 없습니다!";
    } else {
        const maxExpenseDate = dates.find(date => monthDailySummary[date].expenseAmount === maxExpenseAmount);
        maxExpense.textContent = `가장 많은 지출: ${formatChartDate(maxExpenseDate)}, (${maxExpenseAmount.toLocaleString('ko-KR')}원)`;
    }

    const maxExpenseCategory = document.createElement("p");
    const expenseTransactions = getAllTransactionByMonth(selectedMonthDate);
    const expenseCategoryAmounts = summarySumAmount(expenseTransactions, "type", "expense", "category");
    const maxExpenseCategoryAmount = Math.max(...Object.values(expenseCategoryAmounts), 0);
    if(maxExpenseCategoryAmount === 0) {
        maxExpenseCategory.textContent = "가장 많은 지출 카테고리: 없음";
    } else {
        const maxExpenseCategoryValue = Object.keys(expenseCategoryAmounts).find(category => expenseCategoryAmounts[category] === maxExpenseCategoryAmount);
        const maxExpenseCategoryOption = categoryOptions.expense.find(option => option.value === maxExpenseCategoryValue);
        maxExpenseCategory.textContent = `가장 많은 지출 카테고리: ${maxExpenseCategoryOption?.label ?? "-"} (${maxExpenseCategoryAmount.toLocaleString('ko-KR')}원)`;
    }

    const maxIncome = document.createElement("p");
    const maxIncomeAmount = Math.max(...incomeValues, 0);
    if(maxIncomeAmount === 0) {
        maxIncome.textContent = "이번 달 수입이 없습니다!";
    } else {
        const maxIncomeDate = dates.find(date => monthDailySummary[date].incomeAmount === maxIncomeAmount);
        maxIncome.textContent = `가장 많은 수입: ${formatChartDate(maxIncomeDate)}, (${maxIncomeAmount.toLocaleString('ko-KR')}원)`;
    }

    monthlySpendingInsights.append(maxExpense, maxExpenseCategory, maxIncome);
}

//monthly graph util function
function balanceChartgetX(index, count, width, padding) {
    if (count === 1) return width / 2;

    return padding
        + index / (count - 1)
        * (width - padding * 2);
}

function balanceChartgetY(value, minValue, maxValue, height, padding) {
    if (maxValue === minValue) return height / 2;

    return height - padding
        - ((value - minValue) / (maxValue - minValue))
        * (height - padding * 2);
}

function calculateDailySummary(groupedTransactions) {
    const calculationDates = Object.keys(groupedTransactions).sort((a, b) => new Date(a) - new Date(b));

    let cumulativeAmount = 0;

    const dailySummary = {};

    calculationDates.forEach(date => {
        const dateTransactions = groupedTransactions[date];
        const dateSubtotal = calculateDateSubtotal(dateTransactions);

        cumulativeAmount += dateSubtotal.subtotalAmount;

        dailySummary[date] = { ...dateSubtotal, cumulativeAmount };
    });

    return dailySummary;
}

    function calculateDateSubtotal(dateTransactions) {
        const incomeAmount = summaryTransactionAmount(dateTransactions, "type", "income");
        const expenseAmount = summaryTransactionAmount(dateTransactions, "type", "expense");
        const savingAmount = summaryTransactionAmount(dateTransactions, "type", "saving");
        const investmentAmount = summaryTransactionAmount(dateTransactions, "type", "investment");
        const subtotalAmount = incomeAmount - expenseAmount - savingAmount - investmentAmount;

        return { incomeAmount, expenseAmount, savingAmount, investmentAmount, subtotalAmount };
    }

    function calculateBalanceSummary(dailySummary, startingBalance) {
        const balanceSummary = {};

        Object.keys(dailySummary).forEach(date => {
            balanceSummary[date] = startingBalance + dailySummary[date].cumulativeAmount;
        });

        return balanceSummary;
    }

function shouldShowDateLabel(index, dates) {
    if (dates.length < 15) return true;

    const interval = Math.ceil(dates.length / 7);

    return index % interval === 0 || index === dates.length - 1;
}

function createZeroLine(svg, zeroY, padding, width) {
    const zeroLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    zeroLine.setAttribute("x1", padding);
    zeroLine.setAttribute("x2", width - padding);
    zeroLine.setAttribute("y1", zeroY);
    zeroLine.setAttribute("y2", zeroY);
    zeroLine.setAttribute("stroke", "black");
    zeroLine.setAttribute("stroke-width", "1");
    svg.append(zeroLine);
}

function setupChartTooltip(tooltip, left, top, isLast) {
    if(isLast) {
        tooltip.style.left = `${left - 10}px`;
        tooltip.style.transform = "translateX(-100%)";
    } else {
        tooltip.style.left = `${left + 10}px`;
        tooltip.style.transform = "translateX(0)";
    }

    tooltip.style.top = `${top + 10}px`;
}

function createDateText(x, height, date) {
    const dateText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    dateText.setAttribute("x", x);
    dateText.setAttribute("y", height - 10);
    dateText.setAttribute("text-anchor", "middle");
    dateText.setAttribute("font-size", "12px");
    dateText.textContent = formatChartDate(date);
    return dateText;
}

//월별 시작 잔액을 가져오는 함수
function getMonthlyStartingBalance(targetDate) {
    const monthKey = getMonthKey(targetDate);
    if (Object.prototype.hasOwnProperty.call(monthlyStartingBalances, monthKey)) {
        return Number(monthlyStartingBalances[monthKey]);
    }

    //최초로 기록한 달 이전에는 기준 잔액을 0원으로 가정
    const earliestMonthKey = getEarliestTrackedMonthKey();
    if (!earliestMonthKey || monthKey <= earliestMonthKey) return 0;

    //저장된 시작 잔액이 없다면 이전 달의 마지막 잔액을 이어받기
    const prevMonthDate = new Date(targetDate.getFullYear(), targetDate.getMonth() - 1, 1);
    return getMonthlyEndingBalance(prevMonthDate);
}

//기록이 시작된 가장 이른 달을 찾는 함수
function getEarliestTrackedMonthKey() {
    //최초 기준점 확인
    const transactionMonthKeys = transactions.map(transaction => getMonthKey(transaction.date));
    const savedMonthKey = Object.keys(monthlyStartingBalances);

    const monthKeys = [ ...transactionMonthKeys, ...savedMonthKey ].sort();

    return monthKeys[0] ?? null;
}

//이전 달의 마지막 잔액을 계산하는 함수
function getMonthlyEndingBalance(targetDate) {
    //시작 잔액 + 해당 월의 누적 변동액
    const startingBalance = getMonthlyStartingBalance(targetDate);

    const monthTransactions = getTransactionsByMonth(targetDate);
    const groupedTransactions = groupTransactionsByDate(monthTransactions);
    const dailySummary = calculateDailySummary(groupedTransactions);

    const dates = Object.keys(dailySummary).sort();

    const lastCumulativeChange = dates.length > 0
        ? dailySummary[dates[dates.length - 1]].cumulativeAmount
        : 0;

    return startingBalance + lastCumulativeChange;
}

function resetMonthlyStartingBalance() {
    const monthKey = getMonthKey(selectedMonthDate);

    //선택한 달에 저장된 시작 잔액을 제거
    delete monthlyStartingBalances[monthKey];

    //변경된 월별 시작 잔액을 저장
    localStorage.setItem(MONTHLY_STARTING_BALANCES, JSON.stringify(monthlyStartingBalances));

    //이전 달의 마지막 잔액을 기준으로 다시 계산
    renderPage();
}

//filter function
function getVisibleTransactions() {
    //두 가지 배열을 하나로 묶는 구문(전개 구문) 사용.
    let filteredTransactions = getAllTransactionByMonth(selectedMonthDate);

    filteredTransactions = filterByType(filteredTransactions);
    filteredTransactions = filterByCategory(filteredTransactions);
    filteredTransactions = filterByKeyword(filteredTransactions);
    filteredTransactions = sortTransactions(filteredTransactions);

    return filteredTransactions;
}

function getTransactionsByMonth(_targetDate) {
    return transactions.filter(transaction => {
        const dataDate = new Date(transaction.date);
        const targetDate = new Date(_targetDate);

        return (
            dataDate.getFullYear() === targetDate.getFullYear() &&
            dataDate.getMonth() === targetDate.getMonth()
        );
    });
}

function filterByType(filteredTransactions) {
    if(currentTypeFilter === "all") return filteredTransactions;

    return filteredTransactions.filter(transaction => transaction.type === currentTypeFilter);
}

function filterByCategory(filteredTransactions) {
    if(currentCategoryFilter === "all") return filteredTransactions;

    return filteredTransactions.filter(transaction => transaction.category === currentCategoryFilter);
}

function filterByKeyword(filteredTransactions) {
    if(currentKeyword === "") return filteredTransactions;

    return filteredTransactions.filter(transaction => {
        const amountMatch = (String(transaction.amount) || "").toLowerCase().includes(currentKeyword);
        const descriptionMatch = (transaction.description || "").toLowerCase().includes(currentKeyword);

        return amountMatch || descriptionMatch;
    });
}

function sortTransactions(filteredTransactions) {
    return filteredTransactions.sort((a,b) => {
        switch(currentSortFilter) {
            case "latest":
                return b.createdAt - a.createdAt;

            case "oldest":
                return a.createdAt - b.createdAt;

            case "dates_desc":
                return new Date(b.date) - new Date(a.date);

            case "dates_asc":
                return new Date(a.date) - new Date(b.date);

            case "amount_desc":
                return b.amount - a.amount;

            case "amount_asc":
                return a.amount - b.amount;
        }
    });
}

//반복 회차 번호(occurenceIndex)를 받아 실제 발생 날짜를 계산하는 함수
function getRecurringDate(transaction, occurrenceIndex) {
    const [year, month, day] = transaction.date.split("-").map(Number);
    const interval = Number(transaction.repeatInterval);

    let targetYear = year;
    let targetMonth = month - 1;
    let targetDay = day;

    switch (transaction.repeatType) {
        case "daily": {
            const date = new Date(year, month - 1, day);
            date.setDate(date.getDate() + occurrenceIndex * interval);
            return date;
        }

        case "weekly": {
            const date = new Date(year, month - 1, day);
            date.setDate(date.getDate() + occurrenceIndex * interval * 7);
            return date;
        }

        case "monthly":
            targetMonth += occurrenceIndex * interval;
            break;

        case "yearly":
            targetYear += occurrenceIndex * interval;
            break;

        default:
            return null;
    }

    const lastDate = new Date(targetYear, targetMonth + 1, 0).getDate();
    targetDay = Math.min(day, lastDate);

    return new Date(targetYear, targetMonth, targetDay);
}

//선택한 달에 발생하는 반복 거래 개체를 배열로 반환.
function getRecurringTransactionsForMonth(transaction, selectedMonthDate) {
    const result = [];

    const targetYear = selectedMonthDate.getFullYear();
    const targetMonth = selectedMonthDate.getMonth();

    //현재 조회하는 달이 반복 거래를 만들기 이전의 달이라면
    const startDate = new Date(`${transaction.date}T00:00:00`);
    if (startDate.getFullYear() > selectedMonthDate.getFullYear() ||
        (startDate.getFullYear() === selectedMonthDate.getFullYear() &&
        startDate.getMonth() > selectedMonthDate.getMonth())) {
        return [];
    }
    
    //종료일이 지정된 경우에 사용
    const endDate = transaction.repeatEndType === "date" ? new Date(`${transaction.repeatEndDate}T00:00:00`) : null;

    for (let i = 0; ; i++) {
        //현재 회차에서 실제 거래를 생성할 날짜를 받아오는 것
        const recurringDate = getRecurringDate(transaction, i);

        if (!recurringDate) break;

        //계산된 날짜가 종료일을 넘은 경우
        if (endDate && recurringDate > endDate) break;

        //조회 대상 년,월을 넘어간 경우
        if (recurringDate.getFullYear() > targetYear ||
            (recurringDate.getFullYear() === targetYear && recurringDate.getMonth() > targetMonth)) {
            break;
        }

        //조회 대상 년,월인 경우
        if (recurringDate.getFullYear() === targetYear && recurringDate.getMonth() === targetMonth) {
            //원본 거래 복사, 새 아이디 생성, 날짜는 반복 옵션에 따라 재배치
            const recurringDateString = [ recurringDate.getFullYear(),
                String(recurringDate.getMonth() + 1).padStart(2, "0"),
                String(recurringDate.getDate()).padStart(2, "0")].join("-");

            //excludedDates는 '반복 거래에서 삭제한 날짜를 저장하는 배열'
            //여기서 해당 날짜가 삭제 날짜라고 명시되어 있다면 값을 push하지 못한다.(반복 거래 제거)
            if ((transaction.excludedDates ?? []).includes(recurringDateString)) continue;

            //수정된 일자가 있다면 그것을 사용하고, 없다면 빈 배열 사용.
            const override = transaction.occurrenceOverrides?.[recurringDateString] ?? {};

            result.push({
                ...transaction,
                ...override,
                id: `${transaction.id}-${i}`,
                originalTransactionId: transaction.id,
                date: recurringDateString,
                isRecurringOccurrence: true
            });
        }
    }

    return result;
}

//월별 전체 거래를 가져오는 함수
function getAllTransactionByMonth(targetMonthDate) {
    const recurringTransactions = transactions.filter(transaction => transaction.repeat === true)
                                    .flatMap(transaction => getRecurringTransactionsForMonth(transaction, targetMonthDate));

    const regularTransactions = getTransactionsByMonth(targetMonthDate).filter(transaction => transaction.repeat !== true);


    //날짜순으로 반환
    return [...regularTransactions, ...recurringTransactions].sort((a, b) => a.date.localeCompare(b.date));
}

//summary function
function renderSummary() {
    summaryMonth();
    summaryCategory();
    createSummaryCategoryTotalCard();
    if(isSummaryGraph === true) summaryGraph();
    if(isComparison === true) budgetComparison();
}

function summaryMonth() {
    summaryMonthList.innerHTML = "";

    const targetTransactions = getAllTransactionByMonth(selectedMonthDate);
    const prevMonthDate = new Date(selectedMonthDate.getFullYear(), selectedMonthDate.getMonth() - 1, 1);
    const prevTargetTransactions = getAllTransactionByMonth(prevMonthDate);

    const current = {
        income: summaryTransactionAmount(targetTransactions, "type", "income"),
        expense: summaryTransactionAmount(targetTransactions, "type", "expense"),
        saving: summaryTransactionAmount(targetTransactions, "type", "saving"),
        investment: summaryTransactionAmount(targetTransactions, "type", "investment")
    };

    const previous = {
        income: summaryTransactionAmount(prevTargetTransactions, "type", "income"),
        expense: summaryTransactionAmount(prevTargetTransactions, "type", "expense"),
        saving: summaryTransactionAmount(prevTargetTransactions, "type", "saving"),
        investment: summaryTransactionAmount(prevTargetTransactions, "type", "investment")
    };

    current.balance = current.income - current.expense - current.saving - current.investment;
    previous.balance = previous.income - previous.expense - previous.saving - previous.investment;

    const summaryAreas = [ createSummaryMonthCompareArea("수입", current.income, previous.income),
        createSummaryMonthCompareArea("지출", current.expense, previous.expense, `${summaryPercentage(current.expense, current.income)}`, false),
        createSummaryMonthCompareArea("저축", current.saving, previous.saving, `${summaryPercentage(current.saving, current.income)}`),
        createSummaryMonthCompareArea("투자", current.investment, previous.investment, `${summaryPercentage(current.investment, current.income)}`),
        createSummaryMonthCompareArea("가용 금액 변동", current.balance, previous.balance)
    ];

    summaryMonthList.append(...summaryAreas);
}

function createSummaryMonthCompareArea(title, currentAmount, previousAmount, description = "", increaseIsGood = true) {
    const difference = currentAmount - previousAmount;

    const area = document.createElement("div");
    area.classList.add("summary-month-compare-area");

    const amountText = document.createElement("p");
    amountText.textContent = `이번 달 ${title}: ${currentAmount.toLocaleString('ko-KR')}원 ${description}`;

    const compareText = document.createElement("p");
    compareText.classList.add("summary-month-compare");

    if(difference === 0) compareText.textContent = "전월 대비 동일";
    else {
        compareText.textContent = `전월 대비: ${difference.toLocaleString('ko-KR')}원`;
        const isIncrese = difference > 0;
        const isGoodChange = isIncrese === increaseIsGood;

        area.classList.add(isGoodChange ? "summary-month-inc" : "summary-month-dec");
    }

    area.append(amountText, compareText);

    return area;
}

function summaryCategory() {
    summaryCategoryList.innerHTML = "";

    const monthKey = getMonthKey(selectedMonthDate);
    const selectedType = summaryCategoryType.value;
    const typeBudgets = summaryCategoryBudgets[monthKey]?.[selectedType] ?? {};

    const targetTransactions = getAllTransactionByMonth(selectedMonthDate);
    const categoryAmounts = summarySumAmount(targetTransactions, "type", summaryCategoryType.value, "category");
    const amounts = Object.values(categoryAmounts);
    const maxAmount = amounts.length > 0 ? Math.max(...amounts) : 0;
    const totalAmount = amounts.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    const categories = categoryOptions[summaryCategoryType.value] ?? [];

    const sortCategoryAmounts = categories.map(option => {
        const category = option.value;
        const amount = categoryAmounts[category] ?? 0;

        const saveBudget = typeBudgets[category];
        const budget = Number(saveBudget);

        const hasBudget = saveBudget !== undefined &&
                            saveBudget !== null &&
                            saveBudget !== "" &&
                            Number.isFinite(budget) &&
                            budget > 0;

        const utilizationRate = hasBudget ? amount / budget * 100 : null;
        
        let statusRank;

        if(!hasBudget) statusRank = 3;
        else if(utilizationRate >= 100) statusRank = 0;
        else if(utilizationRate >= 80) statusRank = 1;
        else statusRank = 2;

        return { category, amount, hasBudget, utilizationRate, statusRank };
    }).sort((a, b) => {
        //예산 상태순
        if(a.statusRank !== b.statusRank) return a.statusRank - b.statusRank;

        //같은 상태에서는 예산 사용률 높은 순
        if(a.hasBudget && b.hasBudget) return a.utilizationRate - b.utilizationRate;

        return b.amount - a.amount;
    });

    sortCategoryAmounts.forEach(({category, amount}) => {
        summaryCategoryList.append(createSummaryCategoryCard(category, amount, maxAmount, totalAmount));
    });
}

function summaryPercentage(typeAmount, incomeAmount) {
    if(incomeAmount === 0) return "-";

    const result = incomeAmount === 0 ? 0 : typeAmount / incomeAmount * 100;

    return `${result.toFixed(2)}%`;
}

function createSummaryCategoryCard(category, amount, maxAmount, totalAmount) {
    const width = maxAmount === 0 ? 0 : amount / maxAmount * 100;

    const options = categoryOptions[summaryCategoryType.value] ?? [];
    const categoryOption = options.find(option => option.value === category);
    const categoryLabel = categoryOption?.label ?? category;

    const card = document.createElement("div");
    card.classList.add("summary-category-card");

    const categoryHeaderDiv = document.createElement("div");
    categoryHeaderDiv.classList.add("summary-category-header");
    categoryHeaderDiv.style.fontSize = "18px";
        const categoryHeaderLabel = document.createElement("p");
        categoryHeaderLabel.style.fontWeight = 'bold';
        categoryHeaderLabel.textContent = `${categoryLabel}`;

        const categoryHeaderSummaryStateDiv = document.createElement("div");
        const categoryHeaderSummaryStateLabel = document.createElement("p");
        categoryHeaderSummaryStateLabel.classList.add("summary-category-summary-state-label");

        categoryHeaderSummaryStateDiv.append(categoryHeaderSummaryStateLabel);
    categoryHeaderDiv.append(categoryHeaderLabel, categoryHeaderSummaryStateDiv); 

    const budgetInputDiv = document.createElement("div");
    budgetInputDiv.classList.add("summary-category-budget");
        const budgetInputLabel = document.createElement("p");
        budgetInputLabel.textContent = `${categoryLabel}의 예산`;

        const monthKey = getMonthKey(selectedMonthDate);
        const selectedType = summaryCategoryType.value;
        const savedBudget = summaryCategoryBudgets[monthKey]?.[selectedType]?.[category];

        const budgetInput = document.createElement("input");
        budgetInput.type = "number";
        budgetInput.min = 0;
        budgetInput.step = "1000";
        budgetInput.classList.add("summary-category-budget");
        budgetInput.value = savedBudget;

        budgetInput.addEventListener("change", () => {
            const inputValue = budgetInput.value.trim();

            //input이 비어있지 않으면 진행.
            if(inputValue === "") {
                if(summaryCategoryBudgets[monthKey]) {
                    delete summaryCategoryBudgets[monthKey][category];

                    if((Object.keys(summaryCategoryBudgets[monthKey]).length === 0)) delete summaryCategoryBudgets[monthKey];
                }
            } else {
                const monthBudget = Number(inputValue);

                if(!Number.isFinite(monthBudget) || monthBudget < 0) return;

                //월의 예산 객체가 없으면, 선택된 거래 유형 객체가 없으면.
                if(!summaryCategoryBudgets[monthKey]) summaryCategoryBudgets[monthKey] = {};
                if(!summaryCategoryBudgets[monthKey][selectedType]) summaryCategoryBudgets[monthKey][selectedType] = {};

                summaryCategoryBudgets[monthKey][selectedType][category] = monthBudget;
            }

            saveSummaryCategoryBudget();
            renderPage();
        });
    budgetInputDiv.append(budgetInputLabel, budgetInput);

    const categorySummaryRank = document.createElement("div");
    categorySummaryRank.classList.add("category-summary-rank");

    const categorySummaryAmountDiv = document.createElement("div");
    categorySummaryAmountDiv.classList.add("summary-category-amount");
    categorySummaryAmountDiv.style.fontWeight = "bold";
        if(Number(budgetInput.value) !== 0) {
            const categorybudgetAmount = document.createElement("p");
            categorybudgetAmount.textContent = `예산: ${Number(budgetInput.value).toLocaleString('ko-KR')}원`;
            categorySummaryAmountDiv.append(categorybudgetAmount);
        }

        const categoryAmount = document.createElement("p");
        categoryAmount.textContent = `지출: ${amount.toLocaleString('ko-KR')}원`;
    categorySummaryAmountDiv.append(categoryAmount);

    const categoryCompareDiv = document.createElement("div");
    categoryCompareDiv.classList.add("summary-category-compare");
    categoryCompareDiv.style.fontSize = "14px";
        const categoryCompareLabel = document.createElement("p");
        categoryCompareLabel.textContent = "전월 대비 지출";

        const categoryCompareAmount = document.createElement("p");
        const prevMonthDate = new Date(selectedMonthDate.getFullYear(), selectedMonthDate.getMonth() - 1, 1);
        const prevTargetTransactions = getTransactionsByMonth(prevMonthDate);
        const prevAmount = summaryTransactionAmount(prevTargetTransactions, "category", category);
        const difference = amount - prevAmount;
        categoryCompareAmount.textContent = `${difference > 0 ? "+" : ""}${difference.toLocaleString("ko-KR")}원`;
        if(difference !== 0) {
            const isImprovement = summaryCategoryType.value === "expense" ? difference < 0 : difference > 0;
            categoryCompareDiv.classList.add(isImprovement ? "summary-month-inc" : "summary-month-dec");
        }
    categoryCompareDiv.append(categoryCompareLabel, categoryCompareAmount);

    const categoryExpenseComparisonRowDiv = document.createElement("div");
    categoryExpenseComparisonRowDiv.style.gap = "5px";
    categoryExpenseComparisonRowDiv.style.marginTop = "10px";
    categoryExpenseComparisonRowDiv.append(createRow("카테고리별 지출 비교", width, totalAmount, amount));

    const budgetUtilizationRateRowDiv = document.createElement("div");
    budgetUtilizationRateRowDiv.style.gap = "5px";
    budgetUtilizationRateRowDiv.style.marginTop = "10px";
        const remainingBudgetDiv = document.createElement("div");
        remainingBudgetDiv.classList.add("summary-category-remain-budget");
        remainingBudgetDiv.style.fontSize = "14px";
            const remainingBudgetLabel = document.createElement("p");            
            const remainingBudgetAmount = document.createElement("p");

            //유효한 예산이 설정되어 있는지 판단
            const hasBudget = savedBudget !== undefined && savedBudget > 0;
            //설정된 예산 금액
            const budgetAmount = hasBudget ? Number(savedBudget) : 0;
            //예산 사용률%
            const budgetUtilizationRate = hasBudget ? (amount / budgetAmount) * 100 : null;
            //예산에서 실제 지출을 뺀 금액
            const remainingBudget = hasBudget ? budgetAmount - amount : null;

            if(hasBudget) {
                remainingBudgetLabel.textContent = remainingBudget >= 0 ? "남은 예산" : "예산 초과";
                remainingBudgetAmount.textContent = `${Math.abs(remainingBudget).toLocaleString('ko-KR')}원`;
            } else {
                remainingBudgetLabel.textContent = "예산 상태";
                remainingBudgetAmount.textContent = "예산 미설정";
            }
        remainingBudgetDiv.append(remainingBudgetLabel, remainingBudgetAmount);
    budgetUtilizationRateRowDiv.append(createRow("예산 사용률", budgetUtilizationRate ?? 0, hasBudget ? budgetAmount : 0, amount, hasBudget, "budgetUtilization"), remainingBudgetDiv);
    
    budgetStatusAssessment(hasBudget, budgetUtilizationRate);

    card.append(categoryHeaderDiv, budgetInputDiv, categorySummaryRank, categorySummaryAmountDiv, categoryCompareDiv, categoryExpenseComparisonRowDiv, budgetUtilizationRateRowDiv);
    return card;

    function budgetStatusAssessment(hasBudget, rate) {
        categoryHeaderSummaryStateLabel.classList.remove("not-set", "budget-leeway", "budget-caution", "budget-over");

        if(!hasBudget) {
            categoryHeaderSummaryStateLabel.textContent = "예산 미설정";
            categoryHeaderSummaryStateLabel.classList.add("not-set");
        } else if(rate < 80) {
            categoryHeaderSummaryStateLabel.textContent = "예산 여유";
            categoryHeaderSummaryStateLabel.classList.add("budget-leeway");
        } else if(rate < 100) {
            categoryHeaderSummaryStateLabel.textContent = "예산 주의";
            categoryHeaderSummaryStateLabel.classList.add("budget-caution");
        } else if(rate === 100) {
            categoryHeaderSummaryStateLabel.textContent = "예산 한도 도달";
            categoryHeaderSummaryStateLabel.classList.add("budget-over");
        } else {
            categoryHeaderSummaryStateLabel.textContent = "예산 초과";
            categoryHeaderSummaryStateLabel.classList.add("budget-over");
        }
    }
}

    function createRow(label, width, percentageBase, amount, hasBudget = false, type = "none") {
        const div = document.createElement("div");

            const barLabel = document.createElement("p");
            barLabel.textContent = label;
            barLabel.style.textAlign = "left";
            barLabel.style.fontSize = "14px";

            const row = document.createElement("div");
            row.classList.add("summary-graph-row");

            const barTrack = document.createElement("div");
            barTrack.classList.add("summary-graph-track");

            const barChart = document.createElement("div");
            barChart.classList.add("summary-category-bar");
            barChart.style.width = `${Math.min(Math.max(width, 0), 100)}%`;

            const percentage = document.createElement("p");
            percentage.textContent = summaryPercentage(amount, percentageBase);

            if(type === "budgetUtilization") {
                barChart.classList.remove("not-set", "budget-leeway", "budget-caution", "budget-over");
                if (!hasBudget) {
                    barChart.classList.add("not-set");
                } else if (width < 80) {
                    barChart.classList.add("budget-leeway");
                } else if (width < 100) {
                    barChart.classList.add("budget-caution");
                } else {
                    barChart.classList.add("budget-over");
                }
            } else {
                barChart.style.background = "#8fb89a";
            }

            barTrack.append(barChart);
            row.append(barTrack, percentage);

        div.append(barLabel, row);
        
        return div;
    }

function createSummaryCategoryTotalCard() {
    summaryCategoryTotalBudgetArea.innerHTML = "";

    const monthKey = getMonthKey(selectedMonthDate);
    const selectedType = summaryCategoryType.value;
    const monthlyBudgets = summaryCategoryBudgets[monthKey] ?? {};
    const typeBudget = monthlyBudgets[selectedType] ?? {};
    const typeCategories = categoryOptions[selectedType] ?? [];
    const totalBudget = typeCategories.reduce((sum, option) => {
        const savedBudget = typeBudget[option.value];
        
        if(savedBudget === undefined || savedBudget === null || savedBudget === "") return sum;

        const budget = Number(savedBudget);

        return sum + Number(isFinite(budget) && budget >= 0 ? budget : 0);
    }, 0);
    const hasBudget = totalBudget !== undefined && totalBudget > 0;

    const monthTransactions = getAllTransactionByMonth(selectedMonthDate);
    const currentTypeAmount  = summaryTransactionAmount(monthTransactions, "type", selectedType);
    const remainingBudget = totalBudget - currentTypeAmount ;
    const budgetUtilizationRate = totalBudget > 0 ? currentTypeAmount  / totalBudget * 100 : null;

    const header = document.createElement("h3");
    header.textContent = "이번 달 예산 현황";

    const summaryDiv = document.createElement("div");
    summaryDiv.classList.add("summary-category-total-budget-summary-div");
    summaryDiv.style.fontWeight = "bold";

        const totalSummary = document.createElement("p");
        totalSummary.textContent = `전체 예산: ${totalBudget.toLocaleString('ko-KR')}원`;

        const currentSummary = document.createElement("p");
        currentSummary.textContent = `현재 지출: ${currentTypeAmount .toLocaleString('ko-KR')}원`;

    summaryDiv.append(totalSummary, currentSummary,);

    const rowDiv = document.createElement("div");
        const remainingExpenseDiv = document.createElement("div");
        remainingExpenseDiv.classList.add("summary-category-remain-budget");
        remainingExpenseDiv.style.fontSize = "14px";
            const remainingExpenseLabel = document.createElement("p");
            const remainingExpenseAmount = document.createElement("p"); 
            if(totalBudget > 0) {
                remainingExpenseLabel.textContent = `${remainingBudget >= 0 ? "남은 예산" : "예산 초과"}: `
                remainingExpenseAmount.textContent = `${Math.abs(remainingBudget).toLocaleString('ko-KR')}원`;
            }
            else {
                remainingExpenseLabel.textContent = "예산 미설정";
                remainingExpenseAmount.textContent = "";
            }
        remainingExpenseDiv.append(remainingExpenseLabel, remainingExpenseAmount);
        rowDiv.append(createRow("예산 사용률", budgetUtilizationRate ?? 0, totalBudget, currentTypeAmount, hasBudget, "budgetUtilization"), remainingExpenseDiv);

    summaryCategoryTotalBudgetArea.append(header, summaryDiv, rowDiv);
}

    //배열로 전달
    function summarySumAmount(targetTransaction, filterTarget, filterValue, reduceTarget) {
        return targetTransaction
            .filter(transaction => transaction[filterTarget] === filterValue)
            .reduce((result, transaction) => {
                result[transaction[reduceTarget]] = (result[transaction[reduceTarget]] || 0) + transaction.amount;

                return result;
            }, {});
    }

    //값으로 전달
    function summaryTransactionAmount(targetTransaction, filterTarget, filterValue) {
        return targetTransaction
            .filter(transaction => transaction[filterTarget] === filterValue)
            .reduce((result, transaction) => result + transaction.amount, 0);
    }

//graph function
//전달, 앞달 비교 기본 구조
function summaryGraph() {
    summaryGraphList.style.display = "block";
    summaryGraphList.innerHTML = "";

    const prevTransaction = getAllTransactionByMonth(prevMonthDate);
    const nowTransaction = getAllTransactionByMonth(selectedMonthDate);
    const nextTransaction = getAllTransactionByMonth(nextMonthDate);

    Object.keys(TYPE_OPTIONS)
        .filter(type => type !== "all")
        .forEach(type => {
            summaryGraphList.append(summaryGraphComparison(prevTransaction, nowTransaction, nextTransaction,type));
        });

    const hideBtn = document.createElement("button");
    hideBtn.textContent = "숨기기";
    hideBtn.classList.add("css-btn");
    hideBtn.addEventListener("click", () => {
        summaryGraphList.style.display = "none";

        isSummaryGraph = false;
        summaryGraphBtn.style.display = "inline";
        hideBtn.remove();
    });

    summaryGraphList.append(hideBtn);
}

//전달, 앞달 비교 그래프 생성
function summaryGraphComparison(prev, now, next, type) {
    const prevAmount = summaryTransactionAmount(prev, "type", type);
    const nowAmount = summaryTransactionAmount(now, "type", type);
    const nextAmount = summaryTransactionAmount(next, "type", type);

    const maxAmount = Math.max(prevAmount, nowAmount, nextAmount);

    const graph = document.createElement("div");
    graph.classList.add("summary-graph-group");

    const title = document.createElement("h3");
    title.textContent = `${TYPE_OPTIONS[type]} 비교`;
    graph.append(title);

    graph.append(
        createComparisonRow("이전", prevAmount, maxAmount),
        createComparisonRow("이번", nowAmount, maxAmount),
        createComparisonRow("다음", nextAmount, maxAmount)
    );

    return graph;
}

function createComparisonRow(label, amount, maxAmount) {
    const row = document.createElement("div");
    row.classList.add("summary-graph-row");

    const rowTextDiv = document.createElement("div");
    rowTextDiv.classList.add("summary-text-area");
        const rowLabel = document.createElement("p");
        rowLabel.textContent = `${label}`;

        const rowAmount = document.createElement("p");
        rowAmount.textContent = `${amount.toLocaleString("ko-KR")}원`;
    rowTextDiv.append(rowLabel, rowAmount);

    const barTrack = document.createElement("div");
    barTrack.classList.add("summary-graph-track");

    const bar = document.createElement("div");
    bar.classList.add("summary-category-bar");
    bar.style.background = "#8fb89a";

    const width = maxAmount === 0 ? 0 : amount / maxAmount * 100;

    bar.style.width = `${width}%`;

    barTrack.append(bar);
    row.append(rowTextDiv, barTrack);

    return row;
}

//budget comparison function
//예산 넣고 측정하기
function budgetComparison() {
    budgetComparisonList.style.display = "block";
    budgetComparisonList.innerHTML = "";

    const targetTransactions = getAllTransactionByMonth(selectedMonthDate);

    const budgetInput = document.createElement("input");
    budgetInput.type = "number";
    budgetInput.placeholder = "예산 입력";
    budgetComparisonList.append(budgetInput);

    const budgetCategorySelect = document.createElement("select");
    updateCategoryOptions("filter", "expense", budgetCategorySelect);
    budgetComparisonList.append(budgetCategorySelect);

    const consumeText = document.createElement("p");
    let categoryLabel;
    let consume = 0;

    const row = document.createElement("div");
    row.classList.add("summary-graph-row");

        const budgetConsumeComparison = document.createElement("p");

        const barTrack = document.createElement("div");
        barTrack.classList.add("summary-graph-track");

        const bar = document.createElement("div");
        bar.classList.add("summary-category-bar");    
        barTrack.append(bar);

    row.append(budgetConsumeComparison, barTrack);
    budgetComparisonList.append(consumeText, row);

    function updateComsumeText() {
        const selectedCategory = budgetCategorySelect.value;

        if (selectedCategory === "all") {
            categoryLabel = "전체";
            consume = summaryTransactionAmount(targetTransactions, "type", "expense");
        } else {
            const category = categoryOptions.expense.find(option => option.value === selectedCategory);

            categoryLabel = category?.label ?? "-";
            consume = targetTransactions
                .filter(transaction => transaction.type === "expense" && transaction.category === selectedCategory)
                .reduce((result, transaction) => result + transaction.amount, 0);
        }

        consumeText.textContent = `현재 ${categoryLabel} 지출: ${consume.toLocaleString("ko-KR")}원`;
        updateBudgetComparison();
    }

    function updateBudgetComparison() {
        const budget = Number(budgetInput.value);
        if(budget <= 0) {
            budgetConsumeComparison.textContent = "예산을 입력해주세요!";
            budgetConsumeComparison.classList.remove("budget-comparison-shortage");
            bar.style.width = "0%";
            return;
        }

        const comparison = Number(budgetInput.value) - consume;
        if(comparison < 0) {
            budgetConsumeComparison.classList.add("budget-comparison-shortage");
            budgetConsumeComparison.textContent = `예산 초과: ${Math.abs(comparison).toLocaleString('ko-KR')}원`;
        }
        else {
            budgetConsumeComparison.classList.remove("budget-comparison-shortage");
            budgetConsumeComparison.textContent = `남은 예산: ${comparison.toLocaleString('ko-KR')}원`;
        };

        const width = Math.min(consume / budget * 100, 100);
        bar.style.width = `${width}%`;
    }

    updateComsumeText();

    budgetCategorySelect.addEventListener("change", updateComsumeText);

    budgetInput.addEventListener("input", updateBudgetComparison);

    const hideBtn = document.createElement("button");
    hideBtn.textContent = "숨기기";
    hideBtn.classList.add("css-btn");
    hideBtn.addEventListener("click", () => {
        budgetComparisonList.style.display = "none";

        isComparison = false;
        budgetComparisonBtn.style.display = "inline";
        hideBtn.remove();
    });

    budgetComparisonList.append(hideBtn);
}

//category option function
function addCategoryOption(type, value, label) {
    categoryOptions[type].push({value, label});
    saveCategoryOption();

    updateCategoryOptions("input", currentTypeSelect, categorySelect);
    updateCategoryOptions("filter", currentTypeFilter, categoryFilter);

    TOAST.show("카테고리가 추가되었습니다!");
}

function editCategoryOption(type, originalCategoryValue, categoryLabel) {
    const categoryOption = categoryOptions[type].find(option => option.value === originalCategoryValue);
    if(!categoryOption) return;
    
    categoryOption.label = categoryLabel;

    saveCategoryOption();

    updateCategoryOptions("input", currentTypeSelect, categorySelect);
    updateCategoryOptions("filter", currentTypeFilter, categoryFilter);
    renderPage();

    TOAST.show("카테고리가 수정되었습니다!");
}

function deleteCategoryOption(type, categoryLabel) {
    const categoryOption = categoryOptions[type].find(option => option.label === categoryLabel);
    if(!categoryOption) return;

    const categoryValue = categoryOption.value;
    
    const isUsed = transactions.some(transaction => transaction.type === type && transaction.category === categoryValue);
    if(isUsed) {
        alert("현재 거래에서 사용 중인 카테고리는 제거할 수 없습니다!");
        return;
    }

    categoryOptions[type] = categoryOptions[type].filter(option => option.value !== categoryValue);

    saveCategoryOption();

    updateCategoryOptions("input", currentTypeSelect, categorySelect);
    updateCategoryOptions("filter", currentTypeFilter, categoryFilter);

    TOAST.show("카테고리가 제거되었습니다!");
}

function findCategoryOption(type, label) {
    const categoryOption = categoryOptions[type].find(option => option.label === label);
    
    return categoryOption.value;
}

function categoryOptionHTML(option) {
    const header = document.createElement("p");
    header.textContent = `카테고리 ${option}`;
    categoryOptionSettingArea.append(header);

    const categoryOptionTypeSelect = document.createElement("select");
    Object.entries(TYPE_OPTIONS).forEach(([value, label]) => {
        if(value === "all") return;

        const typeOption = document.createElement("option");
        typeOption.value = value;
        typeOption.textContent = label;

        categoryOptionTypeSelect.append(typeOption);
    })
    categoryOptionSettingArea.append(categoryOptionTypeSelect);

    const categoryOptionEditSelect = document.createElement("select");
    if(option === "수정") {
        categoryOptionTypeSelect.addEventListener("change", () => {
            updateCategoryOptions("input", categoryOptionTypeSelect.value, categoryOptionEditSelect)
        });
        updateCategoryOptions("input", categoryOptionTypeSelect.value, categoryOptionEditSelect);
        categoryOptionSettingArea.append(categoryOptionEditSelect);
    }

    const categoryInput = document.createElement("input");
    categoryInput.type = "text";
    categoryInput.placeholder = "카테고리명";
    categoryOptionSettingArea.append(categoryInput);

    const categoryBtn = document.createElement("button");
    if(option === "추가") { categoryBtn.textContent = "추가"; }
    else if(option === "수정") { categoryBtn.textContent = "수정"}
    else { categoryBtn.textContent = "제거"; }
    categoryBtn.addEventListener("click", () => {
        const type = categoryOptionTypeSelect.value;
        const newLabel = categoryInput.value.toLowerCase().trim();

        if(!newLabel) {
            alert("입력된 카테고리명이 없습니다!");
            return;
        }

        if(option === "추가") {
            const exists = categoryOptions[type].some(option => option.label === newLabel);
            if(exists) {
                alert("이미 존재하는 카테고리입니다!");
                return;
            }

            addCategoryOption(type, `custom-${Date.now()}`, newLabel);
        } else if(option === "수정") {
            const originalValue = categoryOptionEditSelect.value;

            const exists = categoryOptions[type].some(option => option.value !== originalValue && option.label === newLabel);
            if(exists) {
                alert("이미 존재하는 카테고리명입니다!")
                return;
            }

            if(isDefaultCategoryOption(type, originalValue)) {
                alert("기본 카테고리는 수정할 수 없습니다!");
                return;
            }

            editCategoryOption(type, originalValue, newLabel);
            updateCategoryOptions("input", categoryOptionTypeSelect.value, categoryOptionEditSelect);
        } else {
            const exists = categoryOptions[type].some(option => option.label === newLabel);
            if(!exists) {
                alert("존재하지 않는 카테고리입니다!");
                return;
            }

            if(isDefaultCategoryOption(type, findCategoryOption(type, categoryInput.value))) {
                alert("기본 카테고리는 삭제할 수 없습니다!");
                return;
            }

            deleteCategoryOption(type, newLabel);
        }

        categoryInput.value = "";
        categoryOptionTypeSelect.value = "expense";
    });
    categoryOptionSettingArea.append(categoryBtn);
    
    const categoryCancelBtn = document.createElement("button");
    categoryCancelBtn.textContent = "입력 취소";
    categoryCancelBtn.addEventListener("click", () => {
        categoryOptionSettingArea.innerHTML = "";
        currentCategoryAddOptionSetting = false;
    });
    categoryOptionSettingArea.append(categoryCancelBtn);
}

function repeatIntervalOptionHTML() {
    repeatIntervalSelect.innerHTML = "";

    let maxInterval;
    let unit;

    switch(repeatFrequencySelect.value) {
        case "daily":
            maxInterval = 31;
            unit = "일";
            break;

        case "weekly":
            maxInterval = 4;
            unit = "주";
            break;

        case "monthly":
            maxInterval = 12;
            unit = "개월";
            break;

        case "yearly":
            maxInterval = 10;
            unit = "년";
            break;

        defalut:
            return;
    }

    for(let i = 1; i <= maxInterval; i++) {
        repeatIntervalSelect.append(createIntervalOption(i, unit));
    }
}

function createIntervalOption(value, unit) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = `${value}${unit}`;

    return option;
}

function updateCategoryOptions(optionType, type, select) {
    select.innerHTML = "";

    const options = optionType === "input" ? categoryOptions[type] : getFilterCategoryOptions(type);

    options.forEach(option => {
        const categoryOption = document.createElement("option");
        categoryOption.value = option.value;
        categoryOption.textContent = option.label;

        select.append(categoryOption);
    });
}

function getFilterCategoryOptions(type) {
    if(type === "all") {
        const allCategory = Object.values(categoryOptions).flat();

        const uniqueCategories = [];
        const values = new Set();

        allCategory.forEach(category => {
            if(!values.has(category.value)) {
                values.add(category.value);
                uniqueCategories.push(category);
            }
        });

        return [
            {value: "all", label: "전체"},
            ...uniqueCategories
        ];
    }

    return [
        { value: "all", label: "전체" },
        ...categoryOptions[type]
    ];
}

function isDefaultCategoryOption(type, categoryValue) {
    return DEFAULT_CATEGORY_OPTIONS[type]?.some(option => option.value === categoryValue);
}

//util function
function saveTransactions() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function saveCategoryOption() {
    localStorage.setItem("CATEGORY_OPTIONS", JSON.stringify(categoryOptions));
}

function saveMonthlyStartingBalance() {
    localStorage.setItem(MONTHLY_STARTING_BALANCES, JSON.stringify(monthlyStartingBalances));
}

function saveSummaryCategoryBudget() {
    localStorage.setItem(SUMMARY_CATEGORY_BUDGET, JSON.stringify(summaryCategoryBudgets));
}

function resetInputForm() {
    const offset = new Date().getTimezoneOffset() * 60000;
    dateInput.value = new Date(Date.now() - offset).toISOString().substring(0, 10);
    amountInput.value = "";
    typeSelect.value = "expense";
        currentTypeSelect = typeSelect.value;
        updateCategoryOptions("input", currentTypeSelect, categorySelect);
    categorySelect.value = "food";
    repeatSelect.checked = false;
    descriptionInput.value = "";

    addBtn.textContent = "추가";
    editCancelBtn.style.display = "none";
    repeatOptionArea.style.display = "none";
}

function updateToday() {
    todayDate.textContent = `오늘 날짜: ${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
    selectedMonth.textContent = `${selectedMonthDate.getFullYear()}년도 ${selectedMonthDate.getMonth() + 1}월 통계`;

    const offset = new Date().getTimezoneOffset() * 60000;
    dateInput.value = new Date(Date.now() - offset).toISOString().substring(0, 10);
}

function formatChartDate(date) {
    const month = Number(date.slice(5, 7));
    const day = Number(date.slice(8, 10));

    return `${month}/${day}`;
}

function getMonthKey(targetDate) {
    const date = new Date(targetDate);

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

//CSV function
function exportCSV() {
    if(!transactions.length) {
        alert("내보낼 거래 내역이 없습니다!");
        return;
    }

    if(!confirm("데이터를 내보내시겠습니까? CSV 파일로 내보내집니다.")) return;

    const rows = [
        [
            "id",
            "date",
            "amount",

            "type",
            "category",
            "description",

            "createdAt",
            "updatedAt"
        ]
    ];

    transactions.forEach(transaction => {
        rows.push([
            transaction.id,
            transaction.date,
            transaction.amount,

            escapeCSV(transaction.type),
            escapeCSV(transaction.category),
            escapeCSV(transaction.description),

            transaction.createdAt,
            transaction.updatedAt
        ]);
    });

    const csv = "\uFEFF" + rows.map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download =
        `budgetList-${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}.csv`;
    a.click();

    URL.revokeObjectURL(url);

    TOAST.show("내보내기 성공!");
}

function importCSV(event) {
    const file = event.target.files[0];

    if(!file) {
        alert("파일이 선택되지 않았습니다!");
        return;
    }

    const reader = new FileReader;

    reader.onload = function(e) {
        const csv = e.target.result;
        const lines = csv.split(/\r?\n/);
        lines.shift();

        if(!validateCSV(lines)) {
            return;
        }

        const importTransactions = [];

        lines.forEach(line => {
            if(!line.trim()) return;

            const values = parseCSVLine(line);

            importTransactions.push({
                id: Number(values[CSV.ID]),
                date: unescapeCSV(values[CSV.DATE]),
                amount: Number(values[CSV.AMOUNT]),

                type: unescapeCSV(values[CSV.TYPE]),
                category: unescapeCSV(values[CSV.CATEGORY]),
                description: unescapeCSV(values[CSV.DESCRIPTION]),

                createdAt: Number(values[CSV.CREATED_AT]),
                updatedAt: Number(values[CSV.UPDATED_AT])
            });
        });

        transactions = importTransactions;
        saveTransactions();
        renderPage();
        TOAST.show("불러오기 성공!");
    };

    reader.readAsText(file, "utf-8");
}

function escapeCSV(value) {
    return `"${String(value ?? "")
        .replace(/\r\n/g, "\\n")
        .replace(/\n/g, "\\n")
        .replace(/"/g, '""')}"`
}

function unescapeCSV(value) {
    value = value.trim();

    if(value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
    }

    return value
        .replace(/""/g, '"')
        .replace(/\\n/g, "\n");
}

function parseCSVLine(line) {
    const values = [];

    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const ch = line[i];

        if(ch === '"') {
            if(inQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }

            continue;
        }

        if(ch === "," && !inQuotes) {
            values.push(current);
            current = "";
            continue;
        }

        current += ch;
    }

    values.push(current);

    return values;
}

function validateCSV(lines) {
    for (const line of lines) {
        if(!line.trim()) continue;

        const values = parseCSVLine(line);

        if(values.length !== Object.values(CSV).length) {
            alert("CSV 형식이 올바르지 않습니다. 레이블 개수에 오류가 있습니다.");
            return false;
        }

        if(!values[CSV.ID].trim()) {
            alert("CSV 데이터 중, ID가 비어 있는 데이터가 있습니다.");
            return false;
        }

        if(!values[CSV.DATE].trim()) {
            alert("CSV 데이터 중, 거래 날짜가 비어 있는 데이터가 있습니다.");
            return false;
        }

        if(!values[CSV.AMOUNT].trim()) {
            alert("CSV 데이터 중, 거래 값이 비어 있는 데이터가 있습니다.");
            return false;
        }

        if(!values[CSV.TYPE].trim()) {
            alert("CSV 데이터 중, 거래 타입이 비어 있는 데이터가 있습니다.");
            return false;
        }

        if(!values[CSV.CATEGORY].trim()) {
            alert("CSV 데이터 중, 거래 카테고리가 비어 있는 데이터가 있습니다.");
            return false;
        }

        if(isNaN(Number(values[CSV.ID]))) {
            alert("CSV 데이터 중, ID 값이 숫자가 아닌 값이 있습니다.");
            return false;
        }

        if(isNaN(Number(values[CSV.AMOUNT]))) {
            alert("CSV 데이터 중, 거래 값이 숫자가 아닌 값이 있습니다.");
            return false;
        }

        if(isNaN(Number(values[CSV.CREATED_AT]))) {
            alert("CSV 데이터 중, 생성 날짜가 숫자가 아닌 값이 있습니다.");
            return false;
        }

        if(isNaN(Number(values[CSV.UPDATED_AT]))) {
            alert("CSV 데이터 중, 수정 날짜가 숫자가 아닌 값이 있습니다.");
            return false;
        }

        const type = unescapeCSV(values[CSV.TYPE]);
        if(!(type in TYPE_OPTIONS) || type === "all") {
            alert("CSV 데이터 중, 거래 타입이 다른 데이터가 있습니다.");
            return false;
        }

        const category = unescapeCSV(values[CSV.CATEGORY]);
        const categoryExists = categoryOptions[type]?.some( option => option.value === category );
        if(!categoryExists) {
            alert("CSV 데이터 중, 거래 카테고리가 다른 데이터가 있습니다.");
            return false;
        }
    }

    return true;
}

updateCategoryOptions("input", currentTypeSelect, categorySelect);
updateCategoryOptions("filter", currentTypeFilter, categoryFilter);
updateToday();

renderPage();
nowMonthBtn.click();


/* 3일차
 * .filter()    : 배열을 반환.
 * .reduce()    : 여러 개의 배열 요소를 하나의 결과로 모으는 함수.
 * 
 *              배열.reduce((누적값, 현재값) => {
 *                      //누적값을 어떻게 바꿀지 작성, 작업
 *                      return 누적값;
 *                  }, 초기값);
 * 
 *              result[transaction.category] = (result[transaction.category] || 0) + transaction.amount;
 *                  여기서 result 배열을 만드는데, 초기값을 {}으로 해두었다면,
 *                      result[transaction.category]의 값은 undefined. {}로 시작했으니 존재하지 않는다.
 *                  여기서, 존재하지 않는 값을 불러오면 오류가 나므로, 초기값 {}으로 시작했다면 그 값을 0으로 바꾼다.
 *                      해당 카테고리의 합계가 없다면 0부터 시작한다는 의미다.
 *                  이후 transaction.amount를 더하는 형식.
 *                  마지막에 return result로 값을 반환하는 이유는 다음 반복에서도 result를 사용하기 위해.
 * 
 *              reduce()는 꼭 숫자를 만드는 건 아니다.
 *              본질적으로 '배열의 여러 요소를 처리해서 최종적으로 하나의 값으로 만드는 것'.
 * 
 * Object.entries(categoryAmounts).forEach(([category, amount]) =>      :
 *              Object.entries()는 객체를 [키, 값] 형태의 배열로 바꿔주는 메서드.
 *              'Object.entries(객체)'가 기본 형태.
 *              const person = { name: "철수", age: 20 }이라는 객체에 Obejct.entries(person)을 하면,
 *                  [ ["name", "철수"], ["age", 20] ]이 된다.
 *              객체 안의 내용을 하나씩 반복하고 싶을 때, forEach()를 바로 사용할 수 없다.
 *                forEach()는 배열 메서드이기 때문.
 *              그래서 Object.entries()를 통해 배열로 만든다.
 * 
 *              entries는 '객체의 항목들' 정도로 생각할 것. 위의 예에서 '항목'은 ["name", "철수"] 혹은 ["age", 20].
 *              각 항목은 항상 [키, 값]의 형태다.
 * 
 *              [category, amount] 자체는 구조 분해.
 *              요소가 ["food", 15000]으로 들어오면, 자동으로 category = "food", amount = 15000으로 변환된다.
 * 
 *              Object.keys()       : [키, 값]의 형태에서 '키'만 가져오는 것.
 *                                    예제로 본다면 ["name", "age"]만 가져온다.
 *              Object.values()     : [키, 값]의 형태에서 '값'만 가져오는 것.
 *                                    예제로 본다면 ["철수", 20]만 가져온다.
 *              Object.entries()    : [키, 값]의 형태에서 '키'와 '값' 둘 다 가져오는 것.
 *                                    예제로 본다면 ["name", "철수"], ["age", 20]을 가져오게 된다.
 */

/* 9일차
 * const offset = new Date().getTimezoneOffset() * 60000;
 * dateInput.value = new Date(Date.now() - offset).toISOString().substring(0, 10);
 *      : 오늘 날짜 > YYYY-MM-DD 형태로 변환 > dateInput에 넣기.
 *        첫 번째 줄: 현재 시간대의 UTC 차이를 밀리초 단위로 계산.
 *          new Date()  : 현재 날짜와 시간을 나타내는 Date 객체를 만듦.
 *          getTimezoneOffset() : 현재 컴퓨터의 현지 시각과 UTC 사이의 차이를 분 단위로 반환.
 *          * 60000     : 1분을 밀리초로 변환. 분 단위의 시간 차이를 밀리초 단위의 시간 차이로 변환시키는 것.
 * 
 *        두 번째 줄: 보정 값 이용해서 오늘 날짜를 생성, 그 값을 실제로 입력칸에 대입시킨다.
 *          Date.now()  : 현재 시각을 밀리초 숫자로 반환. new Date()가 날짜 객체라면, Date.now()는 현재 시점을 나타내는 숫자.
 *                        여기서 - offset을 하면서, 시간대 보정을 할 수 있다.
 *          toISOString()   : Date 객체를 ISO 형식의 문자열로 변환. 2026-09-09T04:00:00.000Z와 같은 형태. T는 날짜/시간 구분선, Z는 UTC를 의미.
 *          substring(0,10) : 앞에서부터 10글자를 가져와서, 2026-09-09를 만들어낸다.
 */

/* 14일차
 * const로 TOAST 만드는 방법이 있었으므로 참조할 것.
 * init()는 초기화 함수에 가까우므로 참고. 생성자와 비슷하지만 생성자처럼 바로 호출되는 함수는 아니다.
 * 
 * disabled = true  : 해당 요소를 비활성하겠다는 의미. '보이지만 사용할 수 없도록 설정'.
 *                    style.display = "none"은 요소 자체를 화면에서 제거. '아예 보이지도 않게 설정'.
 */

/* 16일차
 * addEventlistener() 함수로 만약 addEventlistener("change", importCSV)를 작성했다면,
 *      change에서 일어나는 이벤트들을 모아둔 이벤트 객체가 알아서 importCSV로 전달된다.
 *      따라서 따로 (event) => importCSV(event)로 적지 않아도 괜찮다.
 */

/* 21일차
 * const categoryExists = categoryOptions[type]?.some( option => option.value === category );
 *      categoryOptions[type]?.  : ?.의 의미는 optional shaining(옵셔널 체이닝).
 *                                 앞의 값이 null이나 undefined가 아니라면 .some()을 실행하란 의미.
 * 
 *      some(option => option.value === category)   : .some()은 배열에서 쓰는 메서드.
 *                                                    배열의 요소 중 조건을 만족하는 것이 하나라도 있는지 확인.
 * 
 * 
 * const allCategory = Object.values(categoryOptions).flat();
 * const uniqueCategories = [];
 * const values = new Set();
 *
 * allCategory.forEach(category => {
 *      if(!values.has(category.value)) {
 *          values.add(category.value);
 *          uniqueCategories.push(category);
 *      }
 * });
 * 
 * Object.values(categoryOptions).flat();   : categoryOptions의 모든 배열을 하나의 배열로 합친다.
 *                                            categoryOptions 배열의 value(값)만 가져오고, flat()을 사용.
 *                                            flat() 함수는 배열을 한 단계 평평하게 만든다. 배열 안에 배열이 들어있는 구조에서 배열만 있도록 수정하는 것.
 *                                                  [ [ {...}, {...} ], [...] ] 구조에서 [ {...}, {...}, ... ] 구조로 만드는 것.
 * 
 * const values = new Set()                 : Set은 중복된 값을 저장하지 않는 자료구조. category.value가 이미 등장한 값인지 기억하기 위해 사용.
 *                                            add("food")하고 add("food")하면 "food" 하나만 남는 형식.
 * 
 * values.has(category.value)               : .has() 함수는 Set에서 쓸 수 있는 것으로, 이 값이 Set 안에 이미 존재하는지 확인.
 * values.add(category.value)               : .add() 함수는 Set에서 쓸 수 있는 것으로, () 안의 값을 Set에 기록.
 *                                            if문에 의해 '현재 존재하지 않는 category.value 값을 기록'하는 용도로 사용된다.
 * 
 */

/* 29일차
 * renderBalanceChart() 함수
 * svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); : svg 요소를 만든다.
 *                                                                        svg 네임스페이스에 속하는 <svg> 요소를 만들어라.
 *                                                                        html과 svg는 브라우저에서 서로 다른 네임스페이스를 사용하기 때문에 NS를 사용.
 *          document.createElementNS(네임스페이스, 요소이름)    : 이 네임스페이스에 속하는 이 이름의 요소를 만들어달라는 의미.
 *          "http://www.w3.org/2000/svg"    : svg 네임스페이스. 브라우저에게 '지금 만들려는 요소가 svg에 속한 요소다'라는 것을 알려주는 것.
 *          "svg"                           : 만들 요소의 이름.
 *
 * svg.setAttribute("viewBox", `0 0 ${width} ${height}`);   : svg의 좌표 영역을 지정한다. 내부 좌표계를 설정하는 것.
 *                                                            viewBox="0 0 widht, height" 를 한 것.
 * 
 * const values = dates.map(date => dailySummary[date].cumulativeAmount);   : 각 날짜의 누적 금액만 가져온다.
 * 
 * dates.forEach((date, index) => { ... }   : date는 다루려는 날짜, index는 몇 번째 날짜인지를 표시.
 * 
 * const x = balanceChartgetX(index, dates.length, width, padding); : 몇 번째 날짜인지, 그래프의 가로축에서 몇 px 위치인지를 가져온다.
 * const y = balanceChartgetY(value, minValue, maxValue, height, padding);  : 금액이 얼마인지, 그래프의 세로축에서 몇 px 위치인지를 가져온다.
 *                                                                            단, 금액이 클 수록 Y값은 작아져야 위쪽에 표시된다.
 * 
 * const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle"); : 각 데이터 위치에 점을 생성.
 * circle.setAttribute("r", "4");   : r은 반지름. 4px짜리 점을 생성.
 * 
 * const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");     : 여러 좌표를 직선으로 연결하는 svg 요소.
 * polyline.setAttribute("points", points.join(" "));       : points가 ["40,300", "400,200", "760,100"] 이라면,
 *                                                            <polyline points="40,300 400,200 760,100"> 이 된다.
 * polyline.setAttribute("stroke", "black");    : 선 색상
 * polyline.setAttribute("stroke-width", "2");  : 선 굵기
 * 
 * 
 * balanceChartgetX(index, count, width, padding)   : index로 현재 데이터가 몇 번째인지 확인.
 *                                                    count로 전체 데이터 개수 확인.
 *                                                    width로 svg 전체 가로 길이 확인.
 *                                                    padding으로 svg 양쪽에 확보해둔 여백 확인.
 *      if (count === 1) return width / 2;   : 데이터가 1개밖에 없다면 가운데에 점을 찍겠다는 의미.
 *      return padding + index / (count - 1) * (width - padding * 2);    :
 *          index / (count - 1) : 현재 데이터가 전체 구간에서 어느 정도 위치에 있는지를 구한다.
 *                                개수가 5개일 때, index에 따라 값이 0/4=0, 1/4=0.25, 2/4=0.5 ... 이런 형식.
 *          width - padding * 2 : 실제로 점을 배치할 수 있는 가로 공간. 양쪽 여백을 제거.
 *          위의 두 개를 곱하면 '현재 데이터 위치 비율 * 실제 그래프 가로 길이'.
 *          여기서 padding을 더하는 것은 여백만큼 띄우고 시작해야 하기 때문.
 * 
 * 
 * balanceChartgetY(value, minValue, maxValue, height, padding) : 위와 비슷하게 동작. 다만 svg는 y값이 커질수록 아래로 배치된다.
 *      if (maxValue === minValue) return height / 2;   : 최댓값 === 최솟값 < 이 의미는 모든 데이터의 금액이 같다는 의미. 가운데에 배치하기 위해 height/2.
 *      return height - padding - ((value - minValue) / (maxValue - minValue)) * (height - padding * 2);    :
 *          height - padding    : 그래프의 아래쪽에 배치하기 위한 형태. 그 뒤의 코드(계산된 거리)만큼 위로 올라간다.
 *          (value - minValue) / (maxValue - minValue)  : 현재 값이 최솟값~최댓값 사이에서 어디에 있는지를 비율로 계산.
 */

/* 32일차
 * Math.ceil(dates.length / 7);     : Math.ceil()는 소수점을 올림해서 정수로 만드는 함수.
 *                                    날짜 개수를 7로 나누고 소수점이 생기면 올림으로 만든다.
 *                                    반대로 Math.floor()는 소수점을 내림해서 정수로 만드는 함수.
 */

/* 41일차
 * if (Object.prototype.hasOwnProperty.call(monthlyStartingBalances, monthKey)) {
 *       return Number(monthlyStartingBalances[monthKey]);
 *   }
 *      : 저장된 시작 잔액이 있는지 확인하는 코드.
 *        Object.prototype.hasOwnProperty.call(monthlyStartingBalances, monthKey)으로 monthlyStartingBalances 객체에 monthKey라는 이름의 항목이 실제로 존재하는지 확인.
 *        return Number(monthlyStartingBalances[monthKey])으로 객체에서 해당 월의 시작 잔액을 가져와서 숫자로 변환한 뒤, 반환.
 * 
 * const lastCumulativeChange = dates.length > 0
 *      ? dailySummary[dates[dates.length - 1]].cumulativeAmount
 *      : 0;
 *          : 해당 월의 마지막 누적 변동액을 구하는 코드.
 *            해당 월의 거래 기록을 날짜순으로 살펴보고, 가장 마지막 날짜에 계산된 누적 변동액을 가져온다.
 *            해당 월에 거래 기록이 하나도 없으면 0을 이용.
 * 
 *            const dates = Object.keys(dailySummary).sort();로 dates를 만드는데, dailySummary가 여기서 날짜순으로 정렬된다.
 *            그리고 dates.length > 0으로 배열에 날짜가 한 개 이상 있는지 확인한다.
 *            배열에 날짜가 한 개 이상 존재한다면 dailySummary[dates[dates.length - 1]].cumulativeAmount을 실행한다.
 *                  dates[dates.length - 1]는 배열에서 가장 마지막 날짜를 가져오라는 의미.
 *                  따라서 dates[dates.length - 1]으로 마지막 날짜를 찾고, dailySummary[해당 날짜]로 해당 날짜의 요약 데이터를 찾아서, 해당 날짜까지의 누적된 변동액(cumulativeAmount)을 가져온다.
 *            만약 배열에 날짜가 하나라도 없다면 0을 사용한다.
 */

/* 52일차
 * stopPropagation()    : 현재 이벤트가 캡처링/버블링 단계에서 더이상 전파되지 않도록 방지한다.
 *                        입력창 내부 클릭이 바깥 클릭처럼 처리되지 않도록 하는 것.
 */

/* 57일차
 * .flatMap()   : 각 요소에 매핑(map) 함수를 적용한 뒤, 결과를 1단계 평탄화(flatten)하여 새 배열로 반환하는 함수.
 *                배열의 각 요소를 돌며 콜백 함수를 실행 > 반환된 결과물을 하나의 배열로 합치기 > 깊이 1만큼 평탄화 + 원본 배열 유지
 */
