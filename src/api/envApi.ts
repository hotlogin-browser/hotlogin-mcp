import { localRoutes } from './client.js';
import type {
  ArrangeWindowsParams,
  EnvAddParams,
  EnvClearCacheParams,
  EnvCloseParams,
  EnvDeleteParams,
  EnvIdentityParams,
  EnvListParams,
  EnvStartParams,
  EnvUpdateGroupParams,
  EnvUpdateParams
} from '../types.js';
import { createGetAction, createPostAction, createPostActionWithFallback } from './request.js';
import { getMaxKernelVersion } from './kernelDetector.js';

export const envGateway = {
  create: async (params: EnvAddParams) => {
    // 如果未指定内核版本，自动检测并填充最大版本号
    if (!params.fingerprint?.kernelVersion || params.fingerprint.kernelVersion === 0) {
      const maxKernel = getMaxKernelVersion();
      if (maxKernel) {
        params.fingerprint = params.fingerprint || {};
        params.fingerprint.kernelVersion = maxKernel;
        console.log(`[env_create] Auto-detected kernel version: ${maxKernel}`);
      }
    }
    
    // 调用原始的创建方法
    const createAction = createPostAction<EnvAddParams>({
      path: localRoutes.envCreate,
      scene: 'env create',
      label: 'Env created'
    });
    
    return createAction(params);
  },
  query: createPostAction<EnvListParams>({
    path: localRoutes.envSearch,
    scene: 'env query',
    label: 'Env query result'
  }),
  profile: createPostAction<EnvIdentityParams>({
    path: localRoutes.envProfile,
    scene: 'env profile',
    label: 'Env profile'
  }),
  cookie: createPostAction<EnvIdentityParams>({
    path: localRoutes.envCookie,
    scene: 'env cookie',
    label: 'Env cookie'
  }),
  revise: createPostAction<EnvUpdateParams>({
    path: localRoutes.envModify,
    scene: 'env revise',
    label: 'Env updated'
  }),
  transferGroup: createPostAction<EnvUpdateGroupParams>({
    path: localRoutes.envMoveGroup,
    scene: 'env transfer group',
    label: 'Env group updated'
  }),
  remove: createPostAction<EnvDeleteParams>({
    path: localRoutes.envRemove,
    scene: 'env remove',
    label: 'Env removed'
  }),
  purgeCache: createPostAction<EnvClearCacheParams>({
    path: localRoutes.envPurgeCache,
    scene: 'env purge cache',
    label: 'Env cache cleared'
  }),
  launch: createPostAction<EnvStartParams>({
    path: localRoutes.envLaunch,
    scene: 'env launch',
    label: 'Env launched'
  }),
  terminate: createPostAction<EnvCloseParams>({
    path: localRoutes.envTerminate,
    scene: 'env terminate',
    label: 'Env closed'
  }),
  terminateAll: createPostActionWithFallback<Record<string, never>>(
    {
      path: localRoutes.envTerminateAll,
      scene: 'env terminate all',
      label: 'All env closed'
    },
    {}
  ),
  runtimeState: createPostAction<EnvIdentityParams>({
    path: localRoutes.envRuntimeState,
    scene: 'env runtime state',
    label: 'Env runtime state'
  }),
  opened: createGetAction({
    path: localRoutes.envOpenedCollection,
    scene: 'env opened collection',
    label: 'Opened env list'
  }),
  arrangeWindows: createPostActionWithFallback<ArrangeWindowsParams>(
    {
      path: localRoutes.envWindowLayout,
      scene: 'env window layout',
      label: 'Windows arranged'
    },
    {}
  )
};
