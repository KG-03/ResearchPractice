
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
const editCancelBtn = document.querySelector(".edit-cancel-btn");

const typeFilter = document.querySelector(".type-filter");
const categoryFilter = document.querySelector(".category-filter");

const budgetList = document.querySelector(".budget-list");


const STORAGE_KEY = "reBudgetTransactions";

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

let transactions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

let today = new Date();
let selectedMonthDate = new Date();
let currentTypeSelect = "expense";
let currentTypeFilter = "all";

let editingId = null;
let isEditing = false;


summaryCategoryType.addEventListener("change", () => {
    summaryCategory();
});

prevMonthBtn.addEventListener("click", () => {
    const year = selectedMonthDate.getFullYear();
    const month = selectedMonthDate.getMonth();
    const date = selectedMonthDate.getDate();

    selectedMonthDate = new Date(year, month-1, date);

    updateToday();
    renderTransactions();
});

nowMonthBtn.addEventListener("click", () => {
    selectedMonthDate = new Date(today);

    updateToday();
    renderTransactions();
});

nextMonthBtn.addEventListener("click", () => {
    const year = selectedMonthDate.getFullYear();
    const month = selectedMonthDate.getMonth();
    const date = selectedMonthDate.getDate();

    selectedMonthDate = new Date(year, month+1, date);

    updateToday();
    renderTransactions();
});

shiftMonthBtn.addEventListener("click", () => {
    if(dateShift.value) {
        selectedMonthDate = new Date(dateShift.value);
    }

    updateToday();
    renderTransactions();
    dateShift.value = "";
});

addBtn.addEventListener("click", () => {
    if(!dateInput.value) {
        confirm("날짜란이 비어 있습니다! 날짜를 입력해 주세요");
        return;
    } else if(!Number(amountInput.value)) {
        confirm("금액란이 비어 있습니다! 금액을 입력해 주세요.")
        return;
    } else if (Number(amountInput.value) <= 0) {
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

    saveTransactions();
    renderTransactions();
}

function deleteTransaction(targetTransaction) {
    if(targetTransaction === undefined) return;

    if(confirm("정말 삭제하시겠습니까?")) {
        transactions = transactions.filter(transaction => transaction.id !== targetTransaction.id);

        saveTransactions();
        renderTransactions();
    }
}

function editStart(targetTransaction) {
    editingId = targetTransaction.id;
    isEditing = true;

    dateInput.value = targetTransaction.date;
    amountInput.value = Number(targetTransaction.amount);
    typeSelect.value = targetTransaction.type;
        currentTypeSelect = targetTransaction.type;
        updateCategoryOptions(currentTypeSelect, categorySelect);
    categorySelect.value = targetTransaction.category;
    descriptionInput.value = targetTransaction.description;

    editCancelBtn.style.display = "block";
    addBtn.textContent = "수정 완료";
    amountInput.focus();
}

function editEnd() {
    const editTransaction = transactions.find(transaction => transaction.id === editingId);

    editTransaction.date = dateInput.value;
    editTransaction.amount = Number(amountInput.value);
    editTransaction.type = typeSelect.value;
    editTransaction.category = categorySelect.value;
    editTransaction.description = descriptionInput.value;
    editTransaction.updatedAt = Date.now();

    editingId = null;
    isEditing = false;

    resetInputForm();
    saveTransactions();
    renderTransactions();
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

        const categoryOption = CATEGORY_OPTIONS[transaction.type].find(
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

    const createdDate = document.createElement("p");
    createdDate.textContent = new Date(transaction.createdAt).toLocaleString('ko-KR');
    card.append(createdDate);

    const updatedDate = document.createElement("p");
    updatedDate.textContent = new Date(transaction.updatedAt).toLocaleString('ko-KR');
    card.append(updatedDate);

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

//render transaction function
function renderTransactions() {
    budgetList.innerHTML = "";

    if(!transactions.length) {
        budgetList.innerHTML = "❌ 아직 등록된 기록이 없습니다!";
        return;
    }

    transactions.forEach(transaction => budgetList.append(createTransactionCard(transaction)));

    renderSummary();
}

function getTransactionsByMonth() {
    return transactions.filter(transaction => {
        const dataDate = new Date(transaction.date);

        return (
            dataDate.getFullYear() === selectedMonthDate.getFullYear() &&
            dataDate.getMonth() === selectedMonthDate.getMonth()
        );
    });
}

//summary function
function renderSummary() {
    summaryMonth();
    summaryCategory();
}

function summaryMonth() {
    summaryMonthList.innerHTML = "";

    const targetTransactions = getTransactionsByMonth();

    const expenseAmount = summaryTransactionAmount(targetTransactions, "type", "expense", "type");
    const incomeAmount = summaryTransactionAmount(targetTransactions, "type", "income", "type");
    const savingAmount = summaryTransactionAmount(targetTransactions, "type", "saving", "type");
    const investmentAmount = summaryTransactionAmount(targetTransactions, "type", "investment", "type");
    const balanceAmount = incomeAmount - expenseAmount - savingAmount - investmentAmount;

    summaryMonthList.innerHTML = `
        <p>이번 달 수입: ${incomeAmount.toLocaleString('ko-KR')}원</p>
        <p>이번 달 지출: ${expenseAmount.toLocaleString('ko-KR')}원</p>
        <p>이번 달 저축: ${savingAmount.toLocaleString('ko-KR')}원</p>
        <p>이번 달 투자: ${investmentAmount.toLocaleString('ko-KR')}원</p>
        <p>잔액: ${balanceAmount.toLocaleString('ko-KR')}원</p>
    `;
}

function summaryCategory() {
    summaryCategoryList.innerHTML = "";

    const targetTransactions = getTransactionsByMonth();

    const categoryAmounts = summarySumAmount(targetTransactions, "type", summaryCategoryType.value, "category");
    
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
    categoryLabelAmount.textContent = `${categoryOption.label}: ${amount.toLocaleString('ko-KR')}원`;
    card.append(categoryLabelAmount);
    
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

//util function
function saveTransactions() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function resetInputForm() {
    dateInput.value = "";
    amountInput.value = "";
    typeSelect.value = "expense";
        currentTypeSelect = typeSelect.value;
        updateCategoryOptions(currentTypeSelect, categorySelect);
    categorySelect.value = "food";
    descriptionInput.value = "";

    addBtn.textContent = "추가";
    editCancelBtn.style.display = "none";
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

    const offset = new Date().getTimezoneOffset() * 60000;
    dateInput.value = new Date(Date.now() - offset).toISOString().substring(0, 10);
}

updateCategoryOptions(currentTypeSelect, categorySelect);
updateCategoryOptions(currentTypeFilter, categoryFilter);
updateToday();

renderSummary();
renderTransactions();


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
