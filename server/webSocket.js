const chokidar = require("chokidar");
const fs = require("fs");
const WebSocket = require("ws");

const { syncFile } = require("./file");
const { getZalbumAllMountPath } = require("./zalbumPath");
const { logToFile, logLevels } = require("./log");

let clients = [];
let folderWatcher = null;

// 通知所有连接的客户端刷新页面
function notifyClients() {
    for (let client of clients) {
        client.send("refresh");
    };
};

// 定时发送信息检查客户端是否在线
function sendOnline() {
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send("online");
            if (folderWatcher === null) {
                client.send("closeSync");
            } else {
                client.send("openSync");
            };
        };
    });
};
setInterval(sendOnline, 1000);

// 定时发送信息检查客户端是否在线
let zalbumMountPaths = [];
async function getZalbumPath() {
    const data = await getZalbumAllMountPath();
    const newZalbumMountPaths = data.map(item => item.path);
    const hasChanges = JSON.stringify(zalbumMountPaths) !== JSON.stringify(newZalbumMountPaths);
    if (!hasChanges) {
        return;
    };

    zalbumMountPaths = newZalbumMountPaths;

    if (folderWatcher) {
        folderWatcher.close();
        // 创建新的监视器
        folderWatcher = chokidar.watch(zalbumMountPaths, { ignoreInitial: false, alwaysStat: true, followSymlinks: true })
            .on("all", (event, filePath) => {
                const zalbumMountPath = zalbumMountPaths.find(folder =>
                    filePath.startsWith(folder)
                );
                syncFile(zalbumMountPath, filePath, event);
            });
        logToFile("极相册挂载路径修改", logLevels.WARN);
    };
};
getZalbumPath();
setInterval(getZalbumPath, 30 * 1000);

// 初始化WebSocket
function webSocketServerConnection(webSocketServer) {
    webSocketServer.on("connection", (ws) => {
        clients.push(ws);
        ws.on("close", () => {
            clients = clients.filter(client => client !== ws);
        });

        ws.on("message", (message) => {
            const data = JSON.parse(message);
            if (data.action === "startSync") {
                if (folderWatcher) folderWatcher.close();

                logToFile("同步已开始。", logLevels.INFO);

                folderWatcher = chokidar.watch(zalbumMountPaths, { ignoreInitial: false, alwaysStat: true, followSymlinks: true })
                    .on("all", (event, filePath) => {
                        const zalbumMountPath = zalbumMountPaths.find(folder =>
                            filePath.startsWith(folder)
                        );
                        syncFile(zalbumMountPath, filePath, event);
                    });
            } else if (data.action === "stopSync") {
                if (folderWatcher) {
                    folderWatcher.close();
                    folderWatcher = null;
                }
                logToFile("同步已停止。", logLevels.INFO);
            }
        });
    });
}

module.exports = { webSocketServerConnection, notifyClients };