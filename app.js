const form = document.getElementById("form-todo");
const list = document.querySelector(".todo-list");
const span = document.querySelector(".todo-count");

form.addEventListener("submit", todoSubmit);
list.addEventListener("click", manyTodos);

const tasks = getLocalStorage();

document.addEventListener("DOMContentLoaded", function () {
  let todos = getLocalStorage();

  span.firstElementChild.textContent = tasks.length;

  todos.forEach((todo) => {
    addTodo(todo.title);
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
					<input class="toggle" type="checkbox" />
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
  if (e.target.className === "destroy") {
    e.target.parentElement.parentElement.remove();
    deleteLocalStorage(e.target.parentElement.parentElement.textContent);
  }
  if (e.target.className === "toggle") {
  }
}
function deleteLocalStorage(deleteTodo) {
  const todos = getLocalStorage();

  const newTodos = todos.filter((todo) => todo.title !== deleteTodo.trim());

  localStorage.setItem("todos", JSON.stringify(newTodos));
}
