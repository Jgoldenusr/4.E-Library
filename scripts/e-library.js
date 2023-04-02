//Nodes
const formNode = document.querySelector("form");
const formWrapper = document.querySelector(".form_wrapper");
const cardWrapper = document.querySelector(".card_wrapper");
const addBookBtn = document.querySelector(".new_button");
const loadCardsBtn = document.querySelector(".load_button");
const deleteCardsBtn = document.querySelector(".delete_button");
const submitButton = document.querySelector(".submit_button");
const submitEditButton = document.querySelector(".edit_button");
const returnButton = document.querySelector(".return_button");
const popupTrigger = document.querySelector(".popup_button");
const popupMsg = document.querySelector(".popup_content");

//Important variables and classes
let selectedIndex;
let bookArray = [];
if (localStorage.getItem("myBookArray")) {
  bookArray = JSON.parse(localStorage.getItem("myBookArray"));
  populateTable(bookArray);
}
class Book {
  constructor(aName, anAuthor, somePages, anIndex) {
    this.name = aName;
    this.author = anAuthor;
    this.pages = somePages;
    this.index = anIndex;
    this.read = false;
  }
}
//Main functions
function populateTable(myBook) {
  //if myBook is an array
  if (Array.isArray(myBook) === true) {
    for (let i = 0; i < myBook.length; i++) {
      populateTable(myBook[i]);
    }
  }
  //if myBook is just a book object
  else {
    //card
    let card = document.createElement("div");
    let cardText = document.createElement("div");
    let cardIcons = document.createElement("div");
    let cardH3 = document.createElement("h3");
    let cardP1 = document.createElement("p");
    let cardP2 = document.createElement("p");
    card.classList.add("card");
    card.classList.add("shady");
    cardText.classList.add("card_text");
    cardIcons.classList.add("card_icons");

    //card icons
    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa");
    deleteIcon.classList.add("fa-trash");

    let editIcon = document.createElement("i");
    editIcon.classList.add("fa");
    editIcon.classList.add("fa-gears");

    let readIcon = document.createElement("i");
    readIcon.classList.add("fa");

    if (myBook.read === false) {
      readIcon.classList.add("fa-eye-slash");
    } else {
      readIcon.classList.add("fa-check");
    }

    deleteIcon.addEventListener("click", deleteBook);
    editIcon.addEventListener("click", showEditForm);
    readIcon.addEventListener("click", checkRead);

    //add book info to the card
    cardH3.append(myBook.name);
    cardP1.append(myBook.author);
    cardP2.append(`(${myBook.pages}) páginas`);

    //add everything to card
    cardText.append(cardH3);
    cardText.append(cardP1);
    cardText.append(cardP2);
    cardIcons.append(readIcon);
    cardIcons.append(editIcon);
    cardIcons.append(deleteIcon);
    card.append(cardText);
    card.append(cardIcons);

    //add an index too
    card.dataset.index = myBook.index;
    document.querySelector(".card_stack").append(card);
  }
}
function deleteCards() {
  let tempNodeList = document.querySelectorAll("[data-index]");
  tempNodeList.forEach((node) => {
    node.remove();
  });
  localStorage.clear();
  bookArray = [];
}
function restartCards() {
  let tempNodeList = document.querySelectorAll("[data-index]");
  tempNodeList.forEach((node) => {
    node.remove();
  });
  populateTable(bookArray);
}
function showForm() {
  let formElements = formNode.elements;
  formElements.name.value = "";
  formElements.author.value = "";
  formElements.pages.value = "";
  formWrapper.hidden = false;
  submitButton.hidden = false;
  cardWrapper.hidden = true;
  submitEditButton.hidden = true;
}
function showTable() {
  if (localStorage.getItem("myBookArray")) {
    cardWrapper.hidden = false;
    formWrapper.hidden = true;
    submitEditButton.hidden = true;
    submitButton.hidden = true;
  } else {
    popupMsg.textContent = "No se ha encontrado ninguna tabla local";
    popupTrigger.click();
  }
}
function showEditForm() {
  let formElements = formNode.elements;
  let currentName = bookArray[this.closest(".card").dataset.index].name;
  let currentAuthor = bookArray[this.closest(".card").dataset.index].author;
  let currentPages = bookArray[this.closest(".card").dataset.index].pages;
  let currentIndex = this.closest(".card").dataset.index;
  //set form to current object
  formElements.name.value = currentName;
  formElements.author.value = currentAuthor;
  formElements.pages.value = currentPages;
  selectedIndex = currentIndex;
  formWrapper.hidden = false;
  submitEditButton.hidden = false;
  cardWrapper.hidden = true;
  submitButton.hidden = true;
}
function checkRead(event) {
  //search book by closest row index
  let book = bookArray[this.closest(".card").dataset.index];
  //cell icon
  let icon = event.target;
  if (book.read === false) {
    book.read = true;
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-check");
  } else {
    book.read = false;
    icon.classList.remove("fa-check");
    icon.classList.add("fa-eye-slash");
  }
  localStorage.setItem("myBookArray", JSON.stringify(bookArray));
}
function deleteBook() {
  //remove book from the array
  bookArray.splice(this.closest(".card").dataset.index, 1);
  //update books' indexes
  for (let i = 0; i < bookArray.length; i++) {
    bookArray[i].index = i;
  }
  if (bookArray.length < 1) {
    //delete the table
    deleteCards();
    showForm();
  } else {
    //save the array and update table
    localStorage.setItem("myBookArray", JSON.stringify(bookArray));
    restartCards();
  }
}
function submitEdit(event) {
  event.preventDefault();
  let formElements = formNode.elements;
  //if the form is valid...
  if (formIsValid(formElements)) {
    //update book
    bookArray[selectedIndex].name = formElements.name.value;
    bookArray[selectedIndex].author = formElements.author.value;
    bookArray[selectedIndex].pages = formElements.pages.value;
    //save the array
    localStorage.setItem("myBookArray", JSON.stringify(bookArray));
    restartCards();
    showTable();
  } else {
    popupTrigger.click();
  }
}
function submitBook(event) {
  event.preventDefault();
  formElements = formNode.elements;
  //if the form is valid...
  if (formIsValid(formElements)) {
    //create the new book
    let myBook = new Book(
      formElements.name.value,
      formElements.author.value,
      formElements.pages.value,
      bookArray.length
    );
    //add it to the array and save it to localstorage
    bookArray.push(myBook);
    localStorage.setItem("myBookArray", JSON.stringify(bookArray));
    restartCards();
    showForm();
  } else {
    popupTrigger.click();
  }
}
function formIsValid(formElements) {
  if (
    formElements.name.validity.valueMissing ||
    formElements.pages.validity.valueMissing
  ) {
    popupMsg.textContent = "Los campos de nombre y páginas son obligatorios";
    return false;
  }
  if (formElements.pages.validity.patternMismatch) {
    popupMsg.textContent = "Sólo se permiten números en el campo de páginas";
    return false;
  }
  if (formElements.author.value === "") {
    formElements.author.value = "Desconocid@";
  }
  return true;
}
//event listeners
addBookBtn.addEventListener("click", showForm);
returnButton.addEventListener("click", showForm);
loadCardsBtn.addEventListener("click", showTable);
deleteCardsBtn.addEventListener("click", deleteCards);
submitButton.addEventListener("click", submitBook);
submitEditButton.addEventListener("click", submitEdit);
