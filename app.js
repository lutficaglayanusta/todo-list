const form = document.getElementById("form-todo");
const list = document.querySelector(".todo-list");
const span = document.querySelector(".todo-count");
const footer = document.querySelector(".footer");

form.addEventListener("submit", todoSubmit);
list.addEventListener("click", manyTodos);
footer.addEventListener("click", filterTodos);

document.addEventListener("DOMContentLoaded", function () {
  let todos = getLocalStorage();

  const falseTodos = todos.filter(({ completed }) => completed === false);

  span.firstElementChild.textContent = falseTodos.length;

  todos.forEach((todo) => {
    list.innerHTML += `<li class="${todo.completed ? "completed" : ""}">
				<div class="view">
					<input class="toggle" type="checkbox" ${todo.completed ? "checked" : ""} />
					<label >${todo.title}</label>
					<button class="destroy"></button>
				</div>
			</li>`;
  });
});

function todoSubmit(e) {
  e.preventDefault();

  const input = e.target.elements.todo.value;

  if (input === "") {
    alert("Lütfen tüm alanları doldurunuz");
  } else {
    let todos = getLocalStorage();

    for (let i = 0; i < todos.length; i++) {
      if (todos[i].title === input) {
        return alert("Bu görev zaten veritabanında var");
      }
    }

    addTodo(input);
    addLocalStorage(input);
  }

  e.target.reset();
}

function addTodo(input) {
  list.innerHTML += `<li>
				<div class="view">
					<input class="toggle" type="checkbox"  />
					<label>${input}</label>
					<button class="destroy"></button>
				</div>
			</li>`;
}
function addLocalStorage(input) {
  let todos = getLocalStorage();

  todos.push({ title: input, completed: false });

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
    const newTodo = e.target.parentElement.textContent.trim();

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
}
function deleteLocalStorage(deleteTodo) {
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
				<div class="view">
					<input class="toggle" type="checkbox" type="checkbox" ${
            completed ? "checked" : ""
          } />
					<label>${title}</label>
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
				<div class="view">
					<input class="toggle" type="checkbox" type="checkbox" ${
            completed ? "checked" : ""
          } />
					<label>${title}</label>
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
				<div class="view">
					<input class="toggle" type="checkbox" ${completed ? "checked" : ""} />
					<label>${title}</label>
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
