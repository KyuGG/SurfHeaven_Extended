import * as esbuild from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'

import { userscriptMetadataGenerator } from 'userscript-metadata-generator'
import metadata from './tampermonkeyMetadata'

const isWatchMode = process.argv.includes('--watch')

const ENTRY = './src/main.ts'

const config: esbuild.BuildOptions = {
	entryPoints: [ENTRY],
	bundle: true,
	outfile: './dist/sh.user.js',
	minify: !isWatchMode,
	plugins: [sassPlugin({ type: 'style' })],
	banner: {
		js: userscriptMetadataGenerator(metadata) + '\n',
	},
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
