//Добавляем форму "Создать"
//Добавляем обработчик события нажатия на кнопку +
addBtn.addEventListener("click", e => {
    mdBox.style.display = "flex";
});
//Добавляем обработчик события нажатия на кнопку x
mdClose.addEventListener("click", e => {
    mdBox.style = null;
});

addForm.addEventListener("submit", e => {
    e.preventDefault(); // остановить действие по умолчанию
    const body = {};

    for (let i = 0; i < addForm.elements.length; i++) {
        const inp = addForm.elements[i];

        if (inp.name) {
            if (inp.type === "checkbox") {
                body[inp.name] = inp.checked;
            } else {
                body[inp.name] = inp.value;
            }
        }
    }
    fetch(path + "/add", {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })
    .then(res => {
        
        if (res.ok) {
            addForm.reset();
            mdBox.style = null;
            createCard(body);
            cats.push(body);
            localStorage.setItem("cats-data", JSON.stringify(cats));
        } else {
            return res.json();
        }
    })
    .then(err => {
        if (err && err.message) {
            alert(err.message);
        }
    });
});