# 阿里云静态部署说明

使用 SSH + Docker Compose + 独立 Nginx 容器部署，配置文件为项目根目录的 `compose.yaml`。本地构建静态页面，服务器运行 Nginx 提供文件访问。

2026-10-13 已只读确认服务器安装 Docker 26.1.3 和 Compose 2.27.0，8081 当时未监听，80 已由现有 Nginx 使用。尚未上传或启动本项目；发布前重新确认端口状态，并遵循 `/Users/yj/Desktop/project/aliyun/AGENTS.md`。

## 本地构建与上传

在 Mac 上执行，检查和构建均成功后再上传：

```bash
cd /Users/yj/Desktop/project/cs-notes-reader
npm run check
npm run test:unit
npm run build

ssh aliyun 'mkdir -p /opt/cs-notes-reader/dist'
scp compose.yaml aliyun:/opt/cs-notes-reader/
scp -r dist/. aliyun:/opt/cs-notes-reader/dist/
```

上传后 `compose.yaml` 和 `dist/` 必须位于同一个目录。`dist/` 包含正文、图片、前端资源和 Pagefind 搜索索引；服务器不需要安装项目的 Node.js 依赖。

## 启动与检查

SSH 登录服务器后执行：

```bash
cd /opt/cs-notes-reader
docker compose -p cs-notes-reader config -q
docker compose -p cs-notes-reader up -d
docker compose -p cs-notes-reader ps
curl -I http://127.0.0.1:8081/cs-notes/
```

`config -q` 只校验配置；`up -d` 在后台启动容器；`ps` 应显示运行中；网页应返回 HTTP 200。首次启动需要下载 Nginx 镜像。排错时使用：

```bash
docker compose -p cs-notes-reader logs --tail=100 web
```

容器把服务器的 8081 端口映射到 Nginx 的 80 端口，并将 `dist/` 只读挂载到 `/usr/share/nginx/html/cs-notes/`，与网站的 `/cs-notes/` 部署前缀一致。

## 公网验收

在阿里云 ECS 安全组中允许入站 TCP 8081，并按需设置访问来源、检查服务器防火墙。然后从实际使用的网络访问：

`http://115.29.171.189:8081/cs-notes/`

检查首页、网络分类、深层 `.html` 页面、插图以及 Socket 等搜索词。服务器内部访问成功不等于公网可达。

## 更新与回退

更新前备份服务器上的 `dist/`，记录备份位置。重新本地构建，再上传新的产物；普通静态文件更新无需重启容器。修改 Compose 配置后，重新校验并执行 `up -d`。

回退时恢复备份的 `dist/` 内容；如果 Compose 配置也有变更，同时恢复其备份并执行 `up -d`。需要停止本项目时，在此目录执行 `docker compose -p cs-notes-reader down`。

阅读进度和书签仍保存在浏览器；本地地址与服务器地址的数据分别存储，可以通过设置页导出/导入 JSON 迁移。
