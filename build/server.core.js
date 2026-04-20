#!/usr/bin/env node
'use strict';

var axios = require('axios');
var fs = require('fs');
var path = require('path');
var os = require('os');
var zod = require('zod');
var mcp_js = require('@modelcontextprotocol/sdk/server/mcp.js');
var stdio_js = require('@modelcontextprotocol/sdk/server/stdio.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var axios__default = /*#__PURE__*/_interopDefault(axios);

var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/api/config.ts
function resolveRuntimeProfile() {
  const port = process.env.API_PORT || process.env.PORT || DEFAULT_LOCAL_API_PORT;
  const origin = process.env.BASE_URL || `http://127.0.0.1:${port}`;
  return {
    port,
    token: process.env.API_KEY,
    origin
  };
}
var DEFAULT_LOCAL_API_PORT, runtimeProfile, LOCAL_SERVICE_PORT, LOCAL_SERVICE_TOKEN, LOCAL_SERVICE_ENDPOINT;
var init_config = __esm({
  "src/api/config.ts"() {
    DEFAULT_LOCAL_API_PORT = "60000";
    runtimeProfile = resolveRuntimeProfile();
    LOCAL_SERVICE_PORT = runtimeProfile.port;
    LOCAL_SERVICE_TOKEN = runtimeProfile.token;
    LOCAL_SERVICE_ENDPOINT = runtimeProfile.origin;
  }
});
var serviceOrigin, localRoutes, localRequest, withOrigin;
var init_client = __esm({
  "src/api/client.ts"() {
    init_config();
    serviceOrigin = LOCAL_SERVICE_ENDPOINT || `http://127.0.0.1:${LOCAL_SERVICE_PORT}`;
    localRoutes = {
      health: "/api/v2/status",
      envCreate: "/api/v2/env/add",
      envSearch: "/api/v2/env/list",
      envProfile: "/api/v2/env/detail",
      envCookie: "/api/v2/env/getCookie",
      envModify: "/api/v2/env/update",
      envMoveGroup: "/api/v2/env/updateGroup",
      envRemove: "/api/v2/env/delete",
      envPurgeCache: "/api/v2/env/clearCache",
      envLaunch: "/api/v2/env/start",
      envTerminate: "/api/v2/env/close",
      envTerminateAll: "/api/v2/env/closeAll",
      envRuntimeState: "/api/v2/env/checkStatus",
      envOpenedCollection: "/api/v2/env/checkOpenStatus",
      envWindowLayout: "/api/v2/env/arrangeWindows",
      groupCreate: "/api/v2/group/add",
      groupModify: "/api/v2/group/update",
      groupRemove: "/api/v2/group/delete",
      groupSearch: "/api/v2/group/list",
      proxyCreate: "/api/v2/proxy/add",
      proxyModify: "/api/v2/proxy/update",
      proxyRemove: "/api/v2/proxy/delete",
      proxySearch: "/api/v2/proxy/list"
    };
    localRequest = axios__default.default.create({
      headers: LOCAL_SERVICE_TOKEN ? {
        Authorization: `Bearer ${LOCAL_SERVICE_TOKEN}`,
        API_KEY: LOCAL_SERVICE_TOKEN
      } : void 0
    });
    withOrigin = (path) => `${serviceOrigin}${path}`;
  }
});

// src/api/response.ts
function unwrapEnvelope(response, scene) {
  const { code, data, msg } = response.data;
  if (code === 0 || code === "0") {
    return data;
  }
  throw new Error(`[${scene}] ${msg}`);
}
function presentResult(label, data) {
  return `${label}
${JSON.stringify(data, null, 2)}`;
}
var init_response = __esm({
  "src/api/response.ts"() {
  }
});

// src/api/request.ts
function createPostAction(config) {
  return async (params) => {
    const response = await localRequest.post(withOrigin(config.path), params);
    const data = unwrapEnvelope(response, config.scene);
    return presentResult(config.label, data);
  };
}
function createPostActionWithFallback(config, fallback) {
  return async (params = fallback) => {
    const response = await localRequest.post(withOrigin(config.path), params);
    const data = unwrapEnvelope(response, config.scene);
    return presentResult(config.label, data);
  };
}
function createGetAction(config) {
  return async () => {
    const response = await localRequest.get(withOrigin(config.path));
    const data = unwrapEnvelope(response, config.scene);
    return presentResult(config.label, data);
  };
}
var init_request = __esm({
  "src/api/request.ts"() {
    init_response();
    init_client();
  }
});
function getXlocalPath() {
  const home = os.homedir();
  const os$1 = os.platform();
  if (os$1 === "darwin") {
    return path.join(home, "Library", "Application Support", "HotLogin", "xlocal");
  } else if (os$1 === "win32") {
    return path.join(home, "AppData", "Roaming", "HotLogin", "xlocal");
  } else {
    return path.join(home, ".config", "HotLogin", "xlocal");
  }
}
function getMaxKernelVersion() {
  try {
    const xlocalPath = getXlocalPath();
    if (!fs.existsSync(xlocalPath)) {
      console.log(`[KernelDetector] xlocal folder not found: ${xlocalPath}`);
      return null;
    }
    const entries = fs.readdirSync(xlocalPath);
    const versions = [];
    for (const entry of entries) {
      const fullPath = path.join(xlocalPath, entry);
      const stats = fs.statSync(fullPath);
      if (stats.isDirectory()) {
        const match = entry.match(/^xchrome-(\d+)$/i);
        if (match) {
          const version = parseInt(match[1], 10);
          if (!isNaN(version)) {
            versions.push(version);
          }
        }
      }
    }
    if (versions.length > 0) {
      const maxVersion = Math.max(...versions);
      console.log(`[KernelDetector] Found ${versions.length} kernel versions in ${xlocalPath}, max: ${maxVersion}`);
      return maxVersion;
    }
    console.log(`[KernelDetector] No kernel versions found in ${xlocalPath}`);
    return null;
  } catch (error) {
    console.error("[KernelDetector] Error reading xlocal folder:", error);
    return null;
  }
}
var init_kernelDetector = __esm({
  "src/api/kernelDetector.ts"() {
  }
});

// src/api/envApi.ts
var envGateway;
var init_envApi = __esm({
  "src/api/envApi.ts"() {
    init_client();
    init_request();
    init_kernelDetector();
    envGateway = {
      create: async (params) => {
        if (!params.fingerprint?.kernelVersion || params.fingerprint.kernelVersion === 0) {
          const maxKernel = getMaxKernelVersion();
          if (maxKernel) {
            params.fingerprint = params.fingerprint || {};
            params.fingerprint.kernelVersion = maxKernel;
            console.log(`[env_create] Auto-detected kernel version: ${maxKernel}`);
          }
        }
        const createAction = createPostAction({
          path: localRoutes.envCreate,
          scene: "env create",
          label: "Env created"
        });
        return createAction(params);
      },
      query: createPostAction({
        path: localRoutes.envSearch,
        scene: "env query",
        label: "Env query result"
      }),
      profile: createPostAction({
        path: localRoutes.envProfile,
        scene: "env profile",
        label: "Env profile"
      }),
      cookie: createPostAction({
        path: localRoutes.envCookie,
        scene: "env cookie",
        label: "Env cookie"
      }),
      revise: createPostAction({
        path: localRoutes.envModify,
        scene: "env revise",
        label: "Env updated"
      }),
      transferGroup: createPostAction({
        path: localRoutes.envMoveGroup,
        scene: "env transfer group",
        label: "Env group updated"
      }),
      remove: createPostAction({
        path: localRoutes.envRemove,
        scene: "env remove",
        label: "Env removed"
      }),
      purgeCache: createPostAction({
        path: localRoutes.envPurgeCache,
        scene: "env purge cache",
        label: "Env cache cleared"
      }),
      launch: createPostAction({
        path: localRoutes.envLaunch,
        scene: "env launch",
        label: "Env launched"
      }),
      terminate: createPostAction({
        path: localRoutes.envTerminate,
        scene: "env terminate",
        label: "Env closed"
      }),
      terminateAll: createPostActionWithFallback(
        {
          path: localRoutes.envTerminateAll,
          scene: "env terminate all",
          label: "All env closed"
        },
        {}
      ),
      runtimeState: createPostAction({
        path: localRoutes.envRuntimeState,
        scene: "env runtime state",
        label: "Env runtime state"
      }),
      opened: createGetAction({
        path: localRoutes.envOpenedCollection,
        scene: "env opened collection",
        label: "Opened env list"
      }),
      arrangeWindows: createPostActionWithFallback(
        {
          path: localRoutes.envWindowLayout,
          scene: "env window layout",
          label: "Windows arranged"
        },
        {}
      )
    };
  }
});

// src/api/groupApi.ts
var groupGateway;
var init_groupApi = __esm({
  "src/api/groupApi.ts"() {
    init_client();
    init_request();
    groupGateway = {
      query: createPostActionWithFallback(
        {
          path: localRoutes.groupSearch,
          scene: "group query",
          label: "Group query result"
        },
        {}
      ),
      create: createPostAction({
        path: localRoutes.groupCreate,
        scene: "group create",
        label: "Group created"
      }),
      revise: createPostAction({
        path: localRoutes.groupModify,
        scene: "group revise",
        label: "Group updated"
      }),
      remove: createPostAction({
        path: localRoutes.groupRemove,
        scene: "group remove",
        label: "Group removed"
      })
    };
  }
});

// src/api/proxyApi.ts
async function proxyCreate(params) {
  const safeParams = {
    provider: 1,
    // 自有代理
    queryChannel: "IP2Location",
    ...params
  };
  try {
    const response = await localRequest.post(withOrigin(localRoutes.proxyCreate), safeParams);
    const { code, data, msg } = response.data;
    if (code === 0 || code === "0") {
      return presentResult("Proxy created", data);
    }
    const listResp = await localRequest.post(withOrigin(localRoutes.proxySearch), { page: 1, size: 5 });
    const list = listResp.data?.data?.data ?? [];
    const created = list.find(
      (p) => p.address === params.address && String(p.port) === String(params.port)
    );
    if (created) {
      return presentResult("Proxy created", created);
    }
    throw new Error(`[proxy create] ${msg}`);
  } catch (err) {
    if (err.message?.startsWith("[proxy create]")) throw err;
    throw new Error(`[proxy create] ${err.message}`);
  }
}
var proxyGateway;
var init_proxyApi = __esm({
  "src/api/proxyApi.ts"() {
    init_client();
    init_request();
    init_response();
    proxyGateway = {
      query: createPostAction({
        path: localRoutes.proxySearch,
        scene: "proxy query",
        label: "Proxy query result"
      }),
      create: proxyCreate,
      revise: createPostAction({
        path: localRoutes.proxyModify,
        scene: "proxy revise",
        label: "Proxy updated"
      }),
      remove: createPostAction({
        path: localRoutes.proxyRemove,
        scene: "proxy remove",
        label: "Proxy removed"
      })
    };
  }
});

// src/api/serviceApi.ts
var localServiceGateway;
var init_serviceApi = __esm({
  "src/api/serviceApi.ts"() {
    init_client();
    init_request();
    localServiceGateway = {
      ping: createGetAction({
        path: localRoutes.health,
        scene: "local service ping",
        label: "Local service status"
      })
    };
  }
});
function schemaShape(schema) {
  if ("shape" in schema && typeof schema.shape === "object" && schema.shape !== null) {
    return schema.shape;
  }
  if ("_def" in schema) {
    const definition = schema._def;
    if (definition && "schema" in definition) {
      return schemaShape(definition.schema);
    }
  }
  throw new Error("Unable to extract schema shape");
}
var textArray, platformNameSchema, platformsInfoItemSchema, identityShape, toolSchemas;
var init_schemas = __esm({
  "src/mcp/schemas.ts"() {
    textArray = zod.z.array(zod.z.string());
    platformNameSchema = zod.z.string().describe(
      "platformName \u5E73\u53F0\u540D\u79F0: AliExpress | Amazon | Bing | DHgate | eBay | Etsy | Facebook | Google | Instagram | LinkedIn | MicrosoftLive | Payoneer | PayPal | Shopee | Shopify | TikTok | Walmart | WhatsApp | Wish | X/Twitter | Yandex | YouTube | CUSTOM(\u81EA\u5B9A\u4E49,website\u5FC5\u586B)"
    );
    platformsInfoItemSchema = zod.z.object({
      /** 平台账号编号 (与 platformAccountCodes 中的编号一致) */
      platformAccountCode: zod.z.number().optional(),
      account: zod.z.string().optional(),
      password: zod.z.string().optional(),
      accountName: zod.z.string().optional(),
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
      website: zod.z.string().optional(),
      checkAccountRepeat: zod.z.boolean().optional()
    });
    identityShape = {
      id: zod.z.string().optional(),
      number: zod.z.string().optional()
    };
    toolSchemas = {
      empty: zod.z.object({}),
      envQuery: zod.z.object({
        page: zod.z.number().default(1),
        size: zod.z.number().max(20).default(10),
        id: zod.z.string().optional(),
        number: zod.z.string().optional(),
        groupId: zod.z.string().optional(),
        name: zod.z.string().optional(),
        remark: zod.z.string().optional(),
        proxyId: zod.z.string().optional(),
        platform: zod.z.string().optional()
      }),
      envIdentity: zod.z.object(identityShape),
      envCreate: zod.z.object({
        /** 环境名称 */
        name: zod.z.string().optional(),
        /** 分组ID */
        groupId: zod.z.string().optional(),
        /** 备注 */
        remark: zod.z.string().optional(),
        /** 代理ID (与proxyConfig二选一, 优先使用代理ID) */
        proxyId: zod.z.string().optional(),
        /** 代理配置 */
        proxyConfig: zod.z.object({
          /** 代理渠道: 0-不使用, 1-自有代理, 2-API代理 */
          provider: zod.z.number().optional(),
          /** 代理类型: HTTP | HTTPS | SOCKS5 | SSH */
          type: zod.z.enum(["HTTP", "HTTPS", "SOCKS5", "SSH"]).optional(),
          /** 代理IP */
          address: zod.z.string().optional(),
          /** 代理端口 */
          port: zod.z.number().optional(),
          /** 代理账号 */
          hostAccount: zod.z.string().optional(),
          /** 代理密码 */
          hostPassword: zod.z.string().optional(),
          /** 刷新URL */
          refreshUrl: zod.z.string().optional(),
          /** 提取方式: 0-每次提取, 1-失效后提取 */
          extractType: zod.z.union([zod.z.literal(0), zod.z.literal(1)]).optional(),
          /** API代理提取链接 */
          extractUrl: zod.z.string().optional(),
          /** IP查询渠道: IP2Location | IPApi (默认: IP2Location) */
          queryChannel: zod.z.enum(["IP2Location", "IPApi"]).optional()
        }).optional(),
        /** 账号信息 */
        accountInfo: zod.z.object({
          /** 启动时打开的标签URL列表 */
          openUrl: zod.z.array(zod.z.string()).optional(),
          /** Cookie数据 */
          cookie: zod.z.array(zod.z.object({
            name: zod.z.string(),
            value: zod.z.string(),
            domain: zod.z.string().optional(),
            path: zod.z.string().optional(),
            httpOnly: zod.z.boolean().optional(),
            secure: zod.z.boolean().optional(),
            expires: zod.z.number().optional(),
            sameSite: zod.z.string().optional()
          })).optional(),
          /** 平台账号编号列表 */
          platformAccountCodes: zod.z.array(zod.z.string()).optional(),
          /** 平台账号列表 */
          platformsInfo: zod.z.array(platformsInfoItemSchema).optional(),
          /** 2FA Key */
          faKey: zod.z.string().optional()
        }).optional(),
        /** 指纹信息 */
        fingerprint: zod.z.object({
          /** 浏览器类型, 默认 chrome */
          browserType: zod.z.string().optional(),
          /** 内核版本, 0=智能匹配 (默认: 0) */
          kernelVersion: zod.z.number().optional(),
          /** 操作系统: 0-Windows 1-Mac (默认: 0) */
          system: zod.z.union([zod.z.literal(0), zod.z.literal(1)]).optional(),
          /** 系统版本: Windows 11 | Windows 10 | MacOS 14 | MacOS 12 | MacOS 10 */
          osVersion: zod.z.string().optional(),
          /** UA版本号列表, [0]代表全部 (默认: ["0"]) */
          uaVersion: zod.z.array(zod.z.union([zod.z.number(), zod.z.string()])).optional(),
          /** 自定义UA, 若指定则优先使用 */
          userAgent: zod.z.string().optional()
        }).optional(),
        /** 高级设置 */
        advancedSetting: zod.z.object({
          /** 时区开关: 0-关闭 1-基于IP (默认: 1) */
          autoTimeZone: zod.z.union([zod.z.literal(0), zod.z.literal(1)]).optional(),
          /** 时区, 如 GMT-12:00 Etc/GMT+12, LOCAL-本地时区 */
          timeZone: zod.z.string().optional(),
          /** WebRTC: TRANSFER | REPLACE | REAL | BAN (默认: BAN) */
          webRtcType: zod.z.enum(["TRANSFER", "REPLACE", "REAL", "BAN"]).optional(),
          /** 地理位置: ASK | ALLOW | BAN (默认: ASK) */
          geoLocationType: zod.z.enum(["ASK", "ALLOW", "BAN"]).optional(),
          /** 地理位置基于IP: 0-关闭 1-开启 (默认: 1) */
          autoGeoLocation: zod.z.union([zod.z.literal(0), zod.z.literal(1)]).optional(),
          /** 经度 */
          latitude: zod.z.string().optional(),
          /** 纬度 */
          longitude: zod.z.string().optional(),
          /** 精度(米) */
          accuracy: zod.z.string().optional(),
          /** 语言基于IP: 0-关闭 1-开启 (默认: 1) */
          autoLanguage: zod.z.union([zod.z.literal(0), zod.z.literal(1)]).optional(),
          /** 自定义语言列表, 如 ["zh-CN"] */
          language: zod.z.array(zod.z.string()).optional(),
          /** 界面语言基于IP: 0-关闭 1-开启 (默认: 1) */
          autoInterfaceLanguage: zod.z.union([zod.z.literal(0), zod.z.literal(1)]).optional(),
          /** 界面语言, LOCAL-本地语言 */
          interfaceLanguage: zod.z.string().optional(),
          /** 分辨率类型: RANDOM | BASE_ON_UA | CUSTOM (默认: BASE_ON_UA) */
          resolutionType: zod.z.enum(["RANDOM", "BASE_ON_UA", "CUSTOM"]).optional(),
          /** 分辨率宽度 (CUSTOM时必填, 1-9999) */
          resolutionWidth: zod.z.number().optional(),
          /** 分辨率高度 (CUSTOM时必填, 1-9999) */
          resolutionHeight: zod.z.number().optional(),
          /** 字体类型: DEFAULT | CUSTOM (默认: DEFAULT) */
          fontType: zod.z.enum(["DEFAULT", "CUSTOM"]).optional(),
          /** 字体列表 (CUSTOM时必填) */
          font: zod.z.array(zod.z.string()).optional(),
          /** Canvas: NOISE | REAL (默认: NOISE) */
          canvasType: zod.z.enum(["NOISE", "REAL"]).optional(),
          /** WebGL图像: NOISE | REAL (默认: NOISE) */
          webglImageType: zod.z.enum(["NOISE", "REAL"]).optional(),
          /** WebGL元数据: NOISE | REAL (默认: NOISE) */
          webglMetaType: zod.z.enum(["NOISE", "REAL"]).optional(),
          /** WebGPU: BASEONWEBGL | REAL | BAN (默认: BASEONWEBGL) */
          webGpuType: zod.z.enum(["BASEONWEBGL", "REAL", "BAN"]).optional(),
          /** 语音内容: NOISE | REAL (默认: NOISE) */
          audioContextType: zod.z.enum(["NOISE", "REAL"]).optional(),
          /** 媒体设备: NOISE | REAL (默认: NOISE) */
          mediaDeviceType: zod.z.enum(["NOISE", "REAL"]).optional(),
          /** 基于电脑匹配媒体设备数量: 0-关闭 1-开启 (默认: 1) */
          matchDeviceNum: zod.z.union([zod.z.literal(0), zod.z.literal(1)]).optional(),
          /** 麦克风数量 */
          microphoneNum: zod.z.number().optional(),
          /** 扪声器数量 */
          speakerNum: zod.z.number().optional(),
          /** 摄像机数量 */
          cameraNum: zod.z.number().optional(),
          /** SpeechVoices: NOISE | REAL (默认: NOISE) */
          speechVoiceType: zod.z.enum(["NOISE", "REAL"]).optional(),
          /** ClientRects: NOISE | REAL (默认: NOISE) */
          clientRectsType: zod.z.enum(["NOISE", "REAL"]).optional(),
          /** CPU核心数 (默认: 4, 可选: 4,6,8,10,12,16,20,24) */
          hardwareConcurrencyNum: zod.z.number().optional(),
          /** 内存GB (默认: 8, 可选: 2,4,8) */
          deviceMemory: zod.z.number().optional(),
          /** 设备名称类型: CUSTOM | REAL (默认: CUSTOM) */
          deviceNameType: zod.z.enum(["CUSTOM", "REAL"]).optional(),
          /** 设备名称 */
          deviceName: zod.z.string().optional(),
          /** MAC地址类型: CUSTOM | REAL (默认: CUSTOM) */
          deviceMacType: zod.z.enum(["CUSTOM", "REAL"]).optional(),
          /** MAC地址 */
          deviceMac: zod.z.string().optional(),
          /** Do Not Track: DEFAULT | OPEN | CLOSE (默认: DEFAULT) */
          trackType: zod.z.enum(["DEFAULT", "OPEN", "CLOSE"]).optional(),
          /** 端口扫描保护: 0-关闭 1-开启 (默认: 1) */
          protectScanPort: zod.z.union([zod.z.literal(0), zod.z.literal(1)]).optional(),
          /** 允许扫描的端口列表 */
          allowedScanPort: zod.z.array(zod.z.string()).optional(),
          /** 硬件加速: DEFAULT | OPEN | CLOSE (默认: DEFAULT) */
          hardwareAccelerateType: zod.z.enum(["DEFAULT", "OPEN", "CLOSE"]).optional(),
          /** 内核启动参数列表 */
          startupParam: zod.z.array(zod.z.string()).optional()
        }).optional()
      }),
      envRevise: zod.z.object({
        id: zod.z.string().optional(),
        number: zod.z.string().optional(),
        name: zod.z.string().optional(),
        groupId: zod.z.string().optional(),
        remark: zod.z.string().optional(),
        proxyId: zod.z.string().optional(),
        proxyConfig: zod.z.object({
          provider: zod.z.number().optional(),
          type: zod.z.enum(["HTTP", "HTTPS", "SOCKS5", "SSH"]).optional(),
          address: zod.z.string().optional(),
          port: zod.z.number().optional(),
          hostAccount: zod.z.string().optional(),
          hostPassword: zod.z.string().optional(),
          refreshUrl: zod.z.string().optional(),
          extractType: zod.z.union([zod.z.literal(0), zod.z.literal(1)]).optional(),
          extractUrl: zod.z.string().optional(),
          queryChannel: zod.z.enum(["IP2Location", "IPApi"]).optional()
        }).optional(),
        accountInfo: zod.z.object({
          openUrl: zod.z.array(zod.z.string()).optional(),
          cookie: zod.z.array(zod.z.object({
            name: zod.z.string(),
            value: zod.z.string(),
            domain: zod.z.string().optional(),
            path: zod.z.string().optional(),
            httpOnly: zod.z.boolean().optional(),
            secure: zod.z.boolean().optional(),
            expires: zod.z.number().optional(),
            sameSite: zod.z.string().optional()
          })).optional(),
          platformAccountCodes: zod.z.array(zod.z.string()).optional(),
          platformsInfo: zod.z.array(platformsInfoItemSchema).optional(),
          faKey: zod.z.string().optional()
        }).optional(),
        fingerprint: zod.z.object({
          browserType: zod.z.string().optional(),
          kernelVersion: zod.z.number().optional(),
          system: zod.z.union([zod.z.literal(0), zod.z.literal(1)]).optional(),
          osVersion: zod.z.string().optional(),
          uaVersion: zod.z.array(zod.z.union([zod.z.number(), zod.z.string()])).optional(),
          userAgent: zod.z.string().optional()
        }).optional(),
        advancedSetting: zod.z.object({
          autoTimeZone: zod.z.union([zod.z.literal(0), zod.z.literal(1)]).optional(),
          timeZone: zod.z.string().optional(),
          webRtcType: zod.z.enum(["TRANSFER", "REPLACE", "REAL", "BAN"]).optional(),
          geoLocationType: zod.z.enum(["ASK", "ALLOW", "BAN"]).optional(),
          autoGeoLocation: zod.z.union([zod.z.literal(0), zod.z.literal(1)]).optional(),
          latitude: zod.z.string().optional(),
          longitude: zod.z.string().optional(),
          accuracy: zod.z.string().optional(),
          autoLanguage: zod.z.union([zod.z.literal(0), zod.z.literal(1)]).optional(),
          language: zod.z.array(zod.z.string()).optional(),
          autoInterfaceLanguage: zod.z.union([zod.z.literal(0), zod.z.literal(1)]).optional(),
          interfaceLanguage: zod.z.string().optional(),
          resolutionType: zod.z.enum(["RANDOM", "BASE_ON_UA", "CUSTOM"]).optional(),
          resolutionWidth: zod.z.number().optional(),
          resolutionHeight: zod.z.number().optional(),
          fontType: zod.z.enum(["DEFAULT", "CUSTOM"]).optional(),
          font: zod.z.array(zod.z.string()).optional(),
          canvasType: zod.z.enum(["NOISE", "REAL"]).optional(),
          webglImageType: zod.z.enum(["NOISE", "REAL"]).optional(),
          webglMetaType: zod.z.enum(["NOISE", "REAL"]).optional(),
          webGpuType: zod.z.enum(["BASEONWEBGL", "REAL", "BAN"]).optional(),
          audioContextType: zod.z.enum(["NOISE", "REAL"]).optional(),
          mediaDeviceType: zod.z.enum(["NOISE", "REAL"]).optional(),
          matchDeviceNum: zod.z.union([zod.z.literal(0), zod.z.literal(1)]).optional(),
          microphoneNum: zod.z.number().optional(),
          speakerNum: zod.z.number().optional(),
          cameraNum: zod.z.number().optional(),
          speechVoiceType: zod.z.enum(["NOISE", "REAL"]).optional(),
          clientRectsType: zod.z.enum(["NOISE", "REAL"]).optional(),
          hardwareConcurrencyNum: zod.z.number().optional(),
          deviceMemory: zod.z.number().optional(),
          deviceNameType: zod.z.enum(["CUSTOM", "REAL"]).optional(),
          deviceName: zod.z.string().optional(),
          deviceMacType: zod.z.enum(["CUSTOM", "REAL"]).optional(),
          deviceMac: zod.z.string().optional(),
          trackType: zod.z.enum(["DEFAULT", "OPEN", "CLOSE"]).optional(),
          protectScanPort: zod.z.union([zod.z.literal(0), zod.z.literal(1)]).optional(),
          allowedScanPort: zod.z.array(zod.z.string()).optional(),
          hardwareAccelerateType: zod.z.enum(["DEFAULT", "OPEN", "CLOSE"]).optional(),
          startupParam: zod.z.array(zod.z.string()).optional()
        }).optional()
      }),
      envTransferGroup: zod.z.object({
        ids: zod.z.array(zod.z.string()),
        groupId: zod.z.string()
      }),
      envRemove: zod.z.object({
        ids: zod.z.array(zod.z.string()),
        clearEnvFolder: zod.z.union([zod.z.literal(0), zod.z.literal(1)]).optional()
      }),
      envPurgeCache: zod.z.object({
        id: zod.z.string(),
        cacheList: textArray,
        clearEnvFolder: zod.z.union([zod.z.literal(0), zod.z.literal(1)]).optional()
      }),
      envLaunch: zod.z.object({
        id: zod.z.string().optional(),
        number: zod.z.string().optional(),
        openIpTab: zod.z.union([zod.z.number(), zod.z.string()]).optional(),
        startUpParam: textArray.optional(),
        headless: zod.z.union([zod.z.number(), zod.z.string()]).optional(),
        skipProxyCheck: zod.z.union([zod.z.number(), zod.z.string()]).optional(),
        timeout: zod.z.number().optional()
      }),
      envTerminate: zod.z.object(identityShape),
      envWindowLayout: zod.z.object({
        auto: zod.z.boolean().optional(),
        mode: zod.z.number().optional(),
        config: zod.z.object({
          xStart: zod.z.number().optional(),
          yStart: zod.z.number().optional(),
          width: zod.z.number().optional(),
          height: zod.z.number().optional(),
          xSpace: zod.z.number().optional(),
          ySpace: zod.z.number().optional(),
          cols: zod.z.number().optional()
        }).optional()
      }),
      groupQuery: zod.z.object({
        page: zod.z.number().default(1),
        size: zod.z.number().max(20).default(10),
        id: zod.z.string().optional(),
        name: zod.z.string().optional()
      }),
      groupCreate: zod.z.object({
        name: zod.z.string(),
        remark: zod.z.string().optional()
      }),
      groupRevise: zod.z.object({
        id: zod.z.string(),
        name: zod.z.string(),
        remark: zod.z.string().optional()
      }),
      groupRemove: zod.z.object({
        ids: zod.z.array(zod.z.string())
      }),
      proxyQuery: zod.z.object({
        page: zod.z.number().default(1),
        size: zod.z.number().max(20).default(10),
        id: zod.z.string().optional(),
        provider: zod.z.number().optional(),
        type: zod.z.enum(["HTTP", "HTTPS", "SOCKS5", "SSH"]).optional(),
        status: zod.z.number().optional(),
        address: zod.z.string().optional(),
        remark: zod.z.string().optional()
      }),
      proxyCreate: zod.z.object({
        address: zod.z.string().optional(),
        port: zod.z.number().optional(),
        type: zod.z.enum(["HTTP", "HTTPS", "SOCKS5", "SSH"]),
        agentGroupName: zod.z.string().optional(),
        hostAccount: zod.z.string().optional(),
        hostPassword: zod.z.string().optional(),
        refreshUrl: zod.z.string().optional(),
        provider: zod.z.number().optional().default(1),
        queryChannel: zod.z.enum(["IP2Location", "IPApi"]).optional().default("IP2Location"),
        extractType: zod.z.number().optional(),
        extractUrl: zod.z.string().optional(),
        remark: zod.z.string().optional()
      }),
      proxyRevise: zod.z.object({
        id: zod.z.string(),
        provider: zod.z.number().default(1),
        type: zod.z.enum(["HTTP", "HTTPS", "SOCKS5", "SSH"]).optional(),
        agentGroupName: zod.z.string().optional(),
        address: zod.z.string().optional(),
        port: zod.z.number().optional(),
        hostAccount: zod.z.string().optional(),
        hostPassword: zod.z.string().optional(),
        refreshUrl: zod.z.string().optional(),
        queryChannel: zod.z.enum(["IP2Location", "IPApi"]).optional(),
        extractType: zod.z.number().optional(),
        extractUrl: zod.z.string().optional(),
        remark: zod.z.string().optional()
      }),
      proxyRemove: zod.z.object({
        ids: zod.z.array(zod.z.string())
      }),
      // ── Pilot 浏览器自动化 ───────────────────────────────────────
      /** 连接浏览器会话: wsEndpoint 来自 env_launch 返回的 puppeteer 字段 */
      sessionAttach: zod.z.object({
        wsEndpoint: zod.z.string().describe("WebSocket endpoint from env_launch (puppeteer field)")
      }),
      /** 页面跳转 */
      pageVisit: zod.z.object({
        url: zod.z.string().describe("Target URL to navigate to")
      }),
      /** 截图 */
      pageCapture: zod.z.object({
        savePath: zod.z.string().optional().describe("Local directory to save the screenshot"),
        fullPage: zod.z.boolean().optional().describe("Capture full scrollable page (default: false)")
      }),
      /** 点击元素 */
      elementTap: zod.z.object({
        selector: zod.z.string().describe("CSS selector of the element to click")
      }),
      /** 点击 iframe 内的元素 */
      elementFrameTap: zod.z.object({
        frameSelector: zod.z.string().describe("CSS/XPath selector of the iframe"),
        selector: zod.z.string().describe("CSS selector of the element inside the iframe")
      }),
      /** 填写输入框 */
      elementWrite: zod.z.object({
        selector: zod.z.string().describe("CSS selector of the input element"),
        text: zod.z.string().describe("Text to fill into the input")
      }),
      /** 选择下拉框 */
      elementPick: zod.z.object({
        selector: zod.z.string().describe("CSS selector of the <select> element"),
        value: zod.z.string().describe("Option value to select")
      }),
      /** 鼠标悬停 */
      elementHover: zod.z.object({
        selector: zod.z.string().describe("CSS selector of the element to hover")
      }),
      /** 滚动到元素 */
      elementScroll: zod.z.object({
        selector: zod.z.string().describe("CSS selector of the element to scroll into view")
      }),
      /** 拖拽元素 */
      elementMove: zod.z.object({
        selector: zod.z.string().describe("CSS selector of the element to drag"),
        targetSelector: zod.z.string().describe("CSS selector of the drop target")
      }),
      /** 键盘按键 */
      keyPress: zod.z.object({
        key: zod.z.string().describe("Key name, e.g. Enter, Tab, Escape, ArrowDown"),
        selector: zod.z.string().optional().describe("Optional CSS selector to focus before pressing the key")
      }),
      /** 执行 JS 脚本 */
      scriptEval: zod.z.object({
        script: zod.z.string().describe("JavaScript expression to evaluate in the page context")
      }),
      // ── Pilot 扩展工具 ──────────────────────────────────────────────
      /** 等待页面加载 */
      pageWaitLoad: zod.z.object({
        timeout: zod.z.number().optional().describe("Max wait time in ms (default: 30000)")
      }),
      /** 页面重载 */
      pageReload: zod.z.object({
        waitLoad: zod.z.boolean().optional().describe("Wait for load event after reload (default: true)")
      }),
      /** 等待元素出现 */
      elementWait: zod.z.object({
        selector: zod.z.string().describe("CSS selector to wait for"),
        timeout: zod.z.number().optional().describe("Max wait time in ms (default: 30000)")
      }),
      /** 检测元素是否存在 */
      elementExists: zod.z.object({
        selector: zod.z.string().describe("CSS selector to check")
      }),
      /** 获取元素文本 */
      elementText: zod.z.object({
        selector: zod.z.string().describe("CSS selector of the element")
      }),
      /** 获取元素属性值 */
      elementAttr: zod.z.object({
        selector: zod.z.string().describe("CSS selector of the element"),
        attr: zod.z.string().describe("Attribute name, e.g. href, src, value, class")
      }),
      /** 统计匹配元素数量 */
      elementCount: zod.z.object({
        selector: zod.z.string().describe("CSS selector to count")
      }),
      /** 勾选 checkbox */
      elementCheck: zod.z.object({
        selector: zod.z.string().describe("CSS selector of the checkbox")
      }),
      /** 取消勾选 checkbox */
      elementUncheck: zod.z.object({
        selector: zod.z.string().describe("CSS selector of the checkbox")
      }),
      /** 鼠标点击指定坐标 */
      mouseClickPos: zod.z.object({
        x: zod.z.number().describe("X coordinate in pixels"),
        y: zod.z.number().describe("Y coordinate in pixels"),
        button: zod.z.enum(["left", "right", "middle"]).optional().describe("Mouse button (default: left)")
      }),
      /** 读取 Cookie */
      cookieRead: zod.z.object({
        domain: zod.z.string().optional().describe("Filter cookies by domain (partial match)")
      }),
      /** 写入单条 Cookie */
      cookieWrite: zod.z.object({
        name: zod.z.string(),
        value: zod.z.string(),
        domain: zod.z.string().optional(),
        path: zod.z.string().optional(),
        httpOnly: zod.z.boolean().optional(),
        secure: zod.z.boolean().optional(),
        expires: zod.z.number().optional().describe("Unix timestamp in seconds")
      }),
      /** 清除 Cookie */
      cookieClear: zod.z.object({
        domain: zod.z.string().optional().describe("Clear only cookies matching this domain; omit to clear all")
      }),
      /** 读取 localStorage / sessionStorage */
      storageRead: zod.z.object({
        storageType: zod.z.enum(["local", "session"]).describe("local = localStorage, session = sessionStorage"),
        key: zod.z.string().optional().describe("Specific key to read; omit to read all")
      }),
      /** 写入 localStorage / sessionStorage */
      storageWrite: zod.z.object({
        storageType: zod.z.enum(["local", "session"]).describe("local = localStorage, session = sessionStorage"),
        key: zod.z.string(),
        value: zod.z.string()
      }),
      /** 自动处理 alert / confirm / prompt 弹窗 */
      dialogHandle: zod.z.object({
        action: zod.z.enum(["accept", "dismiss"]).describe("accept to confirm / dismiss to cancel"),
        promptText: zod.z.string().optional().describe("Text to fill when dialog is a prompt")
      })
    };
  }
});

// src/mcp/wrapper.ts
function textResult(text) {
  return {
    content: [
      {
        type: "text",
        text
      }
    ]
  };
}
function wrapToolResult(handler) {
  return async (params) => {
    try {
      const result = await handler(params);
      return textResult(typeof result === "string" ? result : JSON.stringify(result, null, 2));
    } catch (error) {
      return textResult(error instanceof Error ? error.message : String(error));
    }
  };
}
var init_wrapper = __esm({
  "src/mcp/wrapper.ts"() {
  }
});
var require_server_core = __commonJS({
  "src/server.core.ts"() {
    init_envApi();
    init_groupApi();
    init_proxyApi();
    init_serviceApi();
    init_schemas();
    init_wrapper();
    var coreToolDefinitions = [
      {
        name: "health_check",
        description: "\u68C0\u67E5\u706B\u4E91\u672C\u5730\u670D\u52A1\u662F\u5426\u53EF\u7528",
        schema: "empty",
        handler: () => localServiceGateway.ping()
      },
      { name: "env_query", description: "\u5206\u9875\u67E5\u8BE2\u73AF\u5883\u5217\u8868", schema: "envQuery", handler: envGateway.query },
      { name: "env_profile", description: "\u83B7\u53D6\u5355\u4E2A\u73AF\u5883\u8BE6\u60C5", schema: "envIdentity", handler: envGateway.profile },
      { name: "env_cookie", description: "\u83B7\u53D6\u5355\u4E2A\u73AF\u5883 Cookie", schema: "envIdentity", handler: envGateway.cookie },
      { name: "env_create", description: "\u521B\u5EFA\u73AF\u5883", schema: "envCreate", handler: envGateway.create },
      { name: "env_revise", description: "\u66F4\u65B0\u73AF\u5883", schema: "envRevise", handler: envGateway.revise },
      { name: "env_transfer_group", description: "\u6279\u91CF\u8C03\u6574\u73AF\u5883\u5206\u7EC4", schema: "envTransferGroup", handler: envGateway.transferGroup },
      { name: "env_remove", description: "\u5220\u9664\u73AF\u5883", schema: "envRemove", handler: envGateway.remove },
      { name: "env_purge_cache", description: "\u6E05\u7406\u73AF\u5883\u7F13\u5B58", schema: "envPurgeCache", handler: envGateway.purgeCache },
      { name: "env_launch", description: "\u542F\u52A8\u73AF\u5883", schema: "envLaunch", handler: envGateway.launch },
      { name: "env_terminate", description: "\u5173\u95ED\u73AF\u5883", schema: "envTerminate", handler: envGateway.terminate },
      { name: "env_terminate_all", description: "\u5173\u95ED\u5168\u90E8\u5DF2\u6253\u5F00\u73AF\u5883", schema: "empty", handler: () => envGateway.terminateAll() },
      { name: "env_runtime_state", description: "\u83B7\u53D6\u73AF\u5883\u8FD0\u884C\u72B6\u6001", schema: "envIdentity", handler: envGateway.runtimeState },
      { name: "env_opened", description: "\u67E5\u8BE2\u5F53\u524D\u5DF2\u6253\u5F00\u73AF\u5883\u5217\u8868", schema: "empty", handler: () => envGateway.opened() },
      { name: "env_window_layout", description: "\u6574\u7406\u73AF\u5883\u7A97\u53E3\u5E03\u5C40", schema: "envWindowLayout", handler: envGateway.arrangeWindows },
      { name: "group_query", description: "\u67E5\u8BE2\u5206\u7EC4\u5217\u8868", schema: "groupQuery", handler: groupGateway.query },
      { name: "group_create", description: "\u521B\u5EFA\u5206\u7EC4", schema: "groupCreate", handler: groupGateway.create },
      { name: "group_revise", description: "\u66F4\u65B0\u5206\u7EC4", schema: "groupRevise", handler: groupGateway.revise },
      { name: "group_remove", description: "\u5220\u9664\u5206\u7EC4", schema: "groupRemove", handler: groupGateway.remove },
      { name: "proxy_query", description: "\u67E5\u8BE2\u4EE3\u7406\u5217\u8868", schema: "proxyQuery", handler: proxyGateway.query },
      { name: "proxy_create", description: "\u521B\u5EFA\u4EE3\u7406", schema: "proxyCreate", handler: proxyGateway.create },
      { name: "proxy_revise", description: "\u66F4\u65B0\u4EE3\u7406", schema: "proxyRevise", handler: proxyGateway.revise },
      { name: "proxy_remove", description: "\u5220\u9664\u4EE3\u7406", schema: "proxyRemove", handler: proxyGateway.remove }
    ];
    function createServer() {
      const server = new mcp_js.McpServer({
        name: "hotlogin-local-api",
        version: "1.0.0",
        capabilities: {
          resources: {},
          tools: {}
        }
      });
      coreToolDefinitions.forEach(({ name, description, schema, handler }) => {
        server.tool(name, description, schemaShape(toolSchemas[schema]), wrapToolResult(handler));
      });
      return server;
    }
    async function bootstrap() {
      const transport = new stdio_js.StdioServerTransport();
      await createServer().connect(transport);
      console.error("HotLogin Local API MCP Server running on stdio");
    }
    bootstrap().catch((error) => {
      console.error("Fatal error in bootstrap():", error);
      process.exit(1);
    });
  }
});
var server_core = require_server_core();

module.exports = server_core;
