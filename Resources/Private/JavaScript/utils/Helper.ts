export function setCustomElementStyles(shadowRootElement: Element): void {
    const styleSheet = document.querySelector('link[rel="stylesheet"]')
    if (!shadowRootElement || !styleSheet) {
        return
    }

    const style = document.createElement('style')
    style.innerHTML = `@import "${styleSheet.getAttribute('href') as string}"`

    shadowRootElement?.shadowRoot?.prepend(style)
}

export function sortTasks(tasks: any[]): any[] {
    return tasks.sort((a: any, b: any) => a.completed - b.completed)
}

export function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString();
}

export function checkDate(dateString: string) {
    const date: Date = new Date(dateString);
    const now: Date = new Date();
    const threshold = 24 * 60 * 60 * 1000;
    let diff = date.getTime() - now.getTime()

    if (diff < threshold && diff > 0) {
        return { class: 'primary', message: 'Due the next 24 hours', icon: 'warning' };
    } else if (date < now) {
        return { class: 'secondary', message: 'Overdue', icon: 'error' };
    } else {
        return { class: '', message: 'Upcoming', icon: 'calendar_month' };
    }
}
