export interface LocalServiceEnvelope<T = unknown> {
  code: number | string;
  msg: string;
  data: T;
}

export type XbrowserApiResponse<T = unknown> = LocalServiceEnvelope<T>;

export interface EnvListParams {
  size: number;
  page: number;
  id?: string;
  number?: string;
  groupId?: string;
  name?: string;
  proxyId?: string;
  platform?: string;
}

export interface EnvIdentityParams {
  id?: string;
  number?: string;
}

export interface EnvStartParams extends EnvIdentityParams {
  openIpTab?: number | string;
  startUpParam?: string[];
  headless?: number | string;
  skipProxyCheck?: number | string;
  timeout?: number;
}

export interface EnvCloseParams extends EnvIdentityParams {}

// ---- 代理配置 ----
export interface ProxyConfig {
  /** 代理渠道: 0-不使用代理, 1-自有代理, 2-API代理 */
  provider?: number;
  /** 代理类型: HTTP | HTTPS | SOCKS5 | SSH */
  type?: 'HTTP' | 'HTTPS' | 'SOCKS5' | 'SSH';
  /** 代理IP */
  address?: string;
  /** 代理端口 */
  port?: number;
  /** 代理账号 */
  hostAccount?: string;
  /** 代理密码 */
  hostPassword?: string;
  /** 刷新URL */
  refreshUrl?: string;
  /** 提取方式: 0-每次打开都提取, 1-失效后才提取 (provider=2时可用) */
  extractType?: 0 | 1;
  /** API代理提取链接 (provider=2时可用) */
  extractUrl?: string;
  /** IP查询渠道: IP2Location | IPApi */
  queryChannel?: 'IP2Location' | 'IPApi';
}

// ---- 平台账号信息 ----
export interface PlatformInfo {
  /** 平台账号编号 (与 platformAccountCodes 中的编号一致) */
  platformAccountCode?: number;
  /** 账号 */
  account?: string;
  /** 密码 */
  password?: string;
  /** 账号名称 */
  accountName?: string;
  /**
   * 平台名称枚举及对应默认 website:
   * - AliExpress    https://login.aliexpress.com/seller_new.htm
   * - Amazon        https://www.amazon.com/
   * - Bing          https://www.bing.com/
   * - DHgate        https://secure.dhgate.com/passport/login
   * - eBay          https://signin.ebay.com/
   * - Etsy          https://www.etsy.com/signin
   * - Facebook      https://www.facebook.com/
   * - Google        https://accounts.google.com/
   * - Instagram     https://www.instagram.com/
   * - LinkedIn      https://www.linkedin.com
   * - MicrosoftLive https://login.live.com/login.srf
   * - Payoneer      https://www.payoneer.com/
   * - PayPal        https://www.paypal.com/
   * - Shopee        https://seller.sg.shopee.cn/account/signin
   * - Shopify       https://accounts.shopify.com/lookup
   * - TikTok        https://www.tiktok.com/login
   * - Walmart       https://www.walmart.ca/sign-in
   * - WhatsApp      https://www.whatsapp.com/
   * - Wish          https://www.wish.com/account/login/
   * - X/Twitter     https://x.com/i/flow/login
   * - Yandex        https://passport.yandex.com/auth
   * - YouTube       https://www.youtube.com/
   * - CUSTOM        自定义平台, 不在上方列表时使用, website必填
   */
  platformName?: string;
  /**
   * 平台网址 (需带 https:// 前缀)
   * 默认使用 platformName 对应网址，指定时使用指定网址。
   * platformName=CUSTOM 时必填。
   */
  website?: string;
  /** 是否检查账号重复 */
  checkAccountRepeat?: boolean;
}

// ---- 账号信息 ----
export interface AccountInfo {
  /** 启动时打开的标签 URL 列表 */
  openUrl?: string[];
  /** Cookie 数据 */
  cookie?: Array<{
    name: string;
    value: string;
    domain?: string;
    path?: string;
    httpOnly?: boolean;
    secure?: boolean;
    expires?: number;
    sameSite?: string;
  }>;
  /** 平台账号编号列表 */
  platformAccountCodes?: string[];
  /** 平台账号列表 */
  platformsInfo?: PlatformInfo[];
  /** 2FA Key */
  faKey?: string;
}

// ---- 指纹信息 ----
export interface Fingerprint {
  /** 浏览器类型, 目前仅有 chrome (默认: chrome) */
  browserType?: string;
  /** 内核版本, 0 代表智能匹配 (默认: 0) */
  kernelVersion?: number;
  /** 操作系统平台: 0-Windows 1-Mac (默认: 0) */
  system?: 0 | 1;
  /** 系统版本号: Windows 11 | Windows 10 | MacOS 14 | MacOS 12 | MacOS 10 */
  osVersion?: string;
  /** UA版本号列表, [0] 代表全部 (默认: [0]) */
  uaVersion?: number[];
  /** 自定义 UA, 若指定则优先使用 */
  userAgent?: string;
}

// ---- 高级设置 ----
export interface AdvancedSetting {
  /** 时区开关: 0-关闭 1-基于IP (默认: 1) */
  autoTimeZone?: 0 | 1;
  /** 时区, autoTimeZone为3时必填, 如 GMT-12:00 Etc/GMT+12, LOCAL-本地时区 */
  timeZone?: string;
  /** WebRTC: TRANSFER-转发 REPLACE-替换 REAL-真实 BAN-禁用 (默认: BAN) */
  webRtcType?: 'TRANSFER' | 'REPLACE' | 'REAL' | 'BAN';
  /** 地理位置: ASK-询问 ALLOW-允许 BAN-禁用 (默认: ASK) */
  geoLocationType?: 'ASK' | 'ALLOW' | 'BAN';
  /** 地理位置基于IP匹配: 0-关闭 1-开启 (默认: 1) */
  autoGeoLocation?: 0 | 1;
  /** 经度 (autoGeoLocation为0时必填) */
  latitude?: string;
  /** 纬度 (autoGeoLocation为0时必填) */
  longitude?: string;
  /** 精度(米) (autoGeoLocation为0时必填) */
  accuracy?: string;
  /** 语言基于IP匹配: 0-关闭 1-开启 (默认: 1) */
  autoLanguage?: 0 | 1;
  /** 自定义语言列表 (autoLanguage为0时必填), 如 ["zh-CN", "en-US"] */
  language?: string[];
  /** 界面语言基于IP匹配: 0-关闭 1-开启 (默认: 1) */
  autoInterfaceLanguage?: 0 | 1;
  /** 界面语言 (autoInterfaceLanguage为0时必填), LOCAL-本地语言 */
  interfaceLanguage?: string;
  /** 分辨率类型: RANDOM | BASE_ON_UA | CUSTOM (默认: BASE_ON_UA) */
  resolutionType?: 'RANDOM' | 'BASE_ON_UA' | 'CUSTOM';
  /** 分辨率宽度 (resolutionType为CUSTOM时必填, 范围 1-9999) */
  resolutionWidth?: number;
  /** 分辨率高度 (resolutionType为CUSTOM时必填, 范围 1-9999) */
  resolutionHeight?: number;
  /** 字体类型: DEFAULT | CUSTOM (默认: DEFAULT) */
  fontType?: 'DEFAULT' | 'CUSTOM';
  /** 字体列表 (fontType为CUSTOM时必填), 如 ["Arial"] */
  font?: string[];
  /** Canvas: NOISE-噪声 REAL-真实 (默认: NOISE) */
  canvasType?: 'NOISE' | 'REAL';
  /** WebGL图像: NOISE-噪声 REAL-真实 (默认: NOISE) */
  webglImageType?: 'NOISE' | 'REAL';
  /** WebGL元数据: NOISE-噪声 REAL-真实 (默认: NOISE) */
  webglMetaType?: 'NOISE' | 'REAL';
  /** WebGPU: BASEONWEBGL | REAL | BAN (默认: BASEONWEBGL) */
  webGpuType?: 'BASEONWEBGL' | 'REAL' | 'BAN';
  /** 语音内容: NOISE-噪声 REAL-真实 (默认: NOISE) */
  audioContextType?: 'NOISE' | 'REAL';
  /** 媒体设备: NOISE-噪声 REAL-真实 (默认: NOISE) */
  mediaDeviceType?: 'NOISE' | 'REAL';
  /** 基于电脑匹配媒体设备数量: 0-关闭 1-开启 (默认: 1) */
  matchDeviceNum?: 0 | 1;
  /** 麦克风数量 (matchDeviceNum为0时必填) */
  microphoneNum?: number;
  /** 扬声器数量 (matchDeviceNum为0时必填) */
  speakerNum?: number;
  /** 摄像机数量 (matchDeviceNum为0时必填) */
  cameraNum?: number;
  /** SpeechVoices: NOISE-噪声 REAL-真实 (默认: NOISE) */
  speechVoiceType?: 'NOISE' | 'REAL';
  /** ClientRects: NOISE-噪声 REAL-真实 (默认: NOISE) */
  clientRectsType?: 'NOISE' | 'REAL';
  /** CPU核心数 (默认: 4, 可选: 4,6,8,10,12,16,20,24) */
  hardwareConcurrencyNum?: number;
  /** 内存数量GB (默认: 8, 可选: 2,4,8) */
  deviceMemory?: number;
  /** 设备名称类型: CUSTOM | REAL (默认: CUSTOM) */
  deviceNameType?: 'CUSTOM' | 'REAL';
  /** 设备名称 (deviceNameType为CUSTOM时必填) */
  deviceName?: string;
  /** MAC地址类型: CUSTOM | REAL (默认: CUSTOM) */
  deviceMacType?: 'CUSTOM' | 'REAL';
  /** MAC地址 (deviceMacType为CUSTOM时必填) */
  deviceMac?: string;
  /** Do Not Track: DEFAULT | OPEN | CLOSE (默认: DEFAULT) */
  trackType?: 'DEFAULT' | 'OPEN' | 'CLOSE';
  /** 端口扫描保护: 0-关闭 1-开启 (默认: 1) */
  protectScanPort?: 0 | 1;
  /** 允许扫描的端口列表 */
  allowedScanPort?: string[];
  /** 硬件加速: DEFAULT | OPEN | CLOSE (默认: DEFAULT) */
  hardwareAccelerateType?: 'DEFAULT' | 'OPEN' | 'CLOSE';
  /** 内核启动参数列表 */
  startupParam?: string[];
}

export interface EnvAddParams {
  /** 环境名称 */
  name?: string;
  /** 分组ID */
  groupId?: string;
  /** 备注 */
  remark?: string;
  /** 代理ID (与 proxyConfig 二选一, 优先使用代理ID) */
  proxyId?: string;
  /** 代理配置 (与 proxyId 二选一) */
  proxyConfig?: ProxyConfig;
  /** 账号信息 */
  accountInfo?: AccountInfo;
  /** 指纹信息 */
  fingerprint?: Fingerprint;
  /** 高级设置 */
  advancedSetting?: AdvancedSetting;
}

export interface EnvUpdateParams extends EnvAddParams {
  id?: string;
  number?: string;
}

export interface EnvDeleteParams {
  ids: string[];
  clearEnvFolder?: 0 | 1;
}

export interface EnvUpdateGroupParams {
  ids: string[];
  groupId: string;
}

export interface EnvClearCacheParams {
  id: string;
  clearEnvFolder?: 0 | 1;
  cacheList?: string[];
}

export interface GroupListParams {
  name?: string;
  id?: string;
  size?: number;
  page?: number;
}

export interface GroupAddParams {
  name: string;
  [key: string]: any;
}

export interface GroupUpdateParams extends GroupAddParams {
  id: string;
}

export interface GroupDeleteParams {
  ids: string[];
}

export interface ProxyListParams {
  size: number;
  page: number;
  id?: string;
  type?: string;
  host?: string;
}

export interface ProxyAddParams {
  [key: string]: any;
}

export interface ProxyUpdateParams extends ProxyAddParams {}

export interface ProxyDeleteParams {
  ids: string[];
}

export interface ArrangeWindowsParams {
  [key: string]: any;
}

export interface OpenedEnvProfile {
  puppeteer: string;
  selenium: string;
  debug_port: string;
  webdriver: string;
  marionettePort?: string;
  number?: string;
}

export type OpenEnvResult = OpenedEnvProfile;
