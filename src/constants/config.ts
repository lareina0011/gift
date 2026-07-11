/** 可在部署前修改这些配置，定制专属内容 */
export const APP_CONFIG = {
  /** 网站标题 */
  siteTitle: '拾光录',
  /** 登录页副标题 */
  loginSubtitle: '专属于你的那一本',
  /** 首次进入时的寄语 */
  dedication: `从懵懂入学到此刻，
每一步都算数，每一刻都值得被记住。
愿此间点滴，成为日后回望时最温柔的光。`,
  /** 底部进度条标签 */
  progressLabel: '时光足迹',
  /** 封面 Hero 区域 */
  hero: {
    label: '拾 · 光 · 录',
    title: '愿细碎的时光，都被温柔留下',
    description:
      '一段故事、一张照片、一帧画面，不必多特别，却都值得好好安放。在这里慢慢记下，日后再看，心里依然会暖。',
    exploreText: '开始记录',
    futureText: '写给未来',
  },
}

/** 默认账号由后端 server 启动时写入 SQLite，此处仅作文档参考 */
export const AUTH_ACCOUNTS = [
  {
    username: 'lareina',
    password: '20030621jjb',
    role: 'admin' as const,
  },
  {
    username: 'lemon',
    password: '20021007',
    role: 'admin' as const,
  },
]
