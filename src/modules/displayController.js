import Manager from './manager.js';

const displayController = (function () {
    const manager = new Manager();
    const listContainer = document.querySelector('#list-container');
    const todoContainer = document.querySelector('#todo-container');
    const currentListHeader = document.querySelector('#cur');

    const addListBtn = document.querySelector('#add-list');
    addListBtn.addEventListener("click", () => {
        listContainer.innerHTML = "";
        const title = "list";
        manager.addList(title);
        displayController.renderLists();
    });

    const addTodoBtn = document.querySelector('#add-todo');
    addTodoBtn.addEventListener("click", () => {
        todoContainer.innerHTML = "";
        const title = "todo";
        const description = "test";
        manager.addTodo(manager.currentList, title, description);
        displayController.renderTodos();
    });

    function renderLists() {
        listContainer.innerHTML = "";
        const lists = manager.lists;
        for(let i = 0; i < lists.length; i++) {
            const list = lists[i];
    
            const card = document.createElement("div");
            card.classList.add("card");
            card.id = "list";

            card.innerHTML = `<p>${list.title}</p>`;
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
            card.classList.add("card");
            card.id = "todo";

            card.innerHTML = `<p>${todo.title}</p>`;
            todoContainer.appendChild(card);
        }
    }
  
    return { renderLists, renderTodos, manager };
})();
  
export default displayController;