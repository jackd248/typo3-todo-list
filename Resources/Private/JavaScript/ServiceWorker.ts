import Logger from './utils/Logger'

declare let self: ServiceWorkerGlobalScope
interface SyncEvent extends Event {
    lastChance: boolean
    tag: string
    waitUntil(f: Promise<any>): void // eslint-disable-line
}

const classname = 'ServiceWorker'

/**
 * Interface representing a stored request.
 */
interface StoredRequest {
    url: string
    body: string
    method: string
}

Logger.debug('Service Worker started', classname)

/**
 * Event listener for fetch events.
 * If the user is offline, the request is saved.
 * Otherwise, the request is fetched normally.
 */
self.addEventListener('fetch', (event: FetchEvent) => {
    if (!navigator.onLine) {
        Logger.debug('Save request from fetch event', classname, event)
        saveRequest(event.request)
    } else {
        Logger.debug('Proxy fetch event', classname, event)
        event.respondWith(fetch(event.request))
    }
})

/**
 * Event listener for sync events.
 * If the sync event tag is 'sync-requests', it attempts to sync the requests.
 */
self.addEventListener('sync', (event: SyncEvent) => {
    if (event.tag === 'sync-requests') {
        Logger.debug('Sync event', classname, event)
        event.waitUntil(syncRequests())
    }
})

/**
 * Event listener for message events.
 * Listens for messages from the client and processes fetch requests.
 */
self.addEventListener('message', async event => {
    // Check if the message action is 'fetchRequest'
    if (event.data?.action === 'fetchRequest') {
        Logger.debug('Receive request from App', classname, event.data.request)
        try {
            // Destructure the request data
            const { url, method, body } = event.data.request
            Logger.debug('Resend stored request', classname, event.data.request)

            // Send the request and get the response
            const response = await fetch(url, { method, body })
            const responseBody = await response.text()

            // Create a message object with the request and response details
            const message = {
                action: 'requestProcessed',
                request: event.data.request,
                response: {
                    status: response.status,
                    statusText: response.statusText,
                    body: responseBody
                }
            }

            // Send the message to all clients
            const clients = await self.clients.matchAll()
            clients.forEach(client => client.postMessage(message))
        } catch (error) {
            console.error('Error sending cached request:', error)
        }
    }
})

/**
 * Saves a request to be sent later when the user is back online.
 * @param {Request} request - The request to be saved.
 * @returns {Promise<void>}
 */
async function saveRequest(request: Request): Promise<void> {
    const body = await request.clone().text()
    const storedRequest: StoredRequest = {
        url: request.url,
        body,
        method: request.method
    }
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage({ action: 'storeRequest', request: storedRequest })
        })
    })
}

/**
 * Attempts to sync all saved requests.
 * @returns {Promise<void>}
 */
async function syncRequests(): Promise<void> {
    Logger.debug('Try to sync saved requests', classname)
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage({ action: 'getRequests' })
        })
    })
}
