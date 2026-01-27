import { TodoService } from './services/TodoService';

const main = () => {
    const todoService = new TodoService();
    const todos = todoService.getTodos();
    console.log('Todo List:');
    todos.forEach((todo, index) => {
        console.log(`${index + 1}. ${todo}`);
    });
}

main();