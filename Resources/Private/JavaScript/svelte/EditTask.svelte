<!-- EditTask.svelte -->
<script>
    import {createEventDispatcher} from 'svelte';

    import ApiClient from './../utils/ApiClient.ts';

    export let task;

    const dispatch = createEventDispatcher();

    let title = '';
    let description = '';
    let dueDate = '';
    let completed = false;

    $: if (task) {
        title = task.title;
        description = task.description;
        dueDate = task.dueDate ? new Date(task.dueDate).toISOString().replace(/\.\d{3}Z$/, '') : '';
        completed = task.completed;
    }

    async function saveTask() {
        let formattedDueDate = dueDate ? new Date(dueDate).toISOString() : null;
        let updatedTask = {title, description, dueDate: formattedDueDate, completed};

        if (task.uid) {
            updatedTask = await ApiClient.updateTask(task.uid, updatedTask);
            dispatch('toast', 'Task updated');
        } else {
            updatedTask = await ApiClient.createTask(updatedTask);
            dispatch('toast', 'New task created');
        }
        dispatch('taskUpdated', updatedTask);
    }

    function cancel() {
        dispatch('cancel');
    }
</script>

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

<form on:submit|preventDefault={saveTask}>
    <fieldset>
        <legend>Task</legend>
        <div class="row">
            <div class="max">
                <label>Title<span class="primary-text">*</span></label>
                <div class="field border">
                    <input type="text" name="title" required bind:value={title}/>
                </div>
            </div>
            <div class="max">
                <label>Due Date</label>
                <div class="field border">
                    <input type="datetime-local" name="dueDate" bind:value={dueDate}/>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="max">
                <label>Description</label>
                <div class="field border textarea">
                    <textarea  name="description" bind:value={description}></textarea>
                </div>
            </div>
        </div>

        <label class="checkbox">
            <input type="checkbox" name="completed" bind:value={completed}>
            <span>Completed</span>
        </label>

        <div class="space"></div>
        <div class="right">
            <button type="submit">
                <i>save</i>
                Save
            </button>
            <button on:click={cancel} class="border">
                <i>cancel</i>
                Cancel
            </button>
        </div>
    </fieldset>

</form>

<button class="border circle left-round bottom-round extra cancel" on:click={cancel}>
    <i>close</i>
</button>
