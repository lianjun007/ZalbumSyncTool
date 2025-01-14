![](https://raw.githubusercontent.com/lianjun007/ZalbumSyncTool/refs/heads/main/client/image/zalbumLogo.png)
# 极相册同步工具
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
视频教程前往我的主页 [LianJun 主页](https://lianjun.me)，然后前往抖音 / 哔哩哔哩查看视频教程
