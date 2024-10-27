class Logger {
    private devMode: boolean = true;

    debug(message: string, name: string, data: any) {
        if (!this.devMode) {
            return
        }

        if (data === undefined) {
            console.log(`[DEBUG][${name}] ${message}`)
            return
        }
        console.log(`[DEBUG][${name}] ${message}`, data)
    }
}

export default new Logger()
