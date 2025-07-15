export default class Todo {
    constructor(title, description) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.description = description;
        this.status = false;
    }
    changeStatus() {
        this.status = !this.status;
    }
}