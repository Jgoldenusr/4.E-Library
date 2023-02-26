//Nodes
const formNode = document.querySelector("form");
const formWrapper = document.querySelector(".form_wrapper");
const tableWrapper = document.querySelector(".table_wrapper");
const addBookBtn = document.querySelector(".new_button");
const loadTableBtn = document.querySelector(".load_button");
const deleteTableBtn = document.querySelector(".delete_button");
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
    let newRow = document.createElement("tr");
    //add read/unread icon
    let readCell = document.createElement("td");
    let readIcon = document.createElement("i");
    readIcon.classList.add("fa");
    if (myBook.read === false) {
      readIcon.classList.add("fa-eye-slash");
    } else {
      readIcon.classList.add("fa-check");
    }
    readCell.append(readIcon);
    readCell.addEventListener("click", checkRead);
    //delete button
    let deleteCell = document.createElement("td");
    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa");
    deleteIcon.classList.add("fa-trash");
    deleteCell.append(deleteIcon);
    deleteCell.addEventListener("click", deleteBook);
    //name cell
    let nameCell = document.createElement("td");
    nameCell.append(myBook.name);
    nameCell.addEventListener("click", showEditForm);
    //author cell
    let authorCell = document.createElement("td");
    authorCell.append(myBook.author);
    authorCell.addEventListener("click", showEditForm);
    //pages cell
    let pagesCell = document.createElement("td");
    pagesCell.append(myBook.pages);
    pagesCell.addEventListener("click", showEditForm);
    //add everything to newRow
    newRow.append(deleteCell);
    newRow.append(readCell);
    newRow.append(nameCell);
    newRow.append(authorCell);
    newRow.append(pagesCell);
    //add an index too
    newRow.dataset.index = myBook.index;
    document.querySelector("tbody").append(newRow);
  }
}
function deleteTable() {
  let tempNodeList = document.querySelectorAll("[data-index]");
  tempNodeList.forEach((node) => {
    node.remove();
  });
  localStorage.clear();
  bookArray = [];
}
function restartTable() {
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
  tableWrapper.hidden = true;
  submitEditButton.hidden = true;
}
function showTable() {
  if (localStorage.getItem("myBookArray")) {
    /*const formSize = formWrapper.getBoundingClientRect();
    tableWrapper.style.maxHeight = formSize.height + "px";
    tableWrapper.style.minWidth = formSize.width + "px";*/
    tableWrapper.hidden = false;
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
  let currentName = bookArray[this.closest("tr").dataset.index].name;
  let currentAuthor = bookArray[this.closest("tr").dataset.index].author;
  let currentPages = bookArray[this.closest("tr").dataset.index].pages;
  let currentIndex = this.closest("tr").dataset.index;
  //set form to current object
  formElements.name.value = currentName;
  formElements.author.value = currentAuthor;
  formElements.pages.value = currentPages;
  selectedIndex = currentIndex;
  formWrapper.hidden = false;
  submitEditButton.hidden = false;
  tableWrapper.hidden = true;
  submitButton.hidden = true;
}
function checkRead() {
  //search book by closest row index
  let book = bookArray[this.closest("tr").dataset.index];
  //cell icon
  let icon = this.querySelector("i");
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
  bookArray.splice(this.closest("tr").dataset.index, 1);
  //update books' indexes
  for (let i = 0; i < bookArray.length; i++) {
    bookArray[i].index = i;
  }
  if (bookArray.length < 1) {
    //delete the table
    deleteTable();
    showForm();
  } else {
    //save the array and update table
    localStorage.setItem("myBookArray", JSON.stringify(bookArray));
    restartTable();
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
    restartTable();
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
    restartTable();
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
loadTableBtn.addEventListener("click", showTable);
deleteTableBtn.addEventListener("click", deleteTable);
submitButton.addEventListener("click", submitBook);
submitEditButton.addEventListener("click", submitEdit);
