import * as express from 'express'
import { TodoService } from '../services/TodoService';

export class TodoController {

    constructor(private todoService: TodoService) {
        // do nothing
    }

    public registerRoutes(app: express.Express): void {
        app.get('/todos', this.getTodos.bind(this))
        app.post('/todos', express.json(), this.addTodo.bind(this))
        app.post('/todos/:id/complete', this.markTodoAsCompleted.bind(this))
        app.delete('/todos/:id', this.removeTodo.bind(this))
    }

    public async getTodos(req: express.Request, res: express.Response): Promise<void> {
        try {
            const todos = await this.todoService.getTodos()
            res.status(200).json(todos)
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch todos' })
        }
    }

    public async addTodo(req: express.Request, res: express.Response): Promise<void> {
        try {
            const title: string = req.body.title
            if (!title || title.trim() === '') {
                res.status(400).json({ error: 'Title is required' })
                return
            }
            const newTodo = await this.todoService.addTodo(title)
            res.status(201).json(newTodo)
        } catch (error) {
            res.status(500).json({ error: 'Failed to add todo' })
        }
    }

    public async removeTodo(req: express.Request, res: express.Response): Promise<void> {
        try {
            const { id } = req.params
            if (!id) {
                res.status(400).json({ error: 'Todo ID is required' })
                return
            }
            await this.todoService.removeTodo(id as string)
            res.status(200).json({ message: 'Todo removed successfully' })
        } catch (error) {
            res.status(500).json({ error: 'Failed to remove todo' })
        }
    }

    public async markTodoAsCompleted(req: express.Request, res: express.Response): Promise<void> {
        try {
            const { id } = req.params
            if (!id) {
                res.status(400).json({ error: 'Todo ID is required' })
                return
            }
            await this.todoService.markTodoAsCompleted(id as string)
            res.status(200).json({ message: 'Todo marked as completed' })
        } catch (error) {
            res.status(500).json({ error: 'Failed to mark todo as completed' })
        }
    }
}