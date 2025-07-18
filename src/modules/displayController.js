import Manager from "./manager.js";

const displayController = (function () {
  const manager = new Manager();

  const prevBtn = document.querySelector("#prev-date");
  const nextBtn = document.querySelector("#next-date");
  prevBtn.addEventListener("click", () => shiftDate(-1));
  nextBtn.addEventListener("click", () => shiftDate(1));

  const listContainer = document.querySelector("#list-container");
  const todoContainer = document.querySelector("#todo-container");
  const todayTodos = document.querySelector("#today-todos");

  const currentListHeader = document.querySelector("#cur");

  const listForm = document.querySelector("#list-form");
  const todoForm = document.querySelector("#todo-form");

  const addListBtn = document.querySelector("#add-list");
  const addTodoBtn = document.querySelector("#add-todo");

  const createListModal = document.querySelector("#modal-overlay-create-list");
  createListModal.classList.add("hidden");
  const closeListBtn = document.querySelector("#close-create-list-modal");
  const createTodoModal = document.querySelector("#modal-overlay-create-todo");
  createTodoModal.classList.add("hidden");
  const closeCreateTodoBtn = document.querySelector("#close-create-todo-modal");

  const editListModal = document.querySelector("#modal-overlay-edit-list");
  const editListForm = document.querySelector("#edit-list-form");
  const closeEditListBtn = document.querySelector("#close-edit-list-modal");
  const removeListBtn = document.querySelector("#remove-list");

  const editTodoModal = document.querySelector("#modal-overlay-edit-todo");
  const editTodoForm = document.querySelector("#edit-todo-form");
  const closeEditTodoBtn = document.querySelector("#close-edit-todo-modal");
  const removeTodoBtn = document.querySelector("#remove-todo");

  let listToEdit = null;
  let todoToEdit = null;

  addListBtn.addEventListener("click", () => {
    createListModal.classList.remove("hidden");
  });
  closeListBtn.addEventListener("click", () => {
    createListModal.classList.add("hidden");
  });
  closeEditListBtn.addEventListener("click", () => {
    editListModal.classList.add("hidden");
  });
  removeListBtn.addEventListener("click", () => {
    if (listToEdit) {
      const wasCurrent = manager.currentList === listToEdit.id;
      manager.removeList(listToEdit.id);
      if (wasCurrent) {
        manager.currentList = manager.inboxId;
      }
      listToEdit = null;
      editListModal.classList.add("hidden");
      displayController.renderLists();
      displayController.renderTodos();
      displayController.renderTodayTodos();
    }
  });
  listForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.querySelector("#list-name").value.trim();
    const color = document.querySelector('input[name="color"]:checked').value;
    manager.addList(name, `var(--accent-${color})`);
    e.target.reset();
    createListModal.classList.add("hidden");
    displayController.renderLists();
  });
  editListForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.querySelector("#edit-list-name").value.trim();
    const color = document.querySelector(
      'input[name="edit-color"]:checked'
    ).value;
    if (listToEdit) {
      manager.editList(listToEdit.id, name, `var(--accent-${color})`);
      renderLists();
      editListModal.classList.add("hidden");
      listToEdit = null;
    }
  });

  addTodoBtn.addEventListener("click", () => {
    createTodoModal.classList.remove("hidden");
  });
  closeCreateTodoBtn.addEventListener("click", () => {
    createTodoModal.classList.add("hidden");
  });
  closeEditTodoBtn.addEventListener("click", () => {
    editTodoModal.classList.add("hidden");
  });
  removeTodoBtn.addEventListener("click", () => {
    if (todoToEdit) {
      manager.removeTodo(manager.currentList, todoToEdit.id);
      todoToEdit = null;
      editTodoModal.classList.add("hidden");
      displayController.renderTodos();
      displayController.renderTodayTodos();
    }
  });
  editTodoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.querySelector("#edit-todo-title").value.trim();
    const dueDate = document.querySelector("#edit-todo-date").value.trim();
    if (todoToEdit) {
      manager.editTodo(manager.currentList, todoToEdit.id, name, dueDate);
      renderTodos();
      displayController.renderTodayTodos();
      editTodoModal.classList.add("hidden");
      todoToEdit = null;
    }
  });
  todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.querySelector("#todo-title").value.trim();
    const dueDate = document.querySelector("#todo-date").value;
    manager.addTodo(manager.currentList, title, dueDate);
    e.target.reset();
    createTodoModal.classList.add("hidden");
    displayController.renderTodos();
    displayController.renderTodayTodos();
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
        ${
          list.id !== manager.inboxId
            ? '<button class="edit" id="edit-list">edit</button>'
            : ""
        }
      `;
      card.style.backgroundColor = list.color;

      card.addEventListener("click", () => {
        manager.currentList = list.id;
        renderTodos();
        displayController.renderTodayTodos();
        renderLists();
      });
      if (list.id !== manager.inboxId) {
        const editBtn = card.querySelector("#edit-list");
        editBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          listToEdit = list;
          document.querySelector("#edit-list-name").value = list.title;
          const colorName = list.color
            .replace("var(--accent-", "")
            .replace(")", "");
          const colorInput = document.querySelector(
            `input[name="edit-color"][value="${colorName}"]`
          );
          if (colorInput) colorInput.checked = true;
          editListModal.classList.remove("hidden");
        });
      }

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
      card.classList.add(todo.status ? "done" : "not-done");

      card.innerHTML = `
                <div class="todo-content">
                  <input type="checkbox" ${todo.status ? "checked" : ""} />
                  <label>${todo.title}</label>
                </div>
                <div class="todo-meta">
                  <span class="todo-date">${todo.dueDate}</span>
                  <button class="edit" id="edit-todo">edit todo</button>
                </div>
        `;

      const checkbox = card.querySelector("input[type='checkbox']");
      checkbox.addEventListener("change", (e) => {
        manager.changeTodoStatus(manager.currentList, todo.id);
        renderTodos();
        displayController.renderTodayTodos();
      });

      const editBtn = card.querySelector("#edit-todo");
      editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        todoToEdit = todo;
        document.querySelector("#edit-todo-title").value = todo.title;
        document.querySelector("#edit-todo-date").value = todo.dueDate;
        editTodoModal.classList.remove("hidden");
      });

      todoContainer.appendChild(card);
    }
  }

  function renderTodayTodos() {
    todayTodos.innerHTML = "";
    const header = document.querySelector("#today-date");
    const progress = document.querySelector("#progress-bar");
    const circle = document.querySelector(".circle");

    let total = 0;
    let done = 0;

    const allLists = manager.getLists();
    const selectedDate = manager.currentDate;
    header.textContent = formatDate(selectedDate);

    allLists.forEach((list) => {
      list.todos.forEach((todo) => {
        if (todo.dueDate === selectedDate) {
          total++;
          if (todo.status) done++;
          const card = document.createElement("div");
          card.classList.add("todo");
          card.classList.add(todo.status ? "done" : "not-done");

          card.innerHTML = `
            <div class="todo-content">
              <input type="checkbox" ${todo.status ? "checked" : ""} />
              <label>${todo.title}</label>
            </div>
            <button class="edit" id="edit-todo">edit todo</button>
          `;

          const checkbox = card.querySelector("input[type='checkbox']");
          checkbox.addEventListener("change", (e) => {
            manager.changeTodoStatus(manager.currentList, todo.id);
            renderTodos();
            displayController.renderTodayTodos();
          });

          const editBtn = card.querySelector("#edit-todo");
          editBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            todoToEdit = todo;
            document.querySelector("#edit-todo-title").value = todo.title;
            document.querySelector("#edit-todo-date").value = todo.dueDate;
            editTodoModal.classList.remove("hidden");
          });

          todayTodos.appendChild(card);
        }
      });
    });
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);
    progress.value = percent;
    let color = "var(--accent-blue)";
    if (percent >= 80) color = "var(--accent-pink)";
    else if (percent >= 60) color = "var(--accent-orange)";
    else if (percent >= 40) color = "var(--accent-yellow)";
    else if (percent >= 20) color = "var(--accent-mint)";
    else if (percent > 0) color = "var(--accent-teal)";
    else color = "var(--accent-blue)";

    circle.style.backgroundColor = color;
  }

  function formatDate(selectedDate) {
    const selected = new Date(selectedDate);
    const today = new Date();
    const yesterday = new Date();
    const tomorrow = new Date();
    yesterday.setDate(today.getDate() - 1);
    tomorrow.setDate(today.getDate() + 1);
    const isSameDay = (d1, d2) => d1.toDateString() === d2.toDateString();

    if (isSameDay(selected, today)) {
      return "today";
    }
    if (isSameDay(selected, yesterday)) {
      return "yesterday";
    }
    if (isSameDay(selected, tomorrow)) {
      return "tomorrow";
    }
    const res = selected.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return res;
  }

  function shiftDate(days) {
    const current = new Date(manager.currentDate);
    current.setDate(current.getDate() + days);
    manager.currentDate = current.toISOString().split("T")[0];
    manager.save();
    renderTodayTodos();
  }

  return { renderLists, renderTodos, renderTodayTodos };
})();

export default displayController;
