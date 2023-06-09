/**
 * checking extension updates if more than 5 minutes have passed
 */
export default function checkUpdates(isCheckingUpdate: boolean) {
	if (!isCheckingUpdate) return

	const updateLastChecked = unsafeWindow.localStorage.getItem('update_last_checked')
	const MIN5 = 1000 * 60 * 5
	const now = Date.now()

	if (!updateLastChecked) unsafeWindow.localStorage.setItem('update_last_checked', String(now))

	if (now - Number(updateLastChecked) > MIN5) {
		unsafeWindow.localStorage.setItem('update_last_checked', String(now))
		fetchUpdate()
	}
}

function fetchUpdate() {
	const VERSION = GM_info.script.version
	GM_xmlhttpRequest({
		method: 'GET',
		url: 'https://raw.githubusercontent.com/Kalekki/SurfHeaven_Extended/main/changelog.txt',
		onload: response => {
			if (response.status != 200) throw new Error('cannot download update')
			const latest_version = response.responseText.split('___')[1]
			console.log('Current version: ' + VERSION + ' | Latest version: ' + latest_version)
			if (latest_version != VERSION) {
				let update_url =
					'https://github.com/Kalekki/SurfHeaven_Extended/raw/main/sh.user.js'
				let modal = document.createElement('div')
				modal.innerHTML = `
                <div class="modal fade" id="update_modal" tabindex="-1" role="dialog" style="display: flex; z-index:99999">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-body" style="padding: 1rem;">
                            <h5 class="modal-title" style="margin-bottom:1rem;">SH Extended update available!</h5>
                            <p>Version <span style="color:salmon;">${VERSION}</span> -> <span style="color: lightgreen">${latest_version}</span</p>
                            <p style="color:white;">What's new:</p>
                            <textarea readonly style="width:100%;height:80px; background-color:#21242a; color:white;">${
								response.responseText.split('___')[2]
							}</textarea>
                        </div>
                        <div class="modal-footer" style="padding:7px;">
                            <small style="text-align: left;">You can disable this message in the settings.</small>
                            <button type="button" class="btn btn-secondary btn-danger" data-dismiss="modal">Close</button>
                            <a href="${update_url}" target="_blank" onclick="$('#update_modal').modal('hide');" class="btn btn-primary btn-success">Update</a>
                        </div>
                    </div>
                </div>
            </div>
                `
				document.body.appendChild(modal)
				$('#update_modal').modal('show')
			}
		},
	})
}
