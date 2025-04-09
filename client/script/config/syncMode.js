const syncModeSelect = document.getElementById("syncModeSelect")
async function getConfigSyncMode() {
    const res = await fetch("/config/get")
    const config = await res.json()
    syncModeSelect.value = config.syncMode
}
getConfigSyncMode()

async function editSyncMode() {
    webSocketclient.send(JSON.stringify({ action: "stopSync" }))
    fetch("/config/editSyncMode", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ syncMode: syncModeSelect.value }),
    })
}