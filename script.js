const listContainer = document.querySelector("[data-list]");
const formListElement = document.querySelector("[data-new-list-form]");
const inputListElement = document.querySelector(".input-list");

const deleteListElement = document.querySelector("[data-delete-list]");
const clearTaskElement = document.querySelector("[data-clear-task]");

const taskContainer = document.querySelector("[data-tasks-display-container]");
const taskTitleElement = document.querySelector("[data-header-title]");
const taskCountElement = document.querySelector("[data-header-counting]");
const inputTaskElement = document.querySelector(".input-task");
const formTaskElement = document.querySelector("[data-new-task-form]");
const taskDisplayElement = document.querySelector("[data-tasks]");
const taskTemplateElement = document.querySelector("#task-template");

const LOCAL_STORAGE_LIST_KEY = "task.lists";
const LOCAL_STORAGE_SELECTED_ID_KEY = "task.selected.id";
let list = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedId = localStorage.getItem(LOCAL_STORAGE_SELECTED_ID_KEY);
let selectedList = list.find(element => element.id === selectedId);

//*Create new Objects-----------------------------------------------------------------------------
function createAListObject(title) {
  return { id: Date.now().toString(), name: title, task: [] };
}

function createATaskObject(title) {
  return { id: Date.now().toString(), name: title, isCompleted: false };
}

function clearElements(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

//* Save and Rendering-----------------------------------------------------------------------------
function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(list));
  localStorage.setItem(LOCAL_STORAGE_SELECTED_ID_KEY, selectedId);
}

function renderList() {
  list.forEach(element => {
    const listElement = document.createElement("li");
    listElement.classList.add("list-items");
    listElement.dataset.listId = element.id;
    listElement.innerText = element.name;
    if (listElement.dataset.listId === selectedId) {
      listElement.classList.add("selected");
    }
    listContainer.appendChild(listElement);
  });
}

function renderTasks() {
  taskTitleElement.innerText = selectedList.name;
  taskCountElement.innerText = countTask(selectedList.task);
  clearElements(taskDisplayElement);
  selectedList.task.forEach(element => {
    const taskElement = document.importNode(taskTemplateElement.content, true);
    const checkBox = taskElement.querySelector("input");
    const labelElement = taskElement.querySelector("label");
    console.log(labelElement);

    checkBox.id = element.id;
    checkBox.checked = element.isCompleted;

    labelElement.append(element.name);
    labelElement.htmlFor = checkBox.id;
    taskDisplayElement.appendChild(taskElement);
  });
}

function countTask(selectedList) {
  let count = 0;
  selectedList.forEach(e => {
    if (!e.isCompleted) count++;
  });
  let phrase = count <= 1 ? "task" : "tasks";
  return `${count} ${phrase} remaining`;
}

function render() {
  clearElements(listContainer);
  renderList();

  if (selectedId == null || selectedId == "null") {
    taskContainer.style.display = "none";
  } else {
    taskContainer.style.display = "";
    renderTasks(selectedList);
  }
}

function saveAndRender() {
  save();
  render();
}
//* Event handles functions -----------------------------------------------------------------------------

function selectingList(e) {
  if (e.target.tagName.toLowerCase() === "li") {
    selectedId = e.target.dataset.listId;
    selectedList = list.find(element => element.id === selectedId);
    saveAndRender();
  }
}

function checkingTaskBox(event) {
  const target = event.target;
  if (target.tagName.toLowerCase() == "input") {
    const checkBox = selectedList.task.find(element => element.id === target.id);
    checkBox.isCompleted = target.checked;
    save();
    renderTasks();
  }
}

function addNewList(event) {
  event.preventDefault();
  const input = inputListElement.value;
  if (input == null || input === "") return;
  const newList = createAListObject(input);
  list.push(newList);
  inputListElement.value = null;
  if (list.length == 1) {
    selectedId = list[0].id;
    selectedList = list.find(element => element.id === selectedId);
  }
  saveAndRender();
}

function addNewTask(event) {
  event.preventDefault();
  const input = inputTaskElement.value;

  if (input == null || input === "") return;

  const newTask = createATaskObject(input);

  selectedList.task.push(newTask);
  console.log(selectedList.task);
  inputTaskElement.value = null;
  saveAndRender();
}

function deleteAList() {
  let index = list.findIndex(element => element.id === selectedId);
  list.splice(index, 1);
  //* After deleting the selected list, auto grab the upper one. If there aren't anything abbove, grab the below instead.
  index--;
  selectedId = index >= 0 ? list[index].id : list.length > 0 ? list[0].id : null;
  saveAndRender();
}

function clearAllCompletedTask() {
  selectedList.task = selectedList.task.filter(element => element.isCompleted !== true);
  console.log(list);
  saveAndRender();
}

//*-----------------------------------------------------------------------------
render();
listContainer.addEventListener("click", selectingList);

formListElement.addEventListener("submit", addNewList);

formTaskElement.addEventListener("submit", addNewTask);

taskContainer.addEventListener("click", checkingTaskBox);

deleteListElement.addEventListener("click", deleteAList);

clearTaskElement.addEventListener("click", clearAllCompletedTask);
