---
name: xbrowser-automation
description: Complete browser lifecycle management and web automation powered by XBrowser Local API through MCP protocol. Invoke when users need to create/manage browser environments, control web pages, automate interactions, or handle cookies and storage.
---

# XBrowser Automation Suite

全功能浏览器自动化平台，提供环境管理、页面控制和智能交互三大能力模块。基于 MCP 协议实现，支持 50+ 原子化操作。

## 能力矩阵

```
┌─────────────────────────────────────────────────────┐
│              XBrowser Automation                     │
├──────────────┬──────────────┬───────────────────────┤
│ 环境管理      │ 页面控制      │ 智能交互               │
│ Environment   │ Page Control │ Smart Interaction     │
├──────────────┼──────────────┼───────────────────────┤
│ • 创建/查询   │ • 导航跳转    │ • 元素点击/填写        │
│ • 启动/关闭   │ • 截图采集    │ • 键盘/鼠标模拟        │
│ • 分组管理    │ • 内容提取    │ • Cookie/Storage操作  │
│ • 代理配置    │ • 弹窗处理    │ • 脚本执行             │
│ • 指纹定制    │ • 历史控制    │ • 等待/检测            │
│ • 窗口布局    │ • 标签管理    │ • 拖拽/悬停            │
└──────────────┴──────────────┴───────────────────────┘
```

## 快速上手

### 前置条件
- XBrowser 客户端已启动
- MCP Server 已连接（通过 stdio 或 HTTP）
- Node.js >= 18.0.0

### 工作流示例

**场景 1：创建环境并访问网站**
```
1. env_create → 创建浏览器环境（配置指纹+代理）
2. env_launch → 启动环境（获取 wsEndpoint）
3. session_attach → 连接浏览器会话
4. page_visit → 访问目标网址
5. page_capture → 截图验证
```

**场景 2：自动化表单填写**
```
1. env_launch → 启动已有环境
2. session_attach → 连接会话
3. page_visit → 打开表单页面
4. element_write → 填写输入框
5. element_pick → 选择下拉项
6. element_tap → 点击提交按钮
```

**场景 3：批量环境管理**
```
1. env_query → 查询环境列表
2. env_transfer_group → 批量调整分组
3. env_launch → 启动多个环境
4. env_terminate_all → 一键关闭全部
```

---

## 核心工具集

### 🌐 环境生命周期管理 (Environment Lifecycle)

| 工具 | 功能 | 关键参数 |
|------|------|---------|
| `env_create` | 创建新环境 | name, groupId, proxyConfig, fingerprint, accountInfo |
| `env_query` | 分页查询环境 | page, size, groupId, name, platform |
| `env_profile` | 获取环境详情 | id 或 number |
| `env_revise` | 更新环境配置 | id/number + 需要修改的字段 |
| `env_remove` | 删除环境 | ids (数组), clearEnvFolder |
| `env_purge_cache` | 清理缓存 | id, cacheList |

### 🚀 环境运行控制 (Runtime Control)

| 工具 | 功能 | 关键参数 |
|------|------|---------|
| `env_launch` | 启动环境 | id/number, openIpTab, headless, timeout |
| `env_terminate` | 关闭单个环境 | id 或 number |
| `env_terminate_all` | 关闭全部环境 | 无参数 |
| `env_runtime_state` | 获取运行状态 | id 或 number |
| `env_opened` | 查询已打开环境 | 无参数 |
| `env_window_layout` | 整理窗口布局 | auto, mode, config |

### 👥 分组管理 (Group Management)

| 工具 | 功能 | 关键参数 |
|------|------|---------|
| `group_query` | 查询分组列表 | page, size, name |
| `group_create` | 创建分组 | name (必填), remark |
| `group_revise` | 更新分组 | id (必填), name |
| `group_remove` | 删除分组 | ids (数组) |

### 🌍 代理管理 (Proxy Management)

| 工具 | 功能 | 关键参数 |
|------|------|---------|
| `proxy_query` | 查询代理列表 | page, size, type, status |
| `proxy_create` | 创建代理 | type (必填), address, port, hostAccount |
| `proxy_revise` | 更新代理 | id (必填) + 修改字段 |
| `proxy_remove` | 删除代理 | ids (数组) |

### 🤖 Pilot 浏览器自动化 (Browser Automation)

#### 会话与标签页
- `session_attach` — 连接浏览器会话（wsEndpoint 来自 env_launch 返回值）
- `tab_spawn` — 新建标签页

#### 页面导航
- `page_visit` — 跳转 URL（必填：url）
- `page_back` / `page_forward` — 历史后退/前进
- `page_reload` — 刷新页面（可选：waitLoad）

#### 内容提取
- `page_text` — 读取所有可见文本
- `page_html` — 获取完整 HTML
- `page_meta` — 获取 URL 和标题
- `page_capture` — 截图（可选：savePath, fullPage）

#### 元素操作
- `element_tap` — 点击元素（CSS 选择器）
- `element_write` — 填写文本（selector + text）
- `element_pick` — 选择下拉项（selector + value）
- `element_hover` — 鼠标悬停
- `element_scroll` — 滚动到可视区域
- `element_move` — 拖拽元素（selector + targetSelector）
- `element_frame_tap` — 点击 iframe 内元素

#### 键盘与脚本
- `key_press` — 发送键盘按键（key, 可选 selector）
- `script_eval` — 执行 JavaScript（script）

#### 等待与检测
- `page_wait_load` — 等待页面加载（可选：timeout）
- `element_wait` — 等待元素出现（selector, 可选：timeout）
- `element_exists` — 检测元素存在性
- `element_count` — 统计元素数量
- `element_text` — 获取元素文本
- `element_attr` — 获取元素属性

#### 数据存储
- `cookie_read` — 读取 Cookie（可选：domain 过滤）
- `cookie_write` — 写入 Cookie（name, value, domain...）
- `cookie_clear` — 清除 Cookie（可选：domain）
- `storage_read` — 读取 localStorage/sessionStorage
- `storage_write` — 写入 localStorage/sessionStorage

#### 交互增强
- `mouse_click_pos` — 坐标点击（x, y, 可选：button）
- `element_check` / `element_uncheck` — 勾选/取消 checkbox
- `dialog_handle` — 处理弹窗（accept/dismiss）

---

## 参数配置详解

### 环境创建参数结构

```typescript
env_create({
  name: "电商账号-01",              // 环境名称
  groupId: "grp_123",              // 分组 ID
  remark: "Amazon 卖家账号",        // 备注
  
  // 代理配置（二选一：proxyId 或 proxyConfig）
  proxyId: "proxy_456",            // 使用已保存的代理
  // 或
  proxyConfig: {
    provider: 1,                   // 0-不使用, 1-自有, 2-API
    type: "SOCKS5",                // HTTP | HTTPS | SOCKS5 | SSH
    address: "192.168.1.100",
    port: 1080,
    hostAccount: "user",           // 可选
    hostPassword: "pass"           // 可选
  },
  
  // 账号信息
  accountInfo: {
    openUrl: ["https://amazon.com"],
    cookie: [{ name: "session", value: "xxx", domain: ".amazon.com" }],
    platformsInfo: [{
      platformName: "Amazon",
      account: "seller@example.com",
      password: "encrypted_pwd"
    }]
  },
  
  // 指纹配置
  fingerprint: {
    browserType: "chrome",
    system: 0,                     // 0-Windows, 1-Mac
    osVersion: "Windows 11",
    kernelVersion: 0               // 0-智能匹配（自动检测本地最大版本）
  },
  
  // 高级设置
  advancedSetting: {
    autoTimeZone: 1,               // 基于 IP
    webRtcType: "BAN",             // 禁用 WebRTC
    geoLocationType: "ASK",        // 地理位置询问
    resolutionType: "BASE_ON_UA",  // 分辨率跟随 UA
    canvasType: "NOISE",           // Canvas 噪声
    hardwareConcurrencyNum: 8,     // CPU 核心数
    deviceMemory: 8                // 内存 GB
  }
})
```

### 平台名称枚举

支持的平台及默认网址：

| 平台名称 | 默认网址 |
|---------|---------|
| AliExpress | https://login.aliexpress.com/seller_new.htm |
| Amazon | https://www.amazon.com/ |
| Facebook | https://www.facebook.com/ |
| Google | https://accounts.google.com/ |
| TikTok | https://www.tiktok.com/login |
| Shopify | https://accounts.shopify.com/lookup |
| CUSTOM | **需指定 website 字段** |

完整列表：AliExpress, Amazon, Bing, DHgate, eBay, Etsy, Facebook, Google, Instagram, LinkedIn, MicrosoftLive, Payoneer, PayPal, Shopee, Shopify, TikTok, Walmart, WhatsApp, Wish, X/Twitter, Yandex, YouTube, CUSTOM

### 内核版本智能匹配

当 `kernelVersion` 设置为 `0` 或**不指定**时，系统会自动执行内核版本智能匹配：

1. **自动扫描**本地 xlocal 文件夹（路径因操作系统而异）：
   - **Mac**: `~/Library/Application Support/HotLogin/xlocal`
   - **Windows**: `%APPDATA%\HotLogin\xlocal`
   - **Linux**: `~/.config/HotLogin/xlocal`
2. **检测**所有 `xchrome-XXX` 格式的内核目录（如 xchrome-128、xchrome-127）
3. **选择**最大版本号（如同时存在 126、127、128，则自动使用 128）
4. **降级**：如果检测失败或文件夹不存在，则使用系统默认配置

**示例**：
```typescript
// 方式 1：明确设置为 0（智能匹配）
fingerprint: {
  kernelVersion: 0  // 自动检测并使用本地最大版本
}

// 方式 2：不指定 kernelVersion（推荐）
fingerprint: {
  browserType: "chrome",
  system: 0
  // kernelVersion 省略，系统自动检测
}

// 方式 3：指定具体版本（不使用智能匹配）
fingerprint: {
  kernelVersion: 127  // 强制使用 127 版本
}
```

**跨平台兼容**：使用相对路径（通过 `homedir()` 函数），在 Windows、Mac、Linux 上都能正确读取。

---

## 最佳实践

### ✅ 推荐工作流

**1. 环境启动后务必保存 wsEndpoint**
```
env_launch 返回的 puppeteer 字段是后续所有自动化的入口
```

**2. 批量操作前先查询**
```
创建代理前 → proxy_query 检查是否已存在
创建环境前 → env_query 避免重复
```

**3. 异步操作需要验证**
```
env_create 是异步的 → 创建后用 env_query 确认
proxy_create 是异步的 → 创建后用 proxy_query 确认
```

**4. 资源清理**
```
完成任务后 → env_terminate 关闭环境
批量清理 → env_terminate_all 一键关闭
```

### ⚠️ 注意事项

- **环境编号 vs ID**：`id` 是唯一标识符，`number` 是用户可见的编号
- **代理优先级**：同时提供 `proxyId` 和 `proxyConfig` 时，优先使用 `proxyId`
- **自定义平台**：`platformName=CUSTOM` 时必须提供 `website` 字段
- **Cookie 操作**：写入 Cookie 时 `domain` 需要带前导点（如 `.amazon.com`）
- **超时设置**：`env_launch` 的 `timeout` 参数单位是毫秒

---

## 场景化示例

### 场景：跨境电商多账号管理

```
目标：创建 3 个 Amazon 卖家环境，配置不同代理，批量启动

步骤：
1. proxy_create × 3 → 创建 3 个不同地区的代理
2. group_create → 创建"Amazon 卖家"分组
3. env_create × 3 → 创建环境（绑定代理+分组+账号）
4. env_query → 确认环境创建成功
5. env_launch × 3 → 逐个启动环境
6. session_attach × 3 → 连接每个环境的浏览器
7. page_visit → 访问 Amazon Seller Central
8. page_capture → 截图验证登录状态
```

### 场景：自动化数据采集

```
目标：访问目标网站，提取商品信息，保存截图

步骤：
1. env_launch → 启动环境
2. session_attach → 连接会话
3. page_visit → 打开商品列表页
4. page_wait_load → 等待加载完成
5. element_text → 提取商品标题
6. element_attr → 提取价格（获取 data-price 属性）
7. page_capture → 截图保存（savePath: "/data/screenshots"）
8. cookie_read → 保存登录态 Cookie
9. env_terminate → 关闭环境
```

### 场景：A/B 测试多环境对比

```
目标：同时打开多个环境，对比不同配置下的页面表现

步骤：
1. env_create × 2 → 创建两个环境（不同指纹配置）
2. env_launch × 2 → 同时启动
3. session_attach × 2 → 连接两个会话
4. page_visit × 2 → 访问相同 URL
5. script_eval → 执行性能测试脚本
6. page_meta → 对比页面加载结果
7. env_terminate_all → 清理所有环境
```

---

## 故障排查

| 问题 | 可能原因 | 解决方案 |
|------|---------|---------|
| env_launch 失败 | 环境配置数据损坏 | 使用 env_revise 重新保存配置 |
| session_attach 超时 | wsEndpoint 已过期 | 重新 env_launch 获取新的 endpoint |
| element_tap 找不到元素 | 页面未加载完成 | 先调用 page_wait_load 或 element_wait |
| cookie_write 无效 | domain 格式错误 | 确保 domain 带前导点（.example.com） |
| proxy_create 后无法使用 | 异步操作未完成 | 等待几秒后用 proxy_query 确认状态 |

---

## 技术架构

```
用户指令
  ↓
AI Agent (理解意图)
  ↓
MCP Server (xbrowser-local-api)
  ↓
┌─────────────────────────────┐
│  工具路由层 (tools.ts)       │
│  • 参数校验 (Zod schemas)    │
│  • 结果包装 (wrapper.ts)     │
└─────────────────────────────┘
  ↓
┌─────────────────────────────┐
│  网关层 (api/*.ts)           │
│  • envGateway                │
│  • groupGateway              │
│  • proxyGateway              │
│  • localServiceGateway       │
└─────────────────────────────┘
  ↓
┌─────────────────────────────┐
│  Pilot 自动化引擎            │
│  • Playwright 驱动           │
│  • 会话管理 (session.ts)     │
│  • 操作库 (actions.ts)       │
└─────────────────────────────┘
  ↓
XBrowser Local API (HTTP)
  ↓
浏览器实例 (Chromium)
```

---

## 版本信息

- **MCP SDK**: ^1.7.0
- **自动化引擎**: Playwright ^1.59.1
- **参数校验**: Zod ^3.24.2
- **Node.js**: >= 18.0.0
- **协议**: Model Context Protocol (MCP)

---

## 深度参考文档

完整的参数定义、枚举值和使用示例：

| 文档 | 内容 | 使用时机 |
|------|------|---------|
| [references/environment-management.md](references/environment-management.md) | 环境创建/查询/更新/删除的完整参数，指纹配置，高级设置 | 创建或修改环境时需要了解所有配置选项 |
| [references/browser-automation.md](references/browser-automation.md) | Pilot 自动化工具的完整参数，选择器示例，最佳实践 | 执行页面操作、元素交互、数据提取时 |
| [references/group-proxy-management.md](references/group-proxy-management.md) | 分组和代理的增删改查参数，工作流示例 | 管理分组、配置代理、批量操作时 |
| [references/runtime-control.md](references/runtime-control.md) | 环境启动/关闭/状态监控参数，窗口布局 | 控制环境运行状态、调试问题时 |

---

**提示**：所有工具均支持通过 MCP 协议调用，参数采用 JSON 格式传递。完整的参数定义和校验规则见 `src/mcp/schemas.ts`。
