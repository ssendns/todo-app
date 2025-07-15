import Manager from './manager.js';

const displayController = (function () {
    const listContainer = document.querySelector('#lists-container');
    const todoContainer = document.querySelector('#todos-container');

    const addListBtn = document.querySelector('#add-list');
    const addTodoBtn = document.querySelector('#add-todo');

    const currentListHeader = document.querySelector('#cur');

    const manager = new Manager();

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
  
    return { renderLists, renderTodos };
})();
  
export default displayController;