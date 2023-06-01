import Settings from './types/settings.interface'

/**
 * @returns extension settings if they exist; otherwise, returns default settings
 */
export default function loadSettings() {
	// SETTINGS

	const stringSettings = unsafeWindow.localStorage.getItem('settings')

	// return default settings
	if (!stringSettings) return loadDefaultSettings()

	const settings: Partial<Settings> = JSON.parse(stringSettings)
	return validate_settings(settings)
}

/**
 * @returns default extension settings
 */
function loadDefaultSettings() {
	unsafeWindow.localStorage.setItem('settings', JSON.stringify(defaultSettings))
	return defaultSettings
}

/**
 * @returns settings with added missing properties to settings
 */
function validate_settings(settings: Partial<Settings>): Settings {
	return Object.assign(defaultSettings, settings)
}

export const settings_labels = {
	flags: 'Country flags',
	follow_list: 'Follow list',
	update_check: 'Automatic update check',
	cp_chart: 'Checkpoint chart',
	steam_avatar: 'Show Steam avatar',
	completions_by_tier: 'Completions by tier',
	country_top_100: 'Country top 100 table',
	hover_info: 'Player/map info on hover',
	map_cover_image: 'Map cover image',
	points_per_rank: 'Show points per rank',
	completions_bar_chart: 'Show completions as bar chart',
	toasts: 'Show debug toasts',
	user_ratings_table: 'Show user rated maps',
	user_ratings: 'Show user ratings',
	user_effects: 'Show user effects',
}

export const settings_categories = {
	Global: ['flags', 'follow_list', 'hover_info', 'update_check', 'toasts', 'user_effects'],
	Dashboard: ['country_top_100', 'user_ratings_table'],
	'Map page': ['cp_chart', 'points_per_rank', 'map_cover_image', 'user_ratings'],
	Profile: ['steam_avatar', 'completions_by_tier', 'completions_bar_chart'],
}

const defaultSettings: Settings = {
	flags: true,
	follow_list: true,
	update_check: true,
	cp_chart: true,
	steam_avatar: true,
	completions_by_tier: true,
	country_top_100: true,
	hover_info: true,
	map_cover_image: true,
	points_per_rank: true,
	completions_bar_chart: true,
	toasts: false,
	user_ratings_table: true,
	user_ratings: true,
	user_effects: true,
}
