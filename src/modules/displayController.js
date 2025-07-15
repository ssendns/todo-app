import Manager from './manager.js';

const displayController = (function () {
    const manager = new Manager();
    const listContainer = document.querySelector('#list-container');
    const todoContainer = document.querySelector('#todo-container');
    const currentListHeader = document.querySelector('#cur');

    const addListBtn = document.querySelector('#add-list');
    addListBtn.addEventListener("click", () => {
        listContainer.innerHTML = "";
        const title = prompt("title:");
        manager.addList(title);
        displayController.renderLists();
    });

    const addTodoBtn = document.querySelector('#add-todo');
    addTodoBtn.addEventListener("click", () => {
        todoContainer.innerHTML = "";
        const title = prompt("title:");
        const description = prompt("description:");
        manager.addTodo(manager.currentList, title, description);
        displayController.renderTodos();
    });

    function renderLists() {
        listContainer.innerHTML = "";
        const lists = manager.lists;
        for(let i = 0; i < lists.length; i++) {
            const list = lists[i];
    
            const card = document.createElement("div");
            card.classList.add("list");
            if (list.id === manager.currentList) {
                card.id = "selected";
            } else {
                card.id = "not-selected";
            }

            card.innerHTML = `<p>${list.title}</p>`;

            card.addEventListener("click", () => {
                manager.currentList = list.id;
                renderTodos();
                renderLists();
            });

            listContainer.appendChild(card);
        }
    }

    function renderTodos() {
        const list = manager.getCurrentList();
        todoContainer.innerHTML = "";
        currentListHeader.textContent = list.title;
        const todos = list.todos;
        for(let i = 0; i < todos.length; i++) {
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
                <button id="remove">remove todo</button>
            `;

            const checkbox = card.querySelector("input[type='checkbox']");
            checkbox.addEventListener("change", () => {
                manager.changeTodoStatus(manager.currentList, todo.id);
                renderTodos();
            });

            const removeBtn = card.querySelector("#remove");
            removeBtn.addEventListener("click", () => {
                manager.removeTodo(manager.currentList, todo.id);
                renderTodos();
            });

            todoContainer.appendChild(card);
        }
    }
  
    return { renderLists, renderTodos, manager };
})();
  
export default displayController;