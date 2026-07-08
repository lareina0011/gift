# 求学之路 · 毕业礼物网站

一份记录求学阶段点滴的专属毕业礼物网站。

## 功能

- **登录页** — 账号 + 密码，Plasma 动态背景（[React Bits](https://reactbits.dev/backgrounds/plasma)）
- **六个求学阶段 Tab** — 小学、初中、高中、大学、研究生、未来
- **回忆记录** — 标题、日期、文字故事
- **图片 / 视频上传** — 本地存储，支持预览与灯箱浏览
- **底部进度条** — 切换阶段时平滑动画，展示人生求学进度
- **未来愿望墙** — 「未来」Tab 可许下对未来的期待
- **首次欢迎寄语** — 登录后弹出专属 dedication 文字

## 快速开始

```bash
npm install
npm run dev
```

浏览器打开 http://localhost:5173，使用 `src/constants/config.ts` 中配置的账号密码登录。

## 定制

编辑 `src/constants/config.ts`：

| 配置项 | 说明 |
|--------|------|
| `siteTitle` | 网站标题 |
| `dedication` | 首次进入时的寄语 |

## 技术栈

- React + TypeScript + Vite
- Tailwind CSS v4 + [React Bits](https://reactbits.dev/) 风格动画
- Framer Motion 动画
- IndexedDB + localStorage 本地持久化

## 图标替换

阶段图标配置在 `src/constants/icons.ts`，资源放在 `public/assets/icons/`。

将 `customSrc` 改为图片路径即可自动替换，例如：

```typescript
primary: { emoji: '🌱', customSrc: '/assets/icons/primary.png', lucide: Sprout },
```

## 说明

数据保存在浏览器本地，清除浏览器数据会丢失记录。送礼前建议先录入内容，或后续可扩展导出功能。
