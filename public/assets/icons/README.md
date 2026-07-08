# 自定义图标资源

将图标文件放在此目录，然后在 `src/constants/icons.ts` 中配置 `customSrc`：

```typescript
primary: { emoji: '🌱', customSrc: '/assets/icons/primary.png', lucide: Sprout },
```

支持 PNG、SVG、WebP 等格式。
