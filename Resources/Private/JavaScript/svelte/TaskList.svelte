<script>
    import { formatDate, checkDate, sortTasks } from '../utils/Helper'
    import ApiClient from './../utils/ApiClient.ts'
    import Logger from './../utils/Logger.ts'

    // Component properties
    let { task = $bindable(), toast = $bindable(), tasks = $bindable(), ...props } = $props()
    const classname = 'TaskList'

    /**
     * Sets the task to be edited.
     * @param {Object} taskToEdit - The task to be edited.
     */
    function editTask(taskToEdit) {
        task = taskToEdit
    }

    /**
     * Deletes a task.
     * @param {Object} taskToDelete - The task to be deleted.
     */
    async function deleteTask(taskToDelete) {
        await ApiClient.deleteTask(taskToDelete.uid)
        Logger.debug('Task deleted', classname, taskToDelete)
        tasks = tasks.filter(t => t.uid !== taskToDelete.uid)
        toast = 'Task deleted'
        if (tasks.length === 0) task = {}
    }

    /**
     * Toggles the completion status of a task.
     * @param {Object} taskToUpdate - The task to be updated.
     */
    function toggleCompleted(taskToUpdate) {
        taskToUpdate.completed = !taskToUpdate.completed
        ApiClient.updateTask(taskToUpdate.uid, taskToUpdate).then(result => {
            Logger.debug('Task updated', classname, result)
            tasks = tasks.map(t => (t.uid === result.uid ? result : t))
            sortTasks(tasks)
            toast = 'Task updated'
        })
    }
</script>

<div class="list">
    {#each tasks as task}
        <div class="space"></div>
        <div id="task-{task.uid}" class="row padding surface-container task-item {task.completed ? 'fill' : ''}">
            <button class="border circle left-round bottom-round {task.completed ? 'primary' : ''}" onclick={() => toggleCompleted(task)}>
                <i>{task.completed ? 'check_box' : 'check_box_outline_blank'}</i>
                <div class="tooltip">{task.completed ? 'Mark as incomplete' : 'Mark as complete'}</div>
            </button>
            <div class="max">
                <h5 class="small">{task.title}</h5>
                <div>{task.description}</div>
            </div>
            {#if task.dueDate}
                <div class="chip {checkDate(task.dueDate).class}">
                    <i>{checkDate(task.dueDate).icon}</i>
                    <small>{formatDate(task.dueDate)}</small>
                    <span class="tooltip">{checkDate(task.dueDate).message}</span>
                </div>
            {/if}
            <nav class="no-space">
                <button onclick={() => editTask(task)} class="border left-round small edit-task">
                    <i>edit</i>
                    <span class="tooltip">Edit task</span>
                </button>
                <button onclick={() => deleteTask(task)} class="border right-round small fill delete-task">
                    <i>delete</i>
                    <span class="tooltip">Delete task</span>
                </button>
            </nav>
        </div>
    {/each}
</div>

<style>
    @media (max-width: 1024px) {
        .row {
            flex-direction: column;
            align-items: center;
        }
    }
</style>
