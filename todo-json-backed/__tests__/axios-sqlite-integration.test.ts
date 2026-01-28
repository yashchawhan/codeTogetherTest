import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import express from 'express'
import { Server } from 'http'
import { TodoService } from '../src/services/TodoService'
import { TodoSqliteRepository } from '../src/repository/TodoSqliteRepository'
import { TodoController } from '../src/controller/TodoController'
import { AxiosTodoRepository } from '../src/client/AxiosTodoRepository'
import * as fs from 'fs'
import * as path from 'path'

describe('AxiosTodoRepository with SQLite backend', () => {
    let server: Server
    let axiosService: TodoService
    let sqliteRepository: TodoSqliteRepository
    const TEST_PORT = 3002
    const testDbPath = path.join(__dirname, '../data-test/axios-sqlite-test.db')

    beforeAll(async () => {
        // Ensure test directory exists
        const dir = path.dirname(testDbPath)
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
        }
        // Remove existing test database
        if (fs.existsSync(testDbPath)) {
            fs.unlinkSync(testDbPath)
        }

        // Start a test server with SQLite backend
        sqliteRepository = new TodoSqliteRepository(testDbPath)
        const serverService = new TodoService(sqliteRepository)
        const controller = new TodoController(serverService)

        const app = express()
        controller.registerRoutes(app)

        await new Promise<void>((resolve) => {
            server = app.listen(TEST_PORT, () => resolve())
        })

        // Create client service using AxiosTodoRepository
        axiosService = new TodoService(new AxiosTodoRepository(`http://localhost:${TEST_PORT}`))
    })

    afterAll(async () => {
        await new Promise<void>((resolve) => {
            server.close(() => resolve())
        })
        sqliteRepository.close()
        // Clean up test database
        if (fs.existsSync(testDbPath)) {
            fs.unlinkSync(testDbPath)
        }
    })

    it('should get todos via HTTP from SQLite backend', async () => {
        const todos = await axiosService.getTodos()
        expect(Array.isArray(todos)).toBe(true)
    })

    it('should add a todo via HTTP to SQLite backend', async () => {
        const newTodo = await axiosService.addTodo('Axios SQLite Test')

        expect(newTodo.title).toBe('Axios SQLite Test')
        expect(newTodo.completed).toBe(false)
        expect(newTodo.id).toBeDefined()

        // Verify it's in the database
        const todos = await axiosService.getTodos()
        expect(todos.find(t => t.id === newTodo.id)).toBeDefined()
    })

    it('should mark a todo as completed via HTTP in SQLite backend', async () => {
        const newTodo = await axiosService.addTodo('Complete Me SQLite')

        await axiosService.markTodoAsCompleted(newTodo.id)

        const todos = await axiosService.getTodos()
        const updated = todos.find(t => t.id === newTodo.id)
        expect(updated?.completed).toBe(true)
    })

    it('should remove a todo via HTTP from SQLite backend', async () => {
        const newTodo = await axiosService.addTodo('Delete Me SQLite')
        const todosAfterAdd = await axiosService.getTodos()
        const countAfterAdd = todosAfterAdd.length

        await axiosService.removeTodo(newTodo.id)

        const todosAfterRemove = await axiosService.getTodos()
        expect(todosAfterRemove.length).toBe(countAfterAdd - 1)
        expect(todosAfterRemove.find(t => t.id === newTodo.id)).toBeUndefined()
    })
})
