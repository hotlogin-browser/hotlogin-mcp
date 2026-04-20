# hotlogin-mcp

HotLogin Local API 的 MCP（Model Context Protocol）服务封装，用于让 AI Agent / MCP 客户端通过标准 MCP tools 调用本地 HotLogin 服务，实现：

- 环境（Env）生命周期管理：创建、查询、更新、删除、启动、关闭、窗口整理等
- 分组（Group）管理：创建、查询、更新、删除
- 代理（Proxy）管理：创建、查询、更新、删除
- 浏览器自动化（Pilot）：连接已启动环境的 CDP WebSocket，进行页面访问、截图、元素交互、Cookie/Storage 读写等

> 提示：本项目只负责“调用本地 HotLogin 服务”，不包含 HotLogin 客户端本身。

---

## 功能概览

### 核心管理能力（Local API）

- `health_check`
- `env_*`：`env_query` / `env_profile` / `env_create` / `env_revise` / `env_launch` / `env_terminate` / `env_terminate_all` / `env_opened` / `env_window_layout` …
- `group_*`：`group_query` / `group_create` / `group_revise` / `group_remove`
- `proxy_*`：`proxy_query` / `proxy_create` / `proxy_revise` / `proxy_remove`

### 自动化能力（Pilot）

- 会话：`session_attach` / `tab_spawn`
- 页面：`page_visit` / `page_capture` / `page_text` / `page_html` / `page_meta` / `page_reload` / `page_back` / `page_forward` / `page_wait_load`
- 元素：`element_tap` / `element_write` / `element_pick` / `element_hover` / `element_scroll` / `element_move` / `element_wait` / `element_exists` / `element_text` / `element_attr` / `element_count` / `element_check` / `element_uncheck` / `element_frame_tap`
- 输入与脚本：`key_press` / `script_eval` / `mouse_click_pos` / `dialog_handle`
- 状态：`cookie_read` / `cookie_write` / `cookie_clear` / `storage_read` / `storage_write`

工具的完整注册列表见 `src/mcp/tools.ts`，参数校验见 `src/mcp/schemas.ts`。

---

## 前置条件

- 已安装并启动 **HotLogin 客户端**，确保本地 Local API 可用
- Node.js **>= 18**

---

## 安装与构建

在本仓库目录下：

```bash
npm install
npm run build
```

构建产物默认在 `build/`，可执行入口为 `build/server.core.js`（见 `package.json` 的 `main/bin`）。

---

## 在 MCP 客户端中使用

### Cursor / Claude Desktop（stdio）

将 MCP Server 配置加入你的客户端配置中（示例为 `npx` 运行已发布包；若你本地开发，可改成 `node <path>/build/server.core.js`）。

#### macOS / Linux

```json
{
  "mcpServers": {
    "hotlogin-local-api": {
      "command": "npx",
      "args": ["-y", "hotlogin-local-api-mcp"]
    }
  }
}
```

#### Windows

```json
{
  "mcpServers": {
    "hotlogin-local-api": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "hotlogin-local-api-mcp"]
    }
  }
}
```

> 如果你还没发布到 npm：把 `command/args` 改为 `node` 直接指向本地构建产物即可。

---

## 配置（环境变量）

该 MCP server 会请求 HotLogin Local API。常用配置如下（具体字段见 `src/api/config.ts`）：

- `LOCAL_SERVICE_ENDPOINT`：本地服务地址（例如 `http://127.0.0.1:50325` 之类）
- `LOCAL_SERVICE_PORT`：本地服务端口（当 endpoint 未设置时使用）
- `LOCAL_SERVICE_TOKEN`：鉴权 token（如你的本地服务启用了鉴权）

在 MCP 客户端的 server 配置里可以通过 `env` 传入，例如：

```json
{
  "mcpServers": {
    "hotlogin-local-api": {
      "command": "npx",
      "args": ["-y", "hotlogin-local-api-mcp"],
      "env": {
        "LOCAL_SERVICE_PORT": "50325",
        "LOCAL_SERVICE_TOKEN": "your-token"
      }
    }
  }
}
```

---

## 推荐工作流（典型用法）

### 创建环境并进行自动化

1. `env_create`：创建环境（可带代理/指纹/账号信息）
2. `env_launch`：启动环境，拿到返回中的 `wsEndpoint`（或 `puppeteer` 字段里的 ws 地址）
3. `session_attach`：用 wsEndpoint 连接到浏览器会话
4. `page_visit` / `element_*`：执行页面操作
5. `env_terminate`：任务结束后关闭环境（或 `env_terminate_all` 批量关闭）

---

## 常见问题

### health_check 失败

- 确认 HotLogin 客户端已启动
- 确认 `LOCAL_SERVICE_ENDPOINT/PORT` 指向正确
- 如启用鉴权，确认 `LOCAL_SERVICE_TOKEN` 正确

### session_attach 失败或超时

- `wsEndpoint` 可能已经过期：重新 `env_launch` 获取新的 endpoint
- 确认本机到该 ws 地址可达（防火墙/端口占用等）

---

## 安全提示

- 请妥善保管 `LOCAL_SERVICE_TOKEN`，不要提交到仓库或分享给不可信方
- 自动化工具会直接驱动浏览器执行操作，请在可信环境中使用并设置合理的超时与资源清理流程

---

## License

如需开源发布，请在此处补充你的项目许可证文件（例如 `LICENSE`）。
