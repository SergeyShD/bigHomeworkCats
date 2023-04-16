//Функция создает карточку
function createCard(cat, el = box) {
    const card = document.createElement("div");
    card.className = "card";
    //Отрисовываем картинку в карточке
    const divImg = document.createElement("div");
    if (!cat.image) {
        divImg.classList.add("default","cat-pic");
    } else {
        divImg.style.backgroundImage = `url(${cat.image})`;
        divImg.classList.add("cat-pic");
    }
    //Имя
    const name = document.createElement("h2");
    name.innerText = cat.name;
    //Лайк
    const like = document.createElement("i");
    like.className = "fa-heart card__like";
    like.classList.add(cat.favorite ? "fa-solid" : "fa-regular");


    //Добавляем обработчик лайка при нажатии на кнопку
    like.addEventListener("click", e => {
        e.stopPropagation();
        if (cat.id) {
            fetch(`${path}/update/${cat.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({favorite: !cat.favorite})
            })
            .then(res => {
                if (res.status === 200) {
                    like.classList.toggle("fa-solid");
                    like.classList.toggle("fa-regular");
                    cats = cats.map(c => {
                        if (c.id === cat.id) {
                            c.favorite = !cat.favorite;
                        }
                        return c;
                    })
                    localStorage.setItem("cats-data", JSON.stringify(cats));
                }
            })
        }
    })

    //Добавляем удаление при нажатии на кнопку
    const trash = document.createElement("button");
    trash.className = "btn";
    const trashI = document.createElement("i");
    trash.append(trashI)
    trashI.className = "fa-solid fa-trash";
    trash.addEventListener("click", e => {
        e.stopPropagation();
        deleteCard(cat.id, card);
    })
    
    //Добавляем слушатель "Просмотр" при нажатии на кнопку
    const buttonShow = document.createElement("button")
    const buttonShowI = document.createElement("i");
    buttonShow.append(buttonShowI)
    buttonShowI.className = "fa-sharp fa-regular fa-eye"
    buttonShow.className = "btn";
    buttonShow.addEventListener("click", e => {
        e.stopPropagation();
        showModal(cat)
    })

    const cardInfo = document.createElement("div")
    cardInfo.className = "header-element"
    cardInfo.append(buttonShow, trash)

    //Отрисовываем карточку на странице
    const headerCard = document.createElement("div");
    headerCard.className = "header-element"
    headerCard.append(name, like)
    card.append(headerCard,divImg);
    
    card.append(setRate(cat.rate))
    
    card.append(cardInfo)
    el.append(card);
}

//Функция удаления карточки
function deleteCard(id, el) {
    if (id) {
        fetch(`${path}/delete/${id}`, {
            method: "delete"
        })
            .then(res => {
                if (res.status === 200) {
                    el.remove();
                    cats = cats.filter(c => c.id !== id)
                    localStorage.setItem("cats-data", JSON.stringify(cats));
                }
            })
    }
}

//Проверка наличия котов в LS
if (cats) {
    try {
        cats = JSON.parse(cats);
        for (let cat of cats) {
            createCard(cat, box);
        }
    } catch(err) {
        if (err) {
            cats = null;
        }
    }
} else {
    fetch(path + "/show")
        .then(function(res) {
            if (res.statusText === "OK") {
                return res.json();
            }
        })
        .then(function(data) {
            if (!data.length) {
                box.innerHTML = "<div class=\"empty\">У вас пока еще нет питомцев</div>"
            } else {
                cats = [...data];
                localStorage.setItem("cats-data", JSON.stringify(data));
                for (let c of data) {
                    createCard(c, box);
                }
            }
        })
}

//функция отрисовки рейтинга
function setRate(n) {
    const starsDiv = document.createElement("div");
    starsDiv.className = "stars"
    for (let i = 0; i < n ; i++) {
        starsDiv.innerHTML += "<i class=\"fa-solid fa-star\"></i>"
    }
    for (let i = n; i < 5; i++) {
        starsDiv.innerHTML += "<i class=\"fa-regular fa-star\"></i>"
    }
    return starsDiv;
}

//Добавляем функцию открытия модального окна "Просмотр"
function showModal(el) {
    const div = document.createElement("div")

    div.classList.add("modalShow")

    div.innerHTML = `
        <div class="modalShow-container">
            <div class="header-element">
                <div class="modal-close">
                    <i class="fa-solid fa-xmark"></i>
                </div>
            </div>
            ${constModalShow(el)}
        </div>
        `

    document.body.insertBefore(div, scriptElement)

    //Добавляем слушатель для крестика
    const closeShow = document.querySelector(".modalShow-container").querySelector(".modal-close")
    closeShow.addEventListener("click", e => {
        div.remove()
    })

    //Добавляем "Редактировать" при нажатии на кнопку
    const buttonEdit = document.createElement("button")
    buttonEdit.setAttribute("type", "submit")
    buttonEdit.className = "btn"
    const buttonEditI = document.createElement("i")
    buttonEditI.className = "fa-solid fa-pen"
    buttonEdit.append(buttonEditI)
    buttonEdit.addEventListener("click", e => {
        e.stopPropagation();
        cats.forEach(cat => {
            if(cat.id === el.id){
                editModal(cat)
            }
        })
        if(!cats){
            editModal(el)
        }
    })
    
    div.querySelector(".header-element").insertBefore(buttonEdit,closeShow)
}