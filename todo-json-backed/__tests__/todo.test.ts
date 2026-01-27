import { describe, it, expect, beforeEach } from '@jest/globals'
import { TodoService } from '../src/services/TodoService'

describe('TodoService', () => {
    let service: TodoService

    beforeEach(() => {
        service = new TodoService()
    })

    it('get todos should return a list of todos', () => {
        const todos = service.getTodos()
        expect(todos.length).toBeGreaterThan(0)
    })
})