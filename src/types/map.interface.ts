/**
 * @param type (o - linear, 1 - staged)
 * @param date_added (date iso string)
 * @param bigmap (always 0, idk what is this)
 */
export default interface SurfMap {
	map: string
	type: number
	date_added: string
	times_played: number
	checkpoints: number
	tier: number
	bonus: number
	author: string
	completions: number
	bigmap: 0
}
