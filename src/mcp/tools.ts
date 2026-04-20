import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { envGateway } from '../api/envApi.js';
import { groupGateway } from '../api/groupApi.js';
import { proxyGateway } from '../api/proxyApi.js';
import { localServiceGateway } from '../api/serviceApi.js';
import {
  attachSession,
  spawnTab,
  visitUrl,
  captureView,
  readPageText,
  readPageHtml,
  tapElement,
  tapFrameElement,
  writeElement,
  pickOption,
  hoverElement,
  scrollIntoView,
  moveElement,
  sendKey,
  evalScript,
  waitForLoad,
  readPageMeta,
  reloadPage,
  historyBack,
  historyForward,
  waitForElement,
  checkElementExists,
  readElementText,
  readElementAttr,
  countElements,
  checkBox,
  uncheckBox,
  clickAtPosition,
  readCookies,
  writeCookie,
  clearCookies,
  readStorage,
  writeStorage,
  handleDialog
} from '../pilot/actions.js';
import { schemaShape, toolSchemas } from './schemas.js';
import { wrapToolResult } from './wrapper.js';

type ToolHandler = (params: any) => Promise<unknown>;

interface ToolDefinition {
  name: string;
  description: string;
  schema: keyof typeof toolSchemas;
  handler: ToolHandler;
}

const toolDefinitions: ToolDefinition[] = [
  {
    name: 'health_check',
    description: '检查火云本地服务是否可用',
    schema: 'empty',
    handler: () => localServiceGateway.ping()
  },
  { name: 'env_query', description: '分页查询环境列表', schema: 'envQuery', handler: envGateway.query },
  { name: 'env_profile', description: '获取单个环境详情', schema: 'envIdentity', handler: envGateway.profile },
  { name: 'env_cookie', description: '获取单个环境 Cookie', schema: 'envIdentity', handler: envGateway.cookie },
  { name: 'env_create', description: '创建环境', schema: 'envCreate', handler: envGateway.create },
  { name: 'env_revise', description: '更新环境', schema: 'envRevise', handler: envGateway.revise },
  { name: 'env_transfer_group', description: '批量调整环境分组', schema: 'envTransferGroup', handler: envGateway.transferGroup },
  { name: 'env_remove', description: '删除环境', schema: 'envRemove', handler: envGateway.remove },
  { name: 'env_purge_cache', description: '清理环境缓存', schema: 'envPurgeCache', handler: envGateway.purgeCache },
  { name: 'env_launch', description: '启动环境', schema: 'envLaunch', handler: envGateway.launch },
  { name: 'env_terminate', description: '关闭环境', schema: 'envTerminate', handler: envGateway.terminate },
  { name: 'env_terminate_all', description: '关闭全部已打开环境', schema: 'empty', handler: () => envGateway.terminateAll() },
  { name: 'env_runtime_state', description: '获取环境运行状态', schema: 'envIdentity', handler: envGateway.runtimeState },
  { name: 'env_opened', description: '查询当前已打开环境列表', schema: 'empty', handler: () => envGateway.opened() },
  { name: 'env_window_layout', description: '整理环境窗口布局', schema: 'envWindowLayout', handler: envGateway.arrangeWindows },
  { name: 'group_query', description: '查询分组列表', schema: 'groupQuery', handler: groupGateway.query },
  { name: 'group_create', description: '创建分组', schema: 'groupCreate', handler: groupGateway.create },
  { name: 'group_revise', description: '更新分组', schema: 'groupRevise', handler: groupGateway.revise },
  { name: 'group_remove', description: '删除分组', schema: 'groupRemove', handler: groupGateway.remove },
  { name: 'proxy_query', description: '查询代理列表', schema: 'proxyQuery', handler: proxyGateway.query },
  { name: 'proxy_create', description: '创建代理', schema: 'proxyCreate', handler: proxyGateway.create },
  { name: 'proxy_revise', description: '更新代理', schema: 'proxyRevise', handler: proxyGateway.revise },
  { name: 'proxy_remove', description: '删除代理', schema: 'proxyRemove', handler: proxyGateway.remove },

  // ── Pilot 浏览器自动化工具 ──────────────────────────────────────
  { name: 'session_attach',  description: '连接环境浏览器会话，wsEndpoint 来自 env_launch 的 puppeteer 字段', schema: 'sessionAttach', handler: attachSession },
  { name: 'tab_spawn',       description: '在当前会话中新建标签页', schema: 'empty',         handler: () => spawnTab() },
  { name: 'page_visit',      description: '在当前标签页跳转到指定 URL', schema: 'pageVisit',     handler: visitUrl },
  { name: 'page_capture',    description: '截取当前页面截图并返回图片', schema: 'pageCapture',   handler: captureView },
  { name: 'page_text',       description: '读取当前页面所有可见文本', schema: 'empty',         handler: () => readPageText() },
  { name: 'page_html',       description: '读取当前页面完整 HTML', schema: 'empty',         handler: () => readPageHtml() },
  { name: 'element_tap',     description: '点击指定 CSS 选择器的元素', schema: 'elementTap',    handler: tapElement },
  { name: 'element_frame_tap', description: '点击 iframe 内的元素', schema: 'elementFrameTap', handler: tapFrameElement },
  { name: 'element_write',   description: '向输入框填写文本', schema: 'elementWrite',  handler: writeElement },
  { name: 'element_pick',    description: '选择下拉框选项', schema: 'elementPick',   handler: pickOption },
  { name: 'element_hover',   description: '鼠标悬停到元素', schema: 'elementHover',  handler: hoverElement },
  { name: 'element_scroll',  description: '将元素滚动进可视区域', schema: 'elementScroll', handler: scrollIntoView },
  { name: 'element_move',    description: '拖拽元素到目标位置', schema: 'elementMove',   handler: moveElement },
  { name: 'key_press',       description: '发送键盘按键（可选先聚焦元素）', schema: 'keyPress',      handler: sendKey },
  { name: 'script_eval',     description: '在页面上下文执行 JavaScript 并返回结果', schema: 'scriptEval',    handler: evalScript },

  // ── Pilot 扩展工具 ───────────────────────────────────────
  { name: 'page_wait_load',  description: '等待当前页面加载完成', schema: 'pageWaitLoad',  handler: waitForLoad },
  { name: 'page_meta',       description: '获取当前页面 URL 和标题', schema: 'empty',         handler: () => readPageMeta() },
  { name: 'page_reload',     description: '刷新当前页面', schema: 'pageReload',    handler: reloadPage },
  { name: 'page_back',       description: '浏览器历史后退', schema: 'empty',         handler: () => historyBack() },
  { name: 'page_forward',    description: '浏览器历史前进', schema: 'empty',         handler: () => historyForward() },
  { name: 'element_wait',    description: '等待元素出现在 DOM 中', schema: 'elementWait',   handler: waitForElement },
  { name: 'element_exists',  description: '检测元素是否存在并返回数量', schema: 'elementExists', handler: checkElementExists },
  { name: 'element_text',    description: '获取元素内部文本', schema: 'elementText',   handler: readElementText },
  { name: 'element_attr',    description: '获取元素指定属性的值', schema: 'elementAttr',   handler: readElementAttr },
  { name: 'element_count',   description: '统计匹配选择器的元素数量', schema: 'elementCount',  handler: countElements },
  { name: 'element_check',   description: '勾选 checkbox', schema: 'elementCheck',  handler: checkBox },
  { name: 'element_uncheck', description: '取消勾选 checkbox', schema: 'elementUncheck', handler: uncheckBox },
  { name: 'mouse_click_pos', description: '鼠标点击页面指定坐标', schema: 'mouseClickPos', handler: clickAtPosition },
  { name: 'cookie_read',     description: '读取当前会话 Cookie（可按域名过滤）', schema: 'cookieRead',    handler: readCookies },
  { name: 'cookie_write',    description: '写入一条 Cookie', schema: 'cookieWrite',   handler: writeCookie },
  { name: 'cookie_clear',    description: '清除 Cookie（可指定域名或全部清除）', schema: 'cookieClear',   handler: clearCookies },
  { name: 'storage_read',    description: '读取 localStorage / sessionStorage', schema: 'storageRead',   handler: readStorage },
  { name: 'storage_write',   description: '写入 localStorage / sessionStorage', schema: 'storageWrite',  handler: writeStorage },
  { name: 'dialog_handle',   description: '预先注册弹窗处理器（accept/dismiss）', schema: 'dialogHandle',  handler: handleDialog }
];

export function registerLocalTools(server: McpServer) {
  toolDefinitions.forEach(({ name, description, schema, handler }) => {
    server.tool(name, description, schemaShape(toolSchemas[schema]), wrapToolResult(handler));
  });
}
