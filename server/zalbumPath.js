const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

// 链接数据库
const zalbumDBPath = "/zspace/zspace/zsrp/zalbum/zalbumv2.db";
if (!fs.existsSync(zalbumDBPath)) {
    console.error(`数据库文件不存在: ${zalbumDBPath}`);
    return;
};
const zalbumDB = new sqlite3.Database(zalbumDBPath, (err) => {
    if (err) { console.error(`无法连接到数据库: ${err.message}`) };
});

// 获取极相册所有挂载的路径
// isZspace参数代表查询后输出内容是否为zspace路径
// 为false直接查询出来的是/tmp/zfsv3/nvme13，为true则是/zspace/data_nvme003这样的
function getZalbumAllMountPath(isZspace = true) {
    return new Promise((resolve, reject) => {
        const query = `SELECT path, user_id FROM dirs`;
        zalbumDB.all(query, [], (err, rows) => {
            if (err) {
                console.error(`数据库查询错误: ${err.message}`);
                reject(new Error(`数据库查询错误: ${err.message}`));
            } else {
                if (isZspace) {
                    const newRows = rows.map((row) => {
                        return { ...row, path: tempToZspace(row.path) };
                    });
                    resolve(newRows);
                } else {
                    resolve(rows);
                }
            }
        });
    });
};

// 获取HEIC文件对应的MOV文件路径
function getZalbumMovPath(sourceFilePath) {
    return new Promise((resolve, reject) => {
        const query = `SELECT ext FROM feeds WHERE path = ?`;
        const sourceFileZalbumPath = zspaceTotmp(sourceFilePath);

        zalbumDB.get(query, sourceFileZalbumPath, (err, row) => {
            if (err) {
                console.error(`数据库查询错误: ${err.message}`);
                reject(err); // 出错时通过 reject 返回
                return;
            }
            if (row && row.ext && row.ext.includes(".mov@")) {
                const extList = row.ext.split("@");
                const diskInfo = extList[0].split("%23")[0]; // 提取磁盘名部分，去掉 %23 后面的内容
                const diskPrefix = diskInfo.match(/^[a-zA-Z]+/)[0]; // 提取字母部分 (e.g., "nvme")
                const diskSuffix = diskInfo.match(/\d+$/)[0]; // 提取数字部分 (e.g., "13")
                // 生成 diskName (e.g., "/data_n003")
                const adjustedDiskSuffix = (Number(diskSuffix) - 10).toString().padStart(3, "0");
                const diskName = `/data_${diskPrefix[0]}${adjustedDiskSuffix}`;
                const movFileName = extList[extList.length - 2]; // 获取倒数第二个子串作为 MOV 文件名
                const subFolder = movFileName.slice(0, 2);
                const movFilePath = path.join("/zspace", diskName, "/data/udata/real/.internal/AppleLivePhotoVideo", subFolder, movFileName);

                // console.log(`MOV 文件路径: ${movFilePath}`);
                resolve(movFilePath); // 成功时返回 MOV 文件路径
            } else {
                // console.error(`未找到对应的 MOV 文件: ${sourceFileZalbumPath}`);
                resolve(null); // 未找到时返回 null
            }
        });
    });
}

// zspace路径转换为tmp路径
function zspaceTotmp(path) {
    const regex = /\/zspace\/data_([ns])(\d{3})\/data\/udata\/real\/(\w+)\/(.*)/;

    return path.replace(regex, (_, prefixChar, num, phone, rest) => {
        const prefix = prefixChar === "s" ? "sata" : "nvme";
        const newNum = parseInt(num, 10) + 10;
        return `/tmp/zfsv3/${prefix}${newNum}/${phone}/data/${rest}`;
    });
};

// tmp路径转换为zspace路径
function tempToZspace(path) {
    const regex = /\/tmp\/zfsv3\/([a-z]+)(\d{2})\/(\d{11}[a-zA-Z]*)\/data\/(.*)/;

    return path.replace(regex, (_, prefix, num, phone, rest) => {
        const newNum = (parseInt(num, 10) - 10).toString().padStart(3, "0");

        return `/zspace/data_${prefix.charAt(0)}${newNum}/data/udata/real/${phone}/${rest}`;
    });
};

module.exports = { getZalbumAllMountPath, getZalbumMovPath, zspaceTotmp };