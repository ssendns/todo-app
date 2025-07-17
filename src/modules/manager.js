import List from "./list.js";
import Todo from "./todo.js";

export default class Manager {
  constructor() {
    this.lists = [];
    this.currentList = null;
    this.load();
    if (this.lists.length === 0) {
      this.init();
    }
  }

  save() {
    localStorage.setItem("todo-app", JSON.stringify(this.lists));
  }

  load() {
    const data = localStorage.getItem("todo-app");
    if (!data) return;

    const rawLists = JSON.parse(data);
    this.lists = rawLists.map((listData) => {
      const list = new List(listData.title);
      list.id = listData.id;
      list.color = listData.color;
      list.todos = listData.todos.map((todo) => {
        const t = new Todo(todo.title, todo.description);
        t.id = todo.id;
        t.status = todo.status;
        return t;
      });
      return list;
    });

    this.currentList = this.lists[0]?.id || null;
  }

  init() {
    this.addList("inbox", "yellow");
    const list = this.lists[0];
    this.currentList = list.id;
  }

  addList(title, color) {
    const list = new List(title, color);
    this.lists.push(list);
    this.save();
    return list;
  }

  getList(id) {
    return this.lists.find((list) => list.id === id);
  }

  getLists() {
    return this.lists;
  }

  removeList(id) {
    this.lists = this.lists.filter((list) => list.id != id);
    this.save();
  }

  editList(id, newTitle, newColor) {
    const list = this.getList(id);
    list.title = newTitle;
    list.color = newColor;
    this.save();
  }

  getCurrentList() {
    return this.getList(this.currentList);
  }

  getTodos(id) {
    return this.getList(id).getTodos();
  }

  addTodo(id, title, description) {
    const list = this.getList(id);
    list.addTodo(title, description);
    this.save();
  }

  removeTodo(listId, todoId) {
    const list = this.getList(listId);
    list.removeTodo(todoId);
    this.save();
  }

  changeTodoStatus(listId, todoId) {
    const list = this.getList(listId);
    const todo = list.getTodo(todoId);
    todo.changeStatus();
    this.save();
  }
}
