import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.core.ts'],  // 使用精简版入口，只包含管理接口
  format: ['cjs'],
  outDir: 'build',
  sourcemap: false,
  clean: true,
  dts: true,
  // 保持运行时依赖外部引用，不打包进最终文件
  external: [
    'axios',
    'playwright-core',
    'zod',
    '@modelcontextprotocol/sdk'
  ],
  // 打包优化
  splitting: false,
  treeshake: true,
});
