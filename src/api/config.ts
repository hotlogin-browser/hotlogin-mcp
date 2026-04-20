declare const process: {
  env: Record<string, string | undefined>;
};

interface ServiceRuntimeProfile {
  port: string;
  token?: string;
  origin?: string;
}

const DEFAULT_LOCAL_API_PORT = '60000';

function resolveRuntimeProfile(): ServiceRuntimeProfile {
  const port = process.env.API_PORT || process.env.PORT || DEFAULT_LOCAL_API_PORT;
  const origin = process.env.BASE_URL || `http://127.0.0.1:${port}`;

  return {
    port,
    token: process.env.API_KEY,
    origin
  };
}

const runtimeProfile = resolveRuntimeProfile();

export const localRuntime = runtimeProfile;
export const LOCAL_SERVICE_PORT = runtimeProfile.port;
export const LOCAL_SERVICE_TOKEN = runtimeProfile.token;
export const LOCAL_SERVICE_ENDPOINT = runtimeProfile.origin;
