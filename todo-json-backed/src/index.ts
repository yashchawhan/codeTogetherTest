import { TodoService } from './services/TodoService'
import { TodoRepositoryImpl, TodoDataJsonSourceImpl } from './repository/TodoJsonRepository'

const main = async () => {
    const repository = new TodoRepositoryImpl(new TodoDataJsonSourceImpl())
    const todoService = new TodoService(repository);
    const todos = await todoService.getTodos();
    console.log('Todo List:');
    todos.forEach((todo, index) => {
        console.log(`${index + 1}. ${todo.title} - ${todo.completed ? 'Completed' : 'Pending'}`);
    });
}

main();