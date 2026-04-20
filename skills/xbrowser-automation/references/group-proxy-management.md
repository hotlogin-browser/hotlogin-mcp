# 分组与代理管理参考

## 分组管理

### group_query — 查询分组列表
- **page** (可选): 页码，默认 `1`
- **size** (可选): 每页数量，默认 `10`，最大 `20`
- **id** (可选): 分组 ID 精确查询
- **name** (可选): 分组名称模糊搜索

**返回示例**:
```json
{
  "data": [
    {
      "id": "grp_001",
      "name": "Amazon 卖家",
      "remark": "跨境电商账号分组",
      "envCount": 5
    }
  ],
  "total": 1,
  "page": 1,
  "size": 10
}
```

---

### group_create — 创建分组
- **name** (必填): 分组名称
- **remark** (可选): 分组备注

**示例**:
```json
{
  "name": "Facebook 广告账号",
  "remark": "用于 Facebook 广告投放的账号分组"
}
```

---

### group_revise — 更新分组
- **id** (必填): 分组 ID
- **name** (必填): 新的分组名称
- **remark** (可选): 新的备注，传 `null` 可清空备注

**示例**:
```json
{
  "id": "grp_001",
  "name": "Amazon 卖家账号（已验证）",
  "remark": "2024年新版账号"
}
```

---

### group_remove — 删除分组
- **ids** (必填): 分组 ID 数组

**注意**: 
- 删除前需确保分组内没有环境
- 建议先使用 `env_transfer_group` 将环境移出

**示例**:
```json
{
  "ids": ["grp_001", "grp_002"]
}
```

---

## 代理管理

### proxy_query — 查询代理列表
- **page** (可选): 页码，默认 `1`
- **size** (可选): 每页数量，默认 `10`，最大 `20`
- **id** (可选): 代理 ID 精确查询
- **provider** (可选): 代理渠道过滤，`0`-不使用, `1`-自有, `2`-API
- **type** (可选): 代理类型过滤，`HTTP` | `HTTPS` | `SOCKS5` | `SSH`
- **status** (可选): 代理状态过滤
- **address** (可选): 代理地址模糊搜索
- **remark** (可选): 备注模糊搜索

**返回示例**:
```json
{
  "data": [
    {
      "id": "proxy_001",
      "type": "SOCKS5",
      "address": "192.168.1.100",
      "port": 1080,
      "provider": 1,
      "status": 1,
      "remark": "美国住宅代理"
    }
  ],
  "total": 1,
  "page": 1,
  "size": 10
}
```

---

### proxy_create — 创建代理
- **type** (必填): 代理类型，`HTTP` | `HTTPS` | `SOCKS5` | `SSH`
- **address** (可选): 代理服务器地址
- **port** (可选): 代理端口
- **agentGroupName** (可选): 代理组名称
- **hostAccount** (可选): 代理账号
- **hostPassword** (可选): 代理密码
- **refreshUrl** (可选): 代理刷新 URL
- **provider** (可选): 代理渠道，默认 `1`（自有代理）
- **queryChannel** (可选): IP 查询渠道，默认 `IP2Location`，可选 `IPApi`
- **extractType** (可选): 提取方式，`0`-每次提取, `1`-失效后提取
- **extractUrl** (可选): API 代理提取链接
- **remark** (可选): 代理备注

**注意**:
- 创建代理是**异步操作**，创建后需要用 `proxy_query` 确认
- 避免创建重复的 `address + port` 组合

**示例 1：创建 SOCKS5 代理**
```json
{
  "type": "SOCKS5",
  "address": "192.168.1.100",
  "port": 1080,
  "hostAccount": "user123",
  "hostPassword": "pass456",
  "remark": "美国住宅代理 - 纽约"
}
```

**示例 2：创建 API 代理**
```json
{
  "type": "HTTP",
  "provider": 2,
  "extractUrl": "https://api.proxy-provider.com/get?token=xxx&count=1",
  "extractType": 0,
  "queryChannel": "IP2Location",
  "remark": "动态 API 代理"
}
```

---

### proxy_revise — 更新代理
- **id** (必填): 代理 ID
- **provider** (可选): 代理渠道，默认 `1`
- **type** (可选): 代理类型
- **agentGroupName** (可选): 代理组名称
- **address** (可选): 代理地址
- **port** (可选): 代理端口
- **hostAccount** (可选): 代理账号
- **hostPassword** (可选): 代理密码
- **refreshUrl** (可选): 代理刷新 URL
- **queryChannel** (可选): IP 查询渠道
- **extractType** (可选): 提取方式
- **extractUrl** (可选): API 提取链接
- **remark** (可选): 代理备注

**示例**:
```json
{
  "id": "proxy_001",
  "address": "10.0.0.50",
  "port": 8080,
  "remark": "已更新为新代理服务器"
}
```

---

### proxy_remove — 删除代理
- **ids** (必填): 代理 ID 数组

**注意**:
- 删除前需确保没有环境在使用该代理
- 建议先用 `env_query` 检查关联环境

**示例**:
```json
{
  "ids": ["proxy_001", "proxy_002"]
}
```

---

## 工作流示例

### 场景 1：创建代理并绑定到环境

```
1. proxy_create → 创建代理
   {
     "type": "SOCKS5",
     "address": "192.168.1.100",
     "port": 1080
   }

2. 等待几秒（异步操作）

3. proxy_query → 确认代理创建成功
   {
     "address": "192.168.1.100"
   }
   → 获取代理 ID: proxy_001

4. env_create → 创建环境并绑定代理
   {
     "name": "Amazon 账号",
     "proxyId": "proxy_001"
   }
```

---

### 场景 2：批量迁移环境到新分组

```
1. group_create → 创建新分组
   {
     "name": "已验证账号",
     "remark": "2024年验证通过的账号"
   }
   → 获取分组 ID: grp_new

2. env_query → 查询需要迁移的环境
   {
     "groupId": "grp_old",
     "size": 20
   }
   → 获取环境 ID 列表: ["env_001", "env_002", ...]

3. env_transfer_group → 批量转移
   {
     "ids": ["env_001", "env_002", "env_003"],
     "groupId": "grp_new"
   }

4. env_query → 验证转移结果
   {
     "groupId": "grp_new"
   }
```

---

### 场景 3：清理无用代理

```
1. proxy_query → 查询所有代理
   {}

2. 对每个代理：
   env_query → 检查是否有环境使用
   {
     "proxyId": "proxy_001"
   }
   → 如果 total = 0，说明未被使用

3. proxy_remove → 删除未使用的代理
   {
     "ids": ["proxy_unused_01", "proxy_unused_02"]
   }
```

---

## 常见枚举值

### 代理类型 (type)
| 值 | 说明 |
|---|------|
| HTTP | HTTP 代理 |
| HTTPS | HTTPS 代理 |
| SOCKS5 | SOCKS5 代理 |
| SSH | SSH 隧道代理 |

### 代理渠道 (provider)
| 值 | 说明 |
|---|------|
| 0 | 不使用代理 |
| 1 | 自有代理（手动配置） |
| 2 | API 代理（自动提取） |

### IP 查询渠道 (queryChannel)
| 值 | 说明 |
|---|------|
| IP2Location | IP2Location 服务（默认） |
| IPApi | IP-API 服务 |

### 提取方式 (extractType) - 仅 API 代理
| 值 | 说明 |
|---|------|
| 0 | 每次打开环境都提取新 IP |
| 1 | IP 失效后才提取新 IP |

---

## 注意事项

### 代理创建是异步的
```
proxy_create 返回成功 ≠ 代理立即可用
→ 需要等待几秒后用 proxy_query 确认
```

### 删除分组前需解绑环境
```
group_remove 会失败如果分组内有环境
→ 先用 env_transfer_group 将环境移到其他分组
→ 或使用 env_query 检查分组内环境数量
```

### 代理优先级
```
env_create 同时提供 proxyId 和 proxyConfig 时：
→ 优先使用 proxyId
→ proxyConfig 会被忽略
```

### 避免重复代理
```
创建代理前建议：
1. proxy_query 检查是否已存在相同 address + port
2. 如果存在，直接复用已有代理 ID
```
