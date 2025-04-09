// 极相册文件夹
const folderCount = document.getElementById("folderCount")
const matchingFileCount = document.getElementById("matchingFileCount")
const nonMatchingFileCount = document.getElementById("nonMatchingFileCount")
const zalbumMovFileCount = document.getElementById("zalbumMovFileCount")
const totalSize = document.getElementById("totalSize")

// 目标文件夹
const folderCount2 = document.getElementById("folderCount2")
const matchingFileCount2 = document.getElementById("matchingFileCount2")
const nonMatchingFileCount2 = document.getElementById("nonMatchingFileCount2")
const zalbumMovFileCount2 = document.getElementById("zalbumMovFileCount2")
const totalSize2 = document.getElementById("totalSize2")

const allSize = document.getElementById("allSize")

async function getFileCount() {
    await fetch("/statistics")
        .then(response => response.json())
        .then(data => {
            folderCount.firstChild.textContent = data.folderCount
            matchingFileCount.firstChild.textContent = data.matchingFileCount
            nonMatchingFileCount.firstChild.textContent = data.nonMatchingFileCount
            zalbumMovFileCount.firstChild.textContent = data.zalbumMovFileCount
            totalSize.firstChild.textContent = `${convertToGB(data.totalSize)} GB`

            folderCount2.firstChild.textContent = data.folderCount2
            matchingFileCount2.firstChild.textContent = data.matchingFileCount2
            nonMatchingFileCount2.firstChild.textContent = data.nonMatchingFileCount2
            zalbumMovFileCount2.firstChild.textContent = data.zalbumMovFileCount2
            totalSize2.firstChild.textContent = `${convertToGB(data.totalSize2)} GB`

            allSize.firstChild.textContent = `${convertToGB(data.allSize)} GB`
        })
}

function convertToGB(bytes) {
    return (bytes / 1073741824).toFixed(2)  // 1073741824 是 1024^3
}

getFileCount()
setInterval(getFileCount, 1000 * 15)