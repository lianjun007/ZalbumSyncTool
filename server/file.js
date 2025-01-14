const fs = require("fs");
const path = require("path");

const { getZalbumMovPath } = require("./zalbumPath");
const { logToFile, logLevels } = require("./log");

// 读取/写入配置数据
const configFilePath = path.join(__dirname, "../", "config.json");
function readConfig() {
    const config = JSON.parse(fs.readFileSync(configFilePath, "utf8"));
    return config;
}

function writeConfig(config) {
    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2), "utf8");
}

// 文件同步逻辑
function syncFile(zalbumMountPath, sourceFilePath, eventType) {
    const config = readConfig()
    const relativePath = path.relative(zalbumMountPath, sourceFilePath);
    const targetFilePath = path.join(config.targetPath, path.basename(zalbumMountPath), relativePath);
    const sourceFileExtension = path.extname(sourceFilePath).toUpperCase().slice(1);

    if (config.extensions.includes(sourceFileExtension) || config.extensions.length === 0) {
        if (eventType === "add" || eventType === "change") {
            createHardLinkOrCopy(sourceFilePath, targetFilePath);
            if (sourceFileExtension === "HEIC") {
                processHEICFile(zalbumMountPath, sourceFilePath);
            }
        } else if (eventType === "unlink") {
            if (fs.existsSync(targetFilePath)) {
                fs.rmSync(targetFilePath);
            }
            if (sourceFileExtension === "HEIC") {
                const targetFileMovPath1 = replace(/\.heic/i, ".mov");
                const targetFileMovPath2 = replace(/\.HEIC/i, ".MOV");
                if (fs.existsSync(targetFileMovPath1)) {
                    fs.rmSync(targetFileMovPath1);
                } else if (fs.existsSync(targetFileMovPath2)) {
                    fs.rmSync(targetFileMovPath2);
                }
            }
        } else if (eventType === "addDir") {
            fs.mkdirSync(sourceFilePath, { recursive: true });
        } else if (eventType === "unlinkDir") {
            fs.rmSync(targetFilePath, { recursive: true });
        }
    }
};

// 采用硬链接或复制备份文件
function createHardLinkOrCopy(sourceFilePath, targetFilePath) {
    try {
        const targetFileparentPath = path.dirname(targetFilePath); // 获取目标文件的父目录路径

        if (!fs.existsSync(targetFileparentPath)) {
            fs.mkdirSync(targetFileparentPath, { recursive: true });
        };

        if (!fs.existsSync(sourceFilePath)) {
            logToFile(`源文件不存在: ${sourceFilePath}`, logLevels.WARN);
            return;
        };

        if (fs.existsSync(targetFilePath)) {
            const sourceStats = fs.statSync(sourceFilePath);
            const targetStats = fs.statSync(targetFilePath);
            if (sourceStats.ino !== targetStats.ino) {
                fs.copyFileSync(sourceFilePath, targetFilePath);
                logToFile(`目标文件替换: ${targetFilePath}`, logLevels.INFO);
            }
            logToFile(`目标文件已存在: ${targetFilePath}`, logLevels.INFO);
            return;
        };

        try {
            // 尝试创建硬链接
            fs.linkSync(sourceFilePath, targetFilePath);
            logToFile(`成功创建硬链接: ${targetFilePath}`, logLevels.INFO);
        } catch (linkError) {
            // 硬链接失败时，复制文件
            fs.copyFileSync(sourceFilePath, targetFilePath);
            logToFile(`成功复制文件: ${targetFilePath}`, logLevels.INFO);
        };
    } catch (err) {
        console.error("操作失败:", { sourceFilePath, targetFilePath, error: err.message });
    };
};

// 处理HEIC文件
async function processHEICFile(zalbumMountPath, sourceFilePath) {
    const config = readConfig();

    const movFilePath = await getZalbumMovPath(sourceFilePath);  // 获取 MOV 文件路径
    
    if (fs.existsSync(movFilePath)) {
        const targetDir = path.dirname(sourceFilePath.replace(zalbumMountPath, config.targetPath + "/" + path.basename(zalbumMountPath)));

        const heicFileNameWithoutExt = path.basename(sourceFilePath, ".HEIC");

        const newMovPath = path.join(targetDir, `${heicFileNameWithoutExt}.MOV`);
        if (fs.existsSync(newMovPath)) {
            logToFile(`实况照片视频部分已存在：${newMovPath}`, logLevels.INFO);
        } else {
            fs.copyFileSync(movFilePath, newMovPath);
            logToFile(`复制实况视频文件并重命名为: ${newMovPath}`, logLevels.INFO);
        }
    };
};

module.exports = { readConfig, writeConfig, syncFile };