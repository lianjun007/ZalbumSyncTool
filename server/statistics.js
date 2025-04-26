const express = require("express")
const fs = require("fs")
const path = require("path")
const router = express.Router()

const { readConfig } = require("./file")
const { getZalbumAllMountPath, getZalbumMovPath } = require("./zalbumPath")
const { getTargetStatistics } = require("./webSocket")

router.get("/", async (req, res) => {
    const data = await analyzeDirectories()
    res.json(data)
})

// 统计目录信息
async function analyzeDirectories() {
    const directories = await getZalbumAllMountPath()
    const config = readConfig()

    // 极相册路径
    let folderCount = 0
    let matchingFileCount = 0
    let nonMatchingFileCount = 0
    let zalbumMovFileCount = 0
    let totalSize = 0

    // 目标路径
    let folderCount2 = 0
    let matchingFileCount2 = 0
    let nonMatchingFileCount2 = 0
    let zalbumMovFileCount2 = 0
    let totalSize2 = 0

    let allSize = 0

    const visitedInodes = new Set()

    for (const dirPath of directories.map(item => item.path)) {
        if (!fs.existsSync(dirPath)) {
            console.error(`路径不存在或不是有效路径: ${dirPath}`)
            continue
        }

        folderCount++
        await traverse(dirPath)
    }

    if (getTargetStatistics()) {
        await traverse2(config.targetPath)
    }

    async function traverse(currentPath) {
        const entries = fs.readdirSync(currentPath, { withFileTypes: true })

        for (const entry of entries) {
            const fullPath = path.join(currentPath, entry.name)

            // 处理路径不存在的情况，极空间交流群群友 Kelsen 遇到的问题
            if (!fs.existsSync(fullPath)) {
                console.error(`${currentPath} 下的路径：${fullPath} 不存在或不是有效路径`)
                continue
            }

            if (entry.isDirectory()) {
                folderCount++
                await traverse(fullPath)
            } else if (entry.isFile()) {
                const stats = fs.statSync(fullPath)
                const inode = stats.ino
                totalSize += stats.size
                if (!visitedInodes.has(inode)) {
                    visitedInodes.add(inode)
                    allSize += stats.size
                }

                const sourceFileExtension = path.extname(entry.name).toUpperCase().slice(1)
                if (config.extensions.includes(sourceFileExtension) || config.extensions.length === 0) {
                    if (sourceFileExtension === "HEIC") {
                        const movFilePath = await getZalbumMovPath(fullPath)
                        if (movFilePath !== null) {
                            zalbumMovFileCount++
                        }
                    }
                    matchingFileCount++
                } else {
                    nonMatchingFileCount++
                }
            }
        }
    }

    async function traverse2(currentPath) {
        const entries = fs.readdirSync(currentPath, { withFileTypes: true })

        for (const entry of entries) {
            const fullPath = path.join(currentPath, entry.name)

            // 处理路径不存在的情况，极空间交流群群友 Kelsen 遇到的问题
            if (!fs.existsSync(fullPath)) {
                console.error(`${currentPath} 下的路径：${fullPath} 不存在或不是有效路径`)
                continue
            }

            if (entry.isDirectory()) {
                folderCount2++
                await traverse2(fullPath)
            } else if (entry.isFile()) {
                const stats = fs.statSync(fullPath)
                const inode = stats.ino
                totalSize2 += stats.size
                if (!visitedInodes.has(inode)) {
                    visitedInodes.add(inode)
                    allSize += stats.size
                }

                const sourceFileExtension = path.extname(entry.name).toUpperCase().slice(1)
                if (config.extensions.includes(sourceFileExtension) || config.extensions.length === 0) {
                    if (sourceFileExtension === "HEIC") {
                        const targetFileMovPath1 = fullPath.replace(/\.heic/i, ".mov")
                        const targetFileMovPath2 = fullPath.replace(/\.HEIC/i, ".MOV")
                        if (fs.existsSync(targetFileMovPath1) || fs.existsSync(targetFileMovPath2)) {
                            zalbumMovFileCount2++
                        }
                    }
                    matchingFileCount2++
                } else {
                    nonMatchingFileCount2++
                }
            }
        }
    }

    return {
        folderCount,
        matchingFileCount,
        nonMatchingFileCount,
        zalbumMovFileCount,
        totalSize,
        folderCount2,
        matchingFileCount2,
        nonMatchingFileCount2,
        zalbumMovFileCount2,
        totalSize2,
        allSize
    }
}

module.exports = router