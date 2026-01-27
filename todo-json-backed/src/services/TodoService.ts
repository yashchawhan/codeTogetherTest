import * as fs from 'fs-extra'
import { TodoDTO } from '../model/todo-dto'
import * as path from 'path';

export class TodoService {

    private static readonly FILE_PATH = 'data.json'
    private basePath = path.join(__dirname, '../../', 'data')

    constructor() {
        // do nothing
    }

    public getTodos(): TodoDTO[] {
        return this.readFromFile()
    }

    public readFromFile(): TodoDTO[] {
        const fullPath = path.join(this.basePath, TodoService.FILE_PATH)
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

    public setBasePath(path: string) {
        this.basePath = path
    }

}