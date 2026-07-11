# 拾光录

一份记录求学阶段点滴、随时回望的专属网站。

## 功能

- **登录页** — 账号 + 密码，Plasma 动态背景（[React Bits](https://reactbits.dev/backgrounds/plasma)）
- **六个求学阶段 Tab** — 小学、初中、高中、大学、研究生、未来
- **回忆记录** — 标题、日期、文字故事
- **图片 / 视频上传** — 服务端存储，支持预览与灯箱浏览
- **底部进度条** — 切换阶段时平滑动画，展示人生求学进度
- **未来愿望墙** — 「未来」Tab 可许下对未来的期待
- **首次欢迎寄语** — 登录后弹出专属 dedication 文字

## 快速开始

需要同时启动 **后端 API** 和 **前端**：

```bash
# 1. 安装依赖
npm install
npm install --prefix server

# 2. 启动后端（终端 1）
npm run dev:server

# 3. 启动前端（终端 2）
npm run dev
```

浏览器打开 http://localhost:5173 登录。

默认账号（首次启动后端时自动写入 SQLite）：

| 用户名 | 密码 | 角色 |
|--------|------|------|
| lareina | 20030621jjb | admin |
| lemon | 20021007 | admin |

## 架构

| 部分 | 技术 |
|------|------|
| 前端 | React + TypeScript + Vite |
| 后端 | Express + TypeScript + SQLite |
| 数据库 | `server/data/app.db` |
| 媒体文件 | `server/uploads/` |

前端通过 Vite 代理将 `/api` 请求转发到 `http://localhost:3001`。

## 定制

编辑 `src/constants/config.ts`：

| 配置项 | 说明 |
|--------|------|
| `siteTitle` | 网站标题 |
| `dedication` | 首次进入时的寄语 |

## 技术栈

- React + TypeScript + Vite
- Express + better-sqlite3
- Tailwind CSS v4 + [React Bits](https://reactbits.dev/) 风格动画
- Framer Motion 动画

## 图标替换

阶段图标配置在 `src/constants/icons.ts`，资源放在 `public/assets/icons/`。

将 `customSrc` 改为图片路径即可自动替换，例如：

```typescript
primary: { emoji: '🌱', customSrc: '/assets/icons/primary.png', lucide: Sprout },
```

## 说明

数据保存在服务端 SQLite 和 uploads 目录，部署时请备份 `server/data` 与 `server/uploads`。
