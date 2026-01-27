
import { TodoDTO } from '../model/todo-dto'
import * as path from 'path'

export interface ITodoRepository {
    getTodos(): Promise<TodoDTO[]>
    markTodoAsCompleted(id: string): Promise<void>
    addTodo(title: string): Promise<TodoDTO>
    removeTodo(id: string): Promise<void>
}

export class TodoService {

    constructor(private repository: ITodoRepository) {
        // do nothing
    }

    public getTodos(): Promise<TodoDTO[]> {
        return this.repository.getTodos()
    }

    public addTodo(title: string): Promise<TodoDTO> {
        return this.repository.addTodo(title)
    }

    public markTodoAsCompleted(id: string): Promise<void> {
        return this.repository.markTodoAsCompleted(id)
    }

    public removeTodo(id: string): Promise<void> {
        return this.repository.removeTodo(id)
    }
}