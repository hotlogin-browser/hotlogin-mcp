export {
  localRuntime,
  LOCAL_SERVICE_PORT,
  LOCAL_SERVICE_TOKEN,
  LOCAL_SERVICE_ENDPOINT
} from './api/config.js';

export {
  serviceOrigin,
  localRoutes,
  localRequest,
  withOrigin
} from './api/client.js';

export { envGateway } from './api/envApi.js';
export { groupGateway } from './api/groupApi.js';
export { proxyGateway } from './api/proxyApi.js';
export { localServiceGateway } from './api/serviceApi.js';
export { createGetAction, createPostAction, createPostActionWithFallback } from './api/request.js';

export { toolSchemas, schemaShape } from './mcp/schemas.js';
export { registerLocalTools } from './mcp/tools.js';
export { wrapToolResult } from './mcp/wrapper.js';

export type * from './types.js';
