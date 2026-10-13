# 阿里云静态部署说明

当前阶段只完成本地初始化。以下为后续发布约定，不表示服务器配置已修改或公网地址已验证。

默认目标通过 `ssh aliyun` 连接。发布前遵循 `/Users/yj/Desktop/project/aliyun/AGENTS.md`，重新检查现有 Nginx、宝塔管理方式、站点目录、端口、防火墙及安全组。

## 发布方式

1. 本地执行 `npm ci`、检查、测试和 `npm run build`，获得完整 `dist/`，其中包括 Pagefind 索引。
2. 静态产物上传到 `/www/wwwroot/cs-notes-reader/releases/<release-id>/`；不上传私钥、凭据或 `node_modules`。
3. 在检查现有 Nginx 配置并备份后，将 `/cs-notes/` 映射到本项目 `current/`，由 `current` 指向一个版本目录。
4. Nginx 配置变更先执行 `nginx -t`，通过后平滑加载；普通页面更新仅切换版本。
5. 服务器内部和用户实际网络分别验证首页、深层 `.html` 页面、图片与搜索。
6. 有问题时切回上一版；保留上一版资源，兼容已经打开的页面。

目标访问入口：`http://115.29.171.189/cs-notes/`。该地址待实际发布与公网检查。

首版不需要常驻 Node、PM2、数据库或新增 Docker 容器。已有 `ai-images` 项目的服务和端口独立，发布时不改动其配置。
