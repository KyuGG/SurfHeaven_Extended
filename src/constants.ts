export const GROUP_THRESHOLDS = [
	1, 2, 3, 10, 25, 50, 75, 100, 150, 250, 500, 750, 1000, 1500, 2000, 3000, 6000, 15000, 25000,
]

export const GROUP_NAMES = [
	'#1',
	'#2',
	'#3',
	'Master',
	'Elite',
	'Veteran',
	'Expert',
	'Pro',
	'TheSteve',
	'Hotshot',
	'Skilled',
	'Intermediate',
	'Casual',
	'Amateur',
	'Regular',
	'Potato',
	'Beginner',
	'Burrito',
	'Calzone',
	'New',
] as const

export type GroupName = typeof GROUP_NAMES[number];

export const GROUP_COLORS = [
	'gold',
	'gold',
	'gold',
	'#b57fe5',
	'red',
	'#d731eb',
	'#6297d1',
	'#6297d1',
	'#E94A4B',
	'#55ff4b',
	'#aef25d',
	'#ad8adc',
	'#ebe58d',
	'#b4c5d9',
	'#6297d1',
	'#dfa746',
	'#ccccd4',
	'#649ad8',
	'#ccccd4',
	'#FFFFFF',
]

export const AU_SERVERS: Record<number, string> = {
	14: '51.161.199.33:27015',
	15: '51.161.199.33:27016',
	16: '51.161.199.33:27017',
	17: '51.161.199.33:27018',
	18: '51.161.199.33:27019',
	19: '51.161.199.33:27020',
	20: '51.161.199.33:27021',
	21: '51.161.199.33:27022',
}
