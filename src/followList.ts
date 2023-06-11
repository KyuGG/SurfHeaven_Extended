import { AU_SERVERS } from './constants'
import { format_date, insert_flags_to_profiles, make_request, show_overlay_window } from './main'
import { OnlinePlayer, PlayerInfo, Region } from './types/player.interface'

export default function followList(isFollowList: boolean) {
	if (!isFollowList) {
		insert_flags_to_profiles()
		return
	}

	const sidebar_div = document.querySelector('.navigation')!
	const follow_list_root_div = document.createElement('div')
	const follow_list_row_div = document.createElement('div')
	const follow_list_panel_div = document.createElement('div')
	const follow_list_panel_body_div = document.createElement('div')
	const follow_h5 = document.createElement('h5')

	follow_h5.className = 'text-center'
	follow_h5.innerHTML = "<a href='#' style='color:white;'>FOLLOWED PLAYERS</a>"
	follow_h5.addEventListener('click', follow_list_manager)
	follow_h5.classList.add('text-white')
	follow_list_root_div.className = 'row-recentactivity'
	follow_list_row_div.className = 'col-sm-12'
	follow_list_panel_div.className = 'panel panel-filled'
	follow_list_panel_body_div.className = 'panel-body'
	follow_list_panel_body_div.id = 'follow_list'
	follow_list_panel_body_div.style.padding = '5px'

	follow_list_root_div.appendChild(follow_list_row_div)
	follow_list_row_div.appendChild(follow_list_panel_div)
	follow_list_panel_div.appendChild(follow_list_panel_body_div)

	make_request('https://api.surfheaven.eu/api/online/', (onlinePlayers: OnlinePlayer[]) => {
		const follow_list = get_follow_list()
		const followed_players: OnlinePlayer[] = []
		let friends_online = false

		onlinePlayers.forEach(player => {
			if (follow_list.includes(player.steamid)) {
				followed_players.push(player)
				friends_online = true
			}
		})

		if (!friends_online) {
			let follow_list_item = document.createElement('h5')
			follow_list_item.innerHTML = 'No friends online :('
			follow_list_panel_body_div.appendChild(follow_list_item)
		}

		followed_players.sort((player1, player2) => player1.server - player2.server)

		followed_players.forEach(player => {
			let follow_list_item = document.createElement('h5')
			if (player.region === Region.AU) {
				follow_list_item.innerHTML = `<a href="https://surfheaven.eu/player/${
					player.steamid
				}">${player.name}</a> in <a href="steam://connect/${
					AU_SERVERS[player.server]
				}" title="${player.map}" style="color:rgb(0,255,0)">#${player.server - 13} (AU)</a>`
			} else
				follow_list_item.innerHTML = `<a href="https://surfheaven.eu/player/${player.steamid}">${player.name}</a> in <a href="steam://connect/surf${player.server}.surfheaven.eu" title="${player.map}" style="color:rgb(0,255,0)">#${player.server}</a>`

			follow_list_panel_body_div.appendChild(follow_list_item)
		})

		if (follow_list != null && follow_list[0] != '') {
			sidebar_div.insertBefore(follow_list_root_div, sidebar_div.firstChild)
			sidebar_div.insertBefore(follow_h5, sidebar_div.firstChild)
		}
		insert_flags_to_profiles() // needed to be called again to get the flags on the follow list
	})

	// refresh follow list
	const MIN1 = 60 * 1000
	setInterval(refresh_follow_list, MIN1)
}

function follow_list_manager() {
	let follow_list = get_follow_list()
	const follow_list_root = document.createElement('div')
	follow_list_root.style.overflowY = 'scroll'
	follow_list_root.style.maxHeight = '600px'

	for (let i = 0; i < follow_list.length; i++) {
		make_request(
			`https://api.surfheaven.eu/api/playerinfo/${follow_list[i]}`,
			([player]: [PlayerInfo]) => {
				let follow_list_item = document.createElement('div')
				follow_list_item.style.whiteSpace = 'nowrap'
				follow_list_item.style.overflow = 'hidden'
				follow_list_item.style.textOverflow = 'ellipsis'

				// let name = data[0].name
				// let last_online = data[0].lastplay

				const profile_link = document.createElement('a')
				profile_link.href = `https://surfheaven.eu/player/${follow_list[i]}`
				profile_link.innerHTML = player.name || follow_list[i]
				profile_link.style.width = '220px'
				profile_link.style.float = 'left'
				const last_online_span = document.createElement('span')
				last_online_span.style.float = 'right'
				last_online_span.innerHTML = `Last play ${format_date(player.lastplay)} `
				last_online_span.setAttribute('data-last-online', player.lastplay) // for sorting

				const unfollow_button = document.createElement('button')
				unfollow_button.className = 'btn btn-danger btn-xs float-right'
				unfollow_button.style.marginTop = '1px'
				unfollow_button.style.marginLeft = '1rem'
				unfollow_button.style.marginRight = '0.5rem'
				unfollow_button.style.marginBottom = '1px'
				unfollow_button.innerHTML = 'Unfollow'
				unfollow_button.onclick = () => {
					follow_list_root.removeChild(follow_list_item)
					follow_user(follow_list[i])
				}

				follow_list_item.appendChild(profile_link)
				last_online_span.appendChild(unfollow_button)
				follow_list_item.appendChild(last_online_span)
				follow_list_root.appendChild(follow_list_item)

				insert_flags_to_profiles()
				if (follow_list_root.querySelectorAll('div').length === follow_list.length) {
					let follow_list_items = follow_list_root.children
					let follow_list_items_array = []
					for (let j = 0; j < follow_list_items.length; j++) {
						follow_list_items_array.push(follow_list_items[j])
					}
					follow_list_items_array.sort((a, b) => {
						let a_last_online = a
							.querySelector('span')!
							.getAttribute('data-last-online') as string
						let b_last_online = b
							.querySelector('span')!
							.getAttribute('data-last-online') as string
						return new Date(b_last_online).getTime() - new Date(a_last_online).getTime()
					})
					while (follow_list_root.firstChild) {
						follow_list_root.removeChild(follow_list_root.firstChild)
					}
					follow_list_items_array.forEach((item, index) => {
						follow_list_root.appendChild(item)
						if (index % 2 === 0) {
							;(item as HTMLElement).style.backgroundColor = '#19202B'
						}
					})
					insert_flags_to_profiles()
				}
			}
		)
	}
	show_overlay_window('Followed players', follow_list_root)
}

function refresh_follow_list() {
	console.log('Refreshing follow list')
	let follow_list = get_follow_list()
	let follow_list_panel_body_div = document.querySelector(
		'div.row-recentactivity:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)'
	)!
	if (follow_list != null && follow_list[0] != '') {
		make_request('https://api.surfheaven.eu/api/online/', (onlinePlayers: OnlinePlayer[]) => {
			let friends_online = false

			onlinePlayers.forEach(player => {
				if (follow_list.includes(player.steamid)) {
					friends_online = true
				}
			})

			onlinePlayers.sort((player1, player2) => player1.server - player2.server)

			if (friends_online) {
				follow_list_panel_body_div.innerHTML = ''
				onlinePlayers.forEach(player => {
					if (follow_list.includes(player.steamid)) {
						let follow_list_item = document.createElement('h5')
						if (player.region === 'AU') {
							follow_list_item.innerHTML = `<a href="https://surfheaven.eu/player/${
								player.steamid
							}">${player.name}</a> in <a href="steam://connect/${
								AU_SERVERS[player.server]
							}" title="${player.map}" style="color:rgb(0,255,0)">#${
								player.server - 13
							} (AU)</a>`
						} else {
							follow_list_item.innerHTML = `<a href="https://surfheaven.eu/player/${player.steamid}">${player.name}</a> in <a href="steam://connect/surf${player.server}.surfheaven.eu" title="${player.map}" style="color:rgb(0,255,0)">#${player.server}</a>`
						}
						follow_list_panel_body_div.appendChild(follow_list_item)
					}
				})
				insert_flags_to_profiles()
			} else {
				follow_list_panel_body_div.innerHTML = ''
				let follow_list_item = document.createElement('h5')
				follow_list_item.innerHTML = 'No friends online :('
				follow_list_panel_body_div.appendChild(follow_list_item)
			}
		})
	}
}

export function get_follow_list() {
	let follow_list = unsafeWindow.localStorage.getItem('follow_list')
	if (follow_list === null) {
		return []
	} else {
		follow_list = follow_list.slice(0, -1)
		return follow_list.split(',')
	}
}

export function follow_user(id: string) {
	let follow_list = unsafeWindow.localStorage.getItem('follow_list')
	if (follow_list === null) {
		unsafeWindow.localStorage.setItem('follow_list', id + ',')
	} else {
		if (follow_list.includes(id)) {
			console.log('Unfollowing user ' + id)
			follow_list = follow_list.replace(id + ',', '')
		} else {
			console.log('Following user ' + id)
			follow_list += id + ','
		}
		unsafeWindow.localStorage.setItem('follow_list', follow_list)
	}
	refresh_follow_list()
}
