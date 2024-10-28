<script lang="ts">
    import ApiClient from './../utils/ApiClient'
    import Logger from './../utils/Logger'
    import { sortTasks } from '../utils/Helper'
    import { Task } from '../utils/Task'

    const classname = 'EditTask'
    interface Props {
        task?: Task
        toast?: string
        tasks: Task[]
        focus?: number | null | undefined
        [key: string]: any
    }
    let { task = $bindable(), toast = $bindable(), tasks = $bindable(), focus = $bindable(), ...props }: Props = $props()

    let uid: number | null = $state(task?.uid || null)
    let title: string = $state(task?.title || '')
    let description: string = $state(task?.description || '')
    let dueDate: string | null = $state(task?.dueDate ? new Date(task.dueDate).toISOString().slice(0, -5) : null)
    let completed: boolean = $state(task?.completed || false)

    async function saveTask(event: Event) {
        Logger.debug('Save task', classname)
        event.preventDefault()
        const formattedDueDate = dueDate ? new Date(dueDate).toISOString() : null
        const updatedTask: Task = { uid, title, description, dueDate: formattedDueDate, completed }

        if (task?.uid) {
            await update(updatedTask)
        } else {
            await create(updatedTask)
        }
    }

    async function update(updatedTask: Task) {
        await ApiClient.updateTask(task!.uid, updatedTask).then(result => {
            toast = 'Task updated'
            task = result
            tasks = tasks.map(t => (t.uid === task!.uid ? task! : t))
            sortTasks(tasks!)
            Logger.debug('Task updated', classname, task)
            focus = task!.uid
            task = undefined
        })
    }

    async function create(newTask: Task) {
        await ApiClient.createTask(newTask).then(result => {
            toast = 'New task created'
            task = result
            tasks.push(task!)
            sortTasks(tasks)
            Logger.debug('New task created', classname, task)
            focus = task!.uid
            task = undefined
        })
    }

    function cancel() {
        task = undefined
    }
</script>

<!-- Form to edit or create a task -->
<form onsubmit={saveTask}>
    <fieldset>
        <legend>Task</legend>
        <input type="hidden" name="uid" bind:value={uid} />
        <div class="row">
            <div class="max">
                <label for="title">Title<span class="primary-text">*</span></label>
                <div class="field border">
                    <input type="text" id="title" name="title" required bind:value={title} />
                </div>
            </div>
            <div class="max">
                <label for="dueDate">Due Date</label>
                <div class="field border">
                    <input type="datetime-local" id="dueDate" name="dueDate" bind:value={dueDate} />
                </div>
            </div>
        </div>
        <div class="row">
            <div class="max">
                <label for="description">Description</label>
                <div class="field border textarea">
                    <textarea id="description" name="description" bind:value={description}></textarea>
                </div>
            </div>
        </div>
        <label class="checkbox">
            <input type="checkbox" name="completed" bind:checked={completed} />
            <span>Completed</span>
        </label>
        <div class="space"></div>
        <div class="right">
            <button type="submit"><i>{task?.title ? 'save' : 'add_circle'}</i>{task?.title ? 'Save' : 'Create'}</button>
            <button type="button" onclick={cancel} class="border"><i>cancel</i>Cancel</button>
        </div>
    </fieldset>
</form>

<!-- Cancel button to close the form -->
<button class="border circle left-round bottom-round extra cancel" onclick={cancel}>
    <i>close</i>
    <span class="tooltip left">Cancel</span>
</button>

<style>
    .cancel {
        position: fixed;
        right: 1rem;
        top: 1rem;
    }
    .right {
        text-align: right;
    }
</style>
