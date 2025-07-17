import Manager from "./manager.js";

const displayController = (function () {
  const manager = new Manager();
  const listContainer = document.querySelector("#list-container");
  const todoContainer = document.querySelector("#todo-container");
  const currentListHeader = document.querySelector("#cur");
  const listForm = document.querySelector("#list-form");
  const todoForm = document.querySelector("#todo-form");

  const addListBtn = document.querySelector("#add-list");
  addListBtn.addEventListener("click", () => {
    listForm.classList.toggle("hidden");
  });

  listForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.querySelector("#list-name").value.trim();
    const color = document.querySelector('input[name="color"]:checked').value;
    manager.addList(name, color);
    e.target.reset();
    e.target.classList.add("hidden");
    displayController.renderLists();
  });

  const addTodoBtn = document.querySelector("#add-todo");
  addTodoBtn.addEventListener("click", () => {
    todoForm.classList.toggle("hidden");
  });

  todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.querySelector("#todo-title").value.trim();
    const description = document.querySelector("#todo-desc").value.trim();
    manager.addTodo(manager.currentList, title, description);
    e.target.reset();
    e.target.classList.add("hidden");
    displayController.renderTodos();
  });

  function renderLists() {
    listContainer.innerHTML = "";
    const lists = manager.lists;
    for (let i = 0; i < lists.length; i++) {
      const list = lists[i];

      const card = document.createElement("div");
      card.classList.add("list");
      if (list.id === manager.currentList) {
        card.id = "selected";
      } else {
        card.id = "not-selected";
      }

      card.innerHTML = `
                <p>${list.title}</p>
                <button class="remove" id="remove-list">remove</button>
        `;
      card.style.backgroundColor =
        list.id === manager.currentList
          ? "var(--bg-list-selected)"
          : list.color;

      card.addEventListener("click", () => {
        manager.currentList = list.id;
        renderTodos();
        renderLists();
      });
      const editBtn = card.querySelector("#remove-list");
      editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        manager.removeList(list.id);
        if (manager.currentList === list.id) {
          manager.currentList = manager.lists[0]?.id || null;
        }
        renderLists();
        renderTodos();
      });

      listContainer.appendChild(card);
    }
  }

  function renderTodos() {
    const list = manager.getCurrentList();
    todoContainer.innerHTML = "";
    currentListHeader.textContent = list.title;
    const todos = list.todos;
    for (let i = 0; i < todos.length; i++) {
      const todo = todos[i];

      const card = document.createElement("div");
      card.classList.add("todo");
      if (todo.status) {
        card.id = "done";
      } else {
        card.id = "not-done";
      }

      card.innerHTML = `
                <input type="checkbox" ${todo.status ? "checked" : ""} />
                <label>${todo.title}</label>
                <button class="remove" id="remove-todo">remove todo</button>
            `;

      const checkbox = card.querySelector("input[type='checkbox']");
      checkbox.addEventListener("change", () => {
        manager.changeTodoStatus(manager.currentList, todo.id);
        renderTodos();
      });

      const removeBtn = card.querySelector("#remove-todo");
      removeBtn.addEventListener("click", () => {
        manager.removeTodo(manager.currentList, todo.id);
        renderTodos();
      });

      todoContainer.appendChild(card);
    }
  }

  return { renderLists, renderTodos };
})();

export default displayController;
