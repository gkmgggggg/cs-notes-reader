# CS-Notes 阅读站技术选型与架构决策

版本：v1.1（项目初始化后）  
日期：2026-10-12（Asia/Taipei）  
项目：`cs-notes-reader`  
适用范围：个人阅读、无需登录、浏览器保存记录、阿里云静态部署。

## 1. 选型结论

采用 **Astro + React + TypeScript + Pagefind + localStorage + Nginx**。

React 用于搜索、书签、进度、设置和我的阅读等交互组件；Astro 用于内容管理、页面路由和构建时生成 HTML。原笔记以 Markdown 数据导入，阅读正文生成静态网页。站点运行时由阿里云现有 Nginx 提供文件访问。

本决策将此前需求文档中的 VitePress/Vue 建议替换为 React 方案，保留原有功能与验收范围。版本基线已核对官方文档和 npm 包元数据；项目已在本地初始化。2026-10-13 已完成固定上游快照全部 175 个 Markdown 文件的覆盖，生成 170 个阅读页与 5 个历史别名映射，442 个图片资源本地化。类型、内容一致性、静态构建与站内断链检查通过；阿里云部署仍待执行。

## 2. 各层技术选择

| 层次 | 确定选择 | 职责 |
| --- | --- | --- |
| 站点框架 | Astro，静态输出 | Markdown 内容、路由、布局、预生成 HTML |
| 交互 UI | React + React DOM | 搜索弹层、书签、进度、已读、设置、数据恢复 |
| 开发语言 | TypeScript | 内容清单、页面数据、个人记录与脚本的类型约束 |
| 内容模型 | Astro Content Collections | 校验章节元数据，构建时读取正文 |
| Markdown 管线 | Astro 官方 Unified 处理器 + remark/rehype | 链接转换、标题处理、安全 HTML 与渲染 |
| 代码高亮 | Astro Markdown 的 Shiki 能力 | Java、SQL、Shell、C 等代码的静态高亮 |
| 搜索 | Pagefind 扩展版 + React 搜索界面 | 构建后索引 HTML，浏览器内搜索与小节跳转 |
| 共享状态 | Nano Stores + React 适配 | 多个 React 交互区域共享个人记录和设置 |
| 数据存储 | localStorage + JSON 导出/导入 | 保存进度、书签、设置，支持手动迁移 |
| 数据校验 | Zod 4 | 内容清单及个人数据备份的运行时校验 |
| 样式 | 原生 CSS、CSS 变量、React CSS Modules | 阅读排版、响应式、主题；保持主题规则集中 |
| 包管理 | npm + package-lock.json | 锁定依赖，使用 `npm ci` 复现安装 |
| 脚本 | Node.js + TypeScript + tsx | 内容同步、资源处理、校验与构建编排 |
| 测试 | node:test + Playwright | 内容转换与数据逻辑测试、浏览器验收 |
| 发布 | 本地静态构建 + SSH 上传 + Nginx | 版本目录发布、配置检查、访问验证及回退 |

首版交付不包含业务 API、账号系统或数据库服务。服务器只需具备静态文件服务能力；Node.js 用于本地开发和构建。

## 3. 版本基线与兼容性

以下为 2026-10-12 核对后的项目起始基线。直接依赖初始化时写入明确版本，实际依赖树以 `package-lock.json` 为准，后续升级通过独立变更验证。

| 组件 | 基线 | 说明 |
| --- | --- | --- |
| Node.js | 24.15.0，24 LTS 系列 | 采用已有本地环境，满足选定依赖要求；服务器不需要为静态站点升级 Node |
| npm | 11.12.1 | 采用已有本地环境，并在 packageManager 中固定；Astro 所需 npm 版本范围满足 |
| Astro | 7.3.8 | npm `latest` 的稳定发行版本 |
| `@astrojs/react` | 7.0.1 | 官方 React 集成，支持 React 19 |
| React / React DOM | 19.3.0 / 19.3.0 | 两者保持相同版本 |
| TypeScript | 5.9.3 | 与当前 Astro 类型检查工具的支持范围匹配 |
| `@astrojs/check` | 0.9.10 | 当前 peer 范围为 TypeScript 5 或 6 |
| Pagefind | 1.5.2 | 使用带中文分词能力的扩展构建 |
| Nano Stores | 1.5.5 | 共享轻量浏览器状态 |
| `@nanostores/react` | 2.0.1 | 与 React 19、Nano Stores 1.x 的声明范围匹配 |
| Zod | 4.6.6 | Astro 7 内容 schema 支持 Zod 4 |
| `rehype-sanitize` | 6.0.0 | HTML 允许列表清洗 |
| `remark-gfm` | 4.0.1 | 导入脚本解析 GFM 内容；避免重复注册渲染器已有能力 |
| Unified / remark-parse / remark-stringify | 11.0.5 / 11.0.0 / 11.0.0 | 构建时解析、修改和序列化 Markdown AST |
| tsx | 4.23.15 | 运行 TypeScript 构建脚本与逻辑测试 |
| Playwright | 1.64.0 | 核心浏览器流程测试 |

`@types/react`、`@types/react-dom` 采用 19 系列，`@types/node` 采用 24 系列；实际补丁版本在初始化时锁定。

Astro 7 默认 Markdown 处理器是 Sätteri。本项目明确安装与 Astro 兼容的 `@astrojs/markdown-remark` 7.3.2，并配置 `markdown.processor` 为其 `unified()` 处理器，以使用 remark/rehype 转换与清洗插件。`rehype-raw` 采用 7.0.0，均在锁文件中固定。[官方处理器配置](https://docs.astro.build/en/reference/configuration-reference/#markdownprocessor)

TypeScript 当前最新主版本为 7，但 `@astrojs/check@0.9.10` 的声明范围尚不包含 7，因此本项目选择 5.9.3。此处是兼容性决策，不把“每个包都安装 latest”作为安装规则。

Vite 使用 Astro 和官方 React 集成所需的兼容版本，由锁文件固定；不另行把项目根依赖升级到任意最新 Vite。

初始化必须通过：依赖安装无未解决的 peer 冲突、`astro check`、静态构建、Pagefind 索引生成、关键浏览器流程。元数据兼容不替代这些检查。

## 4. 页面与 React 的分工

| 内容或功能 | 实现方式 |
| --- | --- |
| 笔记正文、标题、面包屑、章节导航、参考资料 | Astro 构建静态 HTML |
| 首页分类、分类页、上一章/下一章 | Astro 根据内容清单生成 |
| 搜索弹层、快捷键、结果列表 | React 组件，Pagefind 搜索 API |
| 阅读工具栏、收藏、已读、阅读位置监听 | React 组件，浏览器端初始化 |
| 最近阅读、书签列表、设置和数据迁移 | React 组件 |
| 文章目录与当前位置高亮 | 静态目录配合浏览器 IntersectionObserver |
| 图片放大、代码复制 | 轻量浏览器交互，统一处理焦点与失败降级 |

搜索入口、阅读工具栏等主要交互组件采用 `client:load`；次要部件可按可见性或空闲时加载。正文不等待 React 初始化就可以显示。[React 官方集成](https://docs.astro.build/en/guides/integrations-guide/react/)、[Astro Islands](https://docs.astro.build/en/concepts/islands/)

首版使用普通页面导航，浏览器直接访问生成的页面；不加入 React Router 或 Astro ClientRouter。这样阅读位置保存、页面生命周期和深层刷新有清晰边界，后续再按实际性能需要评估页面过渡。

不同 React 岛屿是独立渲染根，不能假设 React Context 自动跨岛屿共享。因此使用 Nano Stores 共享状态，个人数据的初始化与持久化统一通过存储适配层完成。[Astro 跨岛屿状态说明](https://docs.astro.build/en/recipes/sharing-state-islands/)

## 5. 内容导入设计

处理顺序：固定上游 SHA → 原始快照 → 内容清单 → Markdown AST 转换 → 图片整理 → schema 和链接校验 → Astro 内容集合 → 静态网页。

- 源文件归档与转换后的正文分开保存，源文件不覆盖手工维护的页面或组件。
- 内容清单是分类、顺序、稳定 ID、路由、别名和来源的统一依据。
- 使用 remark AST 处理链接、图片和标题，保留代码块原样，不对整个 Markdown 文件执行粗糙的字符串替换。
- 替换原文的自动目录、纯跳转入口及重复目录；每个源文件在报告中有明确去向。
- 源内容使用 `.md`，不启用上游 MDX、组件导入、脚本或在线编辑执行能力。
- 原始 HTML 经解析后由 `rehype-sanitize` 允许列表清洗；清洗完成后生成可信的标题 ID、图片展示和代码高亮输出。具体插件顺序通过 HTML、锚点和代码样例验证，防止误删代码样式或引入不安全属性。
- 标题 ID 与文章目录、搜索索引、书签定位使用同一结果；维护旧锚点映射，避免清洗器的 ID 前缀策略使站内链接失效。
- 关键插图和公式图优先从原仓库本地图片匹配，构建期间处理缺失图片，输出到本站静态资源；只处理实际引用的素材。
- 保留来源、作者和许可，转换报告记录遗漏、图片失败和断链。

正文渲染采用 Astro 的内容集合与 Markdown 渲染流程；个性化页面的 React 组件不会把原笔记字符串作为 React JSX 执行。[内容集合](https://docs.astro.build/en/guides/content-collections/)、[HTML 清洗器](https://github.com/rehypejs/rehype-sanitize)

## 6. 搜索设计

选择 **Pagefind**。在 Astro 输出 HTML 之后索引最终页面，发布索引文件，React 搜索组件通过浏览器 API 查询；搜索服务不需要在服务器常驻。[Pagefind 工作流程](https://pagefind.app/docs/)

实施约束：

1. 使用 Pagefind 扩展版。官方说明中文无空格分词属于扩展构建能力；页面语言设置为 `zh-CN`。[中文分词说明](https://pagefind.app/docs/multilingual/)
2. 使用 `data-pagefind-body` 限定正文范围，排除导航、工具栏、来源说明和个人页面，减少重复噪声。
3. 将标题、分类、稳定章节 ID 作为元数据，结果展示使用同一份内容清单。
4. 保留标题锚点及代码技术词，验证 `ThreadLocal`、`B+ Tree` 等混合查询。
5. 标题权重与完整标题命中优先按需求调优，必要时在候选结果中进行轻量重排。
6. 搜索模块与索引按需加载，明确处理首次加载、失败和无结果。
7. 搜索模块路径、返回结果和小节 URL 统一适配 `/cs-notes/` 前缀，防止丢失或重复添加前缀。
8. `astro dev` 不产生完整生产搜索索引；搜索验收使用“构建 → 索引 → 预览”的产物。

六个中文/技术词验收查询及 500 毫秒目标沿用需求文档 F03。功能验证失败时先调整索引范围、权重和必要的技术词提示，不并行引入第二套搜索服务。

## 7. 个人数据设计

采用 **localStorage**，存储带版本号的数据结构，包含进度、已读状态、书签和设置。Nano Stores 保存页面内状态；独立适配器负责加载、校验、保存、导入与迁移。

- 组件构建与静态预渲染期间不访问 `window` 或 localStorage；浏览器挂载后初始化，初始输出保持一致。
- 记录以稳定 `noteId` 为键，标题与内容哈希变化不更换键。
- 写入节流，页面隐藏或离开前尽量保存最后位置；明确锚点优先于历史阅读位置。
- 导入文件通过 Zod 校验，采用需求文档定义的合并规则；同版本导出后再导入能够恢复记录。
- 存储容量或访问失败不会阻止正文显示；项目只清除自身命名空间下的数据。
- 同源、不同路径不会天然隔离 localStorage，使用本项目专属键前缀避免与其他站点冲突。

首版无需 IndexedDB；后续若加入大量个人批注、全文离线缓存或附件，再评估数据存储迁移。

## 8. 建议项目结构

```text
cs-notes-reader/
├── content/
│   ├── source.lock.json          # 固定上游版本
│   └── manifest.json             # 分类、顺序、稳定 ID、别名与来源
├── scripts/
│   ├── sync-content.ts           # 显式同步与导入
│   ├── validate-content.ts       # 内容、图片、链接校验
│   ├── build-site.ts             # 构建与搜索索引编排
│   └── publish.sh                # 按部署说明发布静态产物
├── src/
│   ├── content.config.ts
│   ├── content/notes/            # 转换后的 Markdown
│   ├── pages/
│   │   ├── index.astro
│   │   ├── read/[...slug].astro
│   │   ├── category/[category].astro
│   │   ├── reading.astro
│   │   ├── settings.astro
│   │   ├── about.astro
│   │   └── 404.astro
│   ├── layouts/ReaderLayout.astro
│   ├── components/               # React 交互组件及静态布局组件
│   ├── stores/reading.ts
│   ├── lib/                      # 存储、数据 schema、路径与搜索适配
│   └── styles/                   # 排版、主题变量、响应式
├── public/content-assets/        # 本站化插图
├── tests/
│   ├── unit/
│   ├── fixtures/
│   └── e2e/
├── astro.config.mjs
├── tsconfig.json
├── package.json
├── package-lock.json
└── README.md
```

该结构为实施约定，项目已有基础代码；发布脚本与全量内容扩展按后续阶段实施。原始上游快照与临时报告放在工作目录，不混入业务源码；来源锁、稳定清单和最终内容应可追溯。

## 9. 开发、测试与发布流程

| 项目命令约定 | 行为 |
| --- | --- |
| `npm ci` | 按锁文件安装依赖 |
| `npm run content:sync` | 显式获取指定源版本并转换，普通构建不隐式更新上游 |
| `npm run content:check` | 校验清单、重复路由、站内链接、关键图片和来源 |
| `npm run dev` | Astro 本地开发，搜索完整性通过生产预览验证 |
| `npm run check` | `astro check` 等类型与内容检查 |
| `npm run test:unit` | 用 node:test 与 tsx 验证核心数据及转换逻辑 |
| `npm run build` | 校验 → Astro 构建 → Pagefind 索引 → 产物检查 |
| `npm run preview` | 预览完整静态产物 |
| `npm run test:e2e` | Playwright 验证搜索、阅读、进度、书签、数据恢复和子路径 |

重点逻辑测试：源路径编码、重复标题、稳定 ID、数据导入合并、错误数据保护、安全 HTML 与资源映射。浏览器测试覆盖主要阅读闭环；macOS/iOS Safari 和手机公网访问仍需实际设备验证，不能用 WebKit 自动化结果替代全部真实浏览器验收。

Node 内置测试工具避免额外绑定另一套 Vite 构建版本；Playwright 负责真实浏览器交互测试。[Node 测试工具](https://nodejs.org/docs/latest-v24.x/api/test.html)、[Playwright](https://playwright.dev/docs/intro)

## 10. 阿里云运行方案

- `output` 为静态输出，构建产物目录为 `dist/`。
- `base` 为 `/cs-notes/`，`build.format` 为 `file`，保持需求中的 `/read/java/concurrency.html` 路由；`trailingSlash` 与文件输出方式配套设置。[Astro 路由输出配置](https://docs.astro.build/en/reference/configuration-reference/#buildformat)
- 默认本地构建，将完整 HTML、React 资源、插图和 Pagefind 产物通过 SSH 上传。
- 网站发布至 `/www/wwwroot/cs-notes-reader/releases/<release-id>/`，以 `current` 指向当前版本。
- 现有 Nginx 挂载 `/cs-notes/`，实际 server/location 在部署时检查宝塔配置后确定。
- 目标学习地址为 `http://115.29.171.189/cs-notes/`，目前作为待部署目标，不表示已验证可达。
- 发布采用新版本目录、配置检查、版本切换、用户网络访问验证；回退切回上一版，保留前一版资源以兼容已打开页面。

复用既有 Nginx，不新增常驻 Node 进程。该项目不要求调整 `ai-images` 的容器、数据库或 8080 端口。域名和 HTTPS 按后续部署阶段实际条件配置。

## 11. 初始化验证顺序

1. 建立 Astro + React + TypeScript 项目并锁定依赖，验证官方集成与类型检查。
2. 导入 Java 并发、MySQL、HTTP、动态规划四个代表性章节，验证 Markdown 管线、HTML、图片和锚点。
3. 生成 Pagefind 索引，验证中文及技术词查询，验证部署前缀。
4. 实现个人记录适配层，验证进度恢复、书签去重和导出导入。
5. 扩展至完整内容清单，完成需求验收后部署阿里云。

步骤 2、3 优先解决内容兼容和搜索质量，结果用于指导其余章节导入。若未来目标变为多人登录、跨设备自动同步或在线编辑，再单独设计后端与权限系统。

## 12. 依据

- [Astro 官方 React 集成](https://docs.astro.build/en/guides/integrations-guide/react/)
- [Astro 内容集合与 Zod](https://docs.astro.build/en/guides/content-collections/)
- [Astro Markdown 处理器配置](https://docs.astro.build/en/reference/configuration-reference/#markdownprocessor)
- [Astro 共享状态](https://docs.astro.build/en/recipes/sharing-state-islands/)
- [Pagefind 静态搜索](https://pagefind.app/docs/)
- [Pagefind 中文分词与扩展版](https://pagefind.app/docs/multilingual/)
- [Node.js LTS 状态](https://nodejs.org/en/about/previous-releases)
- 版本与 peer 声明核对：npm 官方 registry 中各包对应版本的元数据；核对日期为 2026-10-12。
- 部署环境约束：用户提供的阿里云 `AGENTS.md` 历史快照，发布前重新检查。
