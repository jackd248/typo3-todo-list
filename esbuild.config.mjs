import * as esbuild from 'esbuild'
import esbuildSvelte from "esbuild-svelte";
import sveltePreprocess from "svelte-preprocess";

let devMode = true;

// Issue: https://github.com/sveltejs/svelte/issues/7240
const ignoreWarnings = new Set([
    "'TYPO3' is not defined"
])

const buildConfig = {
    entryPoints: [
        './Resources/Private/JavaScript/App.ts',
    ],
    mainFields: ["svelte", "browser", "module", "main"],
    conditions: ["svelte", "browser"],
    format: `esm`,
    bundle: true,
    sourcemap: true,
    plugins: [
        esbuildSvelte({
            preprocess: sveltePreprocess(
                {
                    scss: { renderSync: true, includePaths: ['assets', 'node_modules'] },
                }
            ),
            compilerOptions: {
                dev: devMode,
                customElement: true
            },
            filterWarnings(warning) {
                if (ignoreWarnings.has(warning.code)) {
                    return false
                }
            }
        }),
    ],

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
