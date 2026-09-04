
const todayDate = document.querySelector(".today-date");

const summaryMonthList = document.querySelector(".summary-month-list");
const summaryCategoryType = document.querySelector(".summary-category-type");
const summaryCategoryList = document.querySelector(".summary-category-list");

const selectedMonth = document.querySelector(".selected-month");
const prevMonthBtn = document.querySelector(".prev-month-btn");
const nowMonthBtn = document.querySelector(".now-month-btn");
const nextMonthBtn = document.querySelector(".next-month-btn");
const dateShift = document.querySelector(".date-shift");
const shiftMonthBtn = document.querySelector(".shift-month-btn");

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


summaryCategoryType.addEventListener("change", () => {
    summaryCategory();
});

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

shiftMonthBtn.addEventListener("click", () => {
    if(dateShift.value) {
        selectedMonthDate = new Date(dateShift.value);
    }

    updateToday();
    dateShift.value = "";
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
    amount.textContent = `${transaction.amount}원`;
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

    renderSummary();
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

function renderSummary() {
    summaryMonth();
    summaryCategory();
}

function summaryMonth() {
    summaryMonthList.innerHTML = "";

    const expenseAmount = summaryTransactionAmount("type", "expense", "type");
    const incomeAmount = summaryTransactionAmount("type", "income", "type");
    const savingAmount = summaryTransactionAmount("type", "saving", "type");
    const investmentAmount = summaryTransactionAmount("type", "investment", "type");
    const balanceAmount = incomeAmount - expenseAmount - savingAmount - investmentAmount;

    summaryMonthList.innerHTML = `
        <p>이번 달 수입: ${incomeAmount}원</p>
        <p>이번 달 지출: ${expenseAmount}원</p>
        <p>이번 달 저축: ${savingAmount}원</p>
        <p>이번 달 투자: ${investmentAmount}원</p>
        <p>잔액: ${balanceAmount}원</p>
    `;
}

function summaryCategory() {
    summaryCategoryList.innerHTML = "";

    const categoryAmounts = summarySumAmount("type", summaryCategoryType.value, "category");
    
    Object.entries(categoryAmounts).forEach(([category, amount]) => {
        summaryCategoryList.append(createSummaryCategoryCard(category, amount));
    });
}

function createSummaryCategoryCard(category, amount) {
    const card = document.createElement("div");
    card.classList.add("summary-category-card");

    const categoryOption = CATEGORY_OPTIONS[summaryCategoryType.value].find(
        option => option.value === category
    );

    const categoryLabelAmount = document.createElement("p");
    categoryLabelAmount.textContent = `${categoryOption.label}: ${amount}원`;
    card.append(categoryLabelAmount);
    
    return card;
}

//배열로 전달
function summarySumAmount(filterTarget, filterValue, reduceTarget) {
    return transactions
        .filter(transaction => transaction[filterTarget] === filterValue)
        .reduce((result, transaction) => {
            result[transaction[reduceTarget]] = (result[transaction[reduceTarget]] || 0) + transaction.amount;

            return result;
        }, {});
}

//값으로 전달
function summaryTransactionAmount(filterTarget, filterValue) {
    return transactions
        .filter(transaction => transaction[filterTarget] === filterValue)
        .reduce((result, transaction) => result + transaction.amount, 0);
}


updateCategoryOptions(currentTypeSelect, categorySelect);
updateCategoryOptions(currentTypeFilter, categoryFilter);
updateToday();

renderSummary();

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
