# 浏览器自动化操作参考

## 会话管理

### session_attach — 连接浏览器会话
- **wsEndpoint** (必填): WebSocket 端点，来自 `env_launch` 返回的 `puppeteer` 字段

**示例**:
```json
{
  "wsEndpoint": "ws://127.0.0.1:9222/devtools/browser/abc123"
}
```

---

## 页面导航

### page_visit — 访问网址
- **url** (必填): 目标网址，需包含协议（http:// 或 https://）

### page_back — 浏览器后退
- 无参数

### page_forward — 浏览器前进
- 无参数

### page_reload — 刷新页面
- **waitLoad** (可选): 是否等待加载完成，默认 `true`

### page_wait_load — 等待页面加载
- **timeout** (可选): 最大等待时间（毫秒），默认 30000

---

## 内容提取

### page_text — 读取页面可见文本
- 无参数
- 返回所有可见元素的文本内容

### page_html — 读取页面 HTML
- 无参数
- 返回完整 HTML 源码

### page_meta — 获取页面元信息
- 无参数
- 返回 `{ url: string, title: string }`

### page_capture — 页面截图
- **savePath** (可选): 保存路径，默认为 `~/Downloads`
- **fullPage** (可选): 是否截取完整页面（包括滚动区域），默认 `false`
- 返回 Base64 编码的 PNG 图片

---

## 元素操作

### element_tap — 点击元素
- **selector** (必填): CSS 选择器

**示例**:
```json
{
  "selector": "#submit-btn"
}
```

### element_write — 填写输入框
- **selector** (必填): CSS 选择器
- **text** (必填): 要填写的文本

**示例**:
```json
{
  "selector": "input[name='username']",
  "text": "admin@example.com"
}
```

### element_pick — 选择下拉项
- **selector** (必填): `<select>` 元素的 CSS 选择器
- **value** (必填): 要选择的选项值

**示例**:
```json
{
  "selector": "select[name='country']",
  "value": "US"
}
```

### element_hover — 鼠标悬停
- **selector** (必填): CSS 选择器

### element_scroll — 滚动到元素
- **selector** (必填): CSS 选择器
- 使用 `scrollIntoView({ behavior: 'smooth' })`

### element_move — 拖拽元素
- **selector** (必填): 源元素选择器
- **targetSelector** (必填): 目标元素选择器

### element_frame_tap — 点击 iframe 内元素
- **frameSelector** (必填): iframe 的 CSS/XPath 选择器
- **selector** (必填): iframe 内元素的选择器

---

## 键盘与脚本

### key_press — 发送键盘按键
- **key** (必填): 按键名称，如 `Enter`, `Tab`, `Escape`, `ArrowDown`
- **selector** (可选): 先聚焦到指定元素再按键

**常用按键**:
- `Enter` — 回车
- `Tab` — 制表符
- `Escape` — ESC
- `Backspace` — 删除
- `ArrowUp` / `ArrowDown` / `ArrowLeft` / `ArrowRight` — 方向键
- `Ctrl+C` / `Ctrl+V` — 复制/粘贴（Mac 用 `Meta+C` / `Meta+V`）

### script_eval — 执行 JavaScript
- **script** (必填): JavaScript 表达式，在页面上下文中执行
- 返回执行结果（可序列化的值）

**示例**:
```json
{
  "script": "document.title"
}
```

```json
{
  "script": "document.querySelectorAll('.product').length"
}
```

---

## 等待与检测

### element_wait — 等待元素出现
- **selector** (必填): CSS 选择器
- **timeout** (可选): 最大等待时间（毫秒），默认 30000

### element_exists — 检测元素存在性
- **selector** (必填): CSS 选择器
- 返回 `{ selector, exists: boolean, count: number }`

### element_count — 统计元素数量
- **selector** (必填): CSS 选择器
- 返回 `{ selector, count: number }`

### element_text — 获取元素文本
- **selector** (必填): CSS 选择器
- 返回 `{ selector, text: string }`

### element_attr — 获取元素属性
- **selector** (必填): CSS 选择器
- **attr** (必填): 属性名称，如 `href`, `src`, `value`, `class`, `data-*`
- 返回 `{ selector, attr, value }`

---

## Checkbox 操作

### element_check — 勾选复选框
- **selector** (必填): CSS 选择器

### element_uncheck — 取消勾选复选框
- **selector** (必填): CSS 选择器

---

## 鼠标坐标操作

### mouse_click_pos — 坐标点击
- **x** (必填): X 坐标（像素）
- **y** (必填): Y 坐标（像素）
- **button** (可选): 鼠标按键，`left`（默认）| `right` | `middle`

**示例**:
```json
{
  "x": 500,
  "y": 300,
  "button": "left"
}
```

---

## Cookie 管理

### cookie_read — 读取 Cookie
- **domain** (可选): 按域名过滤（部分匹配）
- 返回 Cookie 数组

### cookie_write — 写入 Cookie
- **name** (必填): Cookie 名称
- **value** (必填): Cookie 值
- **domain** (可选): 域名，建议带前导点如 `.example.com`
- **path** (可选): 路径，默认 `/`
- **httpOnly** (可选): 是否 HTTP Only
- **secure** (可选): 是否 Secure
- **expires** (可选): 过期时间（Unix 时间戳，秒）

**示例**:
```json
{
  "name": "session_id",
  "value": "abc123xyz",
  "domain": ".amazon.com",
  "path": "/",
  "httpOnly": true,
  "secure": true,
  "expires": 1735689600
}
```

### cookie_clear — 清除 Cookie
- **domain** (可选): 指定域名则只清除该域名的 Cookie，省略则清除全部

---

## Storage 操作

### storage_read — 读取存储
- **storageType** (必填): `local` (localStorage) | `session` (sessionStorage)
- **key** (可选): 指定键名，省略则读取全部

### storage_write — 写入存储
- **storageType** (必填): `local` | `session`
- **key** (必填): 键名
- **value** (必填): 键值（字符串）

**示例**:
```json
{
  "storageType": "local",
  "key": "user_preference",
  "value": "{\"theme\":\"dark\"}"
}
```

---

## 弹窗处理

### dialog_handle — 注册弹窗处理器
- **action** (必填): `accept` (确认) | `dismiss` (取消)
- **promptText** (可选): prompt 弹窗的输入文本

**注意**: 此工具需要在弹窗出现**之前**调用，用于注册处理器。

**示例**:
```json
{
  "action": "accept",
  "promptText": "确认删除"
}
```

---

## 标签页管理

### tab_spawn — 新建标签页
- 无参数
- 在当前会话中打开新标签页

---

## 常用选择器示例

```css
/* ID 选择器 */
#submit-btn

/* 类选择器 */
.product-item
.btn-primary

/* 标签选择器 */
input
button
a

/* 属性选择器 */
input[name='username']
a[href^='https://']
[data-testid='login-btn']

/* 组合选择器 */
form.login input[type='password']
.nav-menu > li:nth-child(2)

/* iframe 选择器 */
iframe[name='payment-frame']
```

---

## 最佳实践

### 1. 元素操作前先等待
```
page_wait_load → element_wait → element_tap
```

### 2. 填写表单的完整流程
```
page_visit → page_wait_load → element_write → key_press(Enter)
```

### 3. 采集数据的标准流程
```
page_visit → page_wait_load → element_text → element_attr → page_capture
```

### 4. Cookie 持久化
```
env_launch → 手动登录 → cookie_read → 保存 Cookie
下次启动 → env_launch → cookie_write → 自动登录
```
