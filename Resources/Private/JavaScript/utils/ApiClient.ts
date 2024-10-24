class ApiClient {
    private apiUrl = '/_api/tasks'

    async getTasks() {
        return this.fetchData(this.apiUrl, 'GET')
    }

    async createTask(task: any) {
        return this.fetchData(this.apiUrl, 'POST', task)
    }

    async updateTask(taskId: number, updatedTask: any) {
        return this.fetchData(`${this.apiUrl}/${taskId}`, 'PATCH', updatedTask)
    }

    async deleteTask(taskId: number) {
        return this.fetchData(`${this.apiUrl}/${taskId}`, 'DELETE')
    }

    private async fetchData(url: string, method: string, body?: any) {
        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: body ? JSON.stringify(body) : undefined,
            })
            if (!response.ok) throw new Error(`Error: ${response.status}`)
            return method !== 'DELETE' ? await response.json() : null
        } catch (error) {
            console.error(`${method} request failed:`, error)
        }
    }
}

export default new ApiClient()
