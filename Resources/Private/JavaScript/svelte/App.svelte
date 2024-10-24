<svelte:options customElement="app-container"/>

<script>
    import {onMount} from 'svelte';
    import EditTask from './EditTask.svelte';
    import TaskList from './TaskList.svelte';
    import {setCustomElementStyles} from "../utils/Helper";
    import ApiClient from './../utils/ApiClient.ts';

    let task = null;
    let toast = '';
    let snackbar = false;
    let offline = false;
    let loading = true;
    let list = true;
    let tasks = [];

    onMount(async () => {
        console.log('Svelte App Mounted');

        setCustomElementStyles(document.querySelector("app-container"));
        tasks = await ApiClient.getTasks().then(data => data['hydra:member']);
        loading = false;

        offline = !navigator.onLine;
        window.addEventListener('offline', () => {
            offline = true;
        });

        window.addEventListener('online', () => {
            offline = false;
        });

        if (tasks.length === 0) {
            handleNew();
        }
    });

    function handleEditTask(event) {
        task = event.detail;
        list = false;
    }

    function handleTaskUpdated(event) {
        const updatedTask = event.detail;
        tasks = tasks.some(t => t.uid === updatedTask.uid)
            ? tasks.map(t => t.uid === updatedTask.uid ? updatedTask : t)
            : [...tasks, updatedTask];

        // Sort tasks by completed status and due date
        tasks = tasks.sort((a, b) => {
            return a.completed - b.completed;
        });
        task = null;
        list = true;

        if (tasks.length === 0) {
            handleNew();
        }
    }

    function handleCancel() {
        task = null;
        list = true;
    }

    function handleNew() {
        task = {};
        list = false;
    }

    function handleToast(event) {
        toast = event.detail;
        snackbar = true;
        setTimeout(() => {
            toast = null;
            snackbar = false;
        }, 3000);
    }

    function toggleDarkMode(event) {
        const dark = document.body.classList.contains('dark');
        if (dark) {
            document.body.classList.remove('dark');
            event.target.querySelector('i').textContent = 'dark_mode';
        } else {
            event.target.querySelector('i').textContent = 'light_mode';
            document.body.classList.add('dark');
        }
    }
</script>

<style>
    .add-task {
        position: fixed;
        right: 1rem;
        bottom: 1rem;
    }

    .offline {
        position: fixed;
        left: 1rem;
        bottom: 1rem;
    }

    .typo3 {
        position: fixed;
        left: 1rem;
        top: 1rem;
    }

    header {
        background: inherit;
    }

    .hidden {
        display: none !important;
    }

    @media (max-width: 1300px) and (min-width: 600px) {
        header .row {
            margin-left: 5rem !important;
        }
        header .max {
            flex: none;
        }
    }

    @media (max-width: 600px) {
        header {
            margin-top: 5rem;
        }
        header .max {
            flex: none;
        }
    }
</style>

<header>
    <div class="row">
        <div class="max">
            <h3><strong>TYPO3</strong> <em>ToDo</em> List</h3>
        </div>
        <button class="border" on:click={toggleDarkMode}>
            <i>dark_mode</i>
        </button>
    </div>
</header>


{#if loading}
    <div class="center-align">
        <progress class="circle"></progress>
    </div>
{/if}

{#if tasks.length === 0 && !loading && list}
    <div class="center-align">
        <button class="border" on:click={handleNew}>
            <i>add</i>
            <span>Create a task</span>
        </button>
    </div>
{/if}

{#if list}
    <TaskList {tasks} on:editTask={handleEditTask} on:toast={handleToast}/>

    <button class="circle left-round top-round extra add-task" on:click={handleNew}>
        <i>add</i>
    </button>
{/if}

{#if task}
    <EditTask {task} on:taskUpdated={handleTaskUpdated} on:cancel={handleCancel} on:toast={handleToast}/>
{/if}

<div class="snackbar primary {snackbar ? 'active' : ''}">
    <i>info</i>
    {toast}
</div>

<div class="circle left-round top-round extra offline {offline ? '' : 'hidden'}">
    <button class="border circle right-round top-round extra">
        <i>wifi_off</i>
        <div class="tooltip">The app is offline</div>
    </button>
</div>

<a href="/typo3/module/web/list?id=2" class="border circle right-round bottom-round extra typo3 tertiary">
    <i>login</i>
</a>

<div class="large-space"></div>
<div class="padding absolute center">
    Made with <i>favorite</i> by <a href="https://konradmichalik.dev" target="_blank" class="link">Konrad Michalik</a>
</div>
