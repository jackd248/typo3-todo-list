<svelte:options customElement="app-container" />

<script lang="ts">
    import EditTask from './EditTask.svelte'
    import TaskList from './TaskList.svelte'
    import { sortTasks, setCustomElementStyles } from '../utils/Helper'
    import ApiClient from './../utils/ApiClient'
    import Logger from './../utils/Logger'
    import { Task } from '../utils/Task'

    const classname: string = 'App'
    let root: Element
    let task: Task | null | object = $state(null)
    let toast = $state(null)
    let snackbar = $state(false)
    let offline = $state(false)
    let loading = $state(true)
    let darkMode = $state(false)
    let tasks = $state([])
    let focus: number | null | undefined = $state(null)

    $effect(() => {
        if (toast) {
            snackbar = true
            setTimeout(() => {
                toast = null
                snackbar = false
            }, 3000)
        }

        if (focus) {
            const element = root.querySelector(`#task-${focus}`)
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' })
            }
            focus = null
        }
    })

    function handleNew() {
        task = {}
    }

    function toggleDarkMode(event: Event) {
        const dark = document.body.classList.contains('dark')
        document.body.classList.toggle('dark')
        event.target!.querySelector('i').textContent = dark ? 'dark_mode' : 'light_mode'
        localStorage.setItem('darkMode', (!dark).toString())
    }

    function initialize() {
        offline = !navigator.onLine
        window.addEventListener('offline', () => (offline = true))
        window.addEventListener('online', () => (offline = false))

        darkMode = localStorage.getItem('darkMode') === 'true'
        if (darkMode) document.body.classList.add('dark')

        Logger.debug('Svelte App Mounted', classname)

        setCustomElementStyles(document.querySelector('app-container')!)
        ApiClient.getTasks().then(data => {
            tasks = 'hydra:member' in data ? data['hydra:member'] : []
            sortTasks(tasks)
            loading = false
            Logger.debug('Tasks loaded', classname, tasks)
            if (tasks.length === 0) handleNew()
        })
    }

    initialize()
</script>

<div bind:this={root} class="wrapper">
    <header>
        <div class="row">
            <div class="max">
                <h3><strong>TYPO3</strong> <em>ToDo</em> List</h3>
            </div>
            <button class="border" onclick={toggleDarkMode}>
                <i>{darkMode ? 'light_mode' : 'dark_mode'}</i>
                <span class="tooltip left">Toggle darkmode</span>
            </button>
        </div>
    </header>

    <main>
        {#if loading}
            <div class="center-align">
                <progress class="circle"></progress>
            </div>
        {/if}

        {#if tasks.length === 0 && !loading && !task}
            <div class="center-align">
                <button class="border" onclick={handleNew}>
                    <i>add</i>
                    <span>Create a task</span>
                </button>
            </div>
        {/if}

        {#if !task}
            <TaskList bind:tasks bind:toast bind:task />
            <button class="circle left-round top-round extra add-task" onclick={handleNew}>
                <i>add</i>
                <span class="tooltip left">Add task</span>
            </button>
        {/if}

        {#if task}
            <EditTask bind:tasks bind:toast bind:task bind:focus />
        {/if}
    </main>

    <footer>
        <div class="padding absolute center">
            Made with <i>keyboard</i> & <i>favorite</i> by
            <a href="https://konradmichalik.dev" target="_blank" class="link">Konrad Michalik</a>
        </div>
    </footer>

    <!-- Snackbar -->
    <div class="snackbar primary {snackbar ? 'active' : ''}">
        <i>info</i>
        {toast}
    </div>

    <div class="circle left-round top-round extra offline {offline ? '' : 'hidden'}">
        <button class="border circle right-round top-round extra">
            <i>wifi_off</i>
            <span class="tooltip">The app is offline</span>
        </button>
    </div>

    <a href="/typo3/module/web/list?id=2" class="border circle right-round bottom-round extra typo3 tertiary">
        <i>login</i>
        <div class="tooltip right">Login to TYPO3 backend</div>
    </a>
</div>

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

    .wrapper {
        display: flex;
        flex-direction: column;
        min-height: 100vh; /* Stellt sicher, dass die Höhe mindestens die Höhe des sichtbaren Bereichs ist */
    }

    header,
    footer {
        background: inherit;
    }

    main {
        flex: 1;
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
