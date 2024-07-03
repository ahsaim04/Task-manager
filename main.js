let baseUrl;
let userId;

function login() {
  userId = document.getElementById('user-id').value.trim();
  if (userId) {
    baseUrl = `https://todo-crudl.deno.dev/${userId}/todos`;
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('task-manager-page').style.display = 'flex';
    load();
  } else {
    alert('Please enter a User ID');
  }
}

async function load() {
  const response = await fetch(baseUrl);
  const todos = await response.json();
  printToDo(todos);
  printInProgress(todos);
  printComplete(todos);
}

async function submit() {
  let title = document.getElementById("title").value;
  console.log(title);
  if (title.trim()) {
    try {
      const response = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, status: "todo" }),
      });
      const data = await response.json();
      console.log(data);

      load();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  } else {
    alert("plz add a to do");
  }
  document.getElementById("title").value = ''
}


async function fetchData(id) {
  const response = await fetch(`${baseUrl}/${id}`);
  const todos = await response.json();
  return todos;
}

async function updateData(id, status) {
  try {
    await fetch(`${baseUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  } catch (error) {
    console.error("Error updating task status:", error);
  }

}
async function handleDelete(id) {
    try {
        await fetch(`${baseUrl}/${id}`, {
          method: 'DELETE'
        });
        load();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
}

async function handleChange(id) {
  let todos = await fetchData(id);
  if (todos.status == "todo") {
    updateData(id, "in-progress");
  } else if (todos.status == "in-progress") {
    updateData(id, "complete");
  }
}

function printToDo(todo) {
  let todos = document.getElementById("todo");
  todos.innerHTML = "";
  todo.map((elm) => {
    if (elm.status == "todo") {
      todos.innerHTML += `
              <div class="flex justify-between">
                              <span class="flex gap-4" ><input id="${elm.id}" onchange="handleChange('${elm.id}')"  key="${elm.status}" type="checkbox">${elm.title}</span><span><a onclick="handleDelete('${elm.id}')"
                                      class="fa fa-x text-xs cursor-pointer text-gray-500"></a></span>
                          </div>
              `;
    }
  });
}
function printInProgress(todo) {
  let todos = document.getElementById("in-progress");
  todos.innerHTML = "";
  todo.map((elm) => {
    if (elm.status == "in-progress")
      todos.innerHTML += `
              <div class="flex justify-between">
                              <span class="flex gap-4" ><input id="${elm.id}" onchange="handleChange('${elm.id}')"  key="${elm.status}" type="checkbox">${elm.title}</span><span><a onclick="handleDelete('${elm.id}')"
                                      class="fa fa-x text-xs cursor-pointer text-gray-500"></a></span>
                          </div>
              `;
  });
}
function printComplete(todo) {
  let todos = document.getElementById("completed");
  todos.innerHTML = "";
  todo.map((elm) => {
    if (elm.status == "complete")
      todos.innerHTML += `
              <div class="flex justify-between">
                              <span class="flex gap-4" >${elm.title}</span><span><a onclick="handleDelete('${elm.id}')"
                                      class="fa fa-x text-xs cursor-pointer text-gray-500"></a></span>
                          </div>
              `;
  });
}

load();
