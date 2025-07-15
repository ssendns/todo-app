import Manager from './modules/manager.js';

const manager = new Manager();

// 1. Добавим список
const list1 = manager.addList("Учёба");

// 2. Добавим задачи в список
const todo1 = list1.addTodo("Сделать домашку", "Математика и физика");
const todo2 = list1.addTodo("Прочитать книгу", "По истории");

// 3. Посмотрим, что есть в списке
console.log("задачи:", list1.getTodos());

// 4. Поменяем статус задачи
manager.changeTodoStatus(list1.id, todo1.id);
console.log("После смены статуса:", list1.getTodos());

// 5. Изменим название списка
manager.editList(list1.id, "Учеба и курсы");
console.log("Список после редактирования:", manager.getLists());

// 6. Удалим список
manager.removeList(list1.id);
console.log("Списки после удаления:", manager.getLists());