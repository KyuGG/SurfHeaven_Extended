import { GroupName } from './../constants'
export interface Player {
	name: string
	steamid: string
}

/**
 * @param playtime (in seconds)
 * @param totalloc (in string seconds)
 * @param totalspec (in string seconds)
 * @param firstseen (date iso string)
 * @param lastplay (date iso string)
 * @param vip (0 or 1)
 */
export interface PlayerInfo extends Player {
	country_code: string
	country_rank: number
	country_ranktotal: number
	firstseen: string
	lastplay: string
	mapscompleted: number
	playtime: number
	points: number
	rank: number
	rankname: GroupName | 'Custom'
	totalloc: string
	totalspec: string
	vip: number
}

export interface OnlinePlayer {
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
