import * as esbuild from 'esbuild'

let devMode = true;

// Issue: https://github.com/sveltejs/svelte/issues/7240
const ignoreWarnings = new Set([
    "'TYPO3' is not defined"
])

const buildConfig = {
    entryPoints: [
        './Resources/Private/JavaScript/App.js',
    ],
    mainFields: ["browser", "module", "main"],
    conditions: ["browser"],
    format: `esm`,
    bundle: true,
    sourcemap: true,
    plugins: [],
    outdir: 'Resources/Public/JavaScript/',
    logLevel: 'info',
}

if (process.argv.includes('--build')) {
    await build()
} else {
    await watch()
}

async function build() {
    devMode = false;
    buildConfig.sourcemap = false
    buildConfig.minify = true
    buildConfig.outExtension = { '.js': '.min.js' }
    await esbuild.build(buildConfig)
}

async function watch() {
    let ctx = await esbuild.context(buildConfig)
    await ctx.watch()
}
