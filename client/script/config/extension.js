// 进入编辑模式
const editExtensionButton = document.getElementById("editExtensionButton")
const confirmEditExtensionButton = document.getElementById("confirmEditExtensionButton")
const cancelEditExtensionButton = document.getElementById("cancelEditExtensionButton")
const inputExtensionModule = document.getElementById("inputExtensionModule")
const inputExtensionModuleAboveHR = document.getElementById("inputExtensionModuleAboveHR")

editExtensionButton.addEventListener("click", () => {
    inputExtensionShowOrHide(true)
})

let deleteButtonDisplay = "none"
function inputExtensionShowOrHide(para) {
    confirmEditExtensionButton.style.display = para ? "flex" : "none"
    cancelEditExtensionButton.style.display = para ? "flex" : "none"
    inputExtensionModule.style.display = para ? "flex" : "none"
    inputExtensionModuleAboveHR.style.display = para ? "flex" : "none"
    editExtensionButton.style.display = para ? "none" : "flex"
    const extensionBoxDeleteButtones = document.querySelectorAll(".extensionBoxDeleteButton")
    extensionBoxDeleteButtones.forEach(button => {
        deleteButtonDisplay = para ? "block" : "none"
        button.style.display = deleteButtonDisplay
    })
}

// 渲染扩展名列表
const extensionShowList = document.getElementById("extensionShowList")
let extensions = []

async function getConfigExtensionList() {
    const res = await fetch("/config/get")
    const config = await res.json()
    extensions = [...config.extensions]
    renderExtensionShowList()
}
getConfigExtensionList()

function renderExtensionShowList() {
    if (extensions.length === 0) {
        extensionShowList.innerHTML = `<p class="subRightText" style="margin: 0">全文件同步</p>`
    } else {
        extensionShowList.innerHTML = extensions
            .map(ext => `
            <div class="extensionShowBox" data-ext="${ext}">
                <p style="font-size: 13px margin: 0px">${ext}</p>
                <button class="extensionBoxDeleteButton" style="display: ${deleteButtonDisplay}"></button>
            </div>`)
            .join("")
    }
}

// 添加、删除扩展名
const extensionInput = document.getElementById("extensionInput")
const addExtensionButton = document.getElementById("addExtensionButton")

addExtensionButton.addEventListener("click", () => {
    let extension = extensionInput.value.trim()
    extension = extension.toUpperCase()
    if (!extensions.includes(extension)) {
        extensions.push(extension)
        deleteButtonDisplay = "block"
        renderExtensionShowList()
        extensionInput.value = ""
    }
})

extensionShowList.addEventListener("click", (e) => {
    if (e.target.classList.contains("extensionBoxDeleteButton")) {
        let ext = e.target.parentElement.dataset.ext
        let index = extensions.indexOf(ext)
        if (index !== -1) {
            extensions.splice(index, 1)
        }
        deleteButtonDisplay = "block"
        renderExtensionShowList()
    }
})

// 确认、取消修改
confirmEditExtensionButton.addEventListener("click", async () => {
    await webSocketclient.send(JSON.stringify({ action: "stopSync" }))
    await fetch("/config/editExtension", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ extensions, webSocketclient: webSocketclient }),
    })
    deleteButtonDisplay = "none"
    inputExtensionShowOrHide(false)
})

cancelEditExtensionButton.addEventListener("click", () => {
    inputExtensionShowOrHide(false)
    deleteButtonDisplay = "none"
    getConfigExtensionList()
})
