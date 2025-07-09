const form = document.getElementById("form-todo");
const list = document.querySelector(".todo-list");
const span = document.querySelector(".todo-count");
const footer = document.querySelector(".footer");
const clearButton = document.querySelector(".clear-completed");

form.addEventListener("submit", todoSubmit);
list.addEventListener("click", manyTodos);
footer.addEventListener("click", filterTodos);
clearButton.addEventListener("click",clearCompleted)

document.addEventListener("DOMContentLoaded", function () {
  let todos = getLocalStorage();

  const falseTodos = todos.filter(({ completed }) => completed === false);

  span.firstElementChild.textContent = falseTodos.length;
  span.textContent = falseTodos.length > 1 ? `${falseTodos.length} items left` : `${falseTodos.length} item left`

  let color;
  

  todos.forEach((todo) => {
    if (todo.priority === "low") {
      color = "low";
    } else if (todo.priority === "medium") {
      color = "medium";
    } else {
      color = "high";
    }
    list.innerHTML += `<li class="${todo.completed ? "completed" : ""} ${color}">
				<div style="display:flex;justify-content:space-between;align-items:center;" class="view">
					<input class="toggle" type="checkbox" ${todo.completed ? "checked" : ""} />
					<label >${todo.title}</label>
          <button class="edit-button"></button>
					<button class="destroy"></button>
          
				</div>
			</li>`;
  });
});

function todoSubmit(e) {
  e.preventDefault();

  const input = e.target.elements.todo.value;

  if (input === "") {
    iziToast.error({
      title: "Error",
      message: "Please fill in all fields",
      position: "topRight",
    });
  } else {
    let todos = getLocalStorage();

    for (let i = 0; i < todos.length; i++) {
      if (todos[i].title === input) {
        iziToast.error({
          title: "Error",
          message: "This task already exists",
          position: "topRight",
        });
        e.target.elements.todo.value = ""
        return;
      }
    }

    addTodo(input);
    addLocalStorage(input);
    iziToast.success({
      title: "Success",
      message: "The message was successfully added.",
      position: "topRight",
    });
  }

  form.reset();
}

function addTodo(input) {
  let todos = getLocalStorage()
  

  list.innerHTML += `<li class="low">
				<div style="display:flex;justify-content:space-between;align-items:center;" class="view">
					<input class="toggle" type="checkbox" />
					<label>${input}</label>
          <button class="edit-button"></button>
					<button class="destroy"></button>
				</div>
			</li>`;
}
function addLocalStorage(input) {
  let todos = getLocalStorage();

  todos.push({ title: input, priority: "low", completed: false });

  const newTodos = todos.filter(({completed})=> completed === false)
  
  span.textContent = newTodos.length > 1 ? `${newTodos.length} items left` : `${newTodos.length} item left`

  localStorage.setItem("todos", JSON.stringify(todos));
}
function getLocalStorage() {
  let todos;

  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  return todos;
}
function manyTodos(e) {
  let todos = getLocalStorage();
  if (e.target.className === "destroy") {
    e.target.parentElement.parentElement.remove();
    deleteLocalStorage(e.target.parentElement.parentElement.textContent);
    
  }
  if (e.target.className === "toggle") {
    const newTodo = e.target.parentElement.parentElement.textContent.trim();

    todos.forEach((todo) => {
      if (todo.title === newTodo && todo.completed === false) {
        todo.completed = true;
        e.target.parentElement.parentElement.classList.toggle("completed");
        e.target.setAttribute("checked", true);
      } else if (todo.title === newTodo && todo.completed === true) {
        todo.completed = false;
        e.target.removeAttribute("checked");
        e.target.parentElement.parentElement.classList.toggle("completed");
      }
    });
    const newTodos = todos.filter(({ completed }) => completed === false)
    
    span.textContent = newTodos.length > 1 ? `${newTodos.length} items left` : `${newTodos.length} item left`

    localStorage.setItem("todos", JSON.stringify(todos));
  }
  if (e.target.className === "edit-button") {
    editTodoLocalStorage(e.target.previousElementSibling.textContent);
  }
}
function editTodoLocalStorage(editTodo){

  let todos = getLocalStorage();
  let instance;

  todos.forEach(todo => {
    if (todo.title === editTodo) {
        instance = basicLightbox.create(`
            <form id="edit-form">
            <label id="task-name">Task Name</label>
        <input type="text" name="task" for="task-name" value="${todo.title}">
            <label id="priority">Priority</label>
        <select name="select" class="choose" for="priority">
          <option value="low" ${todo.priority === "low" ? "selected" : ""}>Low</option>
          <option value="medium" ${todo.priority === "medium" ? "selected" : ""}>Medium</option>
          <option value="high" ${todo.priority === "high" ? "selected" : ""}>High</option>
        </select>
        <div>
          <button class="submit-button" type="submit">Submit</button>
          <button class="cancel-button" type="button">Cancel</button>
        </div>
            </form>
          `);
    }
  })

  instance.show();

  const editForm = document.getElementById("edit-form");

  editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const input = e.target.elements.task.value;
    const select = e.target.elements.select.value;    
    


    todos = todos.map(todo => {
      if (todo.title === editTodo) {
        return { ...todo, title: input, priority: select };
      }
      return todo;
    });
    localStorage.setItem("todos", JSON.stringify(todos));

    list.innerHTML = "";
    todos.forEach((todo) => {
      if (todo.priority === "low") {
        color = "low";
      } else if (todo.priority === "medium") {
        color = "medium";
      } else {
        color = "high";
      }
      list.innerHTML += `<li class="${todo.completed ? "completed" : ""} ${color}">
        <div style="display:flex;justify-content:space-between;align-items:center;" class="view">
          <input class="toggle" type="checkbox" ${todo.completed ? "checked" : ""} />
          <label>${todo.title}</label>
          <button class="edit-button"></button>
          <button class="destroy"></button>
        </div>
      </li>`;
    });

    iziToast.success({
      title: "Success",
      message: "Successfully updated",
      position: "topRight",
    });

    instance.close();
  });

  const cancelButton = document.querySelector(".cancel-button")
  cancelButton.addEventListener("click", () => {
    instance.close()
  })
}


function deleteLocalStorage(deleteTodo) {
  const todos = getLocalStorage();

  const newTodos = todos.filter((todo) => todo.title !== deleteTodo.trim());

  const falseTodos = newTodos.filter(({completed})=> completed === false)

  span.textContent = falseTodos.length > 1 ? `${falseTodos.length} items left` : `${falseTodos.length} item left`

  localStorage.setItem("todos", JSON.stringify(newTodos));
}
function filterTodos(e) {
  let todos = getLocalStorage();
  if (e.target.nodeName === "A") {
    if (e.target.textContent === "Active") {

      const newTodos = todos.filter(
        ({ completed }) => completed === false
      );

      const lastTodos = newTodos
        .map(({ title,priority, completed }) => {
          if (priority === "low") {
            color = "low";
          } else if (priority === "medium") {
            color = "medium";
          } else {
            color = "high";
          }
          return `<li class="${completed ? "completed" : ""} ${color}">
				<div style="display:flex;justify-content:space-between;align-items:center;" class="view">
					<input class="toggle" type="checkbox" type="checkbox" ${
            completed ? "checked" : ""
          } />
					<label>${title}</label>
          <button class="edit-button"></button>
					<button class="destroy"></button>
				</div>
			</li>`;
        })
        .join("");

      list.innerHTML = lastTodos;

      e.target.classList.add("selected");

      e.target.parentElement.previousElementSibling.firstElementChild.classList.remove(
        "selected"
      );

      e.target.parentElement.nextElementSibling.firstElementChild.classList.remove(
        "selected"
      );


      span.textContent = newTodos.length > 1 ? `${newTodos.length} items left` : `${newTodos.length} item left`


    } else if (e.target.textContent === "Completed") {
      const completedTodos = todos.filter(
        ({ title, completed }) => completed === true
      );

      const lastTodos = completedTodos
        .map(({ title,priority,completed }) => {
          if (priority === "low") {
            color = "low";
          } else if (priority === "medium") {
            color = "medium";
          } else {
            color = "high";
          }
          return `<li class="${completed ? "completed" : ""} ${color}">
				<div style="display:flex;justify-content:space-between;align-items:center;" class="view">
					<input class="toggle" type="checkbox" type="checkbox" ${
            completed ? "checked" : ""
          } />
					<label>${title}</label>
          <button class="edit-button"></button>
					<button class="destroy"></button>
				</div>
			</li>`;
        })
        .join("");

      list.innerHTML = lastTodos;

      e.target.classList.add("selected");

      e.target.parentElement.previousElementSibling.firstElementChild.classList.remove(
        "selected"
      );

      e.target.parentElement.previousElementSibling.previousElementSibling.firstElementChild.classList.remove(
        "selected"
      );

      const falseTodos = todos.filter(({ completed }) => completed === false);

      span.textContent = falseTodos.length ? `${falseTodos.length} items left` : `${falseTodos.length} item left`
    } else {
      const allTodos = todos
        .map(({ title,priority,completed }) => {
          if (priority === "low") {
            color = "low";
          } else if (priority === "medium") {
            color = "medium";
          } else {
            color = "high";
          }
          return `<li class="${completed ? "completed" : ""} ${color}">
				<div style="display:flex;justify-content:space-between;align-items:center;" class="view">
					<input class="toggle" type="checkbox" ${completed ? "checked" : ""} />
					<label>${title}</label>
					<button class="edit-button"></button>
					<button class="destroy"></button>
				</div>
			</li>`;
        })
        .join("");
      list.innerHTML = allTodos;

      e.target.classList.add("selected");

      e.target.parentElement.nextElementSibling.nextElementSibling.firstElementChild.classList.remove(
        "selected"
      );
      e.target.parentElement.nextElementSibling.firstElementChild.classList.remove(
        "selected"
      );

      const falseTodos = todos.filter(({ completed }) => completed === false);

      span.textContent = falseTodos.length ? `${falseTodos.length} items left` : `${falseTodos.length} item left` ;
    }
  }
}
function clearCompleted() {

  const listFilter = document.querySelectorAll(".completed")
  listFilter.forEach(item => {
    item.remove()
  })
  let todos = getLocalStorage()
  

  const newTodos = todos.filter(({ completed }) => completed !== true)
  localStorage.setItem("todos", JSON.stringify(newTodos))
  
  iziToast.success({
    title: "Success",
    message: "All completed tasks deleted",
    position: "topRight",
  });

}
