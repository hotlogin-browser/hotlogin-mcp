import { presentResult, unwrapEnvelope } from './response.js';
import { localRequest, withOrigin } from './client.js';

interface TextActionConfig {
  label: string;
  path: string;
  scene: string;
}

export function createPostAction<Params>(config: TextActionConfig) {
  return async (params: Params): Promise<string> => {
    const response = await localRequest.post(withOrigin(config.path), params);
    const data = unwrapEnvelope(response, config.scene);
    return presentResult(config.label, data);
  };
}

export function createPostActionWithFallback<Params>(config: TextActionConfig, fallback: Params) {
  return async (params: Params = fallback): Promise<string> => {
    const response = await localRequest.post(withOrigin(config.path), params);
    const data = unwrapEnvelope(response, config.scene);
    return presentResult(config.label, data);
  };
}

export function createGetAction(config: TextActionConfig) {
  return async (): Promise<string> => {
    const response = await localRequest.get(withOrigin(config.path));
    const data = unwrapEnvelope(response, config.scene);
    return presentResult(config.label, data);
  };
}
