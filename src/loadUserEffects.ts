/**
 * loads css classes from localStorage or api
 * @returns userEffects object
 */
export default async function loadUserEffects() {
	let user_effects: UserEffects = JSON.parse(
		unsafeWindow.localStorage.getItem('user_effects') || '{}'
	)

	const isUpdated = await updateUserEffects()
	if (isUpdated)
		user_effects = JSON.parse(unsafeWindow.localStorage.getItem('user_effects') as string)

	for (let user in user_effects) {
		if (user_effects != null && user_effects[user] != null) {
			if (user_effects[user].startsWith('candycane-custom')) {
				create_custom_candycane_style(user_effects[user])
			}
		}
	}

	return user_effects
}

function create_custom_candycane_style(style_name: string) {
	let colors = style_name.split('-').slice(2)
	if (colors.length == 1) {
		// single color
		//console.log(`Creating custom style: ${colors[0]}`);
		GM_addStyle(`.candycane-custom-${colors[0]} {
                color: ${colors[0]};
            }`)
		return
	}
	let cssColors = colors
		.map((color, index) => {
			if (index === 0) {
				return `${color}, ${color} 10px,`
			} else if (index === colors.length - 1) {
				return `${color} ${index * 10}px, ${color} ${(index + 1) * 10}px`
			}
			return `${color} ${index * 10}px, ${color} ${(index + 1) * 10}px,`
		})
		.join(' ')

	GM_addStyle(`.candycane-custom-${colors.join('-')} {
          background: repeating-linear-gradient(45deg, ${cssColors});
          background-size: 1600%;
          color: transparent;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          -webkit-animation: 40s linear 0s infinite move;
          animation: 40s linear 0s infinite move;
          font-weight: bold;
        }`)
}

/**
 * @returns true if updated, false if update is not needed or got fetch error
 */
async function updateUserEffects() {
	const USER_EFFECTS_URL = 'https://iloveur.mom/surfheaven/user_effects.json'

	const last_updated_effects = unsafeWindow.localStorage.getItem('user_effects_last_updated')
	const MIN5 = 1000 * 60 * 5

	const now = Date.now()
	if (!last_updated_effects || now - Number(last_updated_effects) > MIN5) {
		console.log('Updating user_effects.json')
		unsafeWindow.localStorage.setItem('user_effects_last_updated', String(now))
		const data: UserEffects = await fetch(USER_EFFECTS_URL, {
			cache: 'no-cache',
		})
			.then(response => response.json())
			.catch(e => {
				console.log(e)
				return false
			})

		console.log('Updated user_effects.json')
		unsafeWindow.localStorage.setItem('user_effects', JSON.stringify(data))

		return true
	}

	return false
}

type UserEffects = Record<string, string>
