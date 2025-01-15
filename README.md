![](https://raw.githubusercontent.com/lianjun007/ZalbumSyncTool/refs/heads/main/client/image/zalbumLogo.png)

# 极相册同步工具 ZalbumSyncTool

## 教程

极空间进入 ssh，然后直接运行 docker run 命令

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
视频教程 [抖音](https://v.douyin.com/iyKUUhDP/)

## 最新版本 v1.0.0 20250114

第一个版本，没有进行大量测试，建议做好相册库的备份后再使用。

开发测试环境为极空间 Z4Pro 性能版，装有硬盘数量在个位数。情况特殊的用户（尤其是盘数为两位数的用户）**谨慎使用**。

## 实现功能：

- [x] 一键自动识别挂载到极相册的文件夹并且进行**硬链接**同步！
- [x] 自动同步极相册备份的**实况照片的视频部分**到目标文件夹（a.heic 和 a.mov 这样）！
- [x] 监控极相册挂载文件夹和备份目标文件夹；
- [x] 简约合理且好用的 WebUI；
- [x] WebUI 使用 WebSocket 实时与后端通信（包括定时重连，实时刷新配置 等）；
- [x] 日志系统实时反馈并记录系统状态；
- [x] 更多功能等你探索（其实也没什么了）......

## 已知问题：

- [ ] 不会同步空文件夹：感觉不是很重要，毕竟是同步相册库，这种文件夹里面基本上不会有有用的空文件夹，暂时没管；
- [ ] 日志功能比较随意：时间的时区问题等，不过问题不大。

## 计划功能：

- [ ] 选择部分挂载到极相册的文件夹进行更新；
- [ ] 将实况照片备份进极相册（群晖、MT-Photos 等备份的 a.heic 和 a.mov 这样的实况照片）：有技术问题，可以写入数据库并且显示一段时间，刷新列表就没了；
- [ ] 实况照片视频部分清理：极相册同步的实况照片即使已经删除，也不会删除 AppleLivePhotoVideo 文件夹中的视频部分；
- [ ] 双向同步功能：觉得没什么必要，然后就是做起来比较麻烦，暂时没做；
- [ ] 日志保留条数：日志保留条数修改：暂时没做，感觉是无所谓的小功能。