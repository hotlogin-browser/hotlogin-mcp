import { z } from 'zod';
import type { ZodTypeAny } from 'zod';

const textArray = z.array(z.string());

/**
 * platformName 平台名称枚举及对应默认 website:
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
 *
 * 注意: website 默认使用平台对应网址, 指定时使用指定网址
 */
const platformNameSchema = z.string()
  .describe(
    'platformName 平台名称: AliExpress | Amazon | Bing | DHgate | eBay | Etsy | ' +
    'Facebook | Google | Instagram | LinkedIn | MicrosoftLive | Payoneer | PayPal | ' +
    'Shopee | Shopify | TikTok | Walmart | WhatsApp | Wish | X/Twitter | Yandex | YouTube | ' +
    'CUSTOM(自定义,website必填)'
  );

const platformsInfoItemSchema = z.object({
  /** 平台账号编号 (与 platformAccountCodes 中的编号一致) */
  platformAccountCode: z.number().optional(),
  account: z.string().optional(),
  password: z.string().optional(),
  accountName: z.string().optional(),
  /**
   * 平台名称枚举: AliExpress | Amazon | Bing | DHgate | eBay | Etsy |
   * Facebook | Google | Instagram | LinkedIn | MicrosoftLive | Payoneer | PayPal |
   * Shopee | Shopify | TikTok | Walmart | WhatsApp | Wish | X/Twitter | Yandex | YouTube |
   * CUSTOM(自定义平台,website必填)
   */
  platformName: platformNameSchema.optional(),
  /**
   * 平台网址需带 https:// 前缀。
   * 默认使用 platformName 对应网址，指定时使用指定网址。
   * platformName=CUSTOM 时必填。
   */
  website: z.string().optional(),
  checkAccountRepeat: z.boolean().optional()
});

const identityShape = {
  id: z.string().optional(),
  number: z.string().optional()
};

export const toolSchemas = {
  empty: z.object({}),
  envQuery: z.object({
    page: z.number().default(1),
    size: z.number().max(20).default(10),
    id: z.string().optional(),
    number: z.string().optional(),
    groupId: z.string().optional(),
    name: z.string().optional(),
    remark: z.string().optional(),
    proxyId: z.string().optional(),
    platform: z.string().optional()
  }),
  envIdentity: z.object(identityShape),
  envCreate: z.object({
    /** 环境名称 */
    name: z.string().optional(),
    /** 分组ID */
    groupId: z.string().optional(),
    /** 备注 */
    remark: z.string().optional(),
    /** 代理ID (与proxyConfig二选一, 优先使用代理ID) */
    proxyId: z.string().optional(),
    /** 代理配置 */
    proxyConfig: z.object({
      /** 代理渠道: 0-不使用, 1-自有代理, 2-API代理 */
      provider: z.number().optional(),
      /** 代理类型: HTTP | HTTPS | SOCKS5 | SSH */
      type: z.enum(['HTTP', 'HTTPS', 'SOCKS5', 'SSH']).optional(),
      /** 代理IP */
      address: z.string().optional(),
      /** 代理端口 */
      port: z.number().optional(),
      /** 代理账号 */
      hostAccount: z.string().optional(),
      /** 代理密码 */
      hostPassword: z.string().optional(),
      /** 刷新URL */
      refreshUrl: z.string().optional(),
      /** 提取方式: 0-每次提取, 1-失效后提取 */
      extractType: z.union([z.literal(0), z.literal(1)]).optional(),
      /** API代理提取链接 */
      extractUrl: z.string().optional(),
      /** IP查询渠道: IP2Location | IPApi (默认: IP2Location) */
      queryChannel: z.enum(['IP2Location', 'IPApi']).optional()
    }).optional(),
    /** 账号信息 */
    accountInfo: z.object({
      /** 启动时打开的标签URL列表 */
      openUrl: z.array(z.string()).optional(),
      /** Cookie数据 */
      cookie: z.array(z.object({
        name: z.string(),
        value: z.string(),
        domain: z.string().optional(),
        path: z.string().optional(),
        httpOnly: z.boolean().optional(),
        secure: z.boolean().optional(),
        expires: z.number().optional(),
        sameSite: z.string().optional()
      })).optional(),
      /** 平台账号编号列表 */
      platformAccountCodes: z.array(z.string()).optional(),
      /** 平台账号列表 */
      platformsInfo: z.array(platformsInfoItemSchema).optional(),
      /** 2FA Key */
      faKey: z.string().optional()
    }).optional(),
    /** 指纹信息 */
    fingerprint: z.object({
      /** 浏览器类型, 默认 chrome */
      browserType: z.string().optional(),
      /** 内核版本, 0=智能匹配 (默认: 0) */
      kernelVersion: z.number().optional(),
      /** 操作系统: 0-Windows 1-Mac (默认: 0) */
      system: z.union([z.literal(0), z.literal(1)]).optional(),
      /** 系统版本: Windows 11 | Windows 10 | MacOS 14 | MacOS 12 | MacOS 10 */
      osVersion: z.string().optional(),
      /** UA版本号列表, [0]代表全部 (默认: ["0"]) */
      uaVersion: z.array(z.union([z.number(), z.string()])).optional(),
      /** 自定义UA, 若指定则优先使用 */
      userAgent: z.string().optional()
    }).optional(),
    /** 高级设置 */
    advancedSetting: z.object({
      /** 时区开关: 0-关闭 1-基于IP (默认: 1) */
      autoTimeZone: z.union([z.literal(0), z.literal(1)]).optional(),
      /** 时区, 如 GMT-12:00 Etc/GMT+12, LOCAL-本地时区 */
      timeZone: z.string().optional(),
      /** WebRTC: TRANSFER | REPLACE | REAL | BAN (默认: BAN) */
      webRtcType: z.enum(['TRANSFER', 'REPLACE', 'REAL', 'BAN']).optional(),
      /** 地理位置: ASK | ALLOW | BAN (默认: ASK) */
      geoLocationType: z.enum(['ASK', 'ALLOW', 'BAN']).optional(),
      /** 地理位置基于IP: 0-关闭 1-开启 (默认: 1) */
      autoGeoLocation: z.union([z.literal(0), z.literal(1)]).optional(),
      /** 经度 */
      latitude: z.string().optional(),
      /** 纬度 */
      longitude: z.string().optional(),
      /** 精度(米) */
      accuracy: z.string().optional(),
      /** 语言基于IP: 0-关闭 1-开启 (默认: 1) */
      autoLanguage: z.union([z.literal(0), z.literal(1)]).optional(),
      /** 自定义语言列表, 如 ["zh-CN"] */
      language: z.array(z.string()).optional(),
      /** 界面语言基于IP: 0-关闭 1-开启 (默认: 1) */
      autoInterfaceLanguage: z.union([z.literal(0), z.literal(1)]).optional(),
      /** 界面语言, LOCAL-本地语言 */
      interfaceLanguage: z.string().optional(),
      /** 分辨率类型: RANDOM | BASE_ON_UA | CUSTOM (默认: BASE_ON_UA) */
      resolutionType: z.enum(['RANDOM', 'BASE_ON_UA', 'CUSTOM']).optional(),
      /** 分辨率宽度 (CUSTOM时必填, 1-9999) */
      resolutionWidth: z.number().optional(),
      /** 分辨率高度 (CUSTOM时必填, 1-9999) */
      resolutionHeight: z.number().optional(),
      /** 字体类型: DEFAULT | CUSTOM (默认: DEFAULT) */
      fontType: z.enum(['DEFAULT', 'CUSTOM']).optional(),
      /** 字体列表 (CUSTOM时必填) */
      font: z.array(z.string()).optional(),
      /** Canvas: NOISE | REAL (默认: NOISE) */
      canvasType: z.enum(['NOISE', 'REAL']).optional(),
      /** WebGL图像: NOISE | REAL (默认: NOISE) */
      webglImageType: z.enum(['NOISE', 'REAL']).optional(),
      /** WebGL元数据: NOISE | REAL (默认: NOISE) */
      webglMetaType: z.enum(['NOISE', 'REAL']).optional(),
      /** WebGPU: BASEONWEBGL | REAL | BAN (默认: BASEONWEBGL) */
      webGpuType: z.enum(['BASEONWEBGL', 'REAL', 'BAN']).optional(),
      /** 语音内容: NOISE | REAL (默认: NOISE) */
      audioContextType: z.enum(['NOISE', 'REAL']).optional(),
      /** 媒体设备: NOISE | REAL (默认: NOISE) */
      mediaDeviceType: z.enum(['NOISE', 'REAL']).optional(),
      /** 基于电脑匹配媒体设备数量: 0-关闭 1-开启 (默认: 1) */
      matchDeviceNum: z.union([z.literal(0), z.literal(1)]).optional(),
      /** 麦克风数量 */
      microphoneNum: z.number().optional(),
      /** 扪声器数量 */
      speakerNum: z.number().optional(),
      /** 摄像机数量 */
      cameraNum: z.number().optional(),
      /** SpeechVoices: NOISE | REAL (默认: NOISE) */
      speechVoiceType: z.enum(['NOISE', 'REAL']).optional(),
      /** ClientRects: NOISE | REAL (默认: NOISE) */
      clientRectsType: z.enum(['NOISE', 'REAL']).optional(),
      /** CPU核心数 (默认: 4, 可选: 4,6,8,10,12,16,20,24) */
      hardwareConcurrencyNum: z.number().optional(),
      /** 内存GB (默认: 8, 可选: 2,4,8) */
      deviceMemory: z.number().optional(),
      /** 设备名称类型: CUSTOM | REAL (默认: CUSTOM) */
      deviceNameType: z.enum(['CUSTOM', 'REAL']).optional(),
      /** 设备名称 */
      deviceName: z.string().optional(),
      /** MAC地址类型: CUSTOM | REAL (默认: CUSTOM) */
      deviceMacType: z.enum(['CUSTOM', 'REAL']).optional(),
      /** MAC地址 */
      deviceMac: z.string().optional(),
      /** Do Not Track: DEFAULT | OPEN | CLOSE (默认: DEFAULT) */
      trackType: z.enum(['DEFAULT', 'OPEN', 'CLOSE']).optional(),
      /** 端口扫描保护: 0-关闭 1-开启 (默认: 1) */
      protectScanPort: z.union([z.literal(0), z.literal(1)]).optional(),
      /** 允许扫描的端口列表 */
      allowedScanPort: z.array(z.string()).optional(),
      /** 硬件加速: DEFAULT | OPEN | CLOSE (默认: DEFAULT) */
      hardwareAccelerateType: z.enum(['DEFAULT', 'OPEN', 'CLOSE']).optional(),
      /** 内核启动参数列表 */
      startupParam: z.array(z.string()).optional()
    }).optional()
  }),
  envRevise: z.object({
    id: z.string().optional(),
    number: z.string().optional(),
    name: z.string().optional(),
    groupId: z.string().optional(),
    remark: z.string().optional(),
    proxyId: z.string().optional(),
    proxyConfig: z.object({
      provider: z.number().optional(),
      type: z.enum(['HTTP', 'HTTPS', 'SOCKS5', 'SSH']).optional(),
      address: z.string().optional(),
      port: z.number().optional(),
      hostAccount: z.string().optional(),
      hostPassword: z.string().optional(),
      refreshUrl: z.string().optional(),
      extractType: z.union([z.literal(0), z.literal(1)]).optional(),
      extractUrl: z.string().optional(),
      queryChannel: z.enum(['IP2Location', 'IPApi']).optional()
    }).optional(),
    accountInfo: z.object({
      openUrl: z.array(z.string()).optional(),
      cookie: z.array(z.object({
        name: z.string(),
        value: z.string(),
        domain: z.string().optional(),
        path: z.string().optional(),
        httpOnly: z.boolean().optional(),
        secure: z.boolean().optional(),
        expires: z.number().optional(),
        sameSite: z.string().optional()
      })).optional(),
      platformAccountCodes: z.array(z.string()).optional(),
      platformsInfo: z.array(platformsInfoItemSchema).optional(),
      faKey: z.string().optional()
    }).optional(),
    fingerprint: z.object({
      browserType: z.string().optional(),
      kernelVersion: z.number().optional(),
      system: z.union([z.literal(0), z.literal(1)]).optional(),
      osVersion: z.string().optional(),
      uaVersion: z.array(z.union([z.number(), z.string()])).optional(),
      userAgent: z.string().optional()
    }).optional(),
    advancedSetting: z.object({
      autoTimeZone: z.union([z.literal(0), z.literal(1)]).optional(),
      timeZone: z.string().optional(),
      webRtcType: z.enum(['TRANSFER', 'REPLACE', 'REAL', 'BAN']).optional(),
      geoLocationType: z.enum(['ASK', 'ALLOW', 'BAN']).optional(),
      autoGeoLocation: z.union([z.literal(0), z.literal(1)]).optional(),
      latitude: z.string().optional(),
      longitude: z.string().optional(),
      accuracy: z.string().optional(),
      autoLanguage: z.union([z.literal(0), z.literal(1)]).optional(),
      language: z.array(z.string()).optional(),
      autoInterfaceLanguage: z.union([z.literal(0), z.literal(1)]).optional(),
      interfaceLanguage: z.string().optional(),
      resolutionType: z.enum(['RANDOM', 'BASE_ON_UA', 'CUSTOM']).optional(),
      resolutionWidth: z.number().optional(),
      resolutionHeight: z.number().optional(),
      fontType: z.enum(['DEFAULT', 'CUSTOM']).optional(),
      font: z.array(z.string()).optional(),
      canvasType: z.enum(['NOISE', 'REAL']).optional(),
      webglImageType: z.enum(['NOISE', 'REAL']).optional(),
      webglMetaType: z.enum(['NOISE', 'REAL']).optional(),
      webGpuType: z.enum(['BASEONWEBGL', 'REAL', 'BAN']).optional(),
      audioContextType: z.enum(['NOISE', 'REAL']).optional(),
      mediaDeviceType: z.enum(['NOISE', 'REAL']).optional(),
      matchDeviceNum: z.union([z.literal(0), z.literal(1)]).optional(),
      microphoneNum: z.number().optional(),
      speakerNum: z.number().optional(),
      cameraNum: z.number().optional(),
      speechVoiceType: z.enum(['NOISE', 'REAL']).optional(),
      clientRectsType: z.enum(['NOISE', 'REAL']).optional(),
      hardwareConcurrencyNum: z.number().optional(),
      deviceMemory: z.number().optional(),
      deviceNameType: z.enum(['CUSTOM', 'REAL']).optional(),
      deviceName: z.string().optional(),
      deviceMacType: z.enum(['CUSTOM', 'REAL']).optional(),
      deviceMac: z.string().optional(),
      trackType: z.enum(['DEFAULT', 'OPEN', 'CLOSE']).optional(),
      protectScanPort: z.union([z.literal(0), z.literal(1)]).optional(),
      allowedScanPort: z.array(z.string()).optional(),
      hardwareAccelerateType: z.enum(['DEFAULT', 'OPEN', 'CLOSE']).optional(),
      startupParam: z.array(z.string()).optional()
    }).optional()
  }),
  envTransferGroup: z.object({
    ids: z.array(z.string()),
    groupId: z.string()
  }),
  envRemove: z.object({
    ids: z.array(z.string()),
    clearEnvFolder: z.union([z.literal(0), z.literal(1)]).optional()
  }),
  envPurgeCache: z.object({
    id: z.string(),
    cacheList: textArray,
    clearEnvFolder: z.union([z.literal(0), z.literal(1)]).optional()
  }),
  envLaunch: z.object({
    id: z.string().optional(),
    number: z.string().optional(),
    openIpTab: z.union([z.number(), z.string()]).optional(),
    startUpParam: textArray.optional(),
    headless: z.union([z.number(), z.string()]).optional(),
    skipProxyCheck: z.union([z.number(), z.string()]).optional(),
    timeout: z.number().optional()
  }),
  envTerminate: z.object(identityShape),
  envWindowLayout: z.object({
    auto: z.boolean().optional(),
    mode: z.number().optional(),
    config: z.object({
      xStart: z.number().optional(),
      yStart: z.number().optional(),
      width: z.number().optional(),
      height: z.number().optional(),
      xSpace: z.number().optional(),
      ySpace: z.number().optional(),
      cols: z.number().optional()
    }).optional()
  }),
  groupQuery: z.object({
    page: z.number().default(1),
    size: z.number().max(20).default(10),
    id: z.string().optional(),
    name: z.string().optional()
  }),
  groupCreate: z.object({
    name: z.string(),
    remark: z.string().optional()
  }),
  groupRevise: z.object({
    id: z.string(),
    name: z.string(),
    remark: z.string().optional()
  }),
  groupRemove: z.object({
    ids: z.array(z.string())
  }),
  proxyQuery: z.object({
    page: z.number().default(1),
    size: z.number().max(20).default(10),
    id: z.string().optional(),
    provider: z.number().optional(),
    type: z.enum(['HTTP', 'HTTPS', 'SOCKS5', 'SSH']).optional(),
    status: z.number().optional(),
    address: z.string().optional(),
    remark: z.string().optional()
  }),
  proxyCreate: z.object({
    address: z.string().optional(),
    port: z.number().optional(),
    type: z.enum(['HTTP', 'HTTPS', 'SOCKS5', 'SSH']),
    agentGroupName: z.string().optional(),
    hostAccount: z.string().optional(),
    hostPassword: z.string().optional(),
    refreshUrl: z.string().optional(),
    provider: z.number().optional().default(1),
    queryChannel: z.enum(['IP2Location', 'IPApi']).optional().default('IP2Location'),
    extractType: z.number().optional(),
    extractUrl: z.string().optional(),
    remark: z.string().optional()
  }),
  proxyRevise: z.object({
    id: z.string(),
    provider: z.number().default(1),
    type: z.enum(['HTTP', 'HTTPS', 'SOCKS5', 'SSH']).optional(),
    agentGroupName: z.string().optional(),
    address: z.string().optional(),
    port: z.number().optional(),
    hostAccount: z.string().optional(),
    hostPassword: z.string().optional(),
    refreshUrl: z.string().optional(),
    queryChannel: z.enum(['IP2Location', 'IPApi']).optional(),
    extractType: z.number().optional(),
    extractUrl: z.string().optional(),
    remark: z.string().optional()
  }),
  proxyRemove: z.object({
    ids: z.array(z.string())
  }),

  // ── Pilot 浏览器自动化 ───────────────────────────────────────
  /** 连接浏览器会话: wsEndpoint 来自 env_launch 返回的 puppeteer 字段 */
  sessionAttach: z.object({
    wsEndpoint: z.string().describe('WebSocket endpoint from env_launch (puppeteer field)')
  }),

  /** 页面跳转 */
  pageVisit: z.object({
    url: z.string().describe('Target URL to navigate to')
  }),

  /** 截图 */
  pageCapture: z.object({
    savePath: z.string().optional().describe('Local directory to save the screenshot'),
    fullPage: z.boolean().optional().describe('Capture full scrollable page (default: false)')
  }),

  /** 点击元素 */
  elementTap: z.object({
    selector: z.string().describe('CSS selector of the element to click')
  }),

  /** 点击 iframe 内的元素 */
  elementFrameTap: z.object({
    frameSelector: z.string().describe('CSS/XPath selector of the iframe'),
    selector: z.string().describe('CSS selector of the element inside the iframe')
  }),

  /** 填写输入框 */
  elementWrite: z.object({
    selector: z.string().describe('CSS selector of the input element'),
    text: z.string().describe('Text to fill into the input')
  }),

  /** 选择下拉框 */
  elementPick: z.object({
    selector: z.string().describe('CSS selector of the <select> element'),
    value: z.string().describe('Option value to select')
  }),

  /** 鼠标悬停 */
  elementHover: z.object({
    selector: z.string().describe('CSS selector of the element to hover')
  }),

  /** 滚动到元素 */
  elementScroll: z.object({
    selector: z.string().describe('CSS selector of the element to scroll into view')
  }),

  /** 拖拽元素 */
  elementMove: z.object({
    selector: z.string().describe('CSS selector of the element to drag'),
    targetSelector: z.string().describe('CSS selector of the drop target')
  }),

  /** 键盘按键 */
  keyPress: z.object({
    key: z.string().describe('Key name, e.g. Enter, Tab, Escape, ArrowDown'),
    selector: z.string().optional().describe('Optional CSS selector to focus before pressing the key')
  }),

  /** 执行 JS 脚本 */
  scriptEval: z.object({
    script: z.string().describe('JavaScript expression to evaluate in the page context')
  }),

  // ── Pilot 扩展工具 ──────────────────────────────────────────────
  /** 等待页面加载 */
  pageWaitLoad: z.object({
    timeout: z.number().optional().describe('Max wait time in ms (default: 30000)')
  }),

  /** 页面重载 */
  pageReload: z.object({
    waitLoad: z.boolean().optional().describe('Wait for load event after reload (default: true)')
  }),

  /** 等待元素出现 */
  elementWait: z.object({
    selector: z.string().describe('CSS selector to wait for'),
    timeout: z.number().optional().describe('Max wait time in ms (default: 30000)')
  }),

  /** 检测元素是否存在 */
  elementExists: z.object({
    selector: z.string().describe('CSS selector to check')
  }),

  /** 获取元素文本 */
  elementText: z.object({
    selector: z.string().describe('CSS selector of the element')
  }),

  /** 获取元素属性值 */
  elementAttr: z.object({
    selector: z.string().describe('CSS selector of the element'),
    attr: z.string().describe('Attribute name, e.g. href, src, value, class')
  }),

  /** 统计匹配元素数量 */
  elementCount: z.object({
    selector: z.string().describe('CSS selector to count')
  }),

  /** 勾选 checkbox */
  elementCheck: z.object({
    selector: z.string().describe('CSS selector of the checkbox')
  }),

  /** 取消勾选 checkbox */
  elementUncheck: z.object({
    selector: z.string().describe('CSS selector of the checkbox')
  }),

  /** 鼠标点击指定坐标 */
  mouseClickPos: z.object({
    x: z.number().describe('X coordinate in pixels'),
    y: z.number().describe('Y coordinate in pixels'),
    button: z.enum(['left', 'right', 'middle']).optional().describe('Mouse button (default: left)')
  }),

  /** 读取 Cookie */
  cookieRead: z.object({
    domain: z.string().optional().describe('Filter cookies by domain (partial match)')
  }),

  /** 写入单条 Cookie */
  cookieWrite: z.object({
    name: z.string(),
    value: z.string(),
    domain: z.string().optional(),
    path: z.string().optional(),
    httpOnly: z.boolean().optional(),
    secure: z.boolean().optional(),
    expires: z.number().optional().describe('Unix timestamp in seconds')
  }),

  /** 清除 Cookie */
  cookieClear: z.object({
    domain: z.string().optional().describe('Clear only cookies matching this domain; omit to clear all')
  }),

  /** 读取 localStorage / sessionStorage */
  storageRead: z.object({
    storageType: z.enum(['local', 'session']).describe('local = localStorage, session = sessionStorage'),
    key: z.string().optional().describe('Specific key to read; omit to read all')
  }),

  /** 写入 localStorage / sessionStorage */
  storageWrite: z.object({
    storageType: z.enum(['local', 'session']).describe('local = localStorage, session = sessionStorage'),
    key: z.string(),
    value: z.string()
  }),

  /** 自动处理 alert / confirm / prompt 弹窗 */
  dialogHandle: z.object({
    action: z.enum(['accept', 'dismiss']).describe('accept to confirm / dismiss to cancel'),
    promptText: z.string().optional().describe('Text to fill when dialog is a prompt')
  })
} as const;

export function schemaShape(schema: ZodTypeAny): Record<string, ZodTypeAny> {
  if ('shape' in schema && typeof schema.shape === 'object' && schema.shape !== null) {
    return schema.shape as Record<string, ZodTypeAny>;
  }

  if ('_def' in schema) {
    const definition = (schema as any)._def;
    if (definition && 'schema' in definition) {
      return schemaShape(definition.schema);
    }
  }

  throw new Error('Unable to extract schema shape');
}
