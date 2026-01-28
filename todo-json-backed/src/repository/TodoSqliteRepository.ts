import Database from 'better-sqlite3'
import * as path from 'path'
import { TodoDTO } from '../model/todo-dto'
import { ITodoRepository } from '../services/TodoService'

export class TodoSqliteRepository implements ITodoRepository {
    private db: Database.Database

    constructor(dbPath: string = path.join(__dirname, '../../data/todos.db')) {
        this.db = new Database(dbPath)
        this.initTable()
    }

    private initTable(): void {
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS todos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                completed INTEGER DEFAULT 0
            )
        `)
    }

    async getTodos(): Promise<TodoDTO[]> {
        const rows = this.db.prepare('SELECT * FROM todos').all() as { id: number; title: string; completed: number }[]
        return rows.map(row => ({
            id: String(row.id),
            title: row.title,
            completed: row.completed === 1
        }))
    }

    async addTodo(title: string): Promise<TodoDTO> {
        const result = this.db.prepare('INSERT INTO todos (title) VALUES (?)').run(title)
        return { id: String(result.lastInsertRowid), title, completed: false }
    }

    async markTodoAsCompleted(id: string): Promise<void> {
        this.db.prepare('UPDATE todos SET completed = 1 WHERE id = ?').run(id)
    }

    async removeTodo(id: string): Promise<void> {
        this.db.prepare('DELETE FROM todos WHERE id = ?').run(id)
    }

    close(): void {
        this.db.close()
    }
}
