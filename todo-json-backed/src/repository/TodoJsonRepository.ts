import path from 'path'
import { TodoDTO } from '../model/todo-dto'
import { ITodoRepository } from '../services/TodoService'
import * as fs from 'fs-extra'

export interface ITodoDataSource {
    fetchTodos(): Promise<TodoDTO[]>
    saveTodos(todos: TodoDTO[]): Promise<void>
}

export class TodoDataJsonSourceImpl implements ITodoDataSource {

    private static readonly FILE_PATH = 'data.json'

    constructor(private basePath: string = path.join(__dirname, '../../', 'data')) {
        // do nothing
    }

    async saveTodos(todos: TodoDTO[]): Promise<void> {
        const fullPath = path.join(this.basePath, TodoDataJsonSourceImpl.FILE_PATH)
        try {
            await fs.writeFile(fullPath, JSON.stringify(todos, null, 2), 'utf-8')
        } catch (error) {
            console.error(`Error writing todos to file: ${error}`)
        }
    }

    public async fetchTodos():  Promise<TodoDTO[]> {
        const fullPath = path.join(this.basePath, TodoDataJsonSourceImpl.FILE_PATH)
        try {
            if (fs.existsSync(fullPath)) {
                const data = fs.readFileSync(fullPath, 'utf-8')
                return JSON.parse(data)
            }
        } catch (error) {
            console.error(`Error reading todos from file: ${error}`)
        }
        return []
    }
}

export class TodoRepositoryImpl implements ITodoRepository {

    constructor(private dataSource: ITodoDataSource) {
        // do nothing
    }

    async markTodoAsCompleted(id: string): Promise<void> {
        const todos = await this.getTodos()
        const todo = todos.find(t => t.id === id)
        if (todo) {
            todo.completed = true
            await this.dataSource.saveTodos(todos)
        }
    }

    async addTodo(title: string): Promise<TodoDTO> {
        const todos = await this.getTodos()
        const last = todos[todos.length - 1]
        const nextId = '' + (last ? Number(last.id) + 1 : 1)
        const newTodo: TodoDTO = {
            id: nextId,
            title: title,
            completed: false
        }
        todos.push(newTodo)
        await this.dataSource.saveTodos(todos)
        return newTodo
    }

    async removeTodo(id: string): Promise<void> {
        const todos = await this.getTodos()
        const filteredTodos = todos.filter(t => t.id !== '' + id)
        await this.dataSource.saveTodos(filteredTodos)
    }

    async getTodos():  Promise<TodoDTO[]> {
        return this.dataSource.fetchTodos()
    }

}