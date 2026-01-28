import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import express from 'express'
import { Server } from 'http'
import { TodoService } from '../src/services/TodoService'
import { TodoRepositoryImpl, TodoDataJsonSourceImpl } from '../src/repository/TodoJsonRepository'
import { TodoController } from '../src/controller/TodoController'
import { AxiosTodoRepository } from '../src/client/AxiosTodoRepository'
import * as path from 'path'

describe('AxiosTodoRepository', () => {
    let server: Server
    let axiosService: TodoService

    beforeAll(async () => {
        // Start a test server with test data
        const testDataPath = path.join(__dirname, '../data-test')
        const repository = new TodoRepositoryImpl(new TodoDataJsonSourceImpl(testDataPath))
        const serverService = new TodoService(repository)
        const controller = new TodoController(serverService)

        const app = express()
        controller.registerRoutes(app)

        await new Promise<void>((resolve) => {
            server = app.listen(3000, () => resolve())
        })

        // Create client service using AxiosTodoRepository
        axiosService = new TodoService(new AxiosTodoRepository())
    })

    afterAll(async () => {
        await new Promise<void>((resolve) => {
            server.close(() => resolve())
        })
    })

    it('should get todos via HTTP', async () => {
        const todos = await axiosService.getTodos()
        expect(Array.isArray(todos)).toBe(true)
        expect(todos.length).toBeGreaterThan(0)
    })

    it('should add a todo via HTTP', async () => {
        const newTodo = await axiosService.addTodo('Axios Test Todo')

        expect(newTodo.title).toBe('Axios Test Todo')
        expect(newTodo.completed).toBe(false)
        expect(newTodo.id).toBeDefined()

        // Clean up
        await axiosService.removeTodo(newTodo.id)
    })

    it('should mark a todo as completed via HTTP', async () => {
        // Create a todo
        const newTodo = await axiosService.addTodo('Complete Me')

        // Mark as completed
        await axiosService.markTodoAsCompleted(newTodo.id)

        // Verify
        const todos = await axiosService.getTodos()
        const updated = todos.find(t => t.id === newTodo.id)
        expect(updated?.completed).toBe(true)

        // Clean up
        await axiosService.removeTodo(newTodo.id)
    })

    it('should remove a todo via HTTP', async () => {
        // Create a todo
        const newTodo = await axiosService.addTodo('Delete Me')
        const todosAfterAdd = await axiosService.getTodos()
        const countAfterAdd = todosAfterAdd.length

        // Remove it
        await axiosService.removeTodo(newTodo.id)

        // Verify
        const todosAfterRemove = await axiosService.getTodos()
        expect(todosAfterRemove.length).toBe(countAfterAdd - 1)
        expect(todosAfterRemove.find(t => t.id === newTodo.id)).toBeUndefined()
    })
})
