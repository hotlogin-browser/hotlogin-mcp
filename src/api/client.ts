import axios from 'axios';
import { LOCAL_SERVICE_ENDPOINT, LOCAL_SERVICE_PORT, LOCAL_SERVICE_TOKEN } from './config.js';

export const serviceOrigin = LOCAL_SERVICE_ENDPOINT || `http://127.0.0.1:${LOCAL_SERVICE_PORT}`;

export const localRoutes = {
  health: '/api/v2/status',
  envCreate: '/api/v2/env/add',
  envSearch: '/api/v2/env/list',
  envProfile: '/api/v2/env/detail',
  envCookie: '/api/v2/env/getCookie',
  envModify: '/api/v2/env/update',
  envMoveGroup: '/api/v2/env/updateGroup',
  envRemove: '/api/v2/env/delete',
  envPurgeCache: '/api/v2/env/clearCache',
  envLaunch: '/api/v2/env/start',
  envTerminate: '/api/v2/env/close',
  envTerminateAll: '/api/v2/env/closeAll',
  envRuntimeState: '/api/v2/env/checkStatus',
  envOpenedCollection: '/api/v2/env/checkOpenStatus',
  envWindowLayout: '/api/v2/env/arrangeWindows',
  groupCreate: '/api/v2/group/add',
  groupModify: '/api/v2/group/update',
  groupRemove: '/api/v2/group/delete',
  groupSearch: '/api/v2/group/list',
  proxyCreate: '/api/v2/proxy/add',
  proxyModify: '/api/v2/proxy/update',
  proxyRemove: '/api/v2/proxy/delete',
  proxySearch: '/api/v2/proxy/list'
} as const;

export const localRequest = axios.create({
  headers: LOCAL_SERVICE_TOKEN
    ? {
        Authorization: `Bearer ${LOCAL_SERVICE_TOKEN}`,
        API_KEY: LOCAL_SERVICE_TOKEN
      }
    : undefined
});

export const withOrigin = (path: string) => `${serviceOrigin}${path}`;
