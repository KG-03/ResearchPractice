
const todayDate = document.querySelector(".today-date");
const selectedMonth = document.querySelector(".selected-month");
const prevMonthBtn = document.querySelector(".prev-month-btn");
const nowMonthBtn = document.querySelector(".now-month-btn");
const nextMonthBtn = document.querySelector(".next-month-btn");

const dateInput = document.querySelector(".date-input");
const amountInput = document.querySelector(".amount-input");
const typeSelect = document.querySelector(".type-select");
const categorySelect = document.querySelector(".category-select");
const descriptionInput = document.querySelector(".description-input");
const addBtn = document.querySelector(".add-btn");

const typeFilter = document.querySelector(".type-filter");
const categoryFilter = document.querySelector(".category-filter");

const budgetList = document.querySelector(".budget-list");


const TYPE_OPTIONS = {
    all: "전체",
    expense: "지출",
    income: "수입",
    saving: "저축",
    investment: "투자"
};

const CATEGORY_OPTIONS = {
    all: [
        {value: "all", label: "전체"},

        {value: "salary", label: "급여"},

        {value: "food", label: "식비"},
        {value: "traffic", label: "교통비"},
        {value: "housing", label: "주거비"},
        {value: "living", label: "생활비"},
        {value: "medical", label: "의료/건강"},
        {value: "shopping", label: "쇼핑/미용"},
        {value: "leisure", label: "여가/관계"},
        
        {value: "short-term", label: "단기저축"},
        {value: "long-term", label: "장기저축"},

        {value: "safe-haven-assets", label: "안전자산"},
        {value: "invest-assets", label: "투자자산"},
        {value: "real-assets", label: "실물/대체자산"},

        {value: "etc", label: "기타"}
    ],

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

let transactions = [];

let today = new Date();
let selectedMonthDate = new Date();
let currentTypeSelect = "expense";
let currentTypeFilter = "all";


prevMonthBtn.addEventListener("click", () => {
    const year = selectedMonthDate.getFullYear();
    const month = selectedMonthDate.getMonth();
    const date = selectedMonthDate.getDate();

    selectedMonthDate = new Date(year, month-1, date);

    updateToday();
});

nowMonthBtn.addEventListener("click", () => {
    selectedMonthDate = new Date(today);

    updateToday();
});

nextMonthBtn.addEventListener("click", () => {
    const year = selectedMonthDate.getFullYear();
    const month = selectedMonthDate.getMonth();
    const date = selectedMonthDate.getDate();

    selectedMonthDate = new Date(year, month+1, date);

    updateToday();
});

addBtn.addEventListener("click", () => {
    addTransaction();
});

typeSelect.addEventListener("change", () => {
    currentTypeSelect = typeSelect.value;
    updateCategoryOptions(currentTypeSelect, categorySelect);
});

typeFilter.addEventListener("change", () => {
    currentTypeFilter = typeFilter.value;
    updateCategoryOptions(currentTypeFilter, categoryFilter);
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

    renderTransactions();
}

function createTransactionCard(transaction) {
    const card = document.createElement("div");
    card.classList.add("budget-card");

    const date = document.createElement("p");
    date.textContent = transaction.date;
    card.append(date);

    const amount = document.createElement("p");
    amount.textContent = transaction.amount;
    card.append(amount);

    const type = document.createElement("p");
    type.textContent = TYPE_OPTIONS[transaction.type];
    card.append(type);

    const categoryOption = CATEGORY_OPTIONS[transaction.type].find(
        option => option.value === transaction.category
    );
    const category = document.createElement("p");
    category.textContent = categoryOption.label;
    card.append(category);

    const description = document.createElement("p");
    description.textContent = transaction.description;
    card.append(description);

    return card;
}

function renderTransactions() {
    budgetList.innerHTML = "";

    transactions.forEach(transaction => budgetList.append(createTransactionCard(transaction)));
}

function updateCategoryOptions(type, select) {
    select.innerHTML = "";

    CATEGORY_OPTIONS[type].forEach(option => {
        const categoryOption = document.createElement("option");
        categoryOption.value = option.value;
        categoryOption.textContent = option.label;

        select.append(categoryOption);
    });
}

function updateToday() {
    todayDate.textContent = `오늘 날짜: ${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
    selectedMonth.textContent = `${selectedMonthDate.getFullYear()}년도 ${selectedMonthDate.getMonth() + 1}월 통계`;
}

updateCategoryOptions(currentTypeSelect, categorySelect);
updateCategoryOptions(currentTypeFilter, categoryFilter);
updateToday();
