let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

transactions = transactions.map(transaction => ({
    ...transaction,
    description: transaction.description ?? "",
    updatedAt: transaction.updatedAt ?? transaction.createdAt
}));

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

let currentCategory = "all";
let currentSort = "latest";
let currentType = "all";
let currentDateFilter = "all";
let currentTheme = localStorage.getItem("theme") || "light";

let isEditing = false;
let editingId = null;

addBtn.addEventListener("click", () => {
    if(isEditing) {
        updateTransaction();
    } else {
        addTransaction();
    }
});

categoryFilter.addEventListener("change", () => {
    currentCategory = categoryFilter.value;

    renderTransactions();
});

sortSelect.addEventListener("change", () => {
    currentSort = sortSelect.value;

    renderTransactions();
});

typeSelect.addEventListener("change", () => {
    renderCategoryOptions();
});

typeFilter.addEventListener("change", () => {
    currentType = typeFilter.value;

    renderCategoryFilterOptions();
    renderTransactions();
});

cancelEditBtn.addEventListener("click", () => {
    cancelEdit();
});

dateFilter.addEventListener("change", () => {
    currentDateFilter = dateFilter.value;

    renderTransactions();
});

exportBtn.addEventListener("click", exportCSV);

themeToggleBtn.addEventListener("click", () => {
    currentTheme = currentTheme === "light" ? "dark" : "light";

    localStorage.setItem("theme", currentTheme);
    applyTheme(currentTheme);
    updateThemeButton();
});


//Transaction func
function addTransaction() {
    const amount = Number(amountInput.value);
    const category = categorySelect.value;
    const type = typeSelect.value;
    const description = descriptionInput.value.trim();

    if (amount <= 0) {
        alert("올바른 금액이 아닙니다.");
        return;
    }

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

    amountInput.value = "";
    descriptionInput.value= "";
    renderTransactions();
}

function deleteTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);

    if(editingId === id) cancelEdit();

    saveTransactions();
    renderTransactions();
}

function startEdit(id) {
    const editTransaction = transactions.find(transaction => transaction.id === id);

    if(!editTransaction) return;

    amountInput.value = editTransaction.amount;
    categorySelect.value = editTransaction.category;
    typeSelect.value = editTransaction.type;
    renderCategoryOptions();
    descriptionInput.value = editTransaction.description;

    isEditing = true;
    editingId = id;

    addBtn.textContent = "수정 완료";
    cancelEditBtn.style.display = "inline-block";
}

function updateTransaction() {
    const editTransaction = transactions.find(transaction => transaction.id === editingId);

    if (amountInput.value <= 0) {
        alert("올바른 금액이 아닙니다.");
        return;
    }

    if(!editTransaction) return;

    editTransaction.amount = Number(amountInput.value);
    editTransaction.category = categorySelect.value;
    editTransaction.type = typeSelect.value;
    editTransaction.description = descriptionInput.value.trim();
    editTransaction.updatedAt = Date.now();

    saveTransactions();

    isEditing = false;
    editingId = null;

    addBtn.textContent = "추가";
    cancelEditBtn.style.display = "none";
    amountInput.value = "";
    descriptionInput.value = "";
    
    renderTransactions();
}

function cancelEdit() {
    isEditing = false;
    editingId = null;

    amountInput.value = "";
    descriptionInput.value= "";

    addBtn.textContent = "추가";
    cancelEditBtn.style.display = "none";
    typeSelect.value = "expense";
    categorySelect.value = "food";
}

function createTransactionCard(transaction) {
    const card = document.createElement("div");
    card.classList.add("budget-card");

    const typeLable = transaction.type === "income" ? "➕" : "➖";
    const amount = document.createElement("p");
    amount.textContent = `${typeLable} ${getCategoryLabel(transaction.category)} ${transaction.amount.toLocaleString()}원`;
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

    return card;
}

//Render func
function renderTransactions() {
    budgetList.innerHTML = "";

    let filteredTransactions = [...transactions];

    filteredTransactions = filterByType(filteredTransactions);

    filteredTransactions = filterByCategory(filteredTransactions);

    filteredTransactions = filterByDate(filteredTransactions);

    filteredTransactions = sortTransactions(filteredTransactions);

    if(filteredTransactions.length === 0) {
        budgetList.innerHTML = '<p class="empty-message">아직 등록된 거래가 없습니다.</p>';
    } else {
        filteredTransactions.forEach(transaction => {budgetList.append(createTransactionCard(transaction));});
    }

    transactionCount.textContent = `현재 표시 중 : ${filteredTransactions.length}건`;

    updateSummary(filteredTransactions);
    renderStatistics(filteredTransactions);
}

function renderCategoryOptions() {
    const type = typeSelect.value;

    categorySelect.innerHTML = "";

    CATEGORY_OPTIONS[type].forEach(category => {
        const option = document.createElement("option");

        option.value = category.value;
        option.textContent = category.label;

        categorySelect.append(option);
    });
}

function renderCategoryFilterOptions() {
    const type = typeFilter.value;

    categoryFilter.innerHTML = "";

    CATEGORY_FILTER_OPTIONS[type].forEach(category => {
        const option = document.createElement("option");

        option.value = category.value;
        option.textContent = category.label;

        categoryFilter.append(option);
    });

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
    
    const expenseTitle = document.createElement("h4");
    expenseTitle.textContent = "지출 통계";
    statsList.append(expenseTitle);

    EXPENSE_ORDER.forEach(category => {
        if(expenseStats[category] === undefined) return;

        const item = document.createElement("p");

        item.textContent = `${getCategoryLabel(category)} : ${expenseStats[category].toLocaleString()}원`;
        statsList.append(item);
    })

    const incomeTitle = document.createElement("h4");
    incomeTitle.textContent = "수입 통계";
    statsList.append(incomeTitle);

    INCOME_ORDER.forEach(category => {
        if(incomeStats[category] === undefined) return;

        const item = document.createElement("p");

        item.textContent = `${getCategoryLabel(category)} : ${incomeStats[category].toLocaleString()}원`;
        statsList.append(item);
    })
}

// filter func
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

//Update func
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

//Storage func
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
        const line = `${formatCSVDate(transaction.createdAt)},`+
                    `${getCSVType(transaction.type)},`+
                    `${getCSVCategory(transaction.category)},`+
                    `${transaction.amount},`+
                    `${transaction.description.replace(/\n/g, " ")}`;

        csv += line + "\n";
    });

    const blob = new Blob([csv], {type: "text/csv;charset-utf-8;"});

    const url = URL.createObjectURL(blob);

    const date = new Date().toISOString().split("T")[0];
    const a = document.createElement("a");
    a.href = url;
    a.download = `budget-book-${date}.csv`;
    a.click();

    URL.revokeObjectURL(url);
}

function formatCSVDate(timestamp) {
    if(!timestamp) return "";

    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getCSVType(type) {
    if (type === "income") return "수입";
    return "지출";
}

function getCSVCategory(category) {
    switch(category) {
        case "food": return "식비";
        case "traffic": return "교통";
        case "shopping": return "쇼핑";
        case "salary": return "급여";
    }

    return "기타";
}

//etc
function formatDate(timestamp) {
    if(!timestamp) return "";

    const date = new Date(timestamp);

    return date.toLocaleString("ko-KR");
}

function getCategoryLabel(category) {
    switch(category) {
        case "food": return "🍚 식비";
        case "traffic": return "🚌 교통";
        case "shopping": return "🛍 쇼핑";
        case "salary": return "💰 급여";
    }
    
    return "📦 기타";
}

function applyTheme(theme) {
    document.body.classList.remove("light-theme", "dark-theme");
    document.body.classList.add(`${theme}-theme`);
}

function updateThemeButton() {
    themeToggleBtn.textContent = currentTheme === "light" ? "🌙" : "☀️";
}

renderCategoryOptions();
renderCategoryFilterOptions();
renderTransactions();

applyTheme(currentTheme);
updateThemeButton();

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
