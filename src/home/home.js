let btns = document.querySelectorAll("li");


// let btns = document.querySelector(".article_left");
// console.log(btns.childNodes[1].children);


for (let i = 0; i < btns.length; i++) {
    btns[i].onclick = function () {
        for (let j = 0; j < btns.length; j++) {
            btns[j].className = ""
        }
        this.className = "reed"
    }
}


