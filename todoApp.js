//  runs show() function to display stored tasks
window.onload = function() {
    show();
  };

// check if there's stored tasks
function allTasks() {
    let tasks = [];
    let tasksToString = localStorage.getItem('todo');
    if (tasksToString) {
        tasks = JSON.parse(tasksToString);     
    }
    return tasks;
}

// display stored tasks
function show() {
    let Tasks = allTasks();
    CheckTasksList(); // check if task list is empty
    let id = Tasks.length;
    let checkboxStatus; // to set checkbox to checked or not
    let isChecked = ''; // new class for task title
    let list = '<ul id="ul">';
   
    for(let i=0; i<Tasks.length; i++) {
        if ( Tasks[i].status == 1) {
             checkboxStatus = 'checked';
             isChecked = 'checked';
             
             
        }else{
             checkboxStatus= '';
             isChecked = '';
        }

        list += '<div class="card " id="' + i  +'"><li id="text">' + '<div class="left ' + isChecked +'"  >' +
        Tasks[i].task  + '</div>'+ '<div class="right" ><input class="checkbox"' + checkboxStatus + '  type="checkbox" id="' + i  +'">' + '<p id="done">Done!</p>' +
        '<button class="remove" id=' + i  +'>DELETE</button> </div>' + '</li>'+ '</div>' ;
    };
    list += '</ul>';  

    document.getElementById('Tasks').innerHTML = list;
   let removeBtn =  document.getElementsByClassName('remove');
   let checkbox = document.getElementsByClassName('checkbox');

   

   Tasks.forEach((element,index) => {
    removeBtn[index].addEventListener('click',DeleteTask);
    checkbox[index].addEventListener('click',check);

   });
    
    
}


 
function addTask() {
    let task = document.getElementById('addTask').value;
    let Tasks = allTasks();
    let time = new Date().toLocaleTimeString();
    let status = 0;
    const id = Tasks.length;
    Tasks.push({task, time, status, id});
    localStorage.setItem('todo', JSON.stringify(Tasks));
    renderNewCard(task,id); // to render only the added card, not re-render the whole list
    filter(); // to place the new card in the appropriate position depends on the filtered data
  
    return false;
}

document.body.onkeyup = function(e) {
    let input = document.getElementById('addTask')
    if (e.keyCode == 13 && input.value ) {
      addTask();
      input.value = '';
     
    }
  };
 
function DeleteTask() {
    let Tasks = allTasks();
    let id = this.getAttribute('id');
    if(Tasks.length === 0) {
        Tasks = [];
    } else {
        Tasks.splice(id, 1);
    }

    localStorage.setItem('todo', JSON.stringify(Tasks));
   
    show();
    
    CheckTasksList();
    }

 



function renderNewCard (task,id) {
        let card = document.createElement("div");
        let li = document.createElement("li");
        let rightDiv = document.createElement("div");
        let leftDiv = document.createElement("div");
        let checkbox = document.createElement("input");
        let done = document.createElement("p");
        let ul = document.getElementById("ul");
        let button = document.createElement("button");
      

        button.setAttribute("class","remove");
        button.innerText = "DELETE";
        button.setAttribute('id', id);
        done.innerText = "Done!";
        rightDiv.setAttribute("class","right");
        leftDiv.setAttribute("class","left");
        checkbox.setAttribute("type","checkbox");
        checkbox.setAttribute("class","checkbox");
        checkbox.setAttribute("onClick","check(this)");
        checkbox.setAttribute("id","checkbox");
        card.setAttribute("class","card card-new");
        card.setAttribute("id",allTasks().length - 1);
        li.setAttribute("id", "text");
        li.setAttribute("class","");
        done.setAttribute("id","done");
        
        button.addEventListener('click', DeleteTask);
        

        ul.appendChild(card);
        card.appendChild(li);
        leftDiv.appendChild(document.createTextNode(task));
        li.appendChild(leftDiv);
        li.appendChild(rightDiv);       
        rightDiv.appendChild(checkbox);
        rightDiv.appendChild(done);
        rightDiv.appendChild(button);
        CheckTasksList();
}

function CheckTasksList() {
    let tasksLength = allTasks().length;
    if (tasksLength === 0){
        noTasks.innerText = "No Task for today! Have fun :)";
    } else{
        noTasks.innerText = "";
    }
}

  function filter() { 
    let filterBy = document.getElementById("dropdown");
    

    if ( filterBy.value == 1){ //Alphabitical order
      let nonSortedArray = allTasks();
      let sortedArray = nonSortedArray.sort(function (a, b) {

        let taskA = a.task;
        let taskB = b.task;
           return ( taskA < taskB ) ? -1 : (taskA > taskB ) ? 1 : 0;
          });
          localStorage.setItem('todo', JSON.stringify(sortedArray));
          show();

    }

    if ( filterBy.value == 2 ) { //Time based filter
            let nonSortedArray = allTasks();
            let sortedArray = nonSortedArray.sort(function(a, b) {
            let taskA = a.time;
            let taskB = b.time;
            return ( taskA < taskB ) ? -1 : (taskA > taskB ) ? 1 : 0;

        });
        localStorage.setItem('todo', JSON.stringify(sortedArray));
          show();
    }

    if ( filterBy.value == 3 ) { //Status based order
            let nonSortedArray = allTasks();
            let sortedArray = nonSortedArray.sort(function(a, b) {
            let taskA = a.status;
            let taskB = b.status;
            return ( taskA > taskB ) ? -1 : (taskA < taskB ) ? 1 : 0;

        });
            localStorage.setItem('todo', JSON.stringify(sortedArray));
            show();
    }
}

         function check(){ // set status = 1 if checkbox checked
         let id = this.getAttribute('id');
         let Tasks = allTasks();
         Tasks[id].status == 1 ? Tasks[id].status = 0 : Tasks[id].status = 1;
         localStorage.setItem('todo', JSON.stringify(Tasks));
         show();
      

    }
        
    
