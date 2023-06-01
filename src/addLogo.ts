
/**
 * @returns true if successfully added surfheaven extended logo
 */
export default function addLogo() {
	const logo = document.querySelector('.navbar-brand')

	if (!logo) return false

	const logo_text = document.createElement('div')
	logo_text.id = 'logo_text'
	logo_text.innerHTML =
		"<a style='color:#FFFFFF;' href='https://github.com/Kalekki/SurfHeaven_Extended' target='_blank'>Extended</a>"
	logo_text.style.position = 'absolute'
	logo_text.style.bottom = '0px'
	logo_text.style.fontSize = '10px'
	logo_text.style.color = '#FFFFFF'
	logo_text.style.padding = '0px 0px'
	logo_text.style.zIndex = '100'
	logo_text.style.bottom = '5px'
	logo_text.style.left = '95px'
	logo.appendChild(logo_text)

	return true
}
