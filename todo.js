function show() {
    var todos = get_todos();

    var html = '<ul>';
    for(var i=0; i<todos.length; i++) {
        html += '<li>' + todos[i].task + '<button class="remove" id="' +i  + '">x</button><input type="checkbox" class ="check" id="' + i  + '" ></li>';
    };
    html += '</ul>';
 
    document.getElementById('todos').innerHTML = html;
    
    var buttons = document.getElementsByClassName('remove');
    for (var i=0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', remove);
    };

    var checks = document.getElementsByClassName('check');
    for (var i=0; i < checks.length; i++) {
        todos[i].done === 'done'? checks[i].checked = true : checks[i].checked = false
        checks[i].addEventListener('click', check);
    };
}
//add function to add a new task from the text input to the items list 
function add() {
     this.parentElement.children.item(1)!==null ? this.parentElement.removeChild(this.parentElement.childNodes[3]): null
     if(event.key === 'Enter') {
        var task = this.value;
        
        if (task === '') { 
            if (this.parentElement.children.item(1)===null) {
            var errorMsg = document.createElement("p");
            errorMsg.setAttribute("class","errorMsg")
            var errorTxt = document.createTextNode("You need to write a task first!");
            errorMsg.appendChild(errorTxt);
            document.getElementById("inputBox").appendChild(errorMsg);
            } 
         }
        else {
            var d = new Date();      
            var todos = get_todos();
            todos.push({'task':task , 'date':d ,'done':'notDone'});    
            localStorage.setItem('todo', JSON.stringify(todos));    
            this.value="";
            show();
        }
    }
}
//get the todos stored in the session 
function get_todos() {
    var todos = [];
    var todos_str = localStorage.getItem('todo');
    todos_str !== null ? todos = JSON.parse(todos_str): null    
    return todos;
}
//remove function to remove an item from the list on button click 
function remove() {
    var id = this.getAttribute('id');
    var todos = get_todos();
    todos.splice(id, 1);   
    localStorage.setItem('todo', JSON.stringify(todos));
    show();
}
//check function to update the status of the check button
function check() {
    var todos = get_todos();
    todos[this.id].done ==='done' ? todos[this.id].done = 'notDone': todos[this.id].done ='done'     
    localStorage.setItem('todo', JSON.stringify(todos));
    show();
}
//sort function based of date done tasks and alphabetical order
function sort(){
    let sortSelected = this.value;
    var todos = get_todos();
    var sorting ='';

    sortSelected === 'Date' ? sorting = 'date' 
    : sortSelected === 'Done' ? sorting = 'done'
    : sortSelected === 'Alphabetical' ? sorting = 'task' : null
    
    todos.sort((a, b)=>{
        if(a[sorting] < b[sorting]) { return -1; }
        if(a[sorting] > b[sorting]) { return 1; }
        return 0;
    })

    localStorage.setItem('todo', JSON.stringify(todos));
    this.value = "";
    show();

}
//add event listners on usser input and sort elements
document.getElementById("task").addEventListener("keydown", add);
document.getElementById("sort").addEventListener("click", sort)
 
show();