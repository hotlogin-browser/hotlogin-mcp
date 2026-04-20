import { chromium } from 'playwright-core';
import type { Browser, BrowserContext, Page } from 'playwright-core';

interface PilotState {
  browser: Browser | null;
  context: BrowserContext | null;
  page: Page | null;
}

const state: PilotState = {
  browser: null,
  context: null,
  page: null
};

function requirePage(): Page {
  if (!state.page) {
    throw new Error('No active session. Call session_attach to connect a browser first.');
  }
  return state.page;
}

function requireContext(): BrowserContext {
  if (!state.context) {
    throw new Error('No active session. Call session_attach to connect a browser first.');
  }
  return state.context;
}

export const pilotSession = {
  async attach(wsEndpoint: string): Promise<void> {
    if (state.browser) {
      await state.browser.close().catch(() => {});
    }
    state.browser = await chromium.connectOverCDP(wsEndpoint);
    const contexts = state.browser.contexts();
    state.context = contexts.length > 0 ? contexts[0] : await state.browser.newContext();
    const pages = state.context.pages();
    state.page = pages.length > 0 ? pages[0] : await state.context.newPage();
  },

  async spawnTab(): Promise<void> {
    state.page = await requireContext().newPage();
  },

  page: requirePage,
  context: requireContext,

  isActive(): boolean {
    return state.browser !== null && state.page !== null;
  }
};
