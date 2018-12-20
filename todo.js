// show function is to be called whenever a change is made to the lis(add revpve sort check)
function show() { 
    const todos = get_todos();

    let html = '<ul>';
    todos.forEach((todo,i)=>{
      html += '<li><button class=" btn btn-danger remove" id="'+i+'">x</button><input type="checkbox" class ="check" id="'+i+'" /><label>'+todo.task+'</label></li>';
    })
    html += '</ul>';

    document.getElementById('todos').innerHTML = html; //querySelector or querySelectorAll 
    
    const buttons = document.getElementsByClassName('remove');
    let checks = document.getElementsByClassName('check'); //change to const and also rename
    
    todos.forEach((todo,i)=>{
        checks[i].checked = todo.done ;
        checks[i].addEventListener('click', check);
        buttons[i].addEventListener('click', remove);
    }); 
}

//add function to add a new task from the text input to the items list 
function add() {
     this.parentElement.children.item(1)!==null ? this.parentElement.removeChild(this.parentElement.childNodes[3]): null //refactor
     if(event.key === 'Enter') {
        const task = this.value;
        
        if (task === '') { 
            if (this.parentElement.children.item(1)===null) {
            const errorMsg = document.createElement("p"); 
            errorMsg.setAttribute("class","errorMsg");
            const errorTxt = document.createTextNode("You need to write a task first!");
            errorMsg.appendChild(errorTxt);
            document.getElementById("inputBox").appendChild(errorMsg);
            } 
         }
        else {
            const date = new Date(); //use date now to and store the ms format of the date      
            const todos = get_todos();
            todos.push({'task':task , 'date':date ,'done':false});    
            localStorage.setItem('todo', JSON.stringify(todos));    
            this.value="";
            show();
        }
    }
}

//get the todos stored in the session 
function get_todos() {
    let todos = [];
    let todos_str = localStorage.getItem('todo');
    todos_str !== null ? todos = JSON.parse(todos_str): null    
    return todos;
}

//remove function to remove an item from the list on button click 
function remove() {
    const id = this.getAttribute('id');
    const todos = get_todos();
    todos.splice(id, 1);   
    localStorage.setItem('todo', JSON.stringify(todos));
    show();
}

//check function to update the status of the check button

function check() {
    const todos = get_todos();
    todos[this.id].done = !todos[this.id].done   //missing semicolon 
    localStorage.setItem('todo', JSON.stringify(todos));
    show(); //no need to render the whole thing
}

//sort function based of date done tasks and alphabetical order
function sort(){
    const sorting = this.value;
    const todos = get_todos();
    todos.sort((a, b)=>{
        if(a[sorting] < b[sorting]) { return -1; }
        if(a[sorting] > b[sorting]) { return 1; }
        return 0;
    })
    

    localStorage.setItem('todo', JSON.stringify(todos)); //save the type of sorting
    this.value = "";
    show();

}

//add event listners on usser input and sort elements
document.getElementById("task").addEventListener("keydown", add);
document.getElementById("sort").addEventListener("click", sort)
 
show();
