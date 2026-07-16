# 拾光录

按求学阶段记录点滴、随时回望的私人礼物网站。支持文字、图片、视频与语音，登录后可浏览封面、切换阶段、写下回忆，并附带「一封信」、好友寄语视频、时间胶囊等仪式感功能。

## 账号与权限

后端首次启动时写入两个默认账号（见 `server/src/config.ts` 的 `DEFAULT_USERS`）：

| 账号 | 角色 | 用途 |
|------|------|------|
| `lareina` | `editor` | 开发 / 站点管理：背景、开场、寄语视频、信件、BGM 等；回忆仅自己可见 |
| `lemon` | `viewer` | 展示端：浏览站点内容，管理自己的回忆与愿望 |

部署前务必修改默认密码，**勿将真实密码提交到公开仓库**。登录后也可在「我的 → 账号安全」修改密码。

## 功能概览

### 基础体验

| 模块 | 说明 |
|------|------|
| 登录页 | 账号密码登录；可自定义登录背景 |
| 开场 | 登录后可选图片 + 音频片头；随后欢迎层与寄语 |
| 封面 | 全屏 Hero、卷轴式展开；可自定义封面背景 |
| 阶段浏览 | 小学 → 初中 → 高中 → 大学 → 研究生 → 未来 |
| 回忆记录 | 标题、日期、正文、图片/视频；**按账号隔离**，各自上传各自可见 |
| 未来愿望 | 可多条添加 / 编辑 / 删除（两账号均可）；含「写给讲台」模板 |
| 时光足迹 | 底部进度条，拖拽或点击切换阶段 |
| 拾光星轨 | 照片环绕展示，可点击放大查看 |

### 礼物感（P1）

| 模块 | 说明 |
|------|------|
| 一封信 | 顶栏 / 封面入口；宣纸风阅读长文 |
| 语音留言 | 挂在信件旁，可多段上传（editor） |
| 时间胶囊 | 回忆可设解锁日期；未到期 viewer 只见标题 |
| 阶段好友寄语 | 进入阶段转场后播放好友视频；本会话每阶段播一次，可跳过 |
| 纪念卡 | 选寄语生成竖版 PNG 本地下载 |

### 沉浸与定制（P2）

| 模块 | 说明 |
|------|------|
| 阶段背景 / 图标 | 按阶段上传自定义背景与图标（editor） |
| 浏览 BGM | 独立于登录开场；右下角开关与音量（记忆本地） |
| 回忆筛选 | 按关键词、年份筛选当前阶段回忆 |
| 我的 | 按角色显示：安全 / 信件 / 寄语 / 阶段与 BGM / 开场 / 背景等 |

数据保存在服务端 SQLite 与 `uploads` 目录，多设备需共用同一后端。

## 环境要求

- Node.js 18+
- npm
- Windows 上安装 `better-sqlite3` 时，若预编译包下载失败，可能需要安装 [Visual Studio Build Tools](https://github.com/nodejs/node-gyp#on-windows)（含 “使用 C++ 的桌面开发”）

## 本地运行

需要同时启动 **后端 API** 与 **前端**：

```bash
# 安装依赖
npm install
npm install --prefix server

# 终端 1：启动后端（默认 http://localhost:3001）
npm run dev:server

# 终端 2：启动前端（默认 http://localhost:5173）
npm run dev
```

浏览器访问 http://localhost:5173 。修改角色或默认用户后，请退出并重新登录以刷新 JWT。

## 生产部署建议

```bash
npm run build
npm run build:server
npm run start:server
```

前端构建产物在 `dist/`，需自行配置静态资源托管与 `/api` 反向代理。

| 环境变量 | 说明 |
|----------|------|
| `PORT` | 后端端口，默认 `3001` |
| `JWT_SECRET` | 会话签名密钥，**生产环境必须改为强随机字符串** |

部署时请定期备份：

- `server/data/` — SQLite 数据库
- `server/uploads/` — 用户上传的媒体、背景、寄语视频、语音等

## 项目结构

```
graduation-gift/
├── src/                 # 前端 React 应用
│   ├── components/      # 页面组件（信件、转场寄语、纪念卡、BGM 等）
│   ├── constants/       # 文案、阶段、图标
│   ├── hooks/           # 数据与媒体 hooks
│   └── api/             # 前端 API 封装
├── server/              # Express + SQLite 后端
│   ├── src/
│   │   ├── routes/      # auth / memories / wishes / blessings / letter / media / settings
│   │   ├── config.ts    # 端口、默认用户、阶段 ID
│   │   └── db.ts        # 数据库初始化与迁移
│   ├── data/            # SQLite（运行时生成）
│   └── uploads/         # 媒体文件（运行时生成）
└── public/assets/       # 静态图标等资源
```

前端通过 Vite 开发代理将 `/api` 转发至后端。

## 主要 API（摘要）

| 路径 | 说明 |
|------|------|
| `/api/auth/*` | 登录、会话、改密 |
| `/api/memories` | 回忆 CRUD；支持 `unlockAt` 时间胶囊 |
| `/api/wishes` | 未来愿望（登录用户可读写） |
| `/api/blessings` | 阶段好友寄语视频（写需 editor） |
| `/api/letter` | 信件正文与语音留言 |
| `/api/settings/*` | 背景、开场、头像、阶段背景/图标、BGM |
| `/api/media/:key` | 媒体流（支持 Range；可用 `?token=`） |

## 定制内容

编辑 `src/constants/config.ts` 可修改网站文案，例如：

- `siteTitle` — 网站标题
- `loginSubtitle` — 登录页副标题
- `dedication` — 首次进入时的寄语
- `hero` — 封面标题、描述与按钮文案
- `progressLabel` — 底部进度条标签

阶段文案与进度比例见 `src/constants/stages.ts`。  
默认阶段背景见 `src/constants/stageBackgrounds.ts`（可被后台上传的阶段背景覆盖）。

## 技术栈

**前端**

- React + TypeScript + Vite
- Tailwind CSS v4
- Framer Motion、GSAP（ScrollTrigger）
- [React Bits](https://reactbits.dev/) 风格组件（Plasma、OrbitImages 等）

**后端**

- Express + TypeScript
- better-sqlite3 + bcryptjs + JWT + multer

## 图标替换

阶段图标默认配置在 `src/constants/icons.ts`；也可在「我的 → 阶段与 BGM」按阶段上传覆盖。

本地静态资源可放在 `public/assets/icons/`，例如：

```typescript
primary: { emoji: '🌱', customSrc: '/assets/icons/primary.png', lucide: Sprout },
```

## 安全提示

- 不要将 `server/src/config.ts` 中的真实密码推送到公开 Git 仓库
- 生产环境必须设置独立的 `JWT_SECRET`
- 若仓库曾泄露过凭据，请立即修改密码并轮换密钥
