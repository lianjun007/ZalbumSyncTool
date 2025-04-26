const fs = require("fs")
const path = require("path")

const { getZalbumMovPath } = require("./zalbumPath")
const { logToFile, logLevels } = require("./log")

// 读取/写入配置数据
const configFilePath = path.join(__dirname, "../", "config.json")
function readConfig() {
    const config = JSON.parse(fs.readFileSync(configFilePath, "utf8"))
    return config
}

function writeConfig(config) {
    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2), "utf8")
}

// 文件同步逻辑
async function syncFile(zalbumMountPath, sourceFilePath, eventType) {
    const config = readConfig()
    const relativePath = path.relative(zalbumMountPath, sourceFilePath)
    const targetFilePath = path.join(config.targetPath, path.basename(zalbumMountPath), relativePath)
    const sourceFileExtension = path.extname(sourceFilePath).toUpperCase().slice(1)

    if (config.extensions.includes(sourceFileExtension) || config.extensions.length === 0) {
        if (eventType === "add" || eventType === "change") {
            await createHardLinkOrCopy(sourceFilePath, targetFilePath)
            if (sourceFileExtension === "HEIC") {
                await processHEICFile(zalbumMountPath, sourceFilePath)
            }
        } else if (eventType === "unlink") {
            if (await fs.promises.access(targetFilePath).then(() => true).catch(() => false)) {
                await fs.promises.rm(targetFilePath)
            }
            if (sourceFileExtension === "HEIC") {
                const targetFileMovPath1 = targetFilePath.replace(/\.heic/i, ".mov")
                const targetFileMovPath2 = targetFilePath.replace(/\.HEIC/i, ".MOV")
                if (await fs.promises.access(targetFileMovPath1).then(() => true).catch(() => false)) {
                    await fs.promises.rm(targetFileMovPath1)
                } else if (await fs.promises.access(targetFileMovPath2).then(() => true).catch(() => false)) {
                    await fs.promises.rm(targetFileMovPath2)
                }
            }
        } else if (eventType === "addDir") {
            await fs.promises.mkdir(sourceFilePath, { recursive: true })
        } else if (eventType === "unlinkDir") {
            await fs.promises.rm(targetFilePath, { recursive: true })
        }
    }
}

// 采用硬链接或复制备份文件
async function createHardLinkOrCopy(sourceFilePath, targetFilePath) {
    try {
        const targetFileparentPath = path.dirname(targetFilePath) // 获取目标文件的父目录路径

        if (!(await fs.promises.access(targetFileparentPath).then(() => true).catch(() => false))) {
            await fs.promises.mkdir(targetFileparentPath, { recursive: true })
        }

        if (!(await fs.promises.access(sourceFilePath).then(() => true).catch(() => false))) {
            logToFile(`源文件不存在: ${sourceFilePath}`, logLevels.WARN)
            return
        }

        if (await fs.promises.access(targetFilePath).then(() => true).catch(() => false)) {
            const sourceStats = await fs.promises.stat(sourceFilePath)
            const targetStats = await fs.promises.stat(targetFilePath)
            if (sourceStats.ino !== targetStats.ino) {
                await fs.promises.copyFile(sourceFilePath, targetFilePath)
                logToFile(`目标文件替换: ${targetFilePath}`, logLevels.INFO)
            }
            logToFile(`目标文件已存在: ${targetFilePath}`, logLevels.INFO)
            return
        }

        try {
            // 尝试创建硬链接
            await fs.promises.link(sourceFilePath, targetFilePath)
            logToFile(`成功创建硬链接: ${targetFilePath}`, logLevels.INFO)
        } catch (linkError) {
            // 硬链接失败时，复制文件
            await fs.promises.copyFile(sourceFilePath, targetFilePath)
            logToFile(`成功复制文件: ${targetFilePath}`, logLevels.INFO)
        }
    } catch (err) {
        console.error("操作失败:", { sourceFilePath, targetFilePath, error: err.message })
    }
}

// 处理HEIC文件
async function processHEICFile(zalbumMountPath, sourceFilePath) {
    const config = readConfig()

    const movFilePath = await getZalbumMovPath(sourceFilePath)  // 获取 MOV 文件路径

    if (fs.existsSync(movFilePath)) {
        const targetDir = path.dirname(sourceFilePath.replace(zalbumMountPath, config.targetPath + "/" + path.basename(zalbumMountPath)))

        const heicFileNameWithoutExt = path.basename(sourceFilePath, ".HEIC")

        const newMovPath = path.join(targetDir, `${heicFileNameWithoutExt}.MOV`)
        if (fs.existsSync(newMovPath)) {
            logToFile(`实况照片视频部分已存在：${newMovPath}`, logLevels.INFO)
        } else {
            fs.copyFileSync(movFilePath, newMovPath)
            logToFile(`复制实况视频文件并重命名为: ${newMovPath}`, logLevels.INFO)
        }
    }
}

module.exports = { readConfig, writeConfig, syncFile }