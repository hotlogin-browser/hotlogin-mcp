import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

function textResult(text: string): CallToolResult {
  return {
    content: [
      {
        type: 'text',
        text
      }
    ]
  };
}

export function wrapToolResult(handler: (params: any) => Promise<unknown>) {
  return async (params: any): Promise<CallToolResult> => {
    try {
      const result = await handler(params);
      return textResult(typeof result === 'string' ? result : JSON.stringify(result, null, 2));
    } catch (error) {
      return textResult(error instanceof Error ? error.message : String(error));
    }
  };
}
