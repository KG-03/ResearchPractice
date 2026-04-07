let input = document.querySelector(".input");
let btn = document.querySelector(".btn");
let list = document.querySelector(".list");
let p = document.querySelector(".p");

/*btn.addEventListener("click", function() {
    let text = input.value;
    if (input.value.trim() === "") return;

    let li = document.createElement("li");
    li.textContent = text;

    list.appendChild(li);
    input.value = "";
}); */

btn.addEventListener("click", function() {
    let text = input.value.trim();

    if (text === "") {
        p.textContent = "값을 입력하세요";
        return;
    } else {
        p.textContent = text;
    }

    console.log("안녕하세요");
    console.log(text);

    let li = document.createElement("li");
    li.textContent = text;

    let delbtn = document.createElement("button");
    delbtn.textContent = "삭제";
    delbtn.addEventListener("click", function() {
        li.remove();
    });
    li.appendChild(delbtn);
    
    list.appendChild(li);
    input.value = "";
});
