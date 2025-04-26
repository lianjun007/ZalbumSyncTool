const zalbumFolderNumberButton = document.getElementById("zalbumFolderNumberButton")
const zalbumPathShowList = document.getElementById("zalbumPathShowList")

let zalbumPathNumber = 0
document.getElementById("zalbumFolderSetting").addEventListener("click", function () {
    // 点击按钮切换旋转状态，并且展示路径列表
    const icon = this.querySelector(".listRowEndButtonImage")
    icon.classList.toggle("listRowEndButtonImageRotate")

    if (zalbumPathShowList.style.display === "none" || zalbumPathShowList.style.display === "") {
        getZalbumMountPath(true, false)
    } else {
        getZalbumMountPath(false, false)
    }
})

getZalbumMountPath(false, true)

async function getZalbumMountPath(para, start) {
    if (para) {
        await fetchPath()
        zalbumPathShowList.style.display = "block"
        zalbumFolderNumberButton.firstChild.textContent = ""
    } else {
        if (start) {
            await fetchPath()
        }

        zalbumPathShowList.style.display = "none"
        zalbumFolderNumberButton.firstChild.textContent = zalbumPathNumber
    }
}

async function fetchPath() {
    await fetch("/path/getZalbumAllPath")
        .then(response => response.json())
        .then(data => {
            zalbumPathShowList.innerHTML = ""
            zalbumPathNumber = data.length

            data.forEach((item, index) => {
                const divRow = document.createElement("div")
                divRow.classList.add("listRow")

                if (index == 0) {
                    const divRow1 = document.createElement("div")
                    divRow1.classList.add("listRow")
                    divRow1.innerHTML = `
                        <p class="text" style="width: 200px;">用户 ID</p>
                        <p class="text" style="width: 100%; text-align: right;">地址</p>
                        `
                    zalbumPathShowList.appendChild(divRow1)
                }

                if (index == data.length - 1) {
                    divRow.innerHTML = `
                        <p class="subRightText" style="width: 200px;">${item.user_id}</p>
                        <p class="subRightText zalbumMountPath">${adjustSlashes(item.path)}</p>
                        `
                    zalbumPathShowList.appendChild(divRow)
                    const hr = document.createElement("hr")
                    hr.style.marginTop = "14px"
                    zalbumPathShowList.appendChild(hr)
                } else {
                    divRow.innerHTML = `
                        <p class="subRightText" style="width: 200px;">${item.user_id}</p>
                        <p class="subRightText zalbumMountPath">${adjustSlashes(item.path)}</p>
                        `
                    zalbumPathShowList.appendChild(divRow)
                }
            })
        })
        .catch(error => {
            console.error("请求数据失败:", error)
        })
}