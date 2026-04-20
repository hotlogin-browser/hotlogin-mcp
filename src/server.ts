#!/usr/bin/env node
declare const process: {
  exit(code?: number): void;
};

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerLocalTools } from './mcp/tools.js';

function createServer() {
  const server = new McpServer({
    name: 'xbrowser-local-api',
    version: '0.1.0',
    capabilities: {
      resources: {},
      tools: {}
    }
  });

  registerLocalTools(server);
  return server;
}

async function bootstrap() {
  const transport = new StdioServerTransport();
  await createServer().connect(transport);
  console.error('XBrowser Local API MCP Server running on stdio');
}

bootstrap().catch((error) => {
  console.error('Fatal error in bootstrap():', error);
  process.exit(1);
});
