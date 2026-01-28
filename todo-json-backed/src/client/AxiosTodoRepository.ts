import axios from 'axios'
import { TodoDTO } from '../model/todo-dto'
import { ITodoRepository } from '../services/TodoService'

export class AxiosTodoRepository implements ITodoRepository {
    private readonly baseUrl = 'http://localhost:3000'

    async getTodos(): Promise<TodoDTO[]> {
        const response = await axios.get<TodoDTO[]>(`${this.baseUrl}/todos`)
        return response.data
    }

    async addTodo(title: string): Promise<TodoDTO> {
        const response = await axios.post<TodoDTO>(`${this.baseUrl}/todos`, { title })
        return response.data
    }

    async markTodoAsCompleted(id: string): Promise<void> {
        await axios.post(`${this.baseUrl}/todos/${id}/complete`)
    }

    async removeTodo(id: string): Promise<void> {
        await axios.delete(`${this.baseUrl}/todos/${id}`)
    }
}
