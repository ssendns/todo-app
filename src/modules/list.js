import Todo from "./todo.js";

export default class List {
  constructor(title, color) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.color = color;
    this.todos = [];
  }

  addTodo(title, description) {
    const todo = new Todo(title, description);
    this.todos.push(todo);
    return todo;
  }

  getTodo(id) {
    return this.todos.find((todo) => todo.id === id);
  }

  changeStatus(id) {
    const todo = this.getTodo(id);
    todo.changeStatus();
  }

  getTodos() {
    return this.todos;
  }

  removeTodo(id) {
    this.todos = this.todos.filter((todo) => todo.id != id);
  }
}
