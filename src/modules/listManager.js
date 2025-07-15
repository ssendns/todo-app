import List from './list.js';

export default class ListManager {
    constructor() {
        this.lists = [];
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
}