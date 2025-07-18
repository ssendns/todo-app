export default class Todo {
  constructor(title, dueDate) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.dueDate = dueDate;
    this.status = false;
  }
  changeStatus() {
    this.status = !this.status;
  }
}
