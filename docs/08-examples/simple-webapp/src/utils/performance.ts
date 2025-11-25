/**
 * パフォーマンス最適化関連のユーティリティ関数
 */

/**
 * デバウンス関数
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate: boolean = false
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };

    const callNow = immediate && !timeout;

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func(...args);
  };
};

/**
 * スロットル関数
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * メモ化関数
 */
export const memoize = <T extends (...args: any[]) => any>(
  fn: T,
  getKey?: (...args: Parameters<T>) => string
): T => {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = getKey ? getKey(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

/**
 * 深いオブジェクトの比較
 */
export const deepEqual = (a: any, b: any): boolean => {
  if (a === b) return true;

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) {
    return a === b;
  }

  if (a === null || a === undefined || b === null || b === undefined) {
    return false;
  }

  if (a.prototype !== b.prototype) return false;

  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) {
    return false;
  }

  return keys.every(k => deepEqual(a[k], b[k]));
};

/**
 * 配列のチャンク分割
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * 非同期処理のバッチ実行
 */
export const batchAsync = async <T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize: number = 10,
  delay: number = 0
): Promise<R[]> => {
  const results: R[] = [];
  const chunks = chunk(items, batchSize);

  for (const chunk of chunks) {
    const chunkResults = await Promise.all(chunk.map(processor));
    results.push(...chunkResults);

    if (delay > 0 && chunk !== chunks[chunks.length - 1]) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  return results;
};

/**
 * リクエストのキューイング
 */
export class RequestQueue {
  private queue: Array<() => Promise<any>> = [];
  private running = false;
  private concurrency: number;
  private activeCount = 0;

  constructor(concurrency: number = 3) {
    this.concurrency = concurrency;
  }

  add<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      this.process();
    });
  }

  private async process(): Promise<void> {
    if (this.running && this.activeCount >= this.concurrency) {
      return;
    }

    this.running = true;

    while (this.queue.length > 0 && this.activeCount < this.concurrency) {
      const request = this.queue.shift();
      if (request) {
        this.activeCount++;
        request().finally(() => {
          this.activeCount--;
          this.process();
        });
      }
    }

    if (this.activeCount === 0) {
      this.running = false;
    }
  }
}

/**
 * LRU (Least Recently Used) キャッシュ
 */
export class LRUCache<K, V> {
  private capacity: number;
  private cache: Map<K, V>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key: K): V | undefined {
    if (this.cache.has(key)) {
      // アクセスされたアイテムを最新に移動
      const value = this.cache.get(key)!;
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return undefined;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      // 既存のキーを削除
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // 容量を超える場合、最も古いアイテムを削除
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, value);
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  delete(key: K): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

/**
 * パフォーマンス測定ユーティリティ
 */
export class PerformanceProfiler {
  private marks: Map<string, number> = new Map();
  private measures: Map<string, number[]> = new Map();

  mark(name: string): void {
    this.marks.set(name, performance.now());
  }

  measure(name: string, startMark: string): number {
    const startTime = this.marks.get(startMark);
    if (!startTime) {
      throw new Error(`Start mark "${startMark}" not found`);
    }

    const duration = performance.now() - startTime;
    
    if (!this.measures.has(name)) {
      this.measures.set(name, []);
    }
    this.measures.get(name)!.push(duration);

    return duration;
  }

  getStats(name: string): {
    count: number;
    avg: number;
    min: number;
    max: number;
    total: number;
  } | null {
    const measurements = this.measures.get(name);
    if (!measurements || measurements.length === 0) {
      return null;
    }

    const total = measurements.reduce((sum, time) => sum + time, 0);
    const avg = total / measurements.length;
    const min = Math.min(...measurements);
    const max = Math.max(...measurements);

    return {
      count: measurements.length,
      avg,
      min,
      max,
      total,
    };
  }

  clear(name?: string): void {
    if (name) {
      this.marks.delete(name);
      this.measures.delete(name);
    } else {
      this.marks.clear();
      this.measures.clear();
    }
  }

  getAllStats(): Record<string, ReturnType<PerformanceProfiler['getStats']>> {
    const stats: Record<string, ReturnType<PerformanceProfiler['getStats']>> = {};
    
    for (const name of this.measures.keys()) {
      stats[name] = this.getStats(name);
    }

    return stats;
  }
}

/**
 * 画像最適化ユーティリティ
 */
export const optimizeImage = (
  src: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
  } = {}
): string => {
  // 実際の実装では、画像最適化サービスのURLを生成
  // 例: Cloudinary, ImageKit, Next.js Image Optimization など
  const params = new URLSearchParams();
  
  if (options.width) params.set('w', options.width.toString());
  if (options.height) params.set('h', options.height.toString());
  if (options.quality) params.set('q', options.quality.toString());
  if (options.format) params.set('f', options.format);

  return `${src}?${params.toString()}`;
};

/**
 * リソースヒント生成
 */
export const generateResourceHints = (resources: {
  preload?: string[];
  prefetch?: string[];
  preconnect?: string[];
  dnsPrefetch?: string[];
}): void => {
  const head = document.head;

  // Preload
  resources.preload?.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    
    if (href.endsWith('.js')) link.as = 'script';
    else if (href.endsWith('.css')) link.as = 'style';
    else if (href.match(/\.(jpg|jpeg|png|gif|webp)$/)) link.as = 'image';
    else if (href.match(/\.(woff|woff2|ttf|otf)$/)) {
      link.as = 'font';
      link.crossOrigin = 'anonymous';
    }
    
    head.appendChild(link);
  });

  // Prefetch
  resources.prefetch?.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    head.appendChild(link);
  });

  // Preconnect
  resources.preconnect?.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = href;
    head.appendChild(link);
  });

  // DNS Prefetch
  resources.dnsPrefetch?.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = href;
    head.appendChild(link);
  });
};

/**
 * バンドルサイズ分析用のユーティリティ
 */
export const analyzeBundleSize = (): void => {
  if (process.env.NODE_ENV === 'development') {
    // webpack-bundle-analyzer のような情報を表示
    console.group('Bundle Analysis');
    console.log('Total bundle size:', document.scripts.length, 'scripts');
    console.log('Total stylesheets:', document.styleSheets.length, 'stylesheets');
    
    // パフォーマンス情報
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      console.log('Memory usage:', {
        used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`,
      });
    }
    
    console.groupEnd();
  }
};

// グローバルインスタンス
export const globalProfiler = new PerformanceProfiler();
export const requestQueue = new RequestQueue(5);
export const imageCache = new LRUCache<string, HTMLImageElement>(50);