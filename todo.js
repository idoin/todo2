let taskInput = document.querySelector("#new-task");
let addButton = document.getElementsByTagName("button")[0];
let incompleteTasksHolder = document.querySelector("#incomplete-tasks");
let selector = document.querySelector('#sort-select');


const fetchTasks = () => {
	let tasksFromLocal;
	const todoStorage = localStorage.getItem('Tasks');

	todoStorage !== null ? tasksFromLocal = JSON.parse(todoStorage) : tasksFromLocal = [];

	return tasksFromLocal;
}

const sortSelected = () => {
	switch (selector.value) {
		case 'Time':
			tasks.sort(compareTimes);
			break;
		case 'Status':
			tasks.sort(compareStatus);
			break;
		case 'Alphabet':
			tasks.sort(compareLetters);
			break;
		default:
			break;
	}

	localStorage.setItem('Tasks', JSON.stringify(tasks))
	let oldListItems = document.querySelectorAll('li');
	tasks.forEach((element, index) => {
		let listItem = createNewTaskElement(element.task, element.done);
		incompleteTasksHolder.replaceChild(listItem, oldListItems[index]);
		bindTaskEvents(listItem, taskCompleted);
	});
}


const compareLetters = (a,b) => {
	if (a.task < b.task)
		return -1;
	if (a.task > b.task)
		return 1;
	return 0;
}

const compareTimes = (a,b) => {
	if (a.date < b.date)
		return -1;
	if (a.date > b.date)
		return 1;
	return 0;
}

const compareStatus = (a,b) => {
	if (a.done > b.done)
		return -1;
	if (a.done < b.done)
		return 1;
	return 0;
}

const renderTasks = () => {
	tasks.forEach(element => {
		let listItem = createNewTaskElement(element.task, element.done);

		incompleteTasksHolder.appendChild(listItem);

		bindTaskEvents(listItem, taskCompleted);
	});
}

const createNewTaskElement = (taskString, status) => {

	let listItem = document.createElement("li");
	let checkBox = document.createElement("input");
	let label = document.createElement("label")
	let deleteButton = document.createElement("button")

	status ? checkBox.checked = true : null;

	checkBox.type = "checkbox";

	deleteButton.innerText = "Delete";
	deleteButton.className = "delete";

	label.innerText = taskString;

	listItem.appendChild(checkBox);
	listItem.appendChild(label);
	listItem.appendChild(deleteButton);

	return listItem;
};

const addTask = () => {
	let listItem = createNewTaskElement(taskInput.value);
	tasks.push({
		'task': taskInput.value,
		'date': Date.now(),
		'done': false
	});

	localStorage.setItem("Tasks", JSON.stringify(tasks));

	incompleteTasksHolder.appendChild(listItem);
	bindTaskEvents(listItem, taskCompleted);

	taskInput.value = "";
};

const deleteTask = function() {
	let listItem = this.parentNode;
	let taskToDelete = listItem.children[1].innerText;

	let found = tasks.find((element) => {
		return element.task === taskToDelete
	})

	tasks.splice(tasks.indexOf(found), 1);
	localStorage.setItem('Tasks', JSON.stringify(tasks));

	let ul = listItem.parentNode

	ul.removeChild(listItem);
};


const taskCompleted = function() {
	let listItem = this.parentNode;
	let taskToDelete = listItem.children[1].innerText;

	let found = tasks.find((element) => {
		return element.task === taskToDelete
	})

	tasks[tasks.indexOf(found)].done = !tasks[tasks.indexOf(found)].done

	localStorage.setItem('Tasks', JSON.stringify(tasks));
};

const taskIncomplete = () => {
	let listItem = this.parentNode;
	incompleteTasksHolder.appendChild(listItem);
	bindTaskEvents(listItem, taskCompleted)
};

const bindTaskEvents = (taskListItem, checkBoxEventHandler)  => {
	let checkBox = taskListItem.querySelector("input[type=checkbox]");
	let deleteButton = taskListItem.querySelector("button.delete");

	deleteButton.onclick = deleteTask

	checkBox.onchange = checkBoxEventHandler;
};

addButton.onclick = addTask;

selector.onchange = sortSelected;

for (let i = 0; i < incompleteTasksHolder.children.length; i++) {
	bindTaskEvents(incompleteTasksHolder.children[i], taskCompleted);
};

let tasks = fetchTasks();
renderTasks();