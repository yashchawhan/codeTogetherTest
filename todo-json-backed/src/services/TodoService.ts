
import { TodoDTO } from '../model/todo-dto'
import * as path from 'path'

export interface ITodoRepository {
    getTodos(): Promise<TodoDTO[]>
}

export class TodoService {

    constructor(private repository: ITodoRepository) {
        // do nothing
    }

    public getTodos(): Promise<TodoDTO[]> {
        return this.repository.getTodos()
    }
}