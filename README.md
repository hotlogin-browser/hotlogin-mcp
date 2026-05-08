# hotlogin-mcp

HotLogin **Local API** 的 MCP Server（stdio）。npm 包：**`hotlogin-local-api-mcp`**。

配合仓库内 Skill 使用时，见 `skills/xbrowser-automation/`。

---

## MCP

### Cursor

**Settings → MCP → Add new MCP server**，示例：

```json
{
  "mcpServers": {
    "hotlogin-local-api": {
      "command": "npx",
      "args": ["-y", "hotlogin-local-api-mcp"],
      "env": {
        "PORT": "60000",
        "API_KEY": "your_api_key"
      }
    }
  }
}
```

无鉴权时可去掉 `env`，或只保留 `PORT`。

### npx（最小）

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

### 本地开发（本仓库）

```bash
npm install && npm run build
```

```json
{
  "mcpServers": {
    "hotlogin-local-api": {
      "command": "node",
      "args": ["/你的路径/hotlogin-mcp/build/server.core.js"],
      "env": {
        "PORT": "60000",
        "API_KEY": "your_api_key"
      }
    }
  }
}
```

Windows 下若 `npx` 起不来，可改为 `"command": "cmd"`，`"args": ["/c", "npx", "-y", "hotlogin-local-api-mcp"]`。

---

## 环境变量

与 **`src/api/config.ts`** 一致：

| 变量 | 说明 |
| --- | --- |
| `PORT` / `API_PORT` | Local API 端口，默认 `60000` |
| `BASE_URL` | 完整根地址，如 `http://127.0.0.1:60000` |
| `API_KEY` | 鉴权 |

---

## 前置条件

- HotLogin 客户端已启动，Local API 可访问  
- Node.js **≥ 18**

---

## 工具

注册列表：`src/mcp/tools.ts`，参数校验：`src/mcp/schemas.ts`。

**典型流程：** `env_create` → `env_launch`（取 `wsEndpoint`）→ `session_attach` → `page_visit` / `element_*` → `env_terminate`。

---

## 故障排查

- **`health_check` 失败**：核对 `PORT` / `BASE_URL` / `API_KEY` 与本地服务一致。  
- **`session_attach` 失败或超时**：`wsEndpoint` 过期则重新 `env_launch`；检查本机网络/防火墙。

---

## License

[MIT](LICENSE)
