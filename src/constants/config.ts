/** 可在部署前修改这些配置，定制专属内容 */
export const APP_CONFIG = {
  /** 网站标题 */
  siteTitle: '拾光录',
  /** 登录页副标题 */
  loginSubtitle: '专属于你的那一本',
  /** 首次进入时的寄语 */
  dedication: `从懵懂入学到此刻，
每一步都算数，每一刻都值得被记住。
愿你所信所教，都温柔有光。`,
  /** 底部进度条标签 */
  progressLabel: '时光足迹',
  /** 封面 Hero 区域 */
  hero: {
    label: '拾 · 光 · 录',
    title: '愿细碎的时光，都被温柔留下',
    description:
      '不必件件盛大。那些被风翻过的书页、讲台上初亮的志气、不经意留下的笑，都足够成为记忆的褶皱。收进这一本里，某天翻开，仍能听见旧日的温度。',
    exploreText: '开始记录',
    futureText: '写给未来',
  },
}

/** 默认账号由后端 server 启动时写入 SQLite，此处仅作文档参考 */
export const AUTH_ACCOUNTS = [
  {
    username: 'lareina',
    password: '20030621jjb',
    role: 'editor' as const,
  },
  {
    username: 'lemon',
    password: '20021007',
    role: 'viewer' as const,
  },
]
