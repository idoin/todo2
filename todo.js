const Http = new XMLHttpRequest();

function getTasks() {
    //Returns todos stored in local storage, if empty returns empty array
    let todos = new Array;
    const todoStorage = localStorage.getItem('todo');
    todoStorage !== null
        ? todos = JSON.parse(todoStorage)
        : null;

    return todos;

}

function addTask() {
    //Adds task to todo list in local storage and then shows todos
    const todo = document.getElementById('task-input').value;
    const timeAdded = new Date().toLocaleTimeString();
    const status = false;
    if (todo !== '') {
      const todos = getTasks();
      const id = todos.length+1;
      console.log(id, "here")
        todos.push({todo, timeAdded, status, id});
        localStorage.setItem('todo', JSON.stringify(todos));
        showTasks();

   
        const url=`https://majdqumseya.wixsite.com/mysite/_functions/addTodo/?text=${todo}&dateAdded=${timeAdded}&status=${status}&id=${id}`;
        Http.open("GET", url);
        Http.send();
        Http.onreadystatechange=(e)=>{
        console.log(Http.responseText)
        }
    }
}

function deleteTask() {
    //Gets the tasks and id to be deleted
    const todos = getTasks();
    const id = this.getAttribute('id');

    //splices the todo item by id
    todos.splice(id, 1);

    //Sets the local storage object to the new todos
    localStorage.setItem('todo', JSON.stringify(todos));

    //Shows tasks (from local storage)
    showTasks();

        const url=`https://majdqumseya.wixsite.com/mysite/_functions/deleteTodo/?id=${parseInt(todos[id].id) - 1}`;
        Http.open("GET", url);
        Http.send();
        Http.onreadystatechange=(e)=>{
        console.log(Http.responseText)
        }
}

async function editTask() {
    //Creats edit input for selected list item and adds event hooks to save and delete button
    const oldValue = this.parentElement.innerText.replace('x*Added: ', '').trim().slice(0, -11);
 
    const index = this.id;
    const listElement = document.createElement("li");
    const inputElement = document.createElement("input");
    const deleteButton = document.createElement("button");
    const editButton = document.createElement("button");

    inputElement.value = oldValue;
    deleteButton.className = "delete";
    deleteButton.id = index
    deleteButton.innerText = "x";
    deleteButton.addEventListener('click', deleteTask);

    editButton.className="save";
    editButton.id = index;
    editButton.innerHTML = "*"
   
    editButton.addEventListener('click', (event) => {
        const newValue = inputElement.value;
        saveTask(index, newValue);
    });
 
    
    listElement.appendChild(inputElement);
    listElement.appendChild(deleteButton);
    listElement.appendChild(editButton);
    
    const todoList = document.getElementById('todo-list');
   
    todoList.replaceChild(listElement, todoList.childNodes[index]);    
}

function saveTask(index, newTodo) {
   //Get the tasks
   const todos = getTasks();
   const newTime = new Date().toLocaleTimeString();
   //Edits the selected index with new todo item
   todos[index].todo = newTodo;
   todos[index].timeAdded = newTime; 

   //Updates the local storage todo object with new one
   localStorage.setItem('todo', JSON.stringify(todos));

   //Show tasks (from local storage)
   showTasks();

    const url=`https://majdqumseya.wixsite.com/mysite/_functions/editTodo/?id=${parseInt(todos[index].id)}&text=${newTodo}&time=${newTime}&status=${todos[index].status}`;
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange=(e)=>{
        console.log(Http.responseText)
    }
}

function changeStatus() {
    const todos = getTasks();
    const id = this.getAttribute('id');

    //splices the todo item by id
    todos[id].status = !todos[id].status

    //Sets the local storage object to the new todos
    localStorage.setItem('todo', JSON.stringify(todos));

    const url=`https://majdqumseya.wixsite.com/mysite/_functions/changeStatus/?id=${parseInt(todos[id].id)}&status=${todos[id].status}`;
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange=(e)=>{
        console.log(Http.responseText)
    }
}

// Sort and their respective compare functions (.sort())

// Alphabet
function sortByAlphabet() {
    const todos = getTasks();
    todos.sort(compareLetters);
    localStorage.setItem('todo', JSON.stringify(todos));
    showTasks();
}

function compareLetters(a,b) {
    if (a.todo < b.todo)
      return -1;
    if (a.todo > b.todo)
      return 1;
    return 0;
} 
// !Alphabet

// Time
function sortByTime() {
    const todos = getTasks();
    todos.sort(compareTimes);
    localStorage.setItem('todo', JSON.stringify(todos));
    showTasks();
}

function compareTimes(a,b) {
    if (a.timeAdded < b.timeAdded)
      return -1;
    if (a.timeAdded > b.timeAdded)
      return 1;
    return 0;
}
// !Time

// Status
function sortByStatus() {
    const todos = getTasks();
    todos.sort(compareStatus);
    localStorage.setItem('todo', JSON.stringify(todos));
    showTasks();
}

function compareStatus(a,b) {
    if (a.status > b.status)
    return -1;
  if (a.status < b.status)
    return 1;
  return 0;
}

// !Status

function showTasks() {
    //Get the tasks
    const todos = getTasks();

    //Build task list
    let taskList = '<ul id="todo-list">';
   
    todos.forEach((todo, index) => {
        todo.status === false? taskList += `<li> <input type="checkbox" id="${index}" class="check" name="todo${index}" value="todo${index}">${todo.todo}<button class="delete" id="${index}">x</button><button class="edit" id="${index}">*</button>Added: ${todo.timeAdded}</li>`: taskList += `<li> <input type="checkbox" id="${index}" class="check" name="todo${index}" value="todo${index}" checked>${todo.todo}<button class="delete" id="${index}">x</button><button class="edit" id="${index}">*</button>Added: ${todo.timeAdded}</li>`; 
        
    });
    taskList += '</ul>';

    //Set the div html to newly built task list
    document.getElementById('todo').innerHTML = taskList;

    //Adding event listeners to delete/edit buttons
    deleteButtons = document.getElementsByClassName('delete');
    editButtons = document.getElementsByClassName('edit');
    checkBoxes = document.getElementsByClassName("check");
    todos.forEach((todo, index) => {
        deleteButtons[index].addEventListener('click', deleteTask);
        editButtons[index].addEventListener('click', editTask);
        checkBoxes[index].addEventListener('click', changeStatus)
    });

}

//Event Listeners
document.getElementById('add-button').addEventListener('click', addTask);
document.getElementById('task-input').addEventListener("keyup", (event) =>  {
    event.preventDefault();
    event.keyCode === 13? document.getElementById("add-button").click(): null;
});
document.getElementById('sort-by-alphabet').addEventListener('click', sortByAlphabet);
document.getElementById('sort-by-time').addEventListener('click', sortByTime);
document.getElementById('sort-by-status').addEventListener('click', sortByStatus);

//Initial function to get tasks
showTasks();