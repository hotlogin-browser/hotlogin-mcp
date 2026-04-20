import { localRoutes, localRequest, withOrigin } from './client.js';
import type { ProxyAddParams, ProxyDeleteParams, ProxyListParams, ProxyUpdateParams } from '../types.js';
import { createPostAction } from './request.js';
import { presentResult } from './response.js';

/**
 * proxy/add 上游服务为异步写入，可能返回非 0 码但代理已实际建立。
 * 捕获错误后查询列表以地址匹配确认是否建立成功。
 */
async function proxyCreate(params: ProxyAddParams): Promise<string> {
  // 服务端 provider 字段为 Integer 非空校验缺失，null 会触发 NPE；补充安全默认值
  const safeParams = {
    provider: 1,          // 自有代理
    queryChannel: 'IP2Location',
    ...params
  };
  try {
    const response = await localRequest.post(withOrigin(localRoutes.proxyCreate), safeParams);
    const { code, data, msg } = response.data;
    if (code === 0 || code === '0') {
      return presentResult('Proxy created', data);
    }
    // 上游异步写入场景：查询列表验证是否建立成功
    const listResp = await localRequest.post(withOrigin(localRoutes.proxySearch), { page: 1, size: 5 });
    const list: any[] = listResp.data?.data?.data ?? [];
    const created = list.find(
      (p: any) => p.address === (params as any).address && String(p.port) === String((params as any).port)
    );
    if (created) {
      return presentResult('Proxy created', created);
    }
    throw new Error(`[proxy create] ${msg}`);
  } catch (err: any) {
    if (err.message?.startsWith('[proxy create]')) throw err;
    throw new Error(`[proxy create] ${err.message}`);
  }
}

export const proxyGateway = {
  query: createPostAction<ProxyListParams>({
    path: localRoutes.proxySearch,
    scene: 'proxy query',
    label: 'Proxy query result'
  }),
  create: proxyCreate,
  revise: createPostAction<ProxyUpdateParams>({
    path: localRoutes.proxyModify,
    scene: 'proxy revise',
    label: 'Proxy updated'
  }),
  remove: createPostAction<ProxyDeleteParams>({
    path: localRoutes.proxyRemove,
    scene: 'proxy remove',
    label: 'Proxy removed'
  })
};
