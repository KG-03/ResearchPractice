let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

const amountInput = document.querySelector(".amount-input");
const categorySelect = document.querySelector(".category-select");
const typeSelect = document.querySelector(".type-select");
const addBtn = document.querySelector(".add-btn");
const budgetList = document.querySelector(".budget-list");

addBtn.addEventListener("click", addTransaction);

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
    card.textContent = `${getCategoryLabel(transaction.category)} ${transaction.amount}원 `;

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

    if(transactions.length === 0) {
        budgetList.innerHTML = '<p class="empty-message">아직 등록된 거래가 없습니다.</p>';
        return;
    }

    transactions.forEach(transaction => {
        budgetList.append(
            createTransactionCard(transaction)
        );
    });
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
    
    return "기타";
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
