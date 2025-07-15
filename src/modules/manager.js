import List from './list.js';

export default class Manager {
    constructor() {
        this.lists = [];
        this.currentList = null;
    }

    addList(title) {
        const list = new List(title);
        this.lists.push(list);
        return list;
    }

    getList(id) {
        return this.lists.find(list => list.id === id);
    }

    getLists() {
        return this.lists;
    }

    removeList(id) {
        this.lists = this.lists.filter(list => list.id != id);
    }

    editList(id, newTitle) {
        const list = this.getList(id);
        list.title = newTitle;
    }

    getCurrentList() {
        return this.getList(currentList);
    }

    getTodos(id) {
        return this.getList(id).getTodos();
    }

    removeTodo(listId, todoId) {
        const list = this.getList(listId);
        list.removeTodo(todoId);
    }

    changeTodoStatus(listId, todoId) {
        const list = this.getList(listId);
        const todo = list.getTodo(todoId);
        todo.changeStatus();
    }
}