// 实时获取日志
const syncLog = document.getElementById("syncLog");
async function getLog() {
    await fetch("/log")
        .then(response => response.text())
        .then(data => {
            if (syncLog.value === data) {
                return;
            } else {
                syncLog.value = data;
                syncLog.scrollTop = syncLog.scrollHeight;
            };
        });
};
getLog();
setInterval(getLog, 1000);

// 下载日志按钮
document.getElementById("logDownload").addEventListener("click", () => {
    fetch("/log/download")
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "log.txt";
            a.click();
            window.URL.revokeObjectURL(url);
        });
});