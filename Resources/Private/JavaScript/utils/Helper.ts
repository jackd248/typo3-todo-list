export function setCustomElementStyles(shadowRootElement: Element): void {
    const styleSheet = document.querySelector('link[rel="stylesheet"]')
    if (!shadowRootElement || !styleSheet) {
        return
    }

    const style = document.createElement('style')
    style.innerHTML = `@import "${styleSheet.getAttribute('href') as string}"`

    shadowRootElement?.shadowRoot?.prepend(style)
}
