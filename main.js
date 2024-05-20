const baseUrl = `https://todo-crudl.deno.dev/saim/todos`;
const addTask = document.getElementById('add-task-button');

addTask.addEventListener('click', async () => {
  const taskInput = document.getElementById('task-input');
  const title = taskInput.value;

  if (title.trim()) {
    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, status: 'todo' })
      });
      const data = await response.json();
      console.log(data);

      loadTodos();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  }else{
    alert("plz add a to do");
  }
});

async function loadTodos() {
  try {
    const response = await fetch(baseUrl);
    const todos = await response.json();

    const todoList = document.getElementById('todo-list');
    const inProgressList = document.getElementById('inprogress-list');
    const completedList = document.getElementById('completed-list');

    todoList.innerHTML = '';
    inProgressList.innerHTML = '';
    completedList.innerHTML = '';

    todos.forEach(todo => {
      const taskItem = document.createElement('div');
      taskItem.className = 'flex items-center justify-between p-2 border-b';
      taskItem.setAttribute('data-status', todo.status);
      taskItem.innerHTML = ` 
        <div>
        <input type="checkbox" class="task-checkbox " data-id="${todo.id}" ${todo.status !== 'todo' ? 'checked' : ''}>
        <span class="font-semibold  flex-grow">${todo.title}</span> 
        </div>
        <button class="delete-task text-red-500" data-id="${todo.id}">X</button>
      `;

      switch (todo.status) {
        case 'todo':
          todoList.appendChild(taskItem);
          break;
        case 'inprogress':
          inProgressList.appendChild(taskItem);
          break;
        case 'completed':
          completedList.appendChild(taskItem);
          break;
      }
    });

    const taskCheckbox = document.querySelectorAll('.task-checkbox');

    taskCheckbox.forEach(checkbox => {
      checkbox.addEventListener('change', async (event) => {
        const id = event.target.getAttribute('data-id');
        const parent = event.target.closest('.flex');
        const currentStatus = parent.getAttribute('data-status');

        let newStatus;
        if (currentStatus === 'todo') {
          newStatus = 'inprogress';
         
        } else if (currentStatus === 'inprogress') {
          newStatus = 'completed';
          
        } else (currentStatus === 'completed') {
             newStatus = 'completed';
        }

        await updateTaskStatus(id, newStatus);
        
      });
       
    });

    const delete_Task = document.querySelectorAll('.delete-task');
    delete_Task.forEach(button => {
      button.addEventListener('click', async (event) => {
        const id = event.target.getAttribute('data-id');
        await deleteTask(id);
      });
    });
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
}

async function deleteTask(id) {
  try {
    await fetch(`${baseUrl}/${id}`, {
      method: 'DELETE'
    });
    loadTodos();
  } catch (error) {
    console.error('Error deleting task:', error);
  }
}

async function updateTaskStatus(id, status) {
  try {
    await fetch(`${baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    loadTodos();
  } catch (error) {
    console.error('Error updating task status:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadTodos);
