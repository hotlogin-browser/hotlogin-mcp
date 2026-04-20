import path from 'path';
import os from 'os';
import { pilotSession } from './session.js';

const defaultSavePath = path.join(os.homedir(), 'Downloads');

// ── 会话 ──────────────────────────────────────────────────
export async function attachSession({ wsEndpoint }: { wsEndpoint: string }) {
  await pilotSession.attach(wsEndpoint);
  return `Session attached: ${wsEndpoint}`;
}

// ── 标签页 ─────────────────────────────────────────────────
export async function spawnTab() {
  await pilotSession.spawnTab();
  return 'New tab opened';
}

// ── 页面级操作 ──────────────────────────────────────────────
export async function visitUrl({ url }: { url: string }) {
  await pilotSession.page().goto(url);
  return `Visited: ${url}`;
}

export async function captureView({ savePath, fullPage }: { savePath?: string; fullPage?: boolean }) {
  const page = pilotSession.page();
  const filename = `capture-${Date.now()}-${Math.random().toString(36).slice(2, 10)}.png`;
  const outputPath = path.join(savePath ?? defaultSavePath, filename);
  const buffer = await page.screenshot({ path: outputPath, fullPage: fullPage ?? false });
  return [
    {
      type: 'image' as const,
      data: buffer.toString('base64'),
      mimeType: 'image/png'
    }
  ];
}

export async function readPageText() {
  const page = pilotSession.page();
  const text = await page.evaluate(() => {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const style = window.getComputedStyle(node.parentElement!);
          return style.display !== 'none' && style.visibility !== 'hidden'
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        }
      }
    );
    const chunks: string[] = [];
    let node: Node | null;
    while ((node = walker.nextNode())) {
      const s = node.textContent?.trim();
      if (s) chunks.push(s);
    }
    return chunks.join('\n');
  });
  return `Page text:\n${text}`;
}

export async function readPageHtml() {
  return pilotSession.page().content();
}

// ── 元素操作 ────────────────────────────────────────────────
export async function tapElement({ selector }: { selector: string }) {
  await pilotSession.page().click(selector);
  return `Tapped: ${selector}`;
}

export async function tapFrameElement({
  frameSelector,
  selector
}: {
  frameSelector: string;
  selector: string;
}) {
  const frame = pilotSession.page().frameLocator(frameSelector);
  await frame.locator(selector).click();
  return `Tapped ${selector} inside frame ${frameSelector}`;
}

export async function writeElement({ selector, text }: { selector: string; text: string }) {
  const page = pilotSession.page();
  await page.waitForSelector(selector);
  await page.fill(selector, text);
  return `Wrote "${text}" into ${selector}`;
}

export async function pickOption({ selector, value }: { selector: string; value: string }) {
  const page = pilotSession.page();
  await page.waitForSelector(selector);
  await page.selectOption(selector, value);
  return `Selected "${value}" in ${selector}`;
}

export async function hoverElement({ selector }: { selector: string }) {
  const page = pilotSession.page();
  await page.waitForSelector(selector);
  await page.hover(selector);
  return `Hovered: ${selector}`;
}

export async function scrollIntoView({ selector }: { selector: string }) {
  const page = pilotSession.page();
  await page.waitForSelector(selector);
  await page.evaluate((sel) => {
    document.querySelector(sel)?.scrollIntoView({ behavior: 'smooth' });
  }, selector);
  return `Scrolled to: ${selector}`;
}

export async function moveElement({
  selector,
  targetSelector
}: {
  selector: string;
  targetSelector: string;
}) {
  const page = pilotSession.page();
  const src = await page.waitForSelector(selector);
  const dst = await page.waitForSelector(targetSelector);
  const srcBox = await src.boundingBox();
  const dstBox = await dst.boundingBox();
  if (!srcBox || !dstBox) {
    return 'Cannot resolve element positions for drag';
  }
  await page.mouse.move(srcBox.x + srcBox.width / 2, srcBox.y + srcBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(dstBox.x + dstBox.width / 2, dstBox.y + dstBox.height / 2);
  await page.mouse.up();
  return `Moved ${selector} → ${targetSelector}`;
}

// ── 键盘 ────────────────────────────────────────────────────
export async function sendKey({ key, selector }: { key: string; selector?: string }) {
  const page = pilotSession.page();
  if (selector) {
    await page.waitForSelector(selector);
    await page.focus(selector);
  }
  await page.keyboard.press(key);
  return `Key sent: ${key}`;
}

// ── 脚本 ────────────────────────────────────────────────────
export async function evalScript({ script }: { script: string }) {
  const result = await pilotSession.page().evaluate(script);
  return result;
}

// ── 页面状态 ─────────────────────────────────────────────────
export async function waitForLoad({ timeout }: { timeout?: number }) {
  await pilotSession.page().waitForLoadState('load', { timeout });
  return 'Page load complete';
}

export async function readPageMeta() {
  const page = pilotSession.page();
  return { url: page.url(), title: await page.title() };
}

export async function reloadPage({ waitLoad }: { waitLoad?: boolean }) {
  const page = pilotSession.page();
  await page.reload({ waitUntil: waitLoad !== false ? 'load' : undefined });
  return `Page reloaded: ${page.url()}`;
}

export async function historyBack() {
  await pilotSession.page().goBack();
  return 'Navigated back';
}

export async function historyForward() {
  await pilotSession.page().goForward();
  return 'Navigated forward';
}

// ── 元素查询 ─────────────────────────────────────────────────
export async function waitForElement({ selector, timeout }: { selector: string; timeout?: number }) {
  await pilotSession.page().waitForSelector(selector, { timeout });
  return `Element appeared: ${selector}`;
}

export async function checkElementExists({ selector }: { selector: string }) {
  const count = await pilotSession.page().locator(selector).count();
  return { selector, exists: count > 0, count };
}

export async function readElementText({ selector }: { selector: string }) {
  const page = pilotSession.page();
  await page.waitForSelector(selector);
  const text = await page.locator(selector).innerText();
  return { selector, text };
}

export async function readElementAttr({ selector, attr }: { selector: string; attr: string }) {
  const page = pilotSession.page();
  await page.waitForSelector(selector);
  const value = await page.locator(selector).getAttribute(attr);
  return { selector, attr, value };
}

export async function countElements({ selector }: { selector: string }) {
  const count = await pilotSession.page().locator(selector).count();
  return { selector, count };
}

// ── Checkbox ─────────────────────────────────────────────────
export async function checkBox({ selector }: { selector: string }) {
  const page = pilotSession.page();
  await page.waitForSelector(selector);
  await page.check(selector);
  return `Checked: ${selector}`;
}

export async function uncheckBox({ selector }: { selector: string }) {
  const page = pilotSession.page();
  await page.waitForSelector(selector);
  await page.uncheck(selector);
  return `Unchecked: ${selector}`;
}

// ── 鼠标坐标点击 ──────────────────────────────────────────────
export async function clickAtPosition({ x, y, button }: { x: number; y: number; button?: 'left' | 'right' | 'middle' }) {
  await pilotSession.page().mouse.click(x, y, { button: button ?? 'left' });
  return `Clicked at (${x}, ${y})`;
}

// ── Cookie ────────────────────────────────────────────────────
export async function readCookies({ domain }: { domain?: string }) {
  const cookies = await pilotSession.page().context().cookies();
  const filtered = domain ? cookies.filter(c => c.domain.includes(domain)) : cookies;
  return filtered;
}

export async function writeCookie({
  name, value, domain, path, httpOnly, secure, expires
}: {
  name: string;
  value: string;
  domain?: string;
  path?: string;
  httpOnly?: boolean;
  secure?: boolean;
  expires?: number;
}) {
  const page = pilotSession.page();
  const url = page.url();
  await page.context().addCookies([{ name, value, url, domain, path, httpOnly, secure, expires }]);
  return `Cookie set: ${name}=${value}`;
}

export async function clearCookies({ domain }: { domain?: string }) {
  if (domain) {
    const all = await pilotSession.page().context().cookies();
    const keep = all.filter(c => !c.domain.includes(domain));
    await pilotSession.page().context().clearCookies();
    if (keep.length > 0) {
      await pilotSession.page().context().addCookies(keep);
    }
    return `Cleared cookies for domain: ${domain}`;
  }
  await pilotSession.page().context().clearCookies();
  return 'All cookies cleared';
}

// ── Storage ───────────────────────────────────────────────────
export async function readStorage({ storageType, key }: { storageType: 'local' | 'session'; key?: string }) {
  const data = await pilotSession.page().evaluate(
    ({ type, k }) => {
      const store = type === 'local' ? localStorage : sessionStorage;
      return k ? { [k]: store.getItem(k) } : Object.fromEntries(Object.entries(store));
    },
    { type: storageType, k: key }
  );
  return data;
}

export async function writeStorage({ storageType, key, value }: { storageType: 'local' | 'session'; key: string; value: string }) {
  await pilotSession.page().evaluate(
    ({ type, k, v }) => {
      const store = type === 'local' ? localStorage : sessionStorage;
      store.setItem(k, v);
    },
    { type: storageType, k: key, v: value }
  );
  return `${storageType}Storage[${key}] = ${value}`;
}

// ── 弹窗处理 ─────────────────────────────────────────────────
export async function handleDialog({ action, promptText }: { action: 'accept' | 'dismiss'; promptText?: string }) {
  const page = pilotSession.page();
  page.once('dialog', async (dialog) => {
    if (action === 'accept') {
      await dialog.accept(promptText);
    } else {
      await dialog.dismiss();
    }
  });
  return `Dialog handler registered: will ${action} on next dialog`;
}
