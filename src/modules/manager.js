import List from "./list.js";
import Todo from "./todo.js";

export default class Manager {
  constructor() {
    this.lists = [];
    this.currentList = null;
    this.currentDate = null;
    this.inboxId = null;
    this.load();
    if (this.lists.length === 0) {
      this.init();
    }
  }

  save() {
    const data = {
      lists: this.lists,
      inboxId: this.inboxId,
      currentDate: this.currentDate,
    };
    localStorage.setItem("todo-app", JSON.stringify(data));
  }

  load() {
    const data = localStorage.getItem("todo-app");
    if (!data) return;

    const parsed = JSON.parse(data);
    const rawLists = parsed.lists || [];

    this.lists = rawLists.map((listData) => {
      const list = new List(listData.title);
      list.id = listData.id;
      list.color = listData.color;
      list.todos = listData.todos.map((todo) => {
        const t = new Todo(todo.title, todo.dueDate);
        t.id = todo.id;
        t.status = todo.status;
        return t;
      });
      return list;
    });

    this.inboxId =
      parsed.inboxId || (this.lists.length > 0 ? this.lists[0].id : null);
    this.currentList = this.lists.length > 0 ? this.lists[0].id : null;
    this.currentDate =
      parsed.currentDate || new Date().toISOString().split("T")[0];
  }

  init() {
    this.addList("inbox", "var(--accent-yellow)");
    const list = this.lists[0];
    this.currentList = list.id;
    this.currentDate = new Date().toISOString().split("T")[0];
    this.inboxId = list.id;
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

  addTodo(id, title, dueDate) {
    const list = this.getList(id);
    list.addTodo(title, dueDate);
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

  editTodo(listId, todoId, newTitle, newDate) {
    const list = this.getList(listId);
    const todo = list.getTodo(todoId);
    todo.title = newTitle;
    todo.dueDate = newDate;
    this.save();
  }
}
