
<div align=center>

<img src="https://raw.githubusercontent.com/lianjun007/ZalbumSyncTool/refs/heads/main/client/image/zalbumLogo.png" width=100>

# 极相册同步工具 ZalbumSyncTool

极相册（极空间应用）备份照片的同步与导出工具，用于解决极相册备份的实况照片视频部分被隐藏所造成的一系列麻烦。

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

## 项目背景

众所周知，NAS 的数据（尤其是相册等重要数据）基本都需要多地备份来保障安全。但是极相册的实况照片备份策略会隐藏实况照片的视频部分，所以相册文件夹会缺少实况照片视频部分，也就是会导致用户无法正常导出或备份数据。在这种情况下一旦极空间中的硬盘损毁或遇见其他意外，用户即便在其他地方有备份也会**导致自己的实况照片全部变成静态照片**。

而且用户如果想更换设备或者相册应用时（比如使用 MT-Photos、群晖相册等），由于市面上其他相册应用基本都采用识别到有同名照片与视频便显示为实况照片的策略（备份亦是备份实况照片为两个同名文件），所以极相册的文件夹导入进去也会导致没有实况照片。用户**只能一张一张的在极空间中右键导出实况照片，或一张一张将实况照片下载到手机中重新备份到其他相册**。不仅如此，有些用户可能希望同时使用两个相册，比如在内网使用 MT-Photos，外网和备份照片的时候使用极相册（因为有官方的内网穿透），那在实况照片这个问题上就更没办法有一个好的体验了。

所以我写了极相册同步工具（ZalbumSyncTool），可以一键批量导出或实时同步完整的极相册照片库，其中实况照片的视频部分会被重命名为与照片备份同名的文件，并且采用硬链接备份节省空间，方便**用户备份相册数据、更换相册应用、同时使用极相册和其他相册应用**。

## 主要功能

- [x] 一键自动识别挂载到极相册的文件夹，然后监视这些文件夹进行实时同步！
- [x] 采用**硬链接**的方式同步文件，如果无法使用**硬链接**才进行复制操作；
- [x] 自动提取极相册数据库中的**实况照片的视频部分**到目标文件夹，并且重命名为与静态照片同名（如 a.heic 和 a.mov）！
- [x] 实时统计极相册挂载文件夹和备份目标文件夹的具体数据；
- [x] 简约合理且好用的 WebUI，并且使用 WebSocket 实时与后端通信（包括实时观察应用状态、服务定时重连、实时刷新配置等）；
- [x] 日志系统实时反馈并记录系统状态；
- [x] 更多功能等你探索......

## 计划功能

- [ ] 选择部分挂载到极相册的文件夹甚至是指定其他文件夹进行备份，而不是强制备份整个极相册；
- [ ] 实况照片视频部分清理：极相册同步的实况照片即使已经删除，也不会删除 AppleLivePhotoVideo 文件夹中的视频部分；
- [ ] 双向同步功能：做起来可能比较麻烦并且不安全，暂时没做；
- [ ] 日志功能优化：优化日志性能、日志保留条数的修改、日志功能开关等。

## 无法实现

- [ ] 将实况照片备份进极相册（如群晖、MT-Photos 等备份的 a.heic 和 a.mov 这样的实况照片）。

> 有尝试过反向导入正常相册的文件夹导入极相册并且正常显示实况的功能，在修改数据库和修改实况文件名并且移动到对应的文件夹后确实会显示实况图标。但由于极空间隐藏实况照片时采用了特殊的算法，所以播放实况时无法播放对应的实况视频，并且刷新相册后会恢复如常。
> 
> 可能极空间是为了用户删掉实况照片后（删掉实况照片后实况照片的视频部分还存在系统中）再次备份照片还会匹配到对应的视频部分，所以备份实况照片时实况照片视频部分会被命名为一个特殊的文件名，这个文件名跟文件内容是相关的而不是随机生成的。但这种操作也让我没办法完成反向将其他相册数据导入极空间的功能，其他相册应用的文件夹导入极相册后实况照片只能显示为一张静态照片和一段 2s 左右的短视频，除非你从那个相册应用下载到手机中然后重新备份到极相册。

## 推荐版本

### v1.0.2

修复了一个严重的性能问题，运行所需内存和运行的速度大大提高，不建议使用任何老版本。

### 已知问题

- [ ] 不会同步空文件夹：感觉不是很重要，毕竟是同步相册库，这种文件夹里面基本上不会有有用的空文件夹，暂时没管；
- [ ] 日志功能比较随意：例如日志记录时间的时区、重复非必要或提示信息等问题，不过问题不大。



## 教程

### Docker 部署

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
  lianjun007/zalbumsynctool:latest
```

等待容器成功启动后日志输出 `极相册同步工具服务器已启动`，然后前往浏览器输入部署设备 IP 和指定端口号（如 7777）进入 WebUI。

如果无法下载镜像（比如因为网络问题），可以前往 Release 界面下载其中的 ZalbumSyncTool_v1.0.1.tar.gz 文件，使用 `gunzip /该文件路径` 解压为 ZalbumSyncTool_v1.0.1.tar 后直接导入镜像到极空间使用。

视频教程链接：[抖音](https://v.douyin.com/iyKUUhDP/)、[哔哩哔哩](https://www.bilibili.com/video/BV1mcceePEjy?vd_source=cdd3f9f3f8659d99f09501f1764b7438)

### Node 部署

极空间打开 SSH 功能并且使用工具连接，然后使用 `sudo -i` 命令并且输入管理员账户密码进行提权，然后下载源代码放入极空间中，修改下列命令并运行。

```sh
docker run -d -it \
  --user $(id -u):$(id -g) \
  --name Node_ZalbumSyncTool \
  --privileged=true \
  --restart=always \
  --device /dev/fuse:/dev/fuse \
  -p 7777:7777 \
  -v /:/zspace \
  -v /本项目源代码存储路径:/app
  --memory=512m \
  --cpus=1 \
  node:latest
```

使用下列命令进入容器内部，或在极空间图形化界面中点击容器上的 ssh 按钮进入容器内部。

```sh
docker exec -it Node_ZalbumSyncTool /bin/bash
```

第一次使用运行下列命令（没有 node_modules 文件夹或报依赖相关的错误时）：

```sh
cd /app && npm install && cd / && node /app/server.js
```

等待控制台输出 `极相册同步工具服务器已启动`，然后前往浏览器输入部署设备 IP 和指定端口号（如 7777）进入 WebUI。

后续使用运行下列命令：

```sh
node /app/server.js
```