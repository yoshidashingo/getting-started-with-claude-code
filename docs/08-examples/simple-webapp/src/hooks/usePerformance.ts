import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * デバウンス処理用のフック
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * スロットル処理用のフック
 */
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastRun = useRef(Date.now());

  return useCallback(
    ((...args) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = Date.now();
      }
    }) as T,
    [callback, delay]
  );
};

/**
 * メモ化されたコールバック（依存関係の深い比較）
 */
export const useDeepCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: any[]
): T => {
  const ref = useRef<any[]>();
  const callbackRef = useRef<T>(callback);

  // 深い比較
  const depsChanged = useMemo(() => {
    if (!ref.current) return true;
    if (ref.current.length !== deps.length) return true;
    
    return deps.some((dep, index) => {
      return JSON.stringify(dep) !== JSON.stringify(ref.current![index]);
    });
  }, [deps]);

  if (depsChanged) {
    ref.current = deps;
    callbackRef.current = callback;
  }

  return callbackRef.current;
};

/**
 * 仮想化リスト用のフック
 */
export const useVirtualList = <T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1).map((item, index) => ({
      item,
      index: visibleRange.startIndex + index,
      offsetTop: (visibleRange.startIndex + index) * itemHeight,
    }));
  }, [items, visibleRange, itemHeight]);

  const totalHeight = items.length * itemHeight;

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    handleScroll,
    visibleRange,
  };
};

/**
 * 画像の遅延読み込み用のフック
 */
export const useLazyImage = (src: string, placeholder?: string) => {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = new Image();
            img.onload = () => {
              setImageSrc(src);
              setIsLoaded(true);
              observer.disconnect();
            };
            img.onerror = () => {
              setIsError(true);
              observer.disconnect();
            };
            img.src = src;
          }
        });
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  return { imageSrc, isLoaded, isError, imgRef };
};

/**
 * パフォーマンス測定用のフック
 */
export const usePerformanceMonitor = (name: string) => {
  const startTime = useRef<number>();
  const measurements = useRef<number[]>([]);

  const start = useCallback(() => {
    startTime.current = performance.now();
  }, []);

  const end = useCallback(() => {
    if (startTime.current) {
      const duration = performance.now() - startTime.current;
      measurements.current.push(duration);
      
      // 最新の100件のみ保持
      if (measurements.current.length > 100) {
        measurements.current = measurements.current.slice(-100);
      }

      console.log(`${name}: ${duration.toFixed(2)}ms`);
      return duration;
    }
    return 0;
  }, [name]);

  const getStats = useCallback(() => {
    const times = measurements.current;
    if (times.length === 0) return null;

    const avg = times.reduce((sum, time) => sum + time, 0) / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);

    return { avg, min, max, count: times.length };
  }, []);

  return { start, end, getStats };
};

/**
 * メモリ使用量監視用のフック
 */
export const useMemoryMonitor = () => {
  const [memoryInfo, setMemoryInfo] = useState<{
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null>(null);

  useEffect(() => {
    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMemoryInfo({
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
        });
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000);

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
};

/**
 * レンダリング最適化用のフック
 */
export const useRenderOptimization = () => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTime.current;
    lastRenderTime.current = now;

    if (process.env.NODE_ENV === 'development') {
      console.log(`Render #${renderCount.current}, Time since last: ${timeSinceLastRender}ms`);
    }
  });

  return {
    renderCount: renderCount.current,
  };
};

/**
 * 重い計算の最適化用フック
 */
export const useHeavyComputation = <T, R>(
  computeFn: (data: T) => R,
  data: T,
  shouldCompute: boolean = true
): R | null => {
  const [result, setResult] = useState<R | null>(null);
  const [isComputing, setIsComputing] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    if (!shouldCompute) return;

    // Web Workerが利用可能な場合は使用
    if (typeof Worker !== 'undefined') {
      setIsComputing(true);
      
      // 簡単なワーカーの例（実際の実装では別ファイルが必要）
      const workerCode = `
        self.onmessage = function(e) {
          const { data, computeFn } = e.data;
          try {
            const result = (${computeFn.toString()})(data);
            self.postMessage({ success: true, result });
          } catch (error) {
            self.postMessage({ success: false, error: error.message });
          }
        };
      `;

      const blob = new Blob([workerCode], { type: 'application/javascript' });
      const workerUrl = URL.createObjectURL(blob);
      const worker = new Worker(workerUrl);
      workerRef.current = worker;

      worker.postMessage({ data, computeFn });
      worker.onmessage = (e) => {
        const { success, result, error } = e.data;
        if (success) {
          setResult(result);
        } else {
          console.error('Worker computation failed:', error);
          // フォールバック: メインスレッドで実行
          setResult(computeFn(data));
        }
        setIsComputing(false);
        worker.terminate();
        URL.revokeObjectURL(workerUrl);
      };
    } else {
      // Web Workerが利用できない場合はメインスレッドで実行
      setIsComputing(true);
      setTimeout(() => {
        setResult(computeFn(data));
        setIsComputing(false);
      }, 0);
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [data, computeFn, shouldCompute]);

  return isComputing ? null : result;
};

/**
 * バッチ処理用のフック
 */
export const useBatchedUpdates = <T>(
  batchSize: number = 10,
  delay: number = 100
) => {
  const [items, setItems] = useState<T[]>([]);
  const batchRef = useRef<T[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const addItem = useCallback((item: T) => {
    batchRef.current.push(item);

    if (batchRef.current.length >= batchSize) {
      // バッチサイズに達したら即座に処理
      setItems(prev => [...prev, ...batchRef.current]);
      batchRef.current = [];
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }
    } else {
      // タイマーをリセット
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        if (batchRef.current.length > 0) {
          setItems(prev => [...prev, ...batchRef.current]);
          batchRef.current = [];
        }
        timeoutRef.current = undefined;
      }, delay);
    }
  }, [batchSize, delay]);

  const clearItems = useCallback(() => {
    setItems([]);
    batchRef.current = [];
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { items, addItem, clearItems };
};

/**
 * リソースプリロード用のフック
 */
export const useResourcePreload = (resources: string[]) => {
  useEffect(() => {
    const preloadedResources: HTMLLinkElement[] = [];

    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      
      if (resource.endsWith('.js')) {
        link.as = 'script';
      } else if (resource.endsWith('.css')) {
        link.as = 'style';
      } else if (resource.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        link.as = 'image';
      } else if (resource.match(/\.(woff|woff2|ttf|otf)$/)) {
        link.as = 'font';
        link.crossOrigin = 'anonymous';
      }
      
      link.href = resource;
      document.head.appendChild(link);
      preloadedResources.push(link);
    });

    return () => {
      preloadedResources.forEach(link => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
    };
  }, [resources]);
};