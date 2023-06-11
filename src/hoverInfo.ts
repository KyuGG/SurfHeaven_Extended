import { PlayerInfo } from './types/player.interface'
import { create_flag, format_date, make_request } from './main'
import SurfMap from './types/map.interface'
import { GROUP_COLORS, GROUP_NAMES } from './constants'

export default function hoverInfo(isHoverInfo: boolean) {
	if (!isHoverInfo) return

	const hoverDiv = document.createElement('div')
	hoverDiv.id = 'hover-div'
	document.body.appendChild(hoverDiv)

	const hoverLength = 400 // ms to wait before showing hover info, cumulative with api response time

	function fade_in(element: Element) {
		element.classList.add('show')
	}
	function fade_out(element: Element) {
		element.classList.remove('show')
	}

	document.addEventListener('mouseover', evt => {
		const target = evt.target as HTMLLinkElement

		if (
			!(
				target.tagName === 'A' &&
				!target.href.includes('#') &&
				target?.parentElement?.tagName !== 'LI'
			)
		)
			return

		const hoverTimeout = setTimeout(() => {
			if (target.href.includes('player')) {
				const steamid = target.href.split('/')[4]
				make_request(
					`https://api.surfheaven.eu/api/playerinfo/${steamid}`,
					(playerInfo: PlayerInfo) => displayPlayerInfo(playerInfo, target)
				)
			} else if (target.href.includes('map')) {
				const mapName = target.href.split('/')[4]
				make_request(
					`https://api.surfheaven.eu/api/mapinfo/${mapName}`,
					([map]: [SurfMap]) => displayMapInfo(map, target)
				)
			}
		}, hoverLength)

		document.addEventListener('mouseout', evt => {
			const target = evt.target as HTMLElement

			if (target.tagName === 'A') clearTimeout(hoverTimeout)

			fade_out(hoverDiv)
		})
	})

	function displayPlayerInfo(playerInfo: PlayerInfo, target: HTMLLinkElement) {
		let left_offset = 10
		hoverDiv.style.top = target.getBoundingClientRect().top + Math.floor(window.scrollY) + 'px'
		hoverDiv.style.left = target.getBoundingClientRect().right + left_offset + 'px'
		hoverDiv.style.paddingTop = '0px'
		hoverDiv.style.paddingBottom = '0px'
		hoverDiv.textContent = 'Loading...'
		hoverDiv.style.zIndex = '99999'
		fade_in(hoverDiv)

		hoverDiv.style.backgroundColor = 'rgba(13,17,23,0.6)'
		hoverDiv.style.backgroundImage = 'none'
		hoverDiv.innerHTML = `<div class="row">
        <div class="col-sm-5">
            <h5>Rank</h5>
            <h5>Points</h5>
            <h5>Playtime</h5>
            <h5>Last seen</h5>
        </div>
        <div class="col-sm-7">
            <h5>#${playerInfo.rank} (${create_flag(playerInfo.country_code)} #${
			playerInfo.country_rank
		})</h5>
            <h5>${formatPoints(playerInfo.points)} [${
			(playerInfo.rankname === 'Custom'
				? '#' + playerInfo.rank
				: '<span style="color:' +
				  GROUP_COLORS[GROUP_NAMES.indexOf(playerInfo.rankname)] +
				  ';">' +
				  playerInfo.rankname) + '</span>'
		}]</h5>
            <h5>${formatTime(playerInfo.playtime)}h</h5>
            <h5>${format_date(playerInfo.lastplay)}</h5>
        </div>
    </div>
    `

		hoverDiv.style.top =
			target.getBoundingClientRect().top +
			Math.floor(window.scrollY) -
			hoverDiv.getBoundingClientRect().height / 2 +
			target.getBoundingClientRect().height / 2 +
			'px'
	}

	function displayMapInfo(map: SurfMap, target: HTMLLinkElement) {
		let left_offset = 10
		hoverDiv.style.top = target.getBoundingClientRect().top + Math.floor(window.scrollY) + 'px'
		hoverDiv.style.left = target.getBoundingClientRect().right + left_offset + 'px'
		hoverDiv.style.paddingTop = '0px'
		hoverDiv.style.paddingBottom = '0px'
		hoverDiv.textContent = 'Loading...'
		hoverDiv.style.zIndex = '99999'
		fade_in(hoverDiv)

		const img = new Image()
		img.src = `https://github.com/Sayt123/SurfMapPics/raw/Maps-and-bonuses/csgo/${map.map}.jpg`

		img.onload = function () {
			hoverDiv.style.backgroundImage = `url(${img.src})`
			hoverDiv.style.backgroundSize = 'cover'
			hoverDiv.style.backgroundPosition = 'center'

			hoverDiv.innerHTML = `
            <div class="row outlined text-center" style="min-width: 18vw; min-height: 18vh;">
                <h5>T${map.tier} ${map.type == 0 ? ' linear' : ' staged'} by ${map.author}</h5>
                <!--<h5>Added ${format_date(map.date_added)} / ${
				map.completions
			} completions</h5>-->
            </div>
        `
			hoverDiv.style.top =
				target.getBoundingClientRect().top +
				Math.floor(window.scrollY) -
				hoverDiv.getBoundingClientRect().height / 2 +
				'px'
		}

		img.onerror = function () {
			hoverDiv.style.backgroundColor = 'rgba(13,17,23,0.6)'
			hoverDiv.style.backgroundImage = 'none'
			hoverDiv.innerHTML = `<div class="row">
            <div class="col-sm-4">
                <h5>Type</h5>
                <h5>Author</h5>
                <h5>Added</h5>
                <h5>Finishes</h5>
            </div>
            <div class="col-sm-8">
                <h5>T${map.tier} ${map.type == 0 ? ' linear' : ' staged'}</h5>
                <h5>${map.author}</h5>
                <h5>${format_date(map.date_added)}</h5>
                <h5>${map.completions}</h5>
            </div>
        </div>`
		}

		hoverDiv.style.backgroundImage = 'none'
		hoverDiv.innerHTML = `<div class="row">
        <h5>Loading...</h5>
        </div>`
	}
}

function formatPoints(points: number) {
	// 4300 -> 4.3k
	if (points < 1000) return points
	else return Math.floor(points / 1000) + '.' + Math.floor((points % 1000) / 100) + 'k'
}

function formatTime(time: number) {
	return Math.floor(time / 3600) + '.' + Math.floor((time % 3600) / 60)
}
