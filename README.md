# CS Notes Reader

个人计算机知识阅读站。采用 Astro + React + TypeScript，静态页面由 Nginx 托管，进度与书签保存在浏览器。

## 当前阶段

已完整覆盖固定上游快照 `notes/` 下的 175 个 Markdown 文件：170 个阅读页、5 个历史跳转别名。九个分类按原 README 展示主题入口，各专题目录保留前言、章节链接和参考资料；旧版 SQL、设计模式合订本和旧版目录也可在分类页的“补充版本”中阅读。442 个图片资源全部由本站提供。

支持文章目录、中文全文搜索、收藏、已读、继续阅读、主题/字号和个人数据备份。原有 5 篇的 ID 与 URL 保持一致，继续使用已有阅读记录。阿里云部署尚未执行。

## 本地启动

开发环境：Node.js 24.x（本机 24.15.0）、npm 11.12.1。不要为了运行静态产物升级服务器环境。

```bash
npm ci
npm run dev
```

访问终端显示的 `/cs-notes/` 地址。开发模式适合编辑页面，完整搜索需要构建后的索引。

```bash
npm run check
npm run test:unit
npm run build
npm run preview
```

预览地址默认 `http://localhost:4321/cs-notes/`，端口以终端实际输出为准。构建产物为 `dist/`，构建流程包含内容校验、Astro 静态输出、Pagefind 中文索引及产物检查。

## 内容与更新

- `content/manifest.json`：当前收录章节、稳定 ID、分类与顺序。
- `content/aliases.json`：上游历史跳转文件与实际目录页的映射。
- `content/source.lock.json`：上游 GitHub 仓库与固定提交。
- `content/upstream/`：本次导入的原文与插图，保留用于追溯。
- `src/content/notes/`：适配后的 Markdown。
- `content/reports/`：导入统计、175 个源文件覆盖、逐篇正文一致性与站内链接校验报告。

使用已经准备好的本地源快照重新生成：

```bash
npm run content:sync -- --from content/upstream
```

显式从 GitHub 获取固定源提交并重新生成完整清单：

```bash
npm run content:sync
```

同步会从 README 和专题目录生成完整清单，保留既有章节 ID，并拒绝遗漏未分类文档。完整原文与仓库图片存入 `content/upstream/`；仓库外的 6 个图片资源也已缓存，使用本地快照重导入不需要联网。普通构建不会自动拉取上游新内容。

构建前逐篇比对正文、代码块、标题、图片和表格，遗漏源文件或存在未本地化图片时失败；构建后再次验证 HTML 内容数量和全部站内链接、锚点，避免再次发布部分内容。

## 文档与部署

- `docs/cs-notes-reader-prd.md`：需求与验收标准。
- `docs/cs-notes-reader-tech-stack.md`：技术架构决策。
- `docs/deployment.md`：阿里云部署边界与发布方式。

网站默认部署前缀 `/cs-notes/`，内部页面以 `.html` 输出。当前尚未连接服务器或发布网站。

## 来源与许可

技术笔记来源于 [CyC2018/CS-Notes](https://github.com/CyC2018/CS-Notes)，固定快照 `b70121d377cb6005eb65f12b098cd5decd905669`。原作者为 CyC2018，内容遵循原 README 中的 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 声明；参考资料保留原出处。上游原始说明保存在 `content/upstream/README.md`。

站点代码与上游内容分开管理，项目当前为个人本地项目，尚未发布到远程仓库。

## 完整内容验证（2026-10-13）

- 类型检查：0 错误、0 警告。
- 7 个逻辑测试通过，包含网络三个入口、六个子章节与旧版文档首节保留。
- 全部 175 个源文件覆盖；170 篇正文逐篇比对通过；442 个本地图片资源，无外部图片依赖。
- 静态构建：184 个页面、170 篇搜索索引正文；阅读页的标题、代码、表格、图片数量与原文一致，站内页面和锚点无断链。
- Chrome 浏览器：网络三个入口及六章目录可用，传输层插图与公式加载成功；Socket、传输层、消息队列、Docker、正则表达式、单例模式六组搜索通过；375 像素布局无横向溢出，章节目录折叠/展开可用。
- 后续仍需真实 Safari/手机设备验证、性能验收和阿里云公网部署。
