const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

const { getZalbumAllMountPath } = require("./zalbumPath");

// 路由：根据传入路径返回子目录
router.get("/getSubPaths", (req, res) => {
    const basePath = ".";
    const requestedPath = req.query.path || "";
    const fullPath = path.join(basePath, requestedPath);
    const subDirectories = getSubPaths(fullPath);
    res.json(subDirectories);
});

// 获取极相册挂载的所有文件夹
router.get("/getZalbumAllPath", async (req, res) => {
    const data = await getZalbumAllMountPath();
    res.json(data);
});

// 传入路径获取该路径的所有子路径
function getSubPaths(dirPath) {
    const subDirectories = [];
    try {
        const files = fs.readdirSync(dirPath, { withFileTypes: true });
        files.forEach(file => {
            if (file.isDirectory()) {
                subDirectories.push({
                    name: file.name,
                    path: path.join(dirPath, file.name),
                });
            }
        });
    } catch (err) {
        console.error("读取目录错误：", err);
    }
    return subDirectories;
}

module.exports = router;