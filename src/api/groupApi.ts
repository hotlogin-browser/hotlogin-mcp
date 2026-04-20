import { localRoutes } from './client.js';
import type { GroupAddParams, GroupDeleteParams, GroupListParams, GroupUpdateParams } from '../types.js';
import { createPostAction, createPostActionWithFallback } from './request.js';

export const groupGateway = {
  query: createPostActionWithFallback<GroupListParams>(
    {
      path: localRoutes.groupSearch,
      scene: 'group query',
      label: 'Group query result'
    },
    {}
  ),
  create: createPostAction<GroupAddParams>({
    path: localRoutes.groupCreate,
    scene: 'group create',
    label: 'Group created'
  }),
  revise: createPostAction<GroupUpdateParams>({
    path: localRoutes.groupModify,
    scene: 'group revise',
    label: 'Group updated'
  }),
  remove: createPostAction<GroupDeleteParams>({
    path: localRoutes.groupRemove,
    scene: 'group remove',
    label: 'Group removed'
  })
};
