const selectElement = document.getElementById("targetFolder")

async function getConfigTargetPath() {
    const res = await fetch("/config/get")
    const config = await res.json()
    selectElement.innerHTML = `<option value="${config.targetPath}">${adjustSlashes(config.targetPath)}</option>`
    selectElement.value = config.targetPath
    fetchSubPaths()
}
getConfigTargetPath()

// 根据选择更新路径并获取下一级路径
async function fetchSubPaths() {
    const res = await fetch("/config/get")
    const config = await res.json()
    if (selectElement.value !== config.targetPath) {
        await webSocketclient.send(JSON.stringify({ action: "stopSync" }))
        fetch("/config/editTargetPath", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ targetPath: selectElement.value }),
        })
    }
    fetch(`/path/getSubPaths?path=${selectElement.value}`)
        .then(response => response.json())
        .then(options => {
            selectElement.innerHTML = renderTargetPathSelect(options)
        })
}

async function updateConfigTargetPath() {
    const res = await fetch("/config/get")
    const config = await res.json()
    if (config.targetPath !== selectElement.value) {
        selectElement.innerHTML = `<option value="${config.targetPath}">${adjustSlashes(config.targetPath)}</option>`
        selectElement.value = config.targetPath
    }
    fetchSubPaths()
}

// 生成 `<option>` 元素的 HTML
function renderTargetPathSelect(options) {
    let html = ""
    html += `<option value="${selectElement.value}">${adjustSlashes(selectElement.value)}</option>`
    if (selectElement.value != "" && selectElement.value != "/") {
        html += `<option value="${removeLastPart(selectElement.value)}">${adjustSlashes(removeLastPart(selectElement.value))}</option>`
    }
    options.forEach(option => {
        html += `<option value="/${option.path}">${option.path}/</option>`
    })
    return html
}