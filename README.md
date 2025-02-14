
<div align=center>

<img src="https://raw.githubusercontent.com/lianjun007/ZalbumSyncTool/refs/heads/main/client/image/zalbumLogo.png" width=100>

# 极相册同步工具 ZalbumSyncTool

极相册（极空间的附属功能）的同步工具，用于解决极相册备份的实况照片视频部分被隐藏造成的一系列麻烦。

<img src="https://raw.githubusercontent.com/lianjun007/lianjun007.github.io/refs/heads/main/md/media/1.png" width=480>

<br>

[![Static Badge](https://img.shields.io/badge/%E9%A1%B9%E7%9B%AE%E4%B8%BB%E9%A1%B5-F2F2F6?logo=safari&logoColor=white&labelColor=blue)
](https://lianjun.me/html/project.html?id=zalbumsynctool)
[![Static Badge](https://img.shields.io/badge/dockerhub%20%E4%B8%BB%E9%A1%B5-F2F2F6?logo=docker&logoColor=white&labelColor=blue)
](https://login.docker.com/u/login/identifier?state=hKFo2SBUSFlKWXk2WUg2eXBsb3JWM282TnZPZnY1bmlCSkVfY6Fur3VuaXZlcnNhbC1sb2dpbqN0aWTZIGpxUlBodkFGQ01sM2IxaU5odjZzU3p5NGZUR1dHMlR5o2NpZNkgbHZlOUdHbDhKdFNVcm5lUTFFVnVDMGxiakhkaTluYjk)

![GitHub repo size](https://img.shields.io/github/repo-size/lianjun007/ZalbumSyncTool?logo=github&logoColor=black&label=Github%20%E5%AD%98%E5%82%A8%E5%BA%93%E5%A4%A7%E5%B0%8F&labelColor=F2F2F6&color=black)
![Docker Pulls](https://img.shields.io/docker/pulls/lianjun007/zalbumsynctool?logo=docker&label=dockerhub%20%E6%8B%89%E5%8F%96%E9%87%8F&labelColor=F2F2F6&color=blue)
![Docker Image Size](https://img.shields.io/docker/image-size/lianjun007/zalbumsynctool?logo=docker&logoColor=blue&label=dockerhub%20%E9%95%9C%E5%83%8F%E5%A4%A7%E5%B0%8F&labelColor=F2F2F6)

[![Static Badge](https://img.shields.io/badge/作者-LianJun&nbsp;主页-3B4E4E?logo=headspace&logoColor=FED7B0&labelColor=4D3F36)](https://lianjun.me)
![Static Badge](https://img.shields.io/badge/%E6%95%99%E7%A8%8B-%E6%96%87%E7%AB%A0-F2F2F6?logo=gitbook&labelColor=purple)
[![Static Badge](https://img.shields.io/badge/%E8%A7%86%E9%A2%91-%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9-F2F2F6?logo=bilibili&logoColor=pink&labelColor=blue)
](https://www.bilibili.com/video/BV1mcceePEjy?vd_source=cdd3f9f3f8659d99f09501f1764b7438)
[![Static Badge](https://img.shields.io/badge/%E8%A7%86%E9%A2%91-%E6%8A%96%E9%9F%B3-F2F2F6?logo=tiktok&labelColor=black)
](https://v.douyin.com/iyKUUhDP/)

</div>

# 概况

## 最新版本 v1.0.0

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

# 教程

## Docker 部署

极空间打开 SSH 功能并且使用工具连接，然后使用 `sudo -i` 命令并且输入管理员账户密码进行提权，最后运行下列 `docker run` 命令即可。

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

等待控制台输出`极相册同步工具服务器已启动，端口3000`（后续版本将更新为`极相册同步工具服务器已启动。`），然后前往浏览器输入部署设备 IP 和指定端口号（如 7777）进入 WebUI。

