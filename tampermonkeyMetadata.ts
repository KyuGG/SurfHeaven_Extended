import { Metadata } from 'userscript-metadata-generator'

const SCRIPT_URL = 'https://github.com/Kalekki/SurfHeaven_Extended/raw/main/sh.user.js'
const LOCAL_FILE = `file://${__dirname}/dist/sh.user.js`
const isWatchMode = process.argv.includes('--watch')

const metadata: Metadata = {
	name: 'SurfHeaven ranks Ext',
	namespace: 'http://tampermonkey.net/',
	version: '4.2.16.2',
	description: 'More stats and features for SurfHeaven.eu',
	author: 'kalle, Link, KyuGG',

	updateURL: SCRIPT_URL,
	downloadURL: SCRIPT_URL,

	require: [
		isWatchMode ? LOCAL_FILE : '',
		'https://cdnjs.cloudflare.com/ajax/libs/chartist/0.11.4/chartist.min.js',
	].filter(link => !!link),

	match: 'https://surfheaven.eu/*',
	icon: 'https://www.google.com/s2/favicons?domain=surfheaven.eu',
	connect: ['raw.githubusercontent.com', 'surfheaven.eu', 'iloveur.mom'],
	grant: ['GM_xmlhttpRequest', 'GM_addStyle', 'GM.getValue', 'GM.setValue', 'GM_info'],
	license: 'MIT',
}
export default metadata
