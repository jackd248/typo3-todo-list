export interface Task {
    uid?: number | null
    title: string
    description: string
    completed: boolean
    dueDate: string | null
}
