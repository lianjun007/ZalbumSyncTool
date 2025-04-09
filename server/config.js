const express = require("express")
const router = express.Router()

const { readConfig, writeConfig } = require("./file")
const { notifyClients } = require("./webSocket")

router.get("/get", (req, res) => {
    config = readConfig()
    res.json(config)
})

router.put("/editExtension", express.json(), (req, res) => {
    const newExtensions = req.body["extensions"]
    const config = readConfig()
    config.extensions = newExtensions
    writeConfig(config)
    notifyClients()
    res.status(200).json("扩展修改成功")
})

router.put("/editTargetPath", express.json(), (req, res) => {
    const newTargetPath = req.body["targetPath"]
    const config = readConfig()
    config.targetPath = newTargetPath
    writeConfig(config)
    notifyClients()
    res.status(200).json("目标路径修改成功")
})

router.put("/editSyncMode", express.json(), (req, res) => {
    const newSyncMode = req.body["syncMode"]
    const config = readConfig()
    config.syncMode = newSyncMode
    writeConfig(config)
    notifyClients()
    res.status(200).json("同步模式修改成功")
})

module.exports = router
