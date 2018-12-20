let tasks = storedTasks();

window.onload = function () {
    renderTodoList();
};

function storedTasks() {
    let tasks = [];
    const tasksToString = localStorage.getItem('todo');
    if (tasksToString) {
        tasks = JSON.parse(tasksToString);
    }
    return tasks;
}

function renderTodoList() {
    checkTaskList();

    const sortBy = localStorage.getItem('sortBy');
    const dropdown = document.querySelector('select');
    if (sortBy){
        dropdown.value = sortBy;
    }
    for (let i = 0; i < tasks.length; i++) {
        renderNewCard(tasks[i].taskTitle,tasks[i].time,tasks[i].status);
    }
}

function addTask(taskTitle, time, status, id) {
    tasks.push({taskTitle, time, status, id});
    localStorage.setItem('todo', JSON.stringify(tasks));
    renderNewCard(taskTitle, time,status);
    sort();
}

document.body.onkeyup = function (e) {
    const taskTitle = document.querySelector('#addTask');
    const time = new Date().getTime();
    const status = false;
    const id = taskTitle.value + time;
    if (e.keyCode === 13 && taskTitle.value) {
        addTask(taskTitle.value, time, status, id);
        taskTitle.value = '';
    }
};

function deleteTask(e) {
    const id = e.target.getAttribute('id');
    const pos = tasks.map(e => {
        return e.id;
    }).indexOf(id);
    tasks.splice(pos, 1);
    const cardToDelete = document.getElementById(id);
    cardToDelete.parentNode.removeChild(cardToDelete);
    localStorage.setItem('todo', JSON.stringify(tasks));
    checkTaskList();
}

function renderNewCard(task, time,status ) {
    const id = task + time;
    const ul = document.querySelector('#ul');
    const card = document.createElement('div');
    const li = document.createElement('li');
    const rightDiv = document.createElement('div');
    const leftDiv = document.createElement('div');
    const checkbox = document.createElement('input');
    const done = document.createElement('p');
    const button = document.createElement('button');

    button.setAttribute('class', 'remove');
    button.innerText = 'DELETE';
    button.setAttribute('id', id);
    done.innerText = 'Done!';
    rightDiv.setAttribute('class', 'right');
    leftDiv.setAttribute('class', 'left');
    checkbox.setAttribute('type', "checkbox");
    checkbox.setAttribute('class', 'checkbox');
    checkbox.setAttribute('id', id);

    if(status) {
        checkbox.setAttribute('checked', 'checked');
        leftDiv.setAttribute('class','left checked')
    }
    card.setAttribute('class','card');
    card.setAttribute('id', id);
    li.setAttribute('id', 'text');
    done.setAttribute('id', 'done');

    ul.appendChild(card);
    card.appendChild(li);
    leftDiv.appendChild(document.createTextNode(task));
    li.appendChild(leftDiv);
    li.appendChild(rightDiv);
    rightDiv.appendChild(checkbox);
    rightDiv.appendChild(done);
    rightDiv.appendChild(button);

    button.addEventListener('click', deleteTask);
    checkbox.addEventListener('change', check);

    checkTaskList();

}

function checkTaskList() {
    const noTasksText = document.querySelector('h3');

    if (tasks.length !== 0) {
        noTasksText.style.display = 'none';
    } else {
        noTasksText.style.display = 'block';
    }
}

function sort() {
    let filterBy = document.querySelector("#dropdown");
    let ul = document.querySelector('#ul');

        if (filterBy.value === '1') {

            let nonSortedArray = tasks;
            let sortedArray = nonSortedArray.sort(function (a, b) {
                let taskA = a.taskTitle;
                let taskB = b.taskTitle;
                return (taskA < taskB) ? -1 : (taskA > taskB) ? 1 : 0;
            });

        localStorage.setItem('todo', JSON.stringify(sortedArray));
        localStorage.setItem('sortBy', '1');
    }


    if (filterBy.value === '2') {
        let nonSortedArray = tasks;
        let sortedArray = nonSortedArray.sort(function (a, b) {
            let taskA = a.time;
            let taskB = b.time;
            return (taskA < taskB) ? -1 : (taskA > taskB) ? 1 : 0;

        });
        localStorage.setItem('todo', JSON.stringify(sortedArray));
        localStorage.setItem('sortBy', '2');
    }

    if (filterBy.value === '3') {
        let nonSortedArray = tasks;
        let sortedArray = nonSortedArray.sort(function (a, b) {
            let taskA = a.status;
            let taskB = b.status;
            return (taskA > taskB) ? -1 : (taskA < taskB) ? 1 : 0;

        });
        localStorage.setItem('todo', JSON.stringify(sortedArray));
        localStorage.setItem('sortBy', '3');
    }
    while (ul.hasChildNodes()) {
        ul.removeChild(ul.firstChild);
    }
    renderTodoList();
}

function check(e) {
    const id = e.target.getAttribute('id');
    const pos = tasks.map(function (e) {
        return e.id;
    }).indexOf(id);
    tasks[pos].status = !tasks[pos].status;
    localStorage.setItem('todo', JSON.stringify(tasks));
    sort();
}
        
    
