let input = document.querySelector(".input");
let btn = document.querySelector(".btn");
let delall = document.querySelector(".delall");
let list = document.querySelector(".list");
let guide = document.querySelector(".guide");

btn.addEventListener("click", function() {
    addList();
});

delall.addEventListener("click", function() {
    list.innerHTML = "";
    updateGuide();
});

input.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        addList();
    }
});

function addList() {
    let text = input.value.trim();

    if(text === "") {
        guide.textContent = "입력해 주십시오.";
        return;
    } else {
        guide.textContent = "";
    }

    let li = document.createElement("li");
    li.textContent = text;

    let delbtn = document.createElement("button");
    delbtn.textContent = "삭제";
    delbtn.classList.add("d-btn");
    delbtn.addEventListener("click", function() {
        li.remove();
        updateGuide();
    })

    let donebtn = document.createElement("button");
    donebtn.textContent = "완료";
    donebtn.addEventListener("click", function() {
        li.classList.toggle("done");
    })

    li.appendChild(delbtn);
    li.appendChild(donebtn);
    list.appendChild(li);
    
    updateGuide();
    input.value = "";
    input.focus();
};

function updateGuide() {
    if (list.children.length) {
        guide.textContent = list.children.length + "개의 할 일이 있습니다.";
        return;
    }

    guide.textContent = "";
}

/* 8일차
 * todolist 설계
 */

/* 9일차
 * 편의성 추가 (기능확장, ux 개선)
 */
