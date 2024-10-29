/**
 * Logger class for debugging messages.
 */
class Logger {
    private devMode = false

    /**
     * Logs a debug message if devMode is enabled.
     * @param {string} message - The debug message to log.
     * @param {string} name - The name associated with the debug message.
     * @param {any} [data=undefined] - Optional additional data to log.
     */
    // eslint-disable-next-line
    debug(message: string, name: string, data: any = undefined) {
        if (!this.devMode) return

        console.log(`[DEBUG][${name}] ${message}`, data ?? '')
    }
}

export default new Logger()
