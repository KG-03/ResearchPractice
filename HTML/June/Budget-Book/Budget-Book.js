let transactions = [];

const amountInput = document.querySelector(".amount-input");
const categorySelect = document.querySelector(".category-select");
const typeSelect = document.querySelector(".type-select");
const addBtn = document.querySelector(".add-btn");
const budgetList = document.querySelector(".budget-list");

addBtn.addEventListener("click", addTransaction);

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
        type
    };

    transactions.push(transaction);
    amountInput.value = "";
    renderTransactions();

    console.log(transactions);
}

function renderTransactions() {
    budgetList.innerHTML = "";
    transactions.forEach(transaction => {
        const card = document.createElement("div");
        card.classList.add("budget-card");
        card.textContent = `${getCategoryLabel(transaction.category)} ${transaction.amount}원`;

        budgetList.append(card);
    });
}

function getCategoryLabel(category) {
    if(category === "food") return "식비";
    if(category === "traffic") return "교통";
    if(category === "shopping") return "쇼핑";
    if(category === "salary") return "급여";
    
    return "기타";
}

/* 2일차
 * 1일차에는 기본 html 구조, css 효과 생성.
 * 2일차에 기본적인 card 추가 및 렌더링 함수 생성.
 */