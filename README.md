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
  lianjun007/zalbumsynctool:v1.0.0
```
