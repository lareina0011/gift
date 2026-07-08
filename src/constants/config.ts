/** 可在部署前修改这些配置，定制专属礼物 */
export const APP_CONFIG = {
  /** 网站标题 */
  siteTitle: '求学之路',
  /** 登录页副标题 */
  loginSubtitle: '一份记录成长与梦想的专属礼物',
  /** 首次进入时的寄语 */
  dedication: `从懵懂入学到今日毕业，
每一步都算数，每一刻都值得被记住。
愿此间点滴，成为日后回望时最温柔的光。`,
  /** 底部进度条标签 */
  progressLabel: '人生求学进度',
}

/** 登录账号配置（首次使用时的默认账号，修改密码后会保存在浏览器本地） */
export const AUTH_ACCOUNTS = [
  {
    username: 'lemon',
    password: '20021007',
    role: 'admin' as const,
  },
]
