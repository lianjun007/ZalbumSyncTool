const fs = require("fs")
const path = require("path")
const sqlite3 = require("sqlite3").verbose()

// 链接数据库
const zalbumDBPath = "/zspace/zspace/zsrp/zalbum/zalbumv2.db"
if (!fs.existsSync(zalbumDBPath)) {
    console.error(`数据库文件不存在: ${zalbumDBPath}`)
    return
}
const zalbumDB = new sqlite3.Database(zalbumDBPath, (err) => {
    if (err) { console.error(`无法连接到数据库: ${err.message}`) }
})

// 获取极相册所有挂载的路径
// isZspace 参数代表查询后输出内容是否为 zspace 路径
// 为 false 直接查询出来的是 /tmp/zfsv3/nvme13，为 true 则是 /zspace/data_nvme003 这样的
function getZalbumAllMountPath(isZspace = true) {
    return new Promise((resolve, reject) => {
        const query = `SELECT path, user_id FROM dirs WHERE is_del = 0`
        zalbumDB.all(query, [], (err, rows) => {
            if (err) {
                console.error(`数据库查询错误: ${err.message}`)
                reject(new Error(`数据库查询错误: ${err.message}`))
            } else {
                if (isZspace) {
                    const newRows = rows.map((row) => {
                        return { ...row, path: tempToZspace(row.path) }
                    })
                    resolve(newRows)
                } else {
                    resolve(rows)
                }
            }
        })
    })
}

// 获取 HEIC 文件对应的 MOV 文件路径
function getZalbumMovPath(sourceFilePath) {
    return new Promise((resolve, reject) => {
        const query = `SELECT ext FROM feeds WHERE path = ?`
        const sourceFileZalbumPath = zspaceTotmp(sourceFilePath)

        zalbumDB.get(query, sourceFileZalbumPath, (err, row) => {
            if (err) {
                console.error(`数据库查询错误: ${err.message}`)
                reject(err)
                return
            }
            if (row && row.ext && row.ext.includes(".mov@")) {
                const extList = row.ext.split("@")
                const diskInfo = extList[0].split("%23")[0]
                const diskPrefix = diskInfo.match(/^[a-zA-Z]+/)[0]
                const diskSuffix = diskInfo.match(/\d+$/)[0]
                const adjustedDiskSuffix = (Number(diskSuffix) - 10).toString().padStart(3, "0")
                const diskName = `/data_${diskPrefix[0]}${adjustedDiskSuffix}`
                const movFileName = extList[extList.length - 2]
                const subFolder = movFileName.slice(0, 2)
                const movFilePath = path.join("/zspace", diskName, "/data/udata/real/.internal/AppleLivePhotoVideo", subFolder, movFileName)

                resolve(movFilePath)
            } else {
                resolve(null)
            }
        })
    })
}

// zspace 路径转换为 tmp 路径
function zspaceTotmp(path) {
    const regex = /\/zspace\/data_([ns])(\d{3})\/data\/udata\/real\/(\w+)\/(.*)/

    return path.replace(regex, (_, prefixChar, num, phone, rest) => {
        const prefix = prefixChar === "s" ? "sata" : "nvme"
        const newNum = parseInt(num, 10) + 10
        return `/tmp/zfsv3/${prefix}${newNum}/${phone}/data/${rest}`
    })
}

// tmp 路径转换为 zspace 路径
function tempToZspace(path) {
    const regex = /\/tmp\/zfsv3\/([a-z]+)(\d{2})\/(\d{11}[a-zA-Z]*)\/data\/(.*)/

    return path.replace(regex, (_, prefix, num, phone, rest) => {
        const newNum = (parseInt(num, 10) - 10).toString().padStart(3, "0")

        return `/zspace/data_${prefix.charAt(0)}${newNum}/data/udata/real/${phone}/${rest}`
    })
}

module.exports = { getZalbumAllMountPath, getZalbumMovPath, zspaceTotmp }