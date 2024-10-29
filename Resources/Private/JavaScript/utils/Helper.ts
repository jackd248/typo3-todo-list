import type { Task } from './Task'
import Logger from './Logger'

const classname = 'Helper'

/**
 * Sets custom styles for a shadow DOM element.
 * @param {Element} shadowRootElement - The shadow root element to apply styles to.
 */
export function setCustomElementStyles(shadowRootElement: Element): void {
    const styleSheet = document.querySelector('link[rel="stylesheet"]')
    if (!shadowRootElement || !styleSheet) return

    const style = document.createElement('style')
    style.innerHTML = `@import "${styleSheet.getAttribute('href') as string}"`
    shadowRootElement?.shadowRoot?.prepend(style)
}

/**
 * Sorts an array of tasks by their completion status.
 * @param {Task[]} tasks - The array of tasks to sort.
 * @returns {Task[]} The sorted array of tasks.
 */
export function sortTasks(tasks: Task[]): Task[] {
    return tasks.sort((a, b) => Number(a.completed) - Number(b.completed))
}

/**
 * Formats a date string into a locale-specific string.
 * @param {string} dateString - The date string to format.
 * @returns {string} The formatted date string.
 */
export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString()
}

/**
 * Checks the date and returns an object with class, message, and icon based on the date's proximity to the current date.
 * @param {string} dateString - The date string to check.
 * @returns {Object} An object containing class, message, and icon properties.
 */
export function checkDate(dateString: string) {
    const date = new Date(dateString)
    const now = new Date()
    const threshold = 24 * 60 * 60 * 1000
    const diff = date.getTime() - now.getTime()

    if (diff < threshold && diff > 0) {
        return { class: 'primary', message: 'Due the next 24 hours', icon: 'warning' }
    } else if (date < now) {
        return { class: 'secondary', message: 'Overdue', icon: 'error' }
    } else {
        return { class: '', message: 'Upcoming', icon: 'calendar_month' }
    }
}

/**
 * Stores a request object in local storage.
 * @param {Request} request - The request object to store.
 */
export function storeRequestToLocalStorage(request: Request): void {
    Logger.debug('Store request to local storage', classname, request)
    const requests = getRequestsFromLocalStorage()
    requests.push(request)
    window.localStorage.setItem('offlineRequests', JSON.stringify(requests))
}

/**
 * Retrieves an array of request objects from local storage.
 * @returns {Request[]} The array of request objects.
 */
export function getRequestsFromLocalStorage(): Request[] {
    Logger.debug('Get requests from local storage', classname)
    return JSON.parse(window.localStorage.getItem('offlineRequests') || '[]')
}

/**
 * Removes a request object from local storage.
 * @param {Request} request - The request object to remove.
 */
export function removeFromLocalStorage(request: Request): void {
    Logger.debug('Remove from local storage', classname, request)
    const requests = getRequestsFromLocalStorage()
    const updatedRequests = requests.filter(req => req.url !== request.url || req.body !== request.body || req.method !== request.method)
    window.localStorage.setItem('offlineRequests', JSON.stringify(updatedRequests))
}
