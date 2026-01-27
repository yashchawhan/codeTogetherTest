import path from 'path'
import { TodoDTO } from '../model/todo-dto'
import { ITodoRepository } from '../services/TodoService'
import * as fs from 'fs-extra'

export interface ITodoDataSource {
    fetchTodos(): Promise<TodoDTO[]>
}

export class TodoDataJsonSourceImpl implements ITodoDataSource {

    private static readonly FILE_PATH = 'data.json'

    constructor(private basePath: string = path.join(__dirname, '../../', 'data')) {
        // do nothing
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

    async getTodos():  Promise<TodoDTO[]> {
        return this.dataSource.fetchTodos()
    }

}