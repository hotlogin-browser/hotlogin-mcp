# 环境运行控制参考

## 环境启动 (env_launch)

### 参数说明
- **id** (可选): 环境 ID（id 或 number 至少提供一个）
- **number** (可选): 环境编号
- **openIpTab** (可选): 是否打开 IP 检测页，`0`-不打开, `1`-打开
- **startUpParam** (可选): 启动参数数组
- **headless** (可选): 无头模式，`0`-正常模式, `1`-无头模式
- **skipProxyCheck** (可选): 跳过代理检测，`0`-检测, `1`-跳过
- **timeout** (可选): 启动超时时间（毫秒），默认 60000

### 返回值
```json
{
  "puppeteer": "ws://127.0.0.1:9222/devtools/browser/abc123",
  "selenium": "http://127.0.0.1:9222",
  "debug_port": "9222",
  "webdriver": "http://127.0.0.1:9222"
}
```

**关键字段**:
- `puppeteer`: WebSocket 端点，用于 `session_attach` 连接浏览器
- `debug_port`: Chrome DevTools 端口

### 示例
```json
{
  "id": "env_001",
  "openIpTab": 1,
  "timeout": 30000
}
```

---

## 环境关闭 (env_terminate)

### 参数说明
- **id** (可选): 环境 ID（id 或 number 至少提供一个）
- **number** (可选): 环境编号

### 示例
```json
{
  "id": "env_001"
}
```

---

## 关闭全部环境 (env_terminate_all)

### 参数说明
- 无参数

### 使用场景
- 批量清理所有已打开的环境
- 释放系统资源
- 重置工作环境

### 示例
```json
{}
```

---

## 运行状态查询 (env_runtime_state)

### 参数说明
- **id** (可选): 环境 ID（id 或 number 至少提供一个）
- **number** (可选): 环境编号

### 返回示例
```json
{
  "status": "running",
  "pid": 12345,
  "debugPort": 9222,
  "uptime": 3600
}
```

---

## 已打开环境查询 (env_opened)

### 参数说明
- 无参数

### 返回示例
```json
[
  {
    "number": "1001",
    "puppeteer": "ws://127.0.0.1:9222/devtools/browser/abc123",
    "selenium": "http://127.0.0.1:9222",
    "debug_port": "9222"
  },
  {
    "number": "1002",
    "puppeteer": "ws://127.0.0.1:9223/devtools/browser/def456",
    "selenium": "http://127.0.0.1:9223",
    "debug_port": "9223"
  }
]
```

---

## 窗口布局整理 (env_window_layout)

### 参数说明
- **auto** (可选): 是否自动排列，默认 `true`
- **mode** (可选): 排列模式
- **config** (可选): 自定义布局配置
  - **xStart** (可选): 起始 X 坐标
  - **yStart** (可选): 起始 Y 坐标
  - **width** (可选): 窗口宽度
  - **height** (可选): 窗口高度
  - **xSpace** (可选): X 方向间距
  - **ySpace** (可选): Y 方向间距
  - **cols** (可选): 列数

### 示例 1：自动排列
```json
{
  "auto": true
}
```

### 示例 2：自定义网格布局
```json
{
  "auto": false,
  "config": {
    "xStart": 0,
    "yStart": 0,
    "width": 800,
    "height": 600,
    "xSpace": 10,
    "ySpace": 10,
    "cols": 3
  }
}
```

---

## 工作流示例

### 场景 1：启动环境并自动化

```
1. env_launch → 启动环境
   {
     "id": "env_001",
     "timeout": 30000
   }
   → 获取 puppeteer: "ws://127.0.0.1:9222/devtools/browser/abc123"

2. session_attach → 连接浏览器
   {
     "wsEndpoint": "ws://127.0.0.1:9222/devtools/browser/abc123"
   }

3. page_visit → 访问网站
   {
     "url": "https://example.com"
   }

4. 执行自动化操作...

5. env_terminate → 关闭环境
   {
     "id": "env_001"
   }
```

---

### 场景 2：批量启动多个环境

```
1. env_query → 查询需要启动的环境
   {
     "groupId": "grp_001",
     "size": 20
   }
   → 获取环境列表: ["env_001", "env_002", "env_003"]

2. env_launch × 3 → 逐个启动
   { "id": "env_001" }
   { "id": "env_002" }
   { "id": "env_003" }

3. env_opened → 验证启动结果
   → 检查返回的环境数量

4. env_window_layout → 整理窗口
   {
     "auto": true
   }

5. 完成任务后...

6. env_terminate_all → 一键关闭全部
   {}
```

---

### 场景 3：监控环境运行状态

```
1. env_launch → 启动环境
   { "id": "env_001" }

2. 执行长时间任务...

3. env_runtime_state → 检查运行状态
   { "id": "env_001" }
   → 如果 status = "running"，继续
   → 如果 status = "stopped"，重新启动

4. env_terminate → 任务完成后关闭
   { "id": "env_001" }
```

---

### 场景 4：IP 验证工作流

```
1. env_launch → 启动环境并打开 IP 检测页
   {
     "id": "env_001",
     "openIpTab": 1
   }

2. session_attach → 连接
   { "wsEndpoint": "..." }

3. page_wait_load → 等待 IP 检测页加载
   { "timeout": 10000 }

4. page_text → 读取 IP 信息
   {}

5. page_capture → 截图保存
   {
     "savePath": "/data/ip-verification",
     "fullPage": true
   }

6. env_terminate → 关闭
   { "id": "env_001" }
```

---

## 注意事项

### 启动超时处理
```
env_launch 可能因以下原因超时：
- 代理连接失败
- 系统资源不足
- 环境配置错误

解决方案：
1. 增加 timeout 参数（如 60000 毫秒）
2. 检查代理配置是否正确
3. 使用 env_runtime_state 检查状态
```

### wsEndpoint 过期
```
env_launch 返回的 puppeteer 字段有有效期：
- 环境关闭后失效
- 超时后可能失效

解决方案：
1. 启动后立即 session_attach
2. 如果 attach 失败，重新 env_launch
```

### 批量启动资源控制
```
同时启动过多环境会导致：
- CPU 占用过高
- 内存不足
- 系统卡顿

建议：
1. 分批启动（每次 3-5 个）
2. 每个启动后等待 2-3 秒
3. 使用 env_opened 监控已启动数量
```

### 无头模式使用
```
headless=1 适用于：
- 服务器环境（无显示器）
- 自动化测试
- 后台任务

注意：
- 无头模式无法截图（或部分截图）
- 某些网站会检测无头模式
- 调试时建议使用正常模式
```

---

## 故障排查

| 问题 | 可能原因 | 解决方案 |
|------|---------|---------|
| env_launch 超时 | 代理无法连接 | 检查代理配置，使用 proxy_query 验证 |
| session_attach 失败 | wsEndpoint 无效 | 重新 env_launch 获取新 endpoint |
| 环境启动后闪退 | 配置数据损坏 | 使用 env_revise 重新保存配置 |
| 窗口布局混乱 | 多显示器配置 | 使用 env_window_layout 重新整理 |
| 无法关闭环境 | 进程卡死 | 使用 env_terminate_all 强制关闭全部 |
