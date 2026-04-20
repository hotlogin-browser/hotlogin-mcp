declare module '@modelcontextprotocol/sdk/server/mcp.js' {
  export class McpServer {
    constructor(config: any);
    tool(name: string, description: string, shape: Record<string, any>, handler: (params: any) => Promise<any>): void;
    connect(transport: any): Promise<void>;
  }
}

declare module '@modelcontextprotocol/sdk/server/stdio.js' {
  export class StdioServerTransport {
    constructor();
  }
}

declare module '@modelcontextprotocol/sdk/types.js' {
  export interface CallToolResult {
    content: Array<{
      type: 'text';
      text: string;
    }>;
  }
}
