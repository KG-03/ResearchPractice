const typeSelect = document.querySelector(".type-select");
const categorySelect = document.querySelector(".category-select");
const typeFilter = document.querySelector(".type-filter");
const categoryFilter = document.querySelector(".category-filter");


const TEST_TRANSACTIONS = [
    {
        id: 1,
        date: "2000-00-00",
        amount: 10000,

        type: "expense",
        category: "food",
        
        description: "점심값",

        createdAt: "2000-00-00",
        updatedAt: "2000-00-00"
    }
]

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

let currentTypeSelect = "expense";
let currentTypeFilter = "all";

typeSelect.addEventListener("change", () => {
    currentTypeSelect = typeSelect.value;
    updateCategoryOptions(currentTypeSelect, categorySelect);
});

typeFilter.addEventListener("change", () => {
    currentTypeFilter = typeFilter.value;
    updateCategoryOptions(currentTypeFilter, categoryFilter);
});

function updateCategoryOptions(type, select) {
    select.innerHTML = "";

    CATEGORY_OPTIONS[type].forEach(option => {
        const categoryOption = document.createElement("option");
        categoryOption.value = option.value;
        categoryOption.textContent = option.label;

        select.append(categoryOption);
    });
}

updateCategoryOptions(currentTypeSelect, categorySelect);
updateCategoryOptions(currentTypeFilter, categoryFilter);
