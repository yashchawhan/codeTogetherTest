import axios, { AxiosInstance } from 'axios'
import { TodoDTO } from '../model/todo-dto'
import { ITodoRepository } from '../services/TodoService'

export class AxiosTodoRepository implements ITodoRepository {
    private readonly client: AxiosInstance

    constructor(baseUrl: string = 'http://localhost:3000') {
        this.client = axios.create({
            baseURL: baseUrl,
            headers: {
                'Authorization': 'Bearer secret'
            }
        })
    }

    async getTodos(): Promise<TodoDTO[]> {
        const response = await this.client.get<TodoDTO[]>('/todos')
        return response.data
    }

    async addTodo(title: string): Promise<TodoDTO> {
        const response = await this.client.post<TodoDTO>('/todos', { title })
        return response.data
    }

    async markTodoAsCompleted(id: string): Promise<void> {
        await this.client.post(`/todos/${id}/complete`)
    }

    async removeTodo(id: string): Promise<void> {
        await this.client.delete(`/todos/${id}`)
    }
}
