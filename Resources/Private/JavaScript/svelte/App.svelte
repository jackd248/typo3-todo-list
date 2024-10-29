<svelte:options customElement="app-container" />

<script>
    import EditTask from './EditTask.svelte'
    import TaskList from './TaskList.svelte'
    import {
        sortTasks,
        setCustomElementStyles,
        storeRequestToLocalStorage,
        getRequestsFromLocalStorage,
        removeFromLocalStorage
    } from '../utils/Helper'
    import ApiClient from './../utils/ApiClient.ts'
    import Logger from './../utils/Logger.ts'

    const classname = 'App'
    let root,
        task = $state(null),
        toast = $state(null),
        snackbar = $state(false)
    let offline = $state(false),
        loading = $state(true),
        darkMode = $state(false)
    let tasks = $state([]),
        focus = $state(null)

    /**
     * Effect to handle toast and focus changes.
     */
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
            if (element) element.scrollIntoView({ behavior: 'smooth' })
            focus = null
        }
    })

    /**
     * Handles the creation of a new task.
     */
    function handleNew() {
        task = {}
    }

    /**
     * Toggles dark mode on and off.
     * @param {Event} event - The event triggered by the button click.
     */
    function toggleDarkMode(event) {
        const dark = document.body.classList.contains('dark')
        document.body.classList.toggle('dark')
        event.target.querySelector('i').textContent = dark ? 'dark_mode' : 'light_mode'
        localStorage.setItem('darkMode', !dark)
    }

    async function fetchTasks() {
        ApiClient.getTasks().then(data => {
            tasks = 'hydra:member' in data ? data['hydra:member'] : []
            sortTasks(tasks)
            Logger.debug('Tasks loaded', classname, tasks)
            if (tasks.length === 0) handleNew()
        })
    }

    /**
     * Initializes the application.
     */
    function initialize() {
        offline = !navigator.onLine
        window.addEventListener('offline', () => (offline = true))
        window.addEventListener('online', () => (offline = false))

        darkMode = localStorage.getItem('darkMode') === 'true'
        if (darkMode) document.body.classList.add('dark')

        Logger.debug('Svelte App initialized', classname)
        setCustomElementStyles(document.querySelector('app-container'))
        fetchTasks().then(() => {
            loading = false
        })
    }

    /**
     * Registers the service worker and background sync.
     * https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
     */
    async function registerServiceWorker() {
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
            try {
                const registration = await navigator.serviceWorker.register('/ServiceWorker.js', {
                    scope: '/'
                })
                Logger.debug('Service Worker registered', classname, registration)

                await registration.sync.register('sync-requests')
                Logger.debug('Background Sync registered', classname)
            } catch (error) {
                console.error('Error registering Service Worker or Background Sync:', error)
            }

            /**
             * Listen for messages from the service worker to access the local storage for request handling.
             */
            navigator.serviceWorker.addEventListener('message', event => {
                if (event.data.action === 'storeRequest') {
                    Logger.debug('Store request:', classname, event.data.request)
                    storeRequestToLocalStorage(event.data.request)
                }
                if (event.data.action === 'getRequests') {
                    Logger.debug('Get request message from service worker', classname)
                    const requests = getRequestsFromLocalStorage()
                    for (const request of requests) {
                        Logger.debug('Send stored request to service worker', classname, request)
                        navigator.serviceWorker.controller.postMessage({
                            action: 'fetchRequest',
                            request
                        })
                    }
                }
                if (event.data.action === 'requestProcessed') {
                    const request = event.data.request
                    Logger.debug('Remove request', classname, request)
                    removeFromLocalStorage(request)
                    fetchTasks().then(() => {
                        loading = false
                    })
                }
            })
        } else {
            console.warn('Service Worker or Background Sync is not supported in this browser.')
        }
    }

    registerServiceWorker().then(() => {
        initialize()
    })
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
                    <div>Create a task</div>
                </button>
            </div>
        {/if}

        {#if !task}
            <TaskList bind:tasks bind:toast bind:task />
            <button class="circle left-round top-round extra add-task" onclick={handleNew}>
                <i>add</i>
                <div class="tooltip left">Add task</div>
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
            <div class="tooltip">The app is offline</div>
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
        z-index: 100;
    }

    .offline {
        position: fixed;
        left: 1rem;
        bottom: 1rem;
        z-index: 100;
    }

    .typo3 {
        position: fixed;
        left: 1rem;
        top: 1rem;
        z-index: 100;
    }

    .wrapper {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
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
