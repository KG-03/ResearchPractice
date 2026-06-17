let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

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

let currentCategory = "all";
let currentSort = "latest";

addBtn.addEventListener("click", addTransaction);

categoryFilter.addEventListener("change", () => {
    currentCategory = categoryFilter.value;

    renderTransactions();
});

sortSelect.addEventListener("change", () => {
    currentSort = sortSelect.value;

    renderTransactions();
});

//Transaction func
function addTransaction() {
    const amount = Number(amountInput.value);
    const category = categorySelect.value;
    const type = typeSelect.value;

    if (amount <= 0) {
        alert("올바른 금액이 아닙니다.");
        return;
    }

    const transaction = {
        id: Date.now(),
        amount,
        category,
        type,
        createdAt: Date.now()
    };

    transactions.push(transaction);
    saveTransactions();

    amountInput.value = "";
    renderTransactions();
}

function deleteTransaction(id) {
    transactions = transactions.filter(note => note.id !== id);
    saveTransactions();
    renderTransactions();
}

function createTransactionCard(transaction) {
    const card = document.createElement("div");

    card.classList.add("budget-card");
    card.textContent = `${getCategoryLabel(transaction.category)} ${transaction.amount.toLocaleString()}원 `;

    const delBtn = document.createElement("button");
    delBtn.textContent = "삭제";
    delBtn.addEventListener("click", () => {
        deleteTransaction(transaction.id);
    });

    card.append(delBtn);

    return card;
}

//Render func
function renderTransactions() {
    budgetList.innerHTML = "";

    let filteredTransactions = [...transactions];

    if(currentCategory !== "all") {
        filteredTransactions = filteredTransactions.filter(transaction => transaction.category === currentCategory);
    }

    filteredTransactions = sortTransactions(filteredTransactions);

    if(filteredTransactions.length === 0) {
        budgetList.innerHTML = '<p class="empty-message">아직 등록된 거래가 없습니다.</p>';
    } else {
        filteredTransactions.forEach(transaction => {budgetList.append(createTransactionCard(transaction));});
    }

    updateSummary();
}

// filter func
function sortTransactions(transaction) {
    if(currentSort === "latest") {
        transaction.sort((a,b) => {
            return b.createdAt - a.createdAt;
        });
    }
    
    if (currentSort === "oldest") {
        transaction.sort((a,b)=> {
            return a.createdAt - b.createdAt;
        });
    }
    
    if (currentSort === "amount-desc") {
        transaction.sort((a,b) => {
            return b.amount - a.amount;
        });
    }
    
    if (currentSort === "amount-asc") {
        transaction.sort((a,b) => {
            return a.amount - b.amount;
        });
    }

    return transaction;
}

//Update func
function updateSummary() {
    const totalIncome = transactions.reduce((sum, transaction) => {
        if(transaction.type === "income") {
            return sum + transaction.amount;
        }

        return sum;
    }, 0);

    const totalExpense = transactions.reduce((sum, transaction) => {
        if(transaction.type === "expense") {
            return sum + transaction.amount;
        }

        return sum;
    }, 0);

    const totalBalance = totalIncome - totalExpense;

    incomeTotal.textContent = `총 수입 : ${totalIncome.toLocaleString()}원`;
    expenseTotal.textContent = `총 지출 : ${totalExpense.toLocaleString()}원`;
    balanceTotal.textContent = `잔액 : ${totalBalance.toLocaleString()}원`;
}

//Storage func
function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
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
