const todos = getTodos();
const sortSelected = document.querySelector('#sort');
const todosList = document.querySelector("#todosList");

function getTodos() {
    let savedTodos = localStorage.getItem('todo');
    savedTodos !== null ? savedTodos = JSON.parse(savedTodos): savedTodos =[]    
    return savedTodos;
}

function showTodoList() {

    localStorage.getItem('sortSelected') ? sortSelected.value = localStorage.getItem('sortSelected') : sortSelected.value = ""
    
    while(todosList.firstChild){ 
       todosList.removeChild(todosList.firstChild);
    }

    todos.forEach( (todo, i) =>{

        const todoItem =  buildTask(todo);
        todosList.appendChild(todoItem);
        
        const checkBox = todoItem.querySelector("input[type=checkbox]");
        const deleteButton = todoItem.querySelector("button");

        deleteButton.addEventListener('click', removeTask);
        checkBox.addEventListener('click', check);

    });
}

function addNewTask() {

    const errMsg = document.querySelector('p');
    errMsg.style.display = 'none';
    
    if(event.key === 'Enter') {
        const task = this.value;
        
        if (task === '') { 
            errMsg.style.display = 'block';
        }else {

            errMsg.style.display = 'none';
            const date = new Date(Date.now());
            let newTodo= {'task':task , 'date':date ,'done':false};     
            
            todos.push(newTodo);
            localStorage.setItem('todo', JSON.stringify(todos));    
            
            this.value="";
            
            const todoItem = buildTask(newTodo);
            todosList.appendChild(todoItem);
        
            const checkBox = todoItem.querySelector("input[type=checkbox]");
            const deleteButton = todoItem.querySelector("button");

            deleteButton.addEventListener('click', removeTask);
            checkBox.addEventListener('click', check);
         
            if(sortSelected){sort()}
        }
    }
}

function buildTask (todo){

    const listItem = document.createElement("li");
    const checkBox = document.createElement("input");
    const taskLabel = document.createElement("label");
    const deleteButton = document.createElement("button")


    checkBox.type = "checkbox";
    checkBox.checked = todo.done;

    deleteButton.className = "btn btn-danger remove";
    deleteButton.innerText = "X";

    taskLabel.innerText = todo.task;

    listItem.appendChild(checkBox);
    listItem.appendChild(taskLabel);
    listItem.appendChild(deleteButton);

    return listItem;
}

function removeTask(e) {
    const taskToRemove = e.target.parentNode.parentNode;
    taskToRemove.removeChild(e.target.parentNode);
    const found= todos.findIndex(x => x.task== e.target.parentNode.children[1].innerText);

    todos.splice(found, 1);   
    localStorage.setItem('todo', JSON.stringify(todos));
}


function check(e) {
    const taskToCheck= e.target.parentNode;
    const found= todos.findIndex(x => x.task== e.target.parentNode.children[1].innerText);

    todos[found].done = e.target.parentNode.children[0].checked;
    localStorage.setItem('todo', JSON.stringify(todos));
}

function sort(){
    
    let sortingValue;
    this.value ? sortingValue = this.value : sortingValue = sortSelected.value

    todos.sort((a, b)=>{
        if(a[sortingValue] < b[sortingValue]) { return -1; }
        if(a[sortingValue] > b[sortingValue]) { return 1; }
        return 0;
    })
    
    localStorage.setItem('todo', JSON.stringify(todos));
    localStorage.setItem('sortSelected', sortingValue);
  
    showTodoList();
}

document.getElementById("task").addEventListener("keydown", addNewTask);
document.getElementById("sort").addEventListener("change", sort);

showTodoList();