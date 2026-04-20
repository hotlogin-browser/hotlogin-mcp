import { localRoutes } from './client.js';
import { createGetAction } from './request.js';

export const localServiceGateway = {
  ping: createGetAction({
    path: localRoutes.health,
    scene: 'local service ping',
    label: 'Local service status'
  })
};
