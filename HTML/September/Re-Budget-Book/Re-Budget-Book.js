
const todayDate = document.querySelector(".today-date");

const exportBtn = document.querySelector(".export-btn");
const importBtn = document.querySelector(".import-btn");
const importCSVInput = document.querySelector(".import-csv-input");

const summaryMonthList = document.querySelector(".summary-month-list");
const summaryCategoryType = document.querySelector(".summary-category-type");
const summaryCategoryList = document.querySelector(".summary-category-list");

const selectedMonth = document.querySelector(".selected-month");
const prevMonthBtn = document.querySelector(".prev-month-btn");
const nowMonthBtn = document.querySelector(".now-month-btn");
const nextMonthBtn = document.querySelector(".next-month-btn");
const dateShift = document.querySelector(".date-shift");
const shiftMonthBtn = document.querySelector(".shift-month-btn");

const summaryGrapeBtn = document.querySelector(".summary-grape-btn");
const summaryGrapeList = document.querySelector(".summary-grape-list");

const budgetComparisonBtn = document.querySelector(".budget-comparison-btn");
const budgetComparisonList = document.querySelector(".budget-comparison-list");

const dateInput = document.querySelector(".date-input");
const amountInput = document.querySelector(".amount-input");
const typeSelect = document.querySelector(".type-select");
const categorySelect = document.querySelector(".category-select");
const descriptionInput = document.querySelector(".description-input");
const addBtn = document.querySelector(".add-btn");
const editCancelBtn = document.querySelector(".edit-cancel-btn");

const categoryAddInput = document.querySelector(".category-add-input");
const categoryAddOptionBtn = document.querySelector(".category-add-option-btn");
const categoryEditOptionBtn = document.querySelector(".category-edit-option-btn");
const categoryDeleteOptionBtn = document.querySelector(".category-delete-option-btn");
const categoryOptionSettingArea = document.querySelector(".category-option-setting-area");

const filterResetBtn = document.querySelector(".filter-reset-btn");
const typeFilter = document.querySelector(".type-filter");
const categoryFilter = document.querySelector(".category-filter");
const sortFilter = document.querySelector(".sort-filter");
const searchFilterInput = document.querySelector(".search-filter-input");
const displayFilteredTransactionsNumber = document.querySelector(".display-filtered-transactions-number");

const budgetList = document.querySelector(".budget-list");


const STORAGE_KEY = "reBudgetTransactions";

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
let categoryOptions = JSON.parse(localStorage.getItem("DEFAULT_CATEGORY_OPTIONS")) || structuredClone(DEFAULT_CATEGORY_OPTIONS);

let today = new Date();
let selectedMonthDate = new Date();
let prevMonthDate = null;
let nextMonthDate = null;

let isSummaryGrape = false;
let isComparison = false;

let currentTypeSelect = "expense";

let currentTypeFilter = "all";
let currentCategoryFilter = "all";
let currentSortFilter = "latest";
let currentKeyword = "";
let currentBudgetComparisonTransactions = [];
let currentCategoryAddOptionSetting = false;
let currentCategoryEditOptionSetting = false;
let currentCategoryDeleteOptionSetting = false;

let editingId = null;
let isEditing = false;


exportBtn.addEventListener("click", exportCSV);

importBtn.addEventListener("click", () => {
    importCSVInput.click();
});

importCSVInput.addEventListener("change", importCSV);

summaryCategoryType.addEventListener("change", () => {
    summaryCategory();
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

summaryGrapeBtn.addEventListener("click", () => {
    isSummaryGrape = true;
    summaryGrapeBtn.style.display = "none";
    summaryGrape();
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

filterResetBtn.addEventListener("click", () => {
    currentTypeFilter = "all";
    currentCategoryFilter = "all";
    currentSortFilter = "latest";

    typeFilter.value = currentTypeFilter;
        updateCategoryOptions("filter", currentTypeFilter, categoryFilter);
    categoryFilter.value = currentCategoryFilter;
    sortFilter.value = currentSortFilter;

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


function addTransaction() {
    const transaction = {
        id: Date.now(),
        date: dateInput.value,
        amount: Number(amountInput.value),

        type: typeSelect.value,
        category: categorySelect.value,
        description: descriptionInput.value,

        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    transactions.push(transaction);

    saveTransactions();
    renderPage();

    resetInputForm();

    TOAST.show("성공적으로 생성되었습니다!");
}

function deleteTransaction(targetTransaction) {
    if(targetTransaction === undefined) return;

    if(confirm("정말 삭제하시겠습니까?")) {
        const typeValue = TYPE_OPTIONS[targetTransaction.type];
        const categoryValue = categoryOptions[targetTransaction.type].find(
            option => option.value === targetTransaction.category
        );

        transactions = transactions.filter(transaction => transaction.id !== targetTransaction.id);

        saveTransactions();
        renderPage();

        TOAST.show(`${typeValue}, ${categoryValue.label} 카테고리의 ${targetTransaction.amount.toLocaleString('ko-KR')} 원 거래를 삭제했습니다!`,
                    targetTransaction);
    }
}

function restoreTransaction(targetTransaction) {
    transactions.push(targetTransaction);

    saveTransactions();
    renderPage();

    TOAST.show("성공적으로 복원되었습니다!");
}

function editStart(targetTransaction) {
    editingId = targetTransaction.id;
    isEditing = true;

    dateInput.value = targetTransaction.date;
    amountInput.value = Number(targetTransaction.amount);
    typeSelect.value = targetTransaction.type;
        currentTypeSelect = targetTransaction.type;
        updateCategoryOptions("input", currentTypeSelect, categorySelect);
    categorySelect.value = targetTransaction.category;
    descriptionInput.value = targetTransaction.description;

    editCancelBtn.style.display = "block";
    addBtn.textContent = "수정 완료";
    amountInput.focus();
}

function editEnd() {
    const editTransaction = transactions.find(transaction => transaction.id === editingId);

    const isChanged = editTransaction.date !== dateInput.value ||
                        editTransaction.amount !== Number(amountInput.value) ||
                        editTransaction.type !== typeSelect.value ||
                        editTransaction.category !== categorySelect.value ||
                        editTransaction.description !== descriptionInput.value;

    if(!isChanged) {
        editCancelBtn.click();
        return;
    }

    editTransaction.date = dateInput.value;
    editTransaction.amount = Number(amountInput.value);
    editTransaction.type = typeSelect.value;
    editTransaction.category = categorySelect.value;
    editTransaction.description = descriptionInput.value;
    editTransaction.updatedAt = Date.now();

    editingId = null;
    isEditing = false;

    saveTransactions();
    renderPage();

    resetInputForm();

    TOAST.show("성공적으로 수정되었습니다!");
}

function createTransactionCard(transaction) {
    const card = document.createElement("div");
    card.classList.add("budget-card");

    const cardHeader = document.createElement("div");
    cardHeader.classList.add("budget-card-header");

        const date = document.createElement("p");
        date.textContent = transaction.date;
        date.classList.add("budget-card-header-date");
        cardHeader.append(date);

        const type = document.createElement("p");
        type.textContent = TYPE_OPTIONS[transaction.type];
        type.classList.add(`budget-card-header-badge-${transaction.type}`);
        cardHeader.append(type);

        const categoryOption = categoryOptions[transaction.type].find(
            option => option.value === transaction.category
        );
        const category = document.createElement("p");
        category.textContent = categoryOption.label;
        category.classList.add("budget-card-header-badge");
        cardHeader.append(category);

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

    const delBtn = document.createElement("button");
    delBtn.textContent = "❌ 삭제";
    delBtn.addEventListener("click", () => { deleteTransaction(transaction) });
    delBtn.classList.add("budget-card-button");
    card.append(delBtn);


    return card;
}

//render function
function renderTransactions() {
    budgetList.innerHTML = "";
    currentBudgetComparisonTransactions = [];

    const filteredTransactions = getVisibleTransactions();

    displayFilteredTransactionsNumber.textContent = `현재 표시되는 거래 내역은 ${filteredTransactions.length}건 입니다.`;

    if(!filteredTransactions.length) {
        const message = transactions.length === 0 ? "❌ 아직 등록된 거래가 없습니다!" : "❎ 조건에 맞는 거래가 없습니다!";
        budgetList.innerHTML = message;
        return;
    }

    currentBudgetComparisonTransactions = filteredTransactions;
    filteredTransactions.forEach(transaction => budgetList.append(createTransactionCard(transaction)));
}

function renderPage() {
    renderTransactions();
    renderSummary();
}

//filter function
function getVisibleTransactions() {
    let filteredTransactions = getTransactionsByMonth(selectedMonthDate);

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

//summary function
function renderSummary() {
    summaryMonth();
    summaryCategory();
    if(isSummaryGrape === true) summaryGrape();
    if(isComparison === true) budgetComparison();
}

function summaryMonth() {
    summaryMonthList.innerHTML = "";

    const targetTransactions = getTransactionsByMonth(selectedMonthDate);

    const expenseAmount = summaryTransactionAmount(targetTransactions, "type", "expense");
    const incomeAmount = summaryTransactionAmount(targetTransactions, "type", "income");
    const savingAmount = summaryTransactionAmount(targetTransactions, "type", "saving");
    const investmentAmount = summaryTransactionAmount(targetTransactions, "type", "investment");
    const balanceAmount = incomeAmount - expenseAmount - savingAmount - investmentAmount;

    summaryMonthList.innerHTML = `
        <p>이번 달 수입: ${incomeAmount.toLocaleString('ko-KR')}원</p>
        <p>이번 달 지출: ${expenseAmount.toLocaleString('ko-KR')}원, ${summaryPercentage(expenseAmount, incomeAmount)}</p>
        <p>이번 달 저축: ${savingAmount.toLocaleString('ko-KR')}원, ${summaryPercentage(savingAmount, incomeAmount)}</p>
        <p>이번 달 투자: ${investmentAmount.toLocaleString('ko-KR')}원, ${summaryPercentage(investmentAmount, incomeAmount)}</p>
        <p>잔액: ${balanceAmount.toLocaleString('ko-KR')}원</p>
    `;
}

function summaryCategory() {
    summaryCategoryList.innerHTML = "";

    const targetTransactions = getTransactionsByMonth(selectedMonthDate);

    const categoryAmounts = summarySumAmount(targetTransactions, "type", summaryCategoryType.value, "category");

    const amounts = Object.values(categoryAmounts);
    if(!amounts.length) {
        summaryCategoryList.textContent = "해당 타입의 거래 내역이 없습니다.";
        return;
    }

    const maxAmount = Math.max(...amounts);
    
    Object.entries(categoryAmounts).forEach(([category, amount]) => {
        summaryCategoryList.append(createSummaryCategoryCard(category, amount, maxAmount));
    });
}

function summaryPercentage(typeAmount, incomeAmount) {
    if(incomeAmount === 0) return "-";

    const result = incomeAmount === 0 ? 0 : typeAmount / incomeAmount * 100;

    return `${result.toFixed(2)}%`;
}

function createSummaryCategoryCard(category, amount, maxAmount) {
    const width = maxAmount === 0 ? 0 : amount / maxAmount * 100;

    const card = document.createElement("div");
    card.classList.add("summary-category-card");

    const categoryOption = categoryOptions[summaryCategoryType.value].find(
        option => option.value === category
    );

    const row = document.createElement("div");
    row.classList.add("summary-grape-row");

    const categoryLabelAmount = document.createElement("p");
    categoryLabelAmount.textContent = `${categoryOption.label}: ${amount.toLocaleString('ko-KR')}원`;

    const barTrack = document.createElement("div");
    barTrack.classList.add("summary-grape-track");

    const barChart = document.createElement("div");
    barChart.classList.add("summary-category-bar");
    barChart.style.width = `${width}%`;
    barTrack.append(barChart);
    row.append(categoryLabelAmount, barTrack);
    
    card.append(row);
    return card;
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

//summary grape function
function summaryGrape() {
    summaryGrapeList.style.display = "block";
    summaryGrapeList.innerHTML = "";

    const prevTransaction = getTransactionsByMonth(prevMonthDate);
    const nowTransaction = getTransactionsByMonth(selectedMonthDate);
    const nextTransaction = getTransactionsByMonth(nextMonthDate);

    Object.keys(TYPE_OPTIONS)
        .filter(type => type !== "all")
        .forEach(type => {
            summaryGrapeList.append(
                summaryGrapeComparison(
                    prevTransaction,
                    nowTransaction,
                    nextTransaction,
                    type
                )
            );
        });

    const hideBtn = document.createElement("button");
    hideBtn.textContent = "숨기기";

    hideBtn.addEventListener("click", () => {
        summaryGrapeList.style.display = "none";

        isSummaryGrape = false;
        summaryGrapeBtn.style.display = "inline";
        hideBtn.remove();
    });

    summaryGrapeList.append(hideBtn);
}

function summaryGrapeComparison(prev, now, next, type) {
    const prevAmount = summaryTransactionAmount(prev, "type", type);
    const nowAmount = summaryTransactionAmount(now, "type", type);
    const nextAmount = summaryTransactionAmount(next, "type", type);

    const maxAmount = Math.max(
        prevAmount,
        nowAmount,
        nextAmount
    );

    const grape = document.createElement("div");
    grape.classList.add("summary-grape-group");

    const title = document.createElement("h3");
    title.textContent = `${TYPE_OPTIONS[type]} 비교`;
    grape.append(title);

    grape.append(
        createComparisonRow("이전", prevAmount, maxAmount),
        createComparisonRow("이번", nowAmount, maxAmount),
        createComparisonRow("다음", nextAmount, maxAmount)
    );

    return grape;
}

function createComparisonRow(label, amount, maxAmount) {
    const row = document.createElement("div");
    row.classList.add("summary-grape-row");

    const text = document.createElement("p");
    text.textContent = `${label} ${amount.toLocaleString("ko-KR")}원`;

    const barTrack = document.createElement("div");
    barTrack.classList.add("summary-grape-track");

    const bar = document.createElement("div");
    bar.classList.add("summary-category-bar");

    const width = maxAmount === 0 ? 0 : amount / maxAmount * 100;

    bar.style.width = `${width}%`;

    barTrack.append(bar);
    row.append(text, barTrack);

    return row;
}

//budget comparison function
function budgetComparison() {
    budgetComparisonList.style.display = "block";
    budgetComparisonList.innerHTML = "";

    const budgetInput = document.createElement("input");
    budgetInput.type = "number";
    budgetInput.placeholder = "예산 입력";
    budgetComparisonList.append(budgetInput);

    const consume = summaryTransactionAmount(currentBudgetComparisonTransactions, "type", "expense");
    const consumeText = document.createElement("p");
    consumeText.textContent = `이번 달 지출: ${consume.toLocaleString('ko-KR')}원`;
    budgetComparisonList.append(consumeText);

    const budgetConsumeComparison = document.createElement("p");
    budgetComparisonList.append(budgetConsumeComparison);

    budgetInput.addEventListener("input", () => {
        const budget = Number(budgetInput.value);
        if(budget <= 0) {
            budgetConsumeComparison.textContent = "예산을 입력해주세요!";
            budgetConsumeComparison.classList.remove("budget-comparison-shortage");
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
    });

    const hideBtn = document.createElement("button");
    hideBtn.textContent = "숨기기";
    hideBtn.addEventListener("click", () => {
        budgetComparisonList.style.display = "none";

        isComparison = false;
        budgetComparisonBtn.style.display = "inline";
        hideBtn.remove();
    });

    budgetComparisonList.append(hideBtn);
}

//category function
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

            editCategoryOption(type, originalValue, newLabel);
            updateCategoryOptions("input", categoryOptionTypeSelect.value, categoryOptionEditSelect);
        } else {
            const exists = categoryOptions[type].some(option => option.label === newLabel);
            if(!exists) {
                alert("존재하지 않는 카테고리입니다!");
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


//util function
function saveTransactions() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function saveCategoryOption() {
    localStorage.setItem("DEFAULT_CATEGORY_OPTIONS", JSON.stringify(categoryOptions));
}

function resetInputForm() {
    dateInput.value = "";
    amountInput.value = "";
    typeSelect.value = "expense";
        currentTypeSelect = typeSelect.value;
        updateCategoryOptions("input", currentTypeSelect, categorySelect);
    categorySelect.value = "food";
    descriptionInput.value = "";

    addBtn.textContent = "추가";
    editCancelBtn.style.display = "none";
}

function updateToday() {
    todayDate.textContent = `오늘 날짜: ${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
    selectedMonth.textContent = `${selectedMonthDate.getFullYear()}년도 ${selectedMonthDate.getMonth() + 1}월 통계`;

    const offset = new Date().getTimezoneOffset() * 60000;
    dateInput.value = new Date(Date.now() - offset).toISOString().substring(0, 10);
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

