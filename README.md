# <img src="https://raw.githubusercontent.com/lianjun007/ZalbumSyncTool/refs/heads/main/client/image/zalbumLogo.png" style="width: 30px;"> 极相册同步工具 ZalbumSyncTool

极相册（极空间的附属功能）的同步工具，用于解决极相册备份的实况照片视频部分被隐藏造成的一系列麻烦。

<img src="https://raw.githubusercontent.com/lianjun007/lianjun007.github.io/refs/heads/main/md/media/1.png" style="width: 512px;">

相关链接：[项目主页](https://lianjun.me/html/project.html?id=zalbumsynctool)、[LianJun 主页](https://lianjun.me)


# 教程

## Docker 部署

极空间打开 SSH 功能，然后直接运行下列 docker run 命令。

```sh
docker run -d -it \
  --user $(id -u):$(id -g) \
  --name ZalbumSyncTool \
  --privileged=true \
  --restart=always \
  --device /dev/fuse:/dev/fuse \
  -p 7777:7777 \
  -v /:/zspace \
  --memory=512m \
  --cpus=1 \
  lianjun007/zalbumsynctool:v1.0.0
```

等待容器成功启动后日志输出`极相册同步工具服务器已启动，端口3000`（后续版本将更新为`极相册同步工具服务器已启动。`），然后前往浏览器输入部署设备 IP 和指定端口号（如 7777）进入 WebUI。

视频教程链接：[抖音](https://v.douyin.com/iyKUUhDP/)、[哔哩哔哩](https://www.bilibili.com/video/BV1mcceePEjy?vd_source=cdd3f9f3f8659d99f09501f1764b7438)

## Node 部署

下载源代码，配置安装好 Node 环境（比如在 docker 部署 Node），然后然后运行下列命令。

```sh
node /源代码的相对路径/server.js
```

等待容控制台输出`极相册同步工具服务器已启动，端口3000`（后续版本将更新为`极相册同步工具服务器已启动。`），然后前往浏览器输入部署设备 IP 和指定端口号（如 7777）进入 WebUI。

# 概况

## 最新版本 v1.0.0 20250114

第一个版本，没有进行大量测试，建议做好相册库的备份后再使用。

开发测试环境为极空间 Z4Pro 性能版，装有硬盘数量在个位数。情况特殊的用户（尤其是盘数为两位数的用户）**谨慎使用**。

## 主要功能：

- [x] 一键自动识别挂载到极相册的文件夹，然后监视这些文件夹进行实时同步！
- [x] 采用**硬链接**的方式同步文件，如果无法使用**硬链接**才进行复制操作；
- [x] 自动提取极相册数据库中的**实况照片的视频部分**到目标文件夹，并且重命名为与静态照片同名（a.heic 和 a.mov 这样）！
- [x] 实时统计极相册挂载文件夹和备份目标文件夹的具体数据；
- [x] 简约合理且好用的 WebUI，并且使用 WebSocket 实时与后端通信（包括定时重连，实时刷新配置 等）；
- [x] 日志系统实时反馈并记录系统状态；

## 等待发布：

- [x] 挂载路径展开列表中“用户ID”修改为“用户 ID”，中英文之间添加空格；
- [x] 项目运行后输出“极相册同步工具服务器已启动，端口3000”修改为“极相册同步工具服务器已启动。“，每个人映射的端口都不一样，控制台打印没有意义，且默认端口也不是 3000 而是 7777。

## 已知问题：

- [ ] 不会同步空文件夹：感觉不是很重要，毕竟是同步相册库，这种文件夹里面基本上不会有有用的空文件夹，暂时没管；
- [ ] 日志功能比较随意：例如日志记录时间的时区、重复非必要或提示信息等问题，不过问题不大。

## 计划功能：

- [ ] 选择部分挂载到极相册的文件夹进行更新；
- [ ] 将实况照片备份进极相册（群晖、MT-Photos 等备份的 a.heic 和 a.mov 这样的实况照片）：因为极空间实况照片视频文件命名算法未知，使用仅可以写入数据库并且显示实况照片一段时间，刷新列表之后就没了；
- [ ] 实况照片视频部分清理：极相册同步的实况照片即使已经删除，也不会删除 AppleLivePhotoVideo 文件夹中的视频部分；
- [ ] 双向同步功能：觉得没什么必要，然后就是做起来比较麻烦，暂时没做；
- [ ] 日志保留条数修改：感觉是无所谓的小功能，就暂时没做。