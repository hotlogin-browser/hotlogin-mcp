#!/usr/bin/env node
declare const process: {
  exit(code?: number): void;
};

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { envGateway } from './api/envApi.js';
import { groupGateway } from './api/groupApi.js';
import { proxyGateway } from './api/proxyApi.js';
import { localServiceGateway } from './api/serviceApi.js';
import { schemaShape, toolSchemas } from './mcp/schemas.js';
import { wrapToolResult } from './mcp/wrapper.js';

type ToolHandler = (params: any) => Promise<unknown>;

interface ToolDefinition {
  name: string;
  description: string;
  schema: keyof typeof toolSchemas;
  handler: ToolHandler;
}

// 只包含环境管理、分组管理、代理管理的工具定义
const coreToolDefinitions: ToolDefinition[] = [
  {
    name: 'health_check',
    description: '检查火云本地服务是否可用',
    schema: 'empty',
    handler: () => localServiceGateway.ping()
  },
  { name: 'env_query', description: '分页查询环境列表', schema: 'envQuery', handler: envGateway.query },
  { name: 'env_profile', description: '获取单个环境详情', schema: 'envIdentity', handler: envGateway.profile },
  { name: 'env_cookie', description: '获取单个环境 Cookie', schema: 'envIdentity', handler: envGateway.cookie },
  { name: 'env_create', description: '创建环境', schema: 'envCreate', handler: envGateway.create },
  { name: 'env_revise', description: '更新环境', schema: 'envRevise', handler: envGateway.revise },
  { name: 'env_transfer_group', description: '批量调整环境分组', schema: 'envTransferGroup', handler: envGateway.transferGroup },
  { name: 'env_remove', description: '删除环境', schema: 'envRemove', handler: envGateway.remove },
  { name: 'env_purge_cache', description: '清理环境缓存', schema: 'envPurgeCache', handler: envGateway.purgeCache },
  { name: 'env_launch', description: '启动环境', schema: 'envLaunch', handler: envGateway.launch },
  { name: 'env_terminate', description: '关闭环境', schema: 'envTerminate', handler: envGateway.terminate },
  { name: 'env_terminate_all', description: '关闭全部已打开环境', schema: 'empty', handler: () => envGateway.terminateAll() },
  { name: 'env_runtime_state', description: '获取环境运行状态', schema: 'envIdentity', handler: envGateway.runtimeState },
  { name: 'env_opened', description: '查询当前已打开环境列表', schema: 'empty', handler: () => envGateway.opened() },
  { name: 'env_window_layout', description: '整理环境窗口布局', schema: 'envWindowLayout', handler: envGateway.arrangeWindows },
  { name: 'group_query', description: '查询分组列表', schema: 'groupQuery', handler: groupGateway.query },
  { name: 'group_create', description: '创建分组', schema: 'groupCreate', handler: groupGateway.create },
  { name: 'group_revise', description: '更新分组', schema: 'groupRevise', handler: groupGateway.revise },
  { name: 'group_remove', description: '删除分组', schema: 'groupRemove', handler: groupGateway.remove },
  { name: 'proxy_query', description: '查询代理列表', schema: 'proxyQuery', handler: proxyGateway.query },
  { name: 'proxy_create', description: '创建代理', schema: 'proxyCreate', handler: proxyGateway.create },
  { name: 'proxy_revise', description: '更新代理', schema: 'proxyRevise', handler: proxyGateway.revise },
  { name: 'proxy_remove', description: '删除代理', schema: 'proxyRemove', handler: proxyGateway.remove }
];

function createServer() {
  const server = new McpServer({
    name: 'hotlogin-local-api',
    version: '1.0.0',
    capabilities: {
      resources: {},
      tools: {}
    }
  });

  // 注册核心管理工具
  coreToolDefinitions.forEach(({ name, description, schema, handler }) => {
    server.tool(name, description, schemaShape(toolSchemas[schema]), wrapToolResult(handler));
  });

  return server;
}

async function bootstrap() {
  const transport = new StdioServerTransport();
  await createServer().connect(transport);
  console.error('HotLogin Local API MCP Server running on stdio');
}

bootstrap().catch((error) => {
  console.error('Fatal error in bootstrap():', error);
  process.exit(1);
});
