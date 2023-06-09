import * as esbuild from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'


const isWatchMode = process.argv.includes('--watch')

const ENTRY = './src/addLogo.ts'

const config: esbuild.BuildOptions = {
	entryPoints: [ENTRY],
	bundle: true,
	outfile: './dist/sh.user.js',
	minify: !isWatchMode,
	plugins: [sassPlugin({ type: 'style' })],
	
}

async function watch() {
	const context = await esbuild.context(config)
	await context.watch()
}

async function build() {
	await esbuild.build(config)
}

if (isWatchMode) watch()
else build()
