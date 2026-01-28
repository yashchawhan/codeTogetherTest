import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { TodoService } from '../src/services/TodoService'
import { TodoSqliteRepository } from '../src/repository/TodoSqliteRepository'
import * as fs from 'fs'
import * as path from 'path'

describe('TodoSqliteRepository', () => {
    let service: TodoService
    let repository: TodoSqliteRepository
    const testDbPath = path.join(__dirname, '../data-test/test-todos.db')

    beforeEach(() => {
        // Ensure test directory exists
        const dir = path.dirname(testDbPath)
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
        }
        // Remove existing test database
        if (fs.existsSync(testDbPath)) {
            fs.unlinkSync(testDbPath)
        }

        repository = new TodoSqliteRepository(testDbPath)
        service = new TodoService(repository)
    })

    afterEach(() => {
        repository.close()
        // Clean up test database
        if (fs.existsSync(testDbPath)) {
            fs.unlinkSync(testDbPath)
        }
    })

    it('should start with empty todos', async () => {
        const todos = await service.getTodos()
        expect(todos).toEqual([])
    })

    it('should add a todo', async () => {
        const newTodo = await service.addTodo('Test SQLite Todo')

        expect(newTodo.title).toBe('Test SQLite Todo')
        expect(newTodo.completed).toBe(false)
        expect(newTodo.id).toBeDefined()

        const todos = await service.getTodos()
        expect(todos.length).toBe(1)
        expect(todos[0].title).toBe('Test SQLite Todo')
    })

    it('should mark a todo as completed', async () => {
        const newTodo = await service.addTodo('Complete Me')

        await service.markTodoAsCompleted(newTodo.id)

        const todos = await service.getTodos()
        const updated = todos.find(t => t.id === newTodo.id)
        expect(updated?.completed).toBe(true)
    })

    it('should remove a todo', async () => {
        const todo1 = await service.addTodo('Todo 1')
        const todo2 = await service.addTodo('Todo 2')

        await service.removeTodo(todo1.id)

        const todos = await service.getTodos()
        expect(todos.length).toBe(1)
        expect(todos[0].id).toBe(todo2.id)
    })

    it('should persist todos across repository instances', async () => {
        await service.addTodo('Persistent Todo')
        repository.close()

        // Create new repository instance pointing to same DB
        const newRepository = new TodoSqliteRepository(testDbPath)
        const newService = new TodoService(newRepository)

        const todos = await newService.getTodos()
        expect(todos.length).toBe(1)
        expect(todos[0].title).toBe('Persistent Todo')

        newRepository.close()
    })
})
