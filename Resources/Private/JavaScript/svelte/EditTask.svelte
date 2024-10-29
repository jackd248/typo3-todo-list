<script>
    import ApiClient from './../utils/ApiClient.ts'
    import Logger from './../utils/Logger.ts'
    import { sortTasks } from '../utils/Helper'

    const classname = 'EditTask'
    let { task = $bindable(), toast = $bindable(), tasks = $bindable(), focus = $bindable(), ...props } = $props()

    let uid = task?.uid || ''
    let title = task?.title || ''
    let description = task?.description || ''
    let dueDate = task?.dueDate ? new Date(task?.dueDate) : null
    let completed = task?.completed || false

    if (dueDate) {
        dueDate = `${dueDate.getFullYear()}-${String(dueDate.getMonth() + 1).padStart(2, '0')}-${String(dueDate.getDate()).padStart(2, '0')}T${String(dueDate.getHours()).padStart(2, '0')}:${String(dueDate.getMinutes()).padStart(2, '0')}:${String(dueDate.getSeconds()).padStart(2, '0')}`;
    }
    /**
     * Saves the task by either creating a new one or updating an existing one.
     * @param {Event} event - The form submission event.
     */
    async function saveTask(event) {
        event.preventDefault()
        const formattedDueDate = dueDate ? new Date(dueDate).toISOString() : null
        const updatedTask = { uid, title, description, dueDate: formattedDueDate, completed }
        Logger.debug('Save task', classname, updatedTask)

        if (task?.uid) {
            await update(updatedTask)
        } else {
            await create(updatedTask)
        }
    }

    /**
     * Updates an existing task.
     * @param {Object} updatedTask - The updated task data.
     */
    async function update(updatedTask) {
        const result = await ApiClient.updateTask(task.uid, updatedTask)
        toast = 'Task updated'
        task = result
        tasks = tasks.map(t => (t.uid === task.uid ? task : t))
        sortTasks(tasks)
        Logger.debug('Task updated', classname, task)
        focus = task.uid
        task = null
    }

    /**
     * Creates a new task.
     * @param {Object} newTask - The new task data.
     */
    async function create(newTask) {
        const result = await ApiClient.createTask(newTask)
        toast = 'New task created'
        task = result
        tasks.push(task)
        sortTasks(tasks)
        Logger.debug('New task created', classname, task)
        focus = task.uid
        task = null
    }

    /**
     * Cancels the task editing.
     */
    function cancel() {
        task = null
    }
</script>

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
                    <i>today</i>
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

<button class="border circle left-round bottom-round extra cancel" onclick={cancel}>
    <i>close</i>
    <div class="tooltip left">Cancel</div>
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
