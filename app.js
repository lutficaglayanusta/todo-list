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

  todos.forEach((todo) => {
    list.innerHTML += `<li class="${todo.completed ? "completed" : ""}">
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
      message: "Please enter the all fields",
      position: "topRight"
    });
  } else {
    let todos = getLocalStorage();

    for (let i = 0; i < todos.length; i++) {
      if (todos[i].title === input) {
        iziToast.error({
          title: "Error",
          message: "Bu görev zaten veritabanında var.",
          position:"topRight"
        })
        e.target.elements.todo.value = ""
        return;
      }
    }

    addTodo(input);
    addLocalStorage(input);
    iziToast.success({
      title: "Success",
      message: "Mesaj başarılı bir şekilde eklendi.",
      position:"topRight"
    })
  }

  form.reset();
}

function addTodo(input) {
  list.innerHTML += `<li>
				<div style="display:flex;justify-content:space-between;align-items:center;" class="view">
					<input class="toggle" type="checkbox"  />
					<label>${input}</label>
          <button class="edit-button"></button>
					<button class="destroy"></button>
				</div>
			</li>`;
}
function addLocalStorage(input) {
  let todos = getLocalStorage();

  todos.push({ title: input, priority:"low",completed: false });

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
        e.target.parentElement.parentElement.classList.add("completed");
      } else if (todo.title === newTodo && todo.completed === true) {
        todo.completed = false;
        e.target.parentElement.parentElement.classList.remove("completed");
      }
    });
    localStorage.setItem("todos", JSON.stringify(todos));
  }
  if (e.target.className === "edit-button") {
    console.log()
    editTodoLocalStorage(e.target.previousElementSibling.textContent);
  }
}
function editTodoLocalStorage(editTodo) {
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
      list.innerHTML += `<li class="${todo.completed ? "completed" : ""}">
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
      message: "Başarılı bir şekilde güncellendi",
      position:"topRight"
    })

    instance.close();
  });

  const cancelButton = document.querySelector(".cancel-button")
  cancelButton.addEventListener("click", () => {
    instance.close()
  })
}


function deleteLocalStorage(deleteTodo) {
  console.log(deleteTodo.trim())
  const todos = getLocalStorage();

  const newTodos = todos.filter((todo) => todo.title !== deleteTodo.trim());

  localStorage.setItem("todos", JSON.stringify(newTodos));
}
function filterTodos(e) {
  let todos = getLocalStorage();
  if (e.target.nodeName === "A") {
    if (e.target.textContent === "Active") {
      const newTodos = todos.filter(
        ({ title, completed }) => completed === false
      );

      const lastTodos = newTodos
        .map(({ title, completed }) => {
          return `<li class="${completed ? "completed" : ""}">
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

      const falseTodos = todos.filter(({ completed }) => completed === false);

      span.firstElementChild.textContent = falseTodos.length;
    } else if (e.target.textContent === "Completed") {
      const completedTodos = todos.filter(
        ({ title, completed }) => completed === true
      );

      const lastTodos = completedTodos
        .map(({ title, completed }) => {
          return `<li class="${completed ? "completed" : ""}">
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

      span.firstElementChild.textContent = falseTodos.length;
    } else {
      const allTodos = todos
        .map(({ title, completed }) => {
          return `<li class="${completed ? "completed" : ""}">
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

      span.firstElementChild.textContent = falseTodos.length;
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
    message: "Tüm tamamlanmış görevler silindi",
    position:"topRight"
  })

}
