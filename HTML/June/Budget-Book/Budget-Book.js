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

let currentCategory = "all";
let currentSort = "latest";
let currentType = "all";
let currentDateFilter = "all";

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
})


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

    transactionCount.textContent = `현재 표시 중: ${filteredTransactions.length}건`;

    updateSummary(filteredTransactions);
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

renderCategoryOptions();
renderCategoryFilterOptions();
renderTransactions();

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
