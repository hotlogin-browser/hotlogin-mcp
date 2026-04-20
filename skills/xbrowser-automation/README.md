# XBrowser Automation Skill

## 设计理念

本 Skill 文档以“能力概览 + 场景化工作流 + 深度参考”的方式组织，方便 AI Agent 与开发者快速上手并准确调用 MCP 工具。

### 核心内容

1. **能力矩阵图** — 一目了然的三大模块划分
2. **场景化工作流** — 按真实业务场景组织，而非按 API 端点
3. **最佳实践** — 包含实际使用中的注意事项和推荐做法
4. **故障排查表** — 快速定位和解决常见问题
5. **技术架构图** — 展示完整的调用链路

---

## 文件结构

```
skills/xbrowser-automation/
├── SKILL.md                              # 主文档（能力概览 + 快速上手）
└── references/                           # 深度参考文档
    ├── environment-management.md         # 环境管理完整参数
    ├── browser-automation.md             # 浏览器自动化操作
    ├── group-proxy-management.md         # 分组与代理管理
    └── runtime-control.md                # 环境运行控制
```

---

## 使用方式

### AI Agent 如何使用

当用户提出需求时，AI 会：

1. **读取 SKILL.md 的 description** → 判断是否匹配场景
2. **查看能力矩阵** → 确定需要哪些工具
3. **参考快速上手** → 了解标准工作流
4. **查阅参考文档** → 获取完整参数定义
5. **执行工具调用** → 通过 MCP 协议发送 JSON 参数

### 人类开发者如何使用

1. **快速了解能力** → 阅读 SKILL.md 的能力矩阵
2. **学习使用方式** → 查看场景化示例
3. **查询参数细节** → 打开对应的 reference 文档
4. **排查问题** → 使用故障排查表

---

## 技术栈

- **MCP SDK**: @modelcontextprotocol/sdk ^1.7.0
- **自动化引擎**: Playwright ^1.59.1
- **参数校验**: Zod ^3.24.2
- **HTTP 客户端**: Axios ^1.8.4
- **运行时**: Node.js >= 18.0.0

---

## 版本

- **Skill 版本**: 0.1.0
- **创建日期**: 2026-04-16
- **维护者**: XBrowser Team
