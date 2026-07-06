const amountInput = document.querySelector(".amount-input");
const categorySelect = document.querySelector(".category-select");
const typeSelect = document.querySelector(".type-select");
const addBtn = document.querySelector(".add-btn");
const budgetList = document.querySelector(".budget-list");
const incomeTotal = document.querySelector(".income-total");
const expenseTotal = document.querySelector(".expense-total");
const balanceTotal = document.querySelector(".balance-total");
const categoryFilter = document.querySelector(".category-filter");
const sortSelect = document.querySelector(".sort-select");
const typeFilter = document.querySelector(".type-filter");
const cancelEditBtn = document.querySelector(".cancel-edit-btn");
const dateFilter = document.querySelector(".date-filter");
const descriptionInput = document.querySelector(".description-input");
const transactionCount = document.querySelector(".transaction-count");
const statsList = document.querySelector(".stats-list");
const exportBtn = document.querySelector(".export-btn");
const themeToggleBtn = document.querySelector(".theme-toggle-btn");
const searchInput = document.querySelector(".search-input");
const toast = document.querySelector(".toast");
const delAllBtn = document.querySelector(".delete-all-btn");
const importBtn = document.querySelector(".import-btn");
const importInput = document.querySelector(".import-input");

const CATEGORY_OPTIONS = {
    income: [
        {value: "salary", label: "급여"},
        {value: "etc", label: "기타"}
    ],

    expense: [
        {value: "food", label: "식비"},
        {value: "traffic", label: "교통"},
        {value: "shopping", label: "쇼핑"},
        {value: "etc", label: "기타"}
    ]
};

const CATEGORY_FILTER_OPTIONS = {
    all: [
        {value: "all", label: "전체"},
        {value: "food", label: "식비"},
        {value: "traffic", label: "교통"},
        {value: "shopping", label: "쇼핑"},
        {value: "salary", label: "급여"},
        {value: "etc", label: "기타"}
    ],

    income: [
        {value: "all", label: "전체"},
        {value: "salary", label: "급여"},
        {value: "etc", label: "기타"}
    ],

    expense: [
        {value: "all", label: "전체"},
        {value: "food", label: "식비"},
        {value: "traffic", label: "교통"},
        {value: "shopping", label: "쇼핑"},
        {value: "etc", label: "기타"}
    ]
};

const EXPENSE_ORDER = [
    "food",
    "traffic",
    "shopping",
    "etc"
];

const INCOME_ORDER = [
    "salary",
    "etc"
];

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

transactions = transactions.map(transaction => ({
    ...transaction,
    description: transaction.description ?? "",
    updatedAt: transaction.updatedAt ?? transaction.createdAt
}));

let currentCategory = "all";
let currentSort = "latest";
let currentType = "all";
let currentDateFilter = "all";
let currentTheme = localStorage.getItem("theme") || "light";
let currentKeyword = "";

let isEditing = false;
let editingId = null;

let toastTimer = null;


amountInput.addEventListener("input", () => {
    maxLengthCheck(amountInput);
});

addBtn.addEventListener("click", () => {
    if(isEditing) {
        updateTransaction();
    } else {
        addTransaction();
    }
});

typeSelect.addEventListener("change", () => {
    renderCategorySelectOptions();
});

cancelEditBtn.addEventListener("click", () => {
    cancelEdit();
});

typeFilter.addEventListener("change", () => {
    currentType = typeFilter.value;

    renderCategoryFilterOptions();
    renderTransactions();
});

categoryFilter.addEventListener("change", () => {
    currentCategory = categoryFilter.value;

    renderTransactions();
});

sortSelect.addEventListener("change", () => {
    currentSort = sortSelect.value;

    renderTransactions();
});

dateFilter.addEventListener("change", () => {
    currentDateFilter = dateFilter.value;

    renderTransactions();
});

searchInput.addEventListener("input", () => {
    currentKeyword = searchInput.value.trim().toLowerCase();
    renderTransactions();
});

exportBtn.addEventListener("click", exportCSV);

themeToggleBtn.addEventListener("click", () => {
    currentTheme = currentTheme === "light" ? "dark" : "light";

    localStorage.setItem("theme", currentTheme);
    applyTheme(currentTheme);
    updateThemeButton();
});

delAllBtn.addEventListener("click", () => {
    const isConfirmed = confirm("정말 모두 삭제 하시겠습니까?");
    if (!isConfirmed) return;

    transactions = [];
    saveTransactions();

    cancelEdit();
    renderTransactions();

    showToast("모든 거래가 삭제되었습니다.");
});

importBtn.addEventListener("click", () => {
    importInput.click();
});

importInput.addEventListener("change", () => {
    const file = importInput.files[0];
    const reader = new FileReader();

    if (!file) {
        showToast("불러오기가 취소되었습니다.");
        return;
    }

    const isReplace = confirm("기존 거래를 모두 삭제하고 불러오시겠습니까?\n취소를 누르면 기존 거래에 추가됩니다.");

    if(isReplace) { transactions = []; }
    
    reader.onload = () => {
        const csv = reader.result;
        const rows = csv.split("\n");
        rows.shift();
        rows.forEach(row => {
            if(row.trim() === "") return;

            const columns = row.split(",");

            if(columns.length < 5) return;

            const transaction = {
                id: formatImportDate(columns[0]) + Math.random(),
                amount: Number(columns[3]),
                category: setCSVCategory(columns[2]),
                type: setCSVType(columns[1]),
                description: columns[4].replaceAll('"', ""),
                createdAt: formatImportDate(columns[0]),
                updatedAt: formatImportDate(columns[0])
            };

            transactions.push(transaction);
        });

        saveTransactions();
        renderTransactions();
        showToast("불러오기가 완료되었습니다.");
    };

    reader.readAsText(file, "utf-8");
    importInput.value = "";
});


document.addEventListener("keydown", function(e) {
    if(e.ctrlKey && e.key === "Enter") {
        if(!isEditing) addTransaction();
        else updateTransaction();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    renderCategorySelectOptions();
    renderCategoryFilterOptions();
    
    renderTransactions();

    applyTheme(currentTheme);
    updateThemeButton();
});


//===== Transaction =====
function addTransaction() {
    const amount = Number(amountInput.value);
    const category = categorySelect.value;
    const type = typeSelect.value;
    const description = descriptionInput.value.trim();

    if(!validateTransaction(amount)) return;

    const transaction = {
        id: Date.now(),
        amount,
        category,
        type,
        description,
        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    transactions.push(transaction);
    saveTransactions();

    resetTransactionForm();
    renderTransactions();

    showToast("거래가 추가되었습니다.");
    amountInput.focus();
}

function deleteTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);

    if(editingId === id) cancelEdit();

    saveTransactions();
    renderTransactions();

    showToast("거래가 삭제되었습니다.");
}

function startEdit(id) {
    const editTransaction = transactions.find(transaction => transaction.id === id);

    if(!editTransaction) return;

    fillForm(editTransaction);

    isEditing = true;
    editingId = id;

    addBtn.textContent = "수정 완료";
    cancelEditBtn.style.display = "inline-block";

    amountInput.focus();
}

function updateTransaction() {
    const editTransaction = transactions.find(transaction => transaction.id === editingId);

    if (!editTransaction) return;

    if (!validateTransaction(Number(amountInput.value))) return;

    editTransaction.amount = Number(amountInput.value);
    editTransaction.category = categorySelect.value;
    editTransaction.type = typeSelect.value;
    editTransaction.description = descriptionInput.value.trim();
    editTransaction.updatedAt = Date.now();

    saveTransactions();

    isEditing = false;
    editingId = null;

    resetTransactionForm();
    renderTransactions();

    showToast("거래가 수정되었습니다.");
    amountInput.focus();
}

function cancelEdit() {
    isEditing = false;
    editingId = null;

    resetTransactionForm();

    showToast("수정이 취소되었습니다.");
    amountInput.focus();
}

function fillForm(transaction) {
    amountInput.value = transaction.amount;
    typeSelect.value = transaction.type;
    renderCategorySelectOptions();
    categorySelect.value = transaction.category;
    descriptionInput.value = transaction.description;
}

function createTransactionCard(transaction) {
    const card = document.createElement("div");
    card.classList.add("budget-card");

    const typeLable = transaction.type === "income" ? "➕" : "➖";
    const amount = document.createElement("p");
    amount.textContent = `${typeLable} ${getCategoryIcon(transaction.category)} ${getCategoryLabel(transaction.category)} ${transaction.amount.toLocaleString()}원`;
    card.append(amount);

    if(transaction.description) {
        const description = document.createElement("p");
        description.classList.add("card-description-text")
        description.textContent = `${transaction.description}`;

        card.append(description);
    }

    const date = document.createElement("p");
    date.classList.add("card-date-text");
    date.textContent = `생성: ${formatDate(transaction.createdAt)}`;

    if(transaction.updatedAt !== transaction.createdAt) {
        date.textContent += `\n(수정: ${formatDate(transaction.updatedAt)})`;
    }
    card.append(date);

    const delBtn = document.createElement("button");
    delBtn.textContent = "삭제";
    delBtn.addEventListener("click", () => {
        deleteTransaction(transaction.id);
    });
    card.append(delBtn);

    const editBtn = document.createElement("button");
    editBtn.textContent = "수정";
    editBtn.addEventListener("click", () => {
        startEdit(transaction.id);
    });
    card.append(editBtn);

    const copyBtn = document.createElement("button");
    copyBtn.textContent = "복사";
    copyBtn.addEventListener("click", () => {
        fillForm(transaction);
        amountInput.focus();
        showToast("거래가 입력창에 복사되었습니다.");
    })
    card.append(copyBtn);

    return card;
}

//===== filter =====
function sortTransactions(transaction) {
    if(currentSort === "latest") {
        transaction.sort((a,b) => {
            return b.createdAt - a.createdAt;
        });
    } else if (currentSort === "oldest") {
        transaction.sort((a,b)=> {
            return a.createdAt - b.createdAt;
        });
    } else if (currentSort === "amount-desc") {
        transaction.sort((a,b) => {
            return b.amount - a.amount;
        });
    } else if (currentSort === "amount-asc") {
        transaction.sort((a,b) => {
            return a.amount - b.amount;
        });
    }

    return transaction;
}

function filterByType (transaction) {
    if(currentType !== "all") {
        transaction = transaction.filter(transac => transac.type === currentType);
    }

    return transaction;
}

function filterByCategory(transaction) {
    if(currentCategory !== "all") {
        transaction = transaction.filter(transac => transac.category === currentCategory);
    }

    return transaction;
}

function filterByDate(transaction) {
    if(currentDateFilter === "all") {
        return transaction;
    }

    const now = new Date();

    if(currentDateFilter === "today") {
        return transaction.filter(transac => {
            const date = new Date(transac.createdAt);

            return (
                date.getFullYear() === now.getFullYear() &&
                date.getMonth() === now.getMonth() &&
                date.getDate() === now.getDate()
            );
        });
    } 
    
    if (currentDateFilter === "week") {
        const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

        return transaction.filter(transac => transac.createdAt >= weekAgo);
    } 
    
    if (currentDateFilter === "month") {
        return transaction.filter(transac => {
            const date = new Date(transac.createdAt);

            return (
                date.getFullYear() === now.getFullYear() &&
                date.getMonth() === now.getMonth()
            );
        });
    }

    return transaction;
}

function filterByKeyword(transaction) {
    if(currentKeyword === "") return transaction;

    return transaction.filter(transac => {
        const descriptionMatch = (transac.description || "").toLowerCase().includes(currentKeyword);
        const amountMatch = String(transac.amount).includes(currentKeyword.replaceAll(",", ""));

        return descriptionMatch || amountMatch;
    });
}

//===== Storage(CSV) =====
function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function exportCSV() {
    if(!transactions.length) {
        alert("내보낼 데이터가 없습니다.");
        return;
    }

    const isConfirmed = confirm("내보내시겠습니까?");
    if(!isConfirmed) return;

    let csv = "날짜,타입,카테고리,금액,메모\n";
    transactions.forEach(transaction => {
        const date = `${formatExportDate(transaction.createdAt)}`;
        const type = `${getCSVType(transaction.type)}`;
        const category = `${getCategoryLabel(transaction.category)}`;
        const amount = `${transaction.amount}`;
        const memo = `"${(transaction.description.replace(/\n/g, " ") ?? "")}"`;

        csv += `${date},${type},${category},${amount},${memo}` + "\n";
    });

    const blob = new Blob([csv], {type: "text/csv;charset-utf-8;"});

    const url = URL.createObjectURL(blob);

    const date = new Date().toISOString().split("T")[0];
    const a = document.createElement("a");
    a.href = url;
    a.download = `budget-book-${date}.csv`;
    a.click();

    URL.revokeObjectURL(url);

    showToast("CSV로 내보내기가 성공했습니다.");
}

function formatExportDate(timestamp) {
    if(!timestamp) return "";

    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    const second = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

function getCSVType(type) {
    if (type === "income") return "수입";
    return "지출";
}

function setCSVType(type) {
    if(type === "수입") return "income";
    return "expense";
}

function setCSVCategory(category) {
    switch(category) {
        case "식비": return "food";
        case "교통": return "traffic";
        case "쇼핑": return "shopping";
        case "급여": return "salary";
    }

    return "etc";
}

function formatImportDate(dateString) {
    return new Date(dateString).getTime();
}

//===== Render ======
function renderTransactions() {
    budgetList.innerHTML = "";

    let filteredTransactions = [...transactions];

    filteredTransactions = filterByType(filteredTransactions);

    filteredTransactions = filterByCategory(filteredTransactions);

    filteredTransactions = filterByDate(filteredTransactions);

    filteredTransactions = filterByKeyword(filteredTransactions);

    filteredTransactions = sortTransactions(filteredTransactions);

    if(filteredTransactions.length === 0) {
        if(currentKeyword !== "") budgetList.innerHTML = `<p class="empty-message">검색 결과가 없습니다.</p>`;
        else budgetList.innerHTML = '<p class="empty-message">아직 등록된 거래가 없습니다.</p>';
    } else {
        filteredTransactions.forEach(transaction => {budgetList.append(createTransactionCard(transaction));});
    }

    transactionCount.textContent = `현재 표시 중 : ${filteredTransactions.length}건`;

    updateSummary(filteredTransactions);
    renderStatistics(filteredTransactions);
}

function renderCategoryOption(selectElement, option) {
    selectElement.innerHTML = "";
    option.forEach(optionData => {
        const categoryoption = document.createElement("option");
        categoryoption.value = optionData.value;
        categoryoption.textContent = optionData.label;

        selectElement.append(categoryoption);
    })
}

function renderCategorySelectOptions() {
    renderCategoryOption(categorySelect, CATEGORY_OPTIONS[typeSelect.value]);
}

function renderCategoryFilterOptions() {
    renderCategoryOption(categoryFilter, CATEGORY_FILTER_OPTIONS[typeFilter.value]);

    currentCategory = categoryFilter.value;
}

function renderStatistics(transaction) {
    const incomeStats = {};
    const expenseStats = {};

    transaction.forEach(transactionStats => {
        const target = transactionStats.type === "income" ? incomeStats : expenseStats;

        const category = transactionStats.category;

        if(target[category]) {
            target[category] += transactionStats.amount;
        } else {
            target[category] = transactionStats.amount;
        }
    });

    statsList.innerHTML = "";
    
    renderStatisticsSection("지출 통계", EXPENSE_ORDER, expenseStats);
    renderStatisticsSection("수입 통계", INCOME_ORDER, incomeStats);
}

function renderStatisticsSection(title, order, stats) {
    const sectionTitle = document.createElement("h4");
    sectionTitle.textContent = title;
    statsList.append(sectionTitle);

    order.forEach(category => {
        if(stats[category] === undefined) return;

        const item = document.createElement("p");

        item.textContent = `${getCategoryIcon(category)} ${getCategoryLabel(category)} : ${stats[category].toLocaleString()}원`;
        statsList.append(item);
    })
}

function updateSummary(transactionsSummary) {
    const totalIncome = transactionsSummary.reduce((sum, transaction) => {
        if(transaction.type === "income") {
            return sum + transaction.amount;
        }

        return sum;
    }, 0);

    const totalExpense = transactionsSummary.reduce((sum, transaction) => {
        if(transaction.type === "expense") {
            return sum + transaction.amount;
        }

        return sum;
    }, 0);

    const totalBalance = totalIncome - totalExpense;

    incomeTotal.textContent = `수입 : ${totalIncome.toLocaleString()}원`;
    expenseTotal.textContent = `지출 : ${totalExpense.toLocaleString()}원`;
    balanceTotal.textContent = `잔액 : ${totalBalance.toLocaleString()}원`;
}

//===== Theme =====
function applyTheme(theme) {
    document.body.classList.remove("light-theme", "dark-theme");
    document.body.classList.add(`${theme}-theme`);
}

function updateThemeButton() {
    themeToggleBtn.textContent = currentTheme === "light" ? "🌙" : "☀️";
}

//===== Validation =====
function validateTransaction(amount) {
    if (Number.isNaN(amount)) {
        alert("금액을 입력해 주세요.");
        return false;
    }

    if (amount <= 0) {
        alert("올바른 금액이 아닙니다.");
        return false;
    }

    if (!Number.isInteger(amount)) {
        alert("금액은 정수만 입력할 수 있습니다.");
        return false;
    }

    return true;
}

//===== etc =====
function formatDate(timestamp) {
    if(!timestamp) return "";

    const date = new Date(timestamp);

    return date.toLocaleString("ko-KR");
}

function getCategoryLabel(category) {
    switch(category) {
        case "food": return "식비";
        case "traffic": return "교통";
        case "shopping": return "쇼핑";
        case "salary": return "급여";
    }
    
    return "기타";
}

function getCategoryIcon(category) {
    switch(category) {
        case "food": return "🍚";
        case "traffic": return "🚌";
        case "shopping": return "🛍";
        case "salary": return "💰";
    }

    return "📦";
}

function maxLengthCheck(input) {
    if(input.value.length > input.maxLength) {
        input.value = input.value.slice(0, input.maxLength);
    }
}

function resetTransactionForm() {
    amountInput.value = "";
    descriptionInput.value = "";

    addBtn.textContent = "추가";
    cancelEditBtn.style.display = "none";
    typeSelect.value = "expense";
    renderCategorySelectOptions();
    categorySelect.value = "food";
}

function showToast(message) {
    clearTimeout(toastTimer);

    toast.innerHTML = message;
    toast.classList.add("show");

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => {toast.innerHTML = "";}, 2000);
    }, 3000);
}

/* 참고
 * 콘솔에서 localStorage.clear();를 하면 저장되어 있는 값이 모두 삭제됨.
 */

/* 2일차
 * 1일차에는 기본 html 구조, css 효과 생성.
 * 2일차에 기본적인 card 추가 및 렌더링 함수 생성.
 */

/* 3일차
 * 삭제 버튼 생성.
 * addTransaction()할 때, const transaction에 createdAt 추가.
 * renderTransactions()에서 카드를 생성하던 것을 따로 createTransactionCard() 함수를 만들어 관리.
 */

/* 5일차
 * saveTransactions() 생성.
 */

/* 6일차
 * reduce() : 배열의 모든 요소를 하나의 값으로 축약(reduce)하는 함수.
 *            형태는 '배열.reduce((누적값, 현재 요소) => { ... }, 초기값))'.
 *            [1, 2, 3, 4]라는 배열을 10이라는 하나의 값으로 만들 수 있다.
 *            숫자가 아닌, 문자열도 합칠 수 있다. ["안녕", "하세요"]를 reduce로 합치면 "안녕하세요"가 된다.
 * 
 * 수입일 때 +, 지출일 때 -를 붙이는 구조를 생각해보기.
 */

/* 7일차
 * 카테고리 필터 생성.
 * 이후, getCategoryLabel()을 const CATEGORY_LABEL = {...} 형식으로 바꿀 수 있음을 기억해둘 것.
 *      현재는 함수 형식으로도 괜찮지만, getCategoryColor() 등의 함수가 추가되어 사용되어야 한다면,
 *          const CATEGORY_INFO = { food: { label: "식비", icon: "🍚", color: "orange" } } 등의 형식으로 생성할 수 있기 때문.
 */

/* 8일차
 * 정렬 필터 생성.
 * let filteredTransactions = [...transactions];    : 이 형식을 쓰면 '원본 배열'을 건드리지 않는다.
 * 
 * 이후 '지출'과 '수입' 필터도 고려할 것.
 */

/* 9일차
 * 타입 필터 생성.
 * '타입'에 따라 선택할 수 있는 '카테고리'를 달리하도록 설정. 이는 '입력'과 '필터' 두 가지에서 모두 이용된다.
 */

/* 10일차
 * 등록된 카드 수정 기능.
 * 수정 모드 진입, 수정 취소, 수정 완료, 수정 중 삭제 처리 확인.
 */

/* 12일차
 * 날짜 표기. 생성 날짜 및 수정 날짜 표기.
 */

/* 13일차
 * 기간 필터.
 * filter 함수 분리
 * Date             : 현재 날짜와 시간 정보를 저장하는 객체 생성.
 * getFullYear()    : 연도를 가져온다.
 * getMonth()       : 월을 가져온다. 0~11의 반환값을 가져오는 특징이 있다.
 * getDate()        : 일을 가져온다. getDay()를 하면 '요일'이 가져와지니 주의해야 한다.
 */

/* 14일차
 * 메모 기능 추가.
 * 차후 html에서 maxlength를 사용할 것인지 고민해볼 것.
 */

/* 15일차
 * 필터 결과에 맞는 수입/지출/잔액 표기
 * 필터 결과에 맞는 '현재 표시 중'인 입력값 관리
 */

/* 16일차
 * 카테고리별 통계 영역 생성.
 * Object.entries()     :
 *      Object.entries(incomeStats).forEach(([category, amount]) => {
 *      const item = document.createElement("p");
 *
 *      item.textContent = `${getCategoryLabel(category)} : ${amount.toLocaleString()}원`;
 *      statsList.append(item);
 *  });
 *                          다음과 같은 방식으로 사용하려고 했으나, '정렬 순서'를 정하게 되며 쓰지 못하게 되었다.
 * 
 *                          객체를 다룰 때 사용하는 방식. 객체의 (key, value) 쌍들을 배열로 변환하는 함수.
 *                          기본 형태는 Object.entries(객체).
 * 
 *                              const user = { name: "Kim", age: 20 };
 *                              console.log(Object.entries(user));
 *                          이러한 코드가 있다면, 결과는 [ ["name", "Kim"], ["age", 20] ]로 나온다. (배열 안에 배열)
 *                          따라서 console.log(entries[0][0])을 하면 name이, console.log(entries[0][1])을 하면 Kim이 출력된다.
 * 
 *                          키만 꺼낸다면 Object.keys(...)를, 값만 꺼낸다면 Object.values(...)를 사용한다.
 *                          객체는 배열처럼 forEach(), map(), filter()를 사용할 수 없어, entries를 적용시킨 뒤, 사용하는 것.
 */

/* 17일차
 * csv 내보내기
 * const blob = new Blob([csv], {type: "text/csv;charset-utf-8;"});     : [csv] : 이 문자열을 하나의 파일 내용으로 쓴다는 의미.
 *                                                                                'csv 문자열 > blob > CSV 파일'이 되는 순서.
 * 
 * transaction.description.replace(/\n/g, " ")      : 줄바꿈(마트 \n 우유 구입)을 공백으로 바꾸는 것.
 * String(date.getMonth() + 1).padStart(2, "0");    : '2026-06-06'을 만들 때, date-getMonth()+1만 하면 2026-6만 나오기 때문에 padStart로 앞에 0을 붙여주는 것.
 *                                                    padStart() : 문자열의 앞부분을 특정 길이로 채우는 역할을 한다. padEnd()도 존재.
 * 
 * confirm(), alert()   : 두 가지 모두 브라우저가 제공하는 대화상자(dialog)를 띄운다.
 *                        confirm() : 사용자에게 확인을 받는다. true or false가 반환된다.
 *                        alert()   : 사용자에게 알림만 보여준다. 반환값은 없다.
 */

/* 19일차
 * 다크모드/화이트모드
 */

/* 20일차
 * const descriptionMatch = (transac.description || "").toLowerCase().includes(currentKeyword);
 *      : includes()는 문자열에서만 사용 가능한 함수. 숫자에서는 사용할 수 없다.
 * const amountMatch = String(transac.amount || "").toLowerCase().replaceAll(",", "").includes(currentKeyword.replaceAll(",", ""));
 *      : includes()를 사용하기 위해 number를 string으로 형변환시켜서 사용.
 *        이후, '33,333원'으로 표기되고 있는 중이기 때문에 쉼표를 고려해서 값을 찾아야 한다.
 * 
 *        replaceAll()  : string의 메서드. 문자열에서 특정 내용을 모두 찾아 다른 내용으로 바꾸는 함수.
 *                        형태: 문자열.replaceAll(찾을 문자열, 바꿀 문자열)
 *                        원본 문자열은 변경되지 않기 때문에 반드시 반환값을 받아야 한다.
 * 
 *                        본 코드에서는 ","을 ""으로 변경했다.
 * 
 *                        replace() 함수도 있는데, replace() 함수로는 첫 번째 값만 변경된다.
 *                            따라서 '33,333,333'이라는 값이 있으면, replace()로는 '33333,333'으로 변경되는 것.
 */

/* 21일차
 * 숫자 입력 제한. 정수 외 입력을 저장할 수 없게 지정.
 * 단축키 (ctrl + enter) 추가.
 * slice(0, input.maxLength)    : slice(begin, end).
 *                                어떤 배열의 begin부터 end까지에 대한 복사본을 새 배열 객체로 반환.
 * Number.isNaN()               : 전달받은 값이 NaN인지 여부를 결정하고 Number 유형이 아니라면 false를 반환.
 *                                현재 코드에서는 Number가 아닌 값이 들어갈 수 없는 구조이기 때문에 실행되는 경우는 거의 없으나,
 *                                  혹시 모를 상황에 대비하여 코드를 유지하는 중.
 */

/* 22일차
 * 코드 리팩토링
 */

/* 23일차
 * 코드 재배치
 */

/* 24일차
 * toast 추가.
 */

/* 26일차
 * 메모 복제 기능 + 전체 삭제 기능
 */

/* 27일차
 * import
 * 날짜 값 저장할 때, export 당시에 아예 타임 스탬프 란을 만들어서 export 한 뒤,
 *      import 할 때 그 스탬프 값을 읽어들이는 방법도 하나의 방법이 될 것 같다.
 * 
 * const reader = new FileReader();     : FileReader는 브라우저가 제공하는 파일 읽기 전용 객체.
 *                                        File은 파일 자체를 나타내는 객체. 다른 객체임을 기억할 것.
 * 
 * reader.onload(...)                   : 읽기가 끝나고 ... 내부 함수를 실행하라는 의미.
 * reader.readAsText(file, "utf-8");    : file을 텍스트로 읽어달라는 요청.
 *                                        readAsDataURL(...)과 같은 비슷한 함수도 존재. 예시의 함수는 이미지를 Base64 문자열로 변환한다.
 * reader.result                        : FileReader가 파일을 읽은 결과(내용)가 저장되는 속성(Property). 읽기의 결과.
 * 
 * reader.onload() 이후에 read.readAsText()가 호출되는 방식은 '읽기가 끝났을 때 실행할 함수를 미리 등록하고 실제로 읽기를 시작하다'에 가깝다.
 *      read 자체에 시간이 걸리기 때문에 read 바로 뒤에 실행해야 할 코드를 입력해두면 정상 작동하지 않을 가능성이 높다.
 *      때문에 onload()로 '읽기가 끝난 뒤 실행할 코드'를 미리 설정해두는 것.
 */
