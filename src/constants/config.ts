/** 可在部署前修改这些配置，定制专属内容 */
export const APP_CONFIG = {
  /** 网站标题 */
  siteTitle: '拾光录',
  /** 登录页副标题 */
  loginSubtitle: '记录点滴，回望时光',
  /** 首次进入时的寄语 */
  dedication: `从懵懂入学到此刻，
每一步都算数，每一刻都值得被记住。
愿此间点滴，成为日后回望时最温柔的光。`,
  /** 底部进度条标签 */
  progressLabel: '时光足迹',
  /** 封面 Hero 区域 */
  hero: {
    label: 'MEMORY ALBUM',
    title: '把时光装进这里',
    description:
      '写下一段故事，存下一张照片，留下一段视频——日后翻看，皆是温暖。',
    exploreText: '开始记录',
    futureText: '写给未来',
  },
}

/** 登录账号配置（首次使用时的默认账号，修改密码后会保存在浏览器本地） */
export const AUTH_ACCOUNTS = [
  {
    username: 'lemon',
    password: '20021007',
    role: 'admin' as const,
  },
]
