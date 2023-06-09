export default interface OnlinePlayer {
	map: string
	name: string
	region: Region
	server: number
	steamid: string
}

export enum Region {
	EU = 'EU',
	AU = 'AU',
}
