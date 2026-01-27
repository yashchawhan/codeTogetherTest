import { describe, it, expect, beforeEach } from '@jest/globals'
import { TodoService } from '../src/services/TodoService'
import * as path from 'path'
import { TodoRepositoryImpl, TodoDataJsonSourceImpl } from '../src/repository/TodoJsonRepository'

describe('TodoService', () => {
    let service: TodoService

    beforeEach(() => {
        const testDataPath = path.join(__dirname, '../data-test')
        const repository = new TodoRepositoryImpl(new TodoDataJsonSourceImpl(testDataPath))
        service = new TodoService(repository)
    })

    it('get todos should return a list of todos', async () => {
        const todos = await service.getTodos()
        expect(todos.length).toBeGreaterThan(0)
    })

    it('add todo should add a new todo', async () => {
        const initialTodos = await service.getTodos()
        const newTodoTitle = 'Test Todo'

        const added = await service.addTodo(newTodoTitle)
        expect(added.title).toBe(newTodoTitle)

        const todos = await service.getTodos()
        expect(todos.find(t => t.id === added.id)).toBeDefined()

        await service.removeTodo(added.id)

        const finalTodos = await service.getTodos()
        expect(finalTodos.length).toBe(initialTodos.length)
    })
})