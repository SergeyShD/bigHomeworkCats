//Функция создания формы редактирования
function editModal(el){
    //Пробую через клонирование формы
    const modalEdit = mdBox.cloneNode(true)
    modalEdit.style.zIndex = '15';
    modalEdit.style.display = "flex";
    const editForm = modalEdit.querySelector("form")
    editForm.id = "upd"
    const textBtn = modalEdit.querySelector(".btn-form")
    const headerText= modalEdit.querySelector(".header-element h2")
    headerText.innerText = "Изменить"
    textBtn.innerText = "Изменить"
    
    const inputId = editForm.querySelector("#add1")
    inputId.setAttribute('disabled', true);

    //Наполняем форму значениями взятого на редактирования кота

    //Добавляем форму в body!
    document.body.insertBefore(modalEdit, scriptElement)
    
    //Наполняем форму значениями взятого на редактирования кота
    
    for (let i = 0; i < editForm.elements.length; i++) {
        const inp = editForm.elements[i];
        if (inp.name) {
            if (inp.type === "checkbox") {
                inp.checked = el.favorite;
            } else {
                inp.value = el[inp.name];
            }
        }
    }

    //Навешиваем слушатель на отправку формы
    editForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let body = {};
        for (let i = 0; i < editForm.elements.length; i++) {
            let inp = editForm.elements[i];
            if (inp.name) {
                if (inp.type === "checkbox") {
                    body[inp.name] = inp.checked;
                } else {
                    body[inp.name] = inp.value;
                }
            }
        }
        fetch(`${path}/update/${body.id}`, {
            method: "put",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        .then(res => res.json())
        .then(data => {
            if (data.message.includes("успешно")) {
                cats = cats.map(cat => {
                    if (cat.id === body.id) {
                        const modalShow = document.querySelector(".modalShow-container").querySelector(".cat-text")
                        modalShow.innerHTML = constModalShow(body)
                        return body;
                    }
                    return cat;
                })
                box.innerHTML = "";
                cats.forEach(cat => {
                    createCard(cat);
                })
                localStorage.setItem("cats-data", JSON.stringify(cats));
                modalEdit.remove();
            } else {
                alert(data.message);
            }
        })
    })

    //Навешиваем слушатель на крестик
    const closeShow = modalEdit.querySelector(".modal-close")
    closeShow.addEventListener("click", e => {
        modalEdit.remove()
    })
}