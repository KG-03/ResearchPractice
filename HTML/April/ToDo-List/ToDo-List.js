let input = document.querySelector(".input");
let btn = document.querySelector(".btn");
let list = document.querySelector(".list");
let guide = document.querySelector(".guide");

btn.addEventListener("click", function() {
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
    })

    let donebtn = document.createElement("button");
    donebtn.textContent = "완료";
    donebtn.addEventListener("click", function() {
        li.classList.toggle("done");
    })

    li.appendChild(delbtn);
    li.appendChild(donebtn);


    list.appendChild(li);
    input.value = "";
})