import { useEffect, useCallback, useRef } from 'react';

/**
 * キーボードナビゲーション用のフック
 */
export const useKeyboardNavigation = (
  onEnter?: () => void,
  onEscape?: () => void,
  onArrowUp?: () => void,
  onArrowDown?: () => void,
  onArrowLeft?: () => void,
  onArrowRight?: () => void
) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Enter':
          if (onEnter) {
            event.preventDefault();
            onEnter();
          }
          break;
        case 'Escape':
          if (onEscape) {
            event.preventDefault();
            onEscape();
          }
          break;
        case 'ArrowUp':
          if (onArrowUp) {
            event.preventDefault();
            onArrowUp();
          }
          break;
        case 'ArrowDown':
          if (onArrowDown) {
            event.preventDefault();
            onArrowDown();
          }
          break;
        case 'ArrowLeft':
          if (onArrowLeft) {
            event.preventDefault();
            onArrowLeft();
          }
          break;
        case 'ArrowRight':
          if (onArrowRight) {
            event.preventDefault();
            onArrowRight();
          }
          break;
      }
    },
    [onEnter, onEscape, onArrowUp, onArrowDown, onArrowLeft, onArrowRight]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return handleKeyDown;
};

/**
 * フォーカス管理用のフック
 */
export const useFocusManagement = () => {
  const focusableElementsSelector = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  const getFocusableElements = useCallback(
    (container: HTMLElement): HTMLElement[] => {
      return Array.from(
        container.querySelectorAll(focusableElementsSelector)
      ) as HTMLElement[];
    },
    [focusableElementsSelector]
  );

  const trapFocus = useCallback(
    (container: HTMLElement) => {
      const focusableElements = getFocusableElements(container);
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleTabKey = (event: KeyboardEvent) => {
        if (event.key !== 'Tab') return;

        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement?.focus();
          }
        }
      };

      container.addEventListener('keydown', handleTabKey);

      // 最初の要素にフォーカス
      firstElement?.focus();

      return () => {
        container.removeEventListener('keydown', handleTabKey);
      };
    },
    [getFocusableElements]
  );

  const restoreFocus = useCallback((element: HTMLElement | null) => {
    if (element && typeof element.focus === 'function') {
      element.focus();
    }
  }, []);

  return {
    getFocusableElements,
    trapFocus,
    restoreFocus,
  };
};

/**
 * スクリーンリーダー用のライブリージョン管理フック
 */
export const useLiveRegion = () => {
  const liveRegionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // ライブリージョンを作成
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';

    document.body.appendChild(liveRegion);
    liveRegionRef.current = liveRegion;

    return () => {
      if (liveRegionRef.current) {
        document.body.removeChild(liveRegionRef.current);
      }
    };
  }, []);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (liveRegionRef.current) {
      liveRegionRef.current.setAttribute('aria-live', priority);
      liveRegionRef.current.textContent = message;

      // メッセージをクリア（次回のアナウンスのため）
      setTimeout(() => {
        if (liveRegionRef.current) {
          liveRegionRef.current.textContent = '';
        }
      }, 1000);
    }
  }, []);

  return { announce };
};

/**
 * 色のコントラスト比を計算する関数
 */
export const calculateContrastRatio = (color1: string, color2: string): number => {
  const getLuminance = (color: string): number => {
    // 簡単な実装（実際にはより複雑な計算が必要）
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    const sRGB = [r, g, b].map((c) => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
};

/**
 * WCAG準拠チェック用のフック
 */
export const useWCAGCompliance = () => {
  const checkContrastRatio = useCallback((foreground: string, background: string) => {
    const ratio = calculateContrastRatio(foreground, background);
    return {
      ratio,
      passAA: ratio >= 4.5,
      passAAA: ratio >= 7,
      passAALarge: ratio >= 3,
    };
  }, []);

  const checkFocusVisible = useCallback((element: HTMLElement) => {
    const computedStyle = window.getComputedStyle(element, ':focus-visible');
    const outline = computedStyle.outline;
    const outlineWidth = computedStyle.outlineWidth;
    const outlineStyle = computedStyle.outlineStyle;

    return {
      hasOutline: outline !== 'none' && outlineWidth !== '0px' && outlineStyle !== 'none',
      outline,
      outlineWidth,
      outlineStyle,
    };
  }, []);

  return {
    checkContrastRatio,
    checkFocusVisible,
  };
};

/**
 * 動きを減らす設定を検出するフック
 */
export const useReducedMotion = (): boolean => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  return prefersReducedMotion.matches;
};

/**
 * 高コントラストモードを検出するフック
 */
export const useHighContrast = (): boolean => {
  const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
  return prefersHighContrast.matches;
};

/**
 * ダークモードを検出するフック
 */
export const useDarkMode = (): boolean => {
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
  return prefersDarkMode.matches;
};

/**
 * スキップリンク用のフック
 */
export const useSkipLinks = () => {
  const createSkipLink = useCallback((targetId: string, text: string) => {
    const skipLink = document.createElement('a');
    skipLink.href = `#${targetId}`;
    skipLink.textContent = text;
    skipLink.className = 'skip-link';
    skipLink.style.position = 'absolute';
    skipLink.style.top = '-40px';
    skipLink.style.left = '6px';
    skipLink.style.background = '#000';
    skipLink.style.color = '#fff';
    skipLink.style.padding = '8px';
    skipLink.style.textDecoration = 'none';
    skipLink.style.zIndex = '100';

    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });

    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });

    return skipLink;
  }, []);

  const addSkipLinks = useCallback(() => {
    const skipLinks = [
      { targetId: 'main-content', text: 'メインコンテンツにスキップ' },
      { targetId: 'navigation', text: 'ナビゲーションにスキップ' },
    ];

    const container = document.createElement('div');
    container.className = 'skip-links';

    skipLinks.forEach(({ targetId, text }) => {
      const skipLink = createSkipLink(targetId, text);
      container.appendChild(skipLink);
    });

    document.body.insertBefore(container, document.body.firstChild);

    return () => {
      const existingContainer = document.querySelector('.skip-links');
      if (existingContainer) {
        document.body.removeChild(existingContainer);
      }
    };
  }, [createSkipLink]);

  return { addSkipLinks };
};