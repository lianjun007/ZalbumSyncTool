const express = require("express");
const webSocket = require("ws");
const chokidar = require("chokidar");
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const { webSocketServerConnection } = require("./server/webSocket");

// 服务器
const app = express();
app.use("/config", require("./server/config"));
app.use("/path", require("./server/path"));
app.use("/statistics", require("./server/statistics"));
const { router } = require("./server/log");
app.use("/log", router);

const server = app.listen(3000, () => console.log("极相册同步工具服务器已启动，端口3000"));
const webSocketServer = new webSocket.Server({ server });

// 页面路由
app.use("/client", express.static(path.join(__dirname, "client")));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/client/view/index.html");
});

webSocketServerConnection(webSocketServer)