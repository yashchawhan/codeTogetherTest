import { describe, it, expect, beforeEach } from '@jest/globals'
import { TodoService } from '../src/services/TodoService'
import * as path from 'path'

describe('TodoService', () => {
    let service: TodoService

    beforeEach(() => {
        service = new TodoService()
    })

    it('get todos should return a list of todos', () => {
        const testDataPath = path.join(__dirname, '../data-test')
        service.setBasePath(testDataPath)
        const todos = service.getTodos()
        expect(todos.length).toBeGreaterThan(0)
    })
})