const express = require("express")
const fs = require("fs")
const path = require("path")
const router = express.Router()

const logFilePath = path.join(__dirname, "../log.txt")

// 日志级别枚举
const logLevels = {
    INFO: "INFO",
    WARN: "WARN",
    ERROR: "ERROR"
}

// 最大日志条数（超过此数量时清理旧日志）
// const MAX_LOG_LINES = 1000

// 格式化日期为：yyyy/MM/dd HH:mm:ss
function formatDate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    const seconds = String(date.getSeconds()).padStart(2, "0")

    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`
}

// 获取日志文件的行数
function getLogLineCount(callback) {
    fs.readFile(logFilePath, "utf8", (err, data) => {
        if (err) {
            callback(err, 0)
        } else {
            const lines = data.split("\n").length - 1 // 计算行数（减去最后一个空行）
            callback(null, lines)
        }
    })
}

// 性能问题，不能一边清理一边记录日志，后续优化日志模块吧
// 清理旧日志，保留最新的日志条目
// function cleanOldLogs(callback) {
//     fs.readFile(logFilePath, "utf8", (err, data) => {
//         if (err) {
//             return callback(err)
//         }

//         const lines = data.split("\n")

//         // 保留最新的 MAX_LOG_LINES 条日志
//         if (lines.length > MAX_LOG_LINES) {
//             const newData = lines.slice(lines.length - MAX_LOG_LINES).join("\n")
//             fs.writeFile(logFilePath, newData, callback)
//         } else {
//             callback()
//         }
//     })
// }

// 记录日志到文件
function logToFile(message, level = logLevels.INFO) {
    const timestamp = formatDate(new Date())
    const logMessage = `[${level}] [${timestamp}] ${message}\n`

    // // 在记录日志之前，检查并清理旧日志
    // cleanOldLogs((err) => {
    //     if (err) {
    //         console.error("清理旧日志失败:", err)
    //     }

    //     // 追加新的日志条目
    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
            console.error("写入日志失败:", err)
        }
    })
    // })
}

// 获取日志
router.get("/", (req, res) => {
    fs.readFile(logFilePath, "utf8", (err, data) => {
        if (err) {
            res.status(500).send("读取日志失败")
        } else {
            res.send(data)
        }
    })
})

// 下载日志
router.get("/download", (req, res) => {
    const filePath = path.join(__dirname, "../log.txt")
    const fileName = "log.txt"  // 设置下载的文件名

    res.setHeader("Content-Disposition", `attachment filename="${fileName}"`)
    res.setHeader("Content-Type", "application/octet-stream")

    fs.createReadStream(filePath).pipe(res)
})

// 示例：记录日志
logToFile("程序启动", logLevels.INFO)

module.exports = { logToFile, logLevels, router }
