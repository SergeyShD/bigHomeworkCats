//Объявляем глобальные переменные
const scriptElement = document.querySelector('script');
const box = document.querySelector(".container");
const addBtn = document.querySelector(".add-btn");
const mdBox = document.querySelector(".modal-container");
const mdClose = mdBox.querySelector(".modal-close");

const addForm = document.forms.add;

//Информация внутри модального окна Просмотра
function getAgeString(age) {
    if (age === 1) {
        return age + ' год';
    } else if (age > 1 && age < 5) {
        return age + ' года';
    } else {
        return age + ' лет';
    }
}

const constModalShow = (thisCard) => `
        <div class="cat-text">
            <h2>${thisCard.name}</h2>
            <div>${thisCard.age >0 ? getAgeString(+thisCard.age)  : "Возраст не указан"}</div>
            <div><p>${thisCard.description || "Информации о котике пока нет..."}</p></div>
            <img src=${thisCard.image || "images/default.png"} alt="${thisCard.name}">
        </div>
`

//Добавляем окно для ввода логина пользователя

let user = localStorage.getItem("catLS"); // имя пользователя

if (!user) {
    user = prompt("Ваше уникальное имя: ", "SergeyShD");
    localStorage.setItem("catLS", user);
}

const path = `https://cats.petiteweb.dev/api/single/${user}`;

let cats = localStorage.getItem("cats-data") // массив с котами