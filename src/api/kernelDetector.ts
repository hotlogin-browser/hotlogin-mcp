import { readdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir, platform } from 'os';

/**
 * 获取跨平台的 xlocal 文件夹路径
 * @returns xlocal 文件夹的绝对路径
 */
function getXlocalPath(): string {
  const home = homedir();
  const os = platform();
  
  // 根据不同操作系统返回对应路径
  if (os === 'darwin') {
    // Mac: ~/Library/Application Support/HotLogin/xlocal
    return join(home, 'Library', 'Application Support', 'HotLogin', 'xlocal');
  } else if (os === 'win32') {
    // Windows: %APPDATA%\HotLogin\xlocal
    return join(home, 'AppData', 'Roaming', 'HotLogin', 'xlocal');
  } else {
    // Linux: ~/.config/HotLogin/xlocal
    return join(home, '.config', 'HotLogin', 'xlocal');
  }
}

/**
 * 获取本地xlocal文件夹中最大的内核版本号
 * 例如: xchrome-128 -> 128
 * @returns 最大内核版本号，如果未找到则返回 null
 */
export function getMaxKernelVersion(): number | null {
  try {
    // 获取跨平台的 xlocal 路径
    const xlocalPath = getXlocalPath();
    
    // 检查路径是否存在
    if (!existsSync(xlocalPath)) {
      console.log(`[KernelDetector] xlocal folder not found: ${xlocalPath}`);
      return null;
    }

    // 读取目录内容
    const entries = readdirSync(xlocalPath);

    // 过滤出符合 xchrome-XXX 格式的目录并提取版本号
    const versions: number[] = [];
    for (const entry of entries) {
      const fullPath = join(xlocalPath, entry);
      const stats = statSync(fullPath);
      
      // 只处理目录
      if (stats.isDirectory()) {
        // 匹配 xchrome-数字 的格式
        const match = entry.match(/^xchrome-(\d+)$/i);
        if (match) {
          const version = parseInt(match[1], 10);
          if (!isNaN(version)) {
            versions.push(version);
          }
        }
      }
    }

    // 返回最大版本号
    if (versions.length > 0) {
      const maxVersion = Math.max(...versions);
      console.log(`[KernelDetector] Found ${versions.length} kernel versions in ${xlocalPath}, max: ${maxVersion}`);
      return maxVersion;
    }

    console.log(`[KernelDetector] No kernel versions found in ${xlocalPath}`);
    return null;
  } catch (error) {
    console.error('[KernelDetector] Error reading xlocal folder:', error);
    return null;
  }
}
