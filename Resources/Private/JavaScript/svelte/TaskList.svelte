<script>
    import {createEventDispatcher} from 'svelte';
    import ApiClient from './../utils/ApiClient.js';


    const dispatch = createEventDispatcher();
    export let tasks;

    function editTask(task) {
        dispatch('editTask', task);
    }

    async function deleteTask(task) {
        await ApiClient.deleteTask(task.uid);
        tasks = tasks.filter(t => t.uid !== task.uid);
        dispatch('toast', 'Task deleted');
    }

    function formatDate(dateString) {
        return new Date(dateString).toLocaleString();
    }

    function checkDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const threshold = 24 * 60 * 60 * 1000;

        if (date - now < threshold && date - now > 0) {
            return 'primary';
        } else if (date < now) {
            return 'secondary';
        } else {
            return '';
        }
    }

    function toggleCompleted(task) {
        task.completed = !task.completed;
        ApiClient.updateTask(task.uid, task);
        tasks = tasks.map(t => t.uid === task.uid ? task : t);
        dispatch('toast', 'Task updated');
    }
</script>

<style>
    @media (max-width: 1024px) {
        .row {
            flex-direction: column;
            align-items: center;
        }
    }
</style>

<div class="list">
    {#each tasks as task}
        <div class="space"></div>
        <div class="row padding surface-container {task.completed ? 'fill' : ''}">
            <button class="border circle left-round bottom-round {task.completed ? 'primary' : ''}"
                    on:click={toggleCompleted(task)}>
                {#if task.completed }
                    <i>check_box</i>
                {:else}
                    <i>check_box_outline_blank</i>
                {/if}
            </button>
            <div class="max">
                <h5 class="small">{task.title}</h5>
                <div>{task.description}</div>
            </div>
            {#if task.dueDate}
                <div class="chip {checkDate(task.dueDate)}">
                    <i>
                        {#if checkDate(task.dueDate) === 'primary'}
                            warning
                        {:else if checkDate(task.dueDate) === 'secondary'}
                            error
                        {:else}
                            calendar_month
                        {/if}
                    </i>
                    <small>{formatDate(task.dueDate)}</small>
                </div>
            {/if}
            <nav class="no-space">
                <button on:click={editTask(task)} class="border left-round small">
                    <i>edit</i>
                </button>
                <button on:click={deleteTask(task)} class="border right-round small fill">
                    <i>delete</i>
                </button>
            </nav>
        </div>
    {/each}
</div>
