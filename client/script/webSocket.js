// WebSocket 连接状态展示控件
const statusUnlink = document.getElementById("statusUnlink");
const statusLink = document.getElementById("statusLink");
function statusLinkDisplay(isLink) {
    if (isLink) {
        statusLink.style.display = "block";
        statusUnlink.style.display = "none";
    } else {
        statusLink.style.display = "none";
        statusUnlink.style.display = "block";
    }
}

let linkRara = 0;
let webSocketclient = null;
const syncToggle = document.getElementById("syncToggle");

// WebSocket 连接函数
async function connectWebSocket() {
    const webSocketclientUrl = window.location.href.replace("http", "ws");

    if (webSocketclient) {
        webSocketclient.close();
    }

    webSocketclient = new WebSocket(webSocketclientUrl);

    return new Promise((resolve, reject) => {
        webSocketclient.onopen = () => {
            linkRara = 0;
            getConfigExtensionList();
            getConfigTargetPath();
            getConfigSyncMode();
            resolve();
        };

        webSocketclient.onmessage = (event) => {
            const message = event.data;
            handleWebSocketMessage(message);
        };

        webSocketclient.onclose = () => {
            statusLinkDisplay(false);
            reject(new Error("WebSocket 连接关闭"));
        };

        webSocketclient.onerror = (error) => {
            reject(error);
        };
    });
}

// 处理 WebSocket 消息
function handleWebSocketMessage(message) {
    switch (message) {
        case "refresh":
            getConfigExtensionList();
            updateConfigTargetPath();
            getConfigSyncMode();
            break;
        case "online":
            linkRara = 0;
            statusLinkDisplay(true);
            break;
        case "openSync":
            syncToggle.checked = true;
            break;
        case "closeSync":
            syncToggle.checked = false;
            break;
        default:
            console.log("未知消息:", message);
            break;
    }
}

// 重连函数
async function reconnect() {
    linkRara++;
    if (linkRara >= 7) {
        statusLinkDisplay(false);
        try {
            await connectWebSocket();
        } catch (error) {
            console.error("WebSocket 连接失败:", error);
        }
    }
}
setInterval(reconnect, 1000);

// 同步开关控制
syncToggle.addEventListener("change", () => {
    const message = syncToggle.checked
        ? JSON.stringify({ action: "startSync" })
        : JSON.stringify({ action: "stopSync" });

    webSocketclient.send(message);
});

// 初始化WebSocket连接
connectWebSocket();