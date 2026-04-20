# 环境管理完整参数参考

## 环境创建 (env_create)

### 基础字段
- **name** (可选): 环境名称，最大长度 100 字符
- **groupId** (可选): 分组 ID，空字符串表示未分组
- **remark** (可选): 备注信息，最大长度 1500 字符

### 代理配置（二选一）

**方式 1：使用已保存的代理**
- **proxyId** (可选): 代理 ID，或 `"random"` 表示随机分配

**方式 2：内联代理配置**
- **proxyConfig** (可选): 代理配置对象
  - **provider** (可选): 代理渠道，`0`-不使用, `1`-自有代理, `2`-API 代理
  - **type** (可选): 代理类型，`HTTP` | `HTTPS` | `SOCKS5` | `SSH`
  - **address** (可选): 代理服务器 IP 或域名
  - **port** (可选): 代理端口，范围 0-65535
  - **hostAccount** (可选): 代理账号
  - **hostPassword** (可选): 代理密码
  - **refreshUrl** (可选): 代理刷新 URL
  - **extractType** (可选): 提取方式，`0`-每次提取, `1`-失效后提取
  - **extractUrl** (可选): API 代理提取链接
  - **queryChannel** (可选): IP 查询渠道，`IP2Location` | `IPApi`

### 账号信息
- **accountInfo** (可选): 账号配置对象
  - **openUrl** (可选): 启动时打开的 URL 数组
  - **cookie** (可选): Cookie 数组
    - **name** (必填): Cookie 名称
    - **value** (必填): Cookie 值
    - **domain** (可选): 域名，建议带前导点如 `.example.com`
    - **path** (可选): 路径，默认 `/`
    - **httpOnly** (可选): 是否 HTTP Only
    - **secure** (可选): 是否 Secure
    - **expires** (可选): 过期时间（Unix 时间戳，秒）
    - **sameSite** (可选): `Strict` | `Lax` | `None`
  - **platformAccountCodes** (可选): 平台账号编号数组
  - **platformsInfo** (可选): 平台账号列表
    - **platformAccountCode** (可选): 平台账号编号
    - **account** (可选): 账号
    - **password** (可选): 密码
    - **accountName** (可选): 账号名称
    - **platformName** (可选): 平台名称（见平台枚举表）
    - **website** (可选): 平台网址，`platformName=CUSTOM` 时必填
    - **checkAccountRepeat** (可选): 是否检查账号重复
  - **faKey** (可选): 2FA 密钥

### 指纹配置
- **fingerprint** (可选): 指纹配置对象
  - **browserType** (可选): 浏览器类型，默认 `chrome`
  - **kernelVersion** (可选): 内核版本
    - 设置为 `0` 或**不指定**时：触发智能匹配，自动检测本地最大版本
    - 设置为具体数字时：使用指定版本（如 `128`、`127`）
    - **智能匹配机制**：
      1. 自动扫描 xlocal 文件夹（路径因操作系统而异）：
         - Mac: `~/Library/Application Support/HotLogin/xlocal`
         - Windows: `%APPDATA%\HotLogin\xlocal`
         - Linux: `~/.config/HotLogin/xlocal`
      2. 检测所有 `xchrome-XXX` 格式的内核目录
      3. 选择最大版本号（例如有 126、127、128 时自动使用 128）
      4. 检测失败时使用系统默认配置
    - **跨平台兼容**：自动识别操作系统并使用正确路径
  - **system** (可选): 操作系统，`0`-Windows, `1`-Mac
  - **osVersion** (可选): 系统版本，如 `Windows 11` | `Windows 10` | `MacOS 14` | `MacOS 12` | `MacOS 10`
  - **uaVersion** (可选): UA 版本数组，`[0]` 表示全部
  - **userAgent** (可选): 自定义 UA，指定后优先使用

### 高级设置
- **advancedSetting** (可选): 高级配置对象
  - **autoTimeZone** (可选): 时区开关，`0`-关闭, `1`-基于 IP（默认）
  - **timeZone** (可选): 自定义时区，如 `GMT-12:00` | `Etc/GMT+12` | `LOCAL`
  - **webRtcType** (可选): WebRTC 设置，`TRANSFER` | `REPLACE` | `REAL` | `BAN`（默认）
  - **geoLocationType** (可选): 地理位置，`ASK`（默认）| `ALLOW` | `BAN`
  - **autoGeoLocation** (可选): 地理位置基于 IP，`0`-关闭, `1`-开启（默认）
  - **latitude** (可选): 纬度（autoGeoLocation=0 时必填）
  - **longitude** (可选): 经度（autoGeoLocation=0 时必填）
  - **accuracy** (可选): 精度（米）（autoGeoLocation=0 时必填）
  - **autoLanguage** (可选): 语言基于 IP，`0`-关闭, `1`-开启（默认）
  - **language** (可选): 自定义语言数组，如 `["zh-CN", "en-US"]`
  - **autoInterfaceLanguage** (可选): 界面语言基于 IP，`0`-关闭, `1`-开启（默认）
  - **interfaceLanguage** (可选): 界面语言，`LOCAL` 表示本地语言
  - **resolutionType** (可选): 分辨率类型，`RANDOM` | `BASE_ON_UA`（默认）| `CUSTOM`
  - **resolutionWidth** (可选): 分辨率宽度（CUSTOM 时必填，1-9999）
  - **resolutionHeight** (可选): 分辨率高度（CUSTOM 时必填，1-9999）
  - **fontType** (可选): 字体类型，`DEFAULT`（默认）| `CUSTOM`
  - **font** (可选): 字体数组（CUSTOM 时必填）
  - **canvasType** (可选): Canvas 指纹，`NOISE`（默认）| `REAL`
  - **webglImageType** (可选): WebGL 图像，`NOISE`（默认）| `REAL`
  - **webglMetaType** (可选): WebGL 元数据，`NOISE`（默认）| `REAL`
  - **webGpuType** (可选): WebGPU，`BASEONWEBGL`（默认）| `REAL` | `BAN`
  - **audioContextType** (可选): 语音内容，`NOISE`（默认）| `REAL`
  - **mediaDeviceType** (可选): 媒体设备，`NOISE`（默认）| `REAL`
  - **matchDeviceNum** (可选): 匹配设备数量，`0`-关闭, `1`-开启（默认）
  - **microphoneNum** (可选): 麦克风数量
  - **speakerNum** (可选): 扬声器数量
  - **cameraNum** (可选): 摄像机数量
  - **speechVoiceType** (可选): SpeechVoices，`NOISE`（默认）| `REAL`
  - **clientRectsType** (可选): ClientRects，`NOISE`（默认）| `REAL`
  - **hardwareConcurrencyNum** (可选): CPU 核心数，可选值：4,6,8,10,12,16,20,24（默认 4）
  - **deviceMemory** (可选): 内存 GB，可选值：2,4,8（默认 8）
  - **deviceNameType** (可选): 设备名称类型，`CUSTOM`（默认）| `REAL`
  - **deviceName** (可选): 设备名称（CUSTOM 时必填）
  - **deviceMacType** (可选): MAC 地址类型，`CUSTOM`（默认）| `REAL`
  - **deviceMac** (可选): MAC 地址（CUSTOM 时必填）
  - **trackType** (可选): Do Not Track，`DEFAULT`（默认）| `OPEN` | `CLOSE`
  - **protectScanPort** (可选): 端口扫描保护，`0`-关闭, `1`-开启（默认）
  - **allowedScanPort** (可选): 允许扫描的端口数组
  - **hardwareAccelerateType** (可选): 硬件加速，`DEFAULT`（默认）| `OPEN` | `CLOSE`
  - **startupParam** (可选): 内核启动参数数组

---

## 环境查询 (env_query)

- **page** (可选): 页码，默认 `1`
- **size** (可选): 每页数量，默认 `10`，最大 `20`
- **id** (可选): 环境 ID 精确查询
- **number** (可选): 环境编号精确查询
- **groupId** (可选): 分组 ID 过滤
- **name** (可选): 环境名称模糊搜索
- **remark** (可选): 备注模糊搜索
- **proxyId** (可选): 代理 ID 过滤
- **platform** (可选): 平台名称过滤

---

## 环境详情 (env_profile)

- **id** (可选): 环境 ID（id 或 number 至少提供一个）
- **number** (可选): 环境编号

---

## 环境更新 (env_revise)

参数与 `env_create` 相同，额外需要：
- **id** (可选): 环境 ID（id 或 number 至少提供一个）
- **number** (可选): 环境编号

---

## 环境删除 (env_remove)

- **ids** (必填): 环境 ID 数组
- **clearEnvFolder** (可选): 是否清理环境文件夹，`0`-不清理, `1`-清理

---

## 缓存清理 (env_purge_cache)

- **id** (必填): 环境 ID
- **cacheList** (必填): 缓存类型数组
  - 可选值：`local_storage` | `indexeddb` | `extension_cache` | `cookie` | `history` | `image_file`
- **clearEnvFolder** (可选): 是否清理环境文件夹，`0`-不清理, `1`-清理

---

## 示例

### 创建带代理的环境
```json
{
  "name": "Amazon 卖家账号",
  "groupId": "grp_001",
  "proxyConfig": {
    "provider": 1,
    "type": "SOCKS5",
    "address": "192.168.1.100",
    "port": 1080
  },
  "fingerprint": {
    "system": 0,
    "osVersion": "Windows 11"
  }
}
```

### 批量删除环境
```json
{
  "ids": ["env_001", "env_002", "env_003"],
  "clearEnvFolder": 1
}
```
