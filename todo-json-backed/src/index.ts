import express from 'express'
import { TodoSqliteRepository } from './repository/TodoSqliteRepository';
import { TodoService } from './services/TodoService';
import { TodoController } from './controller/TodoController';

const main = async () => {
    const repository = new TodoSqliteRepository()
    const todoService = new TodoService(repository)
    const todoController = new TodoController(todoService)

    const app = express();
    const port = 3000;

    todoController.registerRoutes(app)

    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

main();