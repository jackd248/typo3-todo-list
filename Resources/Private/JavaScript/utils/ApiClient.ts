import type { Task } from './Task'

class ApiClient {
    private apiUrl = '/_api/tasks'

    /**
     * Fetches all tasks from the API.
     * @returns {Promise<Task[]>} A promise that resolves to an array of tasks.
     */
    async getTasks(): Promise<Task[]> {
        return await this.fetchData(this.apiUrl, 'GET')
    }

    /**
     * Creates a new task via the API.
     * @param {Task} task - The task to be created.
     * @returns {Promise<Task>} A promise that resolves to the created task.
     */
    async createTask(task: Task): Promise<Task> {
        return this.fetchData(this.apiUrl, 'POST', task)
    }

    /**
     * Updates an existing task via the API.
     * @param {number} taskId - The ID of the task to be updated.
     * @param {Task} updatedTask - The updated task data.
     * @returns {Promise<Task>} A promise that resolves to the updated task.
     */
    async updateTask(taskId: number, updatedTask: Task): Promise<Task> {
        return this.fetchData(`${this.apiUrl}/${taskId}`, 'PATCH', updatedTask)
    }

    /**
     * Deletes a task via the API.
     * @param {number} taskId - The ID of the task to be deleted.
     * @returns {Promise<null>} A promise that resolves to null if the deletion was successful.
     */
    async deleteTask(taskId: number): Promise<Task> {
        return this.fetchData(`${this.apiUrl}/${taskId}`, 'DELETE')
    }

    /**
     * Fetches data from the API.
     * @private
     * @param {string} url - The URL to fetch data from.
     * @param {string} method - The HTTP method to use.
     * @param {Task} [body] - The request body, if applicable.
     * @returns {Promise<any>} A promise that resolves to the response data.
     */
    // eslint-disable-next-line
    private async fetchData(url: string, method: string, body?: Task): Promise<any> {
        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: body ? JSON.stringify(body) : undefined
            })
            if (!response.ok) throw new Error(`Error: ${response.status}`)
            return method !== 'DELETE' ? await response.json() : null
        } catch (error) {
            console.error(`${method} request failed:`, error)
        }
    }
}

export default new ApiClient()
