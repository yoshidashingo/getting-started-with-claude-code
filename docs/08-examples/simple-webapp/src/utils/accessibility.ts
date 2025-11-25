/**
 * アクセシビリティ関連のユーティリティ関数
 */

/**
 * 一意のIDを生成する（アクセシビリティ用）
 */
export const generateAccessibleId = (prefix: string = 'accessible'): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * ARIA属性を生成する
 */
export const createAriaAttributes = (options: {
  label?: string;
  labelledBy?: string;
  describedBy?: string;
  expanded?: boolean;
  selected?: boolean;
  checked?: boolean;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  live?: 'off' | 'polite' | 'assertive';
  atomic?: boolean;
  hidden?: boolean;
  role?: string;
}) => {
  const attributes: Record<string, string | boolean> = {};

  if (options.label) attributes['aria-label'] = options.label;
  if (options.labelledBy) attributes['aria-labelledby'] = options.labelledBy;
  if (options.describedBy) attributes['aria-describedby'] = options.describedBy;
  if (options.expanded !== undefined) attributes['aria-expanded'] = options.expanded;
  if (options.selected !== undefined) attributes['aria-selected'] = options.selected;
  if (options.checked !== undefined) attributes['aria-checked'] = options.checked;
  if (options.disabled !== undefined) attributes['aria-disabled'] = options.disabled;
  if (options.required !== undefined) attributes['aria-required'] = options.required;
  if (options.invalid !== undefined) attributes['aria-invalid'] = options.invalid;
  if (options.live) attributes['aria-live'] = options.live;
  if (options.atomic !== undefined) attributes['aria-atomic'] = options.atomic;
  if (options.hidden !== undefined) attributes['aria-hidden'] = options.hidden;
  if (options.role) attributes['role'] = options.role;

  return attributes;
};

/**
 * フォーカス可能な要素を取得する
 */
export const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    '[contenteditable="true"]',
    '[tabindex]:not([tabindex="-1"])',
  ];

  return Array.from(
    container.querySelectorAll(focusableSelectors.join(', '))
  ) as HTMLElement[];
};

/**
 * 要素が画面に表示されているかチェック
 */
export const isElementVisible = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);

  return (
    rect.width > 0 &&
    rect.height > 0 &&
    style.visibility !== 'hidden' &&
    style.display !== 'none' &&
    parseFloat(style.opacity) > 0
  );
};

/**
 * スクリーンリーダー用のテキストを生成
 */
export const createScreenReaderText = (
  mainText: string,
  additionalInfo?: string[]
): string => {
  const parts = [mainText];
  if (additionalInfo && additionalInfo.length > 0) {
    parts.push(...additionalInfo);
  }
  return parts.join(', ');
};

/**
 * キーボードイベントのヘルパー
 */
export const isActivationKey = (event: KeyboardEvent): boolean => {
  return event.key === 'Enter' || event.key === ' ';
};

export const isNavigationKey = (event: KeyboardEvent): boolean => {
  return ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key);
};

export const isEscapeKey = (event: KeyboardEvent): boolean => {
  return event.key === 'Escape';
};

/**
 * フォーカストラップの実装
 */
export class FocusTrap {
  private container: HTMLElement;
  private focusableElements: HTMLElement[];
  private firstElement: HTMLElement | null;
  private lastElement: HTMLElement | null;
  private previousActiveElement: HTMLElement | null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.focusableElements = getFocusableElements(container);
    this.firstElement = this.focusableElements[0] || null;
    this.lastElement = this.focusableElements[this.focusableElements.length - 1] || null;
    this.previousActiveElement = document.activeElement as HTMLElement;
  }

  activate(): void {
    this.container.addEventListener('keydown', this.handleKeyDown);
    if (this.firstElement) {
      this.firstElement.focus();
    }
  }

  deactivate(): void {
    this.container.removeEventListener('keydown', this.handleKeyDown);
    if (this.previousActiveElement) {
      this.previousActiveElement.focus();
    }
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === this.firstElement) {
        event.preventDefault();
        this.lastElement?.focus();
      }
    } else {
      // Tab
      if (document.activeElement === this.lastElement) {
        event.preventDefault();
        this.firstElement?.focus();
      }
    }
  };
}

/**
 * ライブリージョンでのアナウンス
 */
export class LiveAnnouncer {
  private liveRegion: HTMLElement;

  constructor() {
    this.liveRegion = this.createLiveRegion();
  }

  private createLiveRegion(): HTMLElement {
    const existing = document.getElementById('live-announcer');
    if (existing) {
      return existing;
    }

    const liveRegion = document.createElement('div');
    liveRegion.id = 'live-announcer';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';

    document.body.appendChild(liveRegion);
    return liveRegion;
  }

  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = message;

    // メッセージをクリア
    setTimeout(() => {
      this.liveRegion.textContent = '';
    }, 1000);
  }

  destroy(): void {
    if (this.liveRegion.parentNode) {
      this.liveRegion.parentNode.removeChild(this.liveRegion);
    }
  }
}

/**
 * アクセシビリティチェッカー
 */
export class AccessibilityChecker {
  /**
   * 画像のalt属性をチェック
   */
  static checkImageAlt(img: HTMLImageElement): {
    hasAlt: boolean;
    isEmpty: boolean;
    isDecorative: boolean;
  } {
    const alt = img.getAttribute('alt');
    return {
      hasAlt: alt !== null,
      isEmpty: alt === '',
      isDecorative: alt === '' && img.getAttribute('role') === 'presentation',
    };
  }

  /**
   * フォーム要素のラベルをチェック
   */
  static checkFormLabel(input: HTMLInputElement): {
    hasLabel: boolean;
    hasAriaLabel: boolean;
    hasAriaLabelledBy: boolean;
    labelText: string | null;
  } {
    const id = input.id;
    const label = id ? document.querySelector(`label[for="${id}"]`) : null;
    const ariaLabel = input.getAttribute('aria-label');
    const ariaLabelledBy = input.getAttribute('aria-labelledby');

    return {
      hasLabel: !!label,
      hasAriaLabel: !!ariaLabel,
      hasAriaLabelledBy: !!ariaLabelledBy,
      labelText: label?.textContent || ariaLabel || null,
    };
  }

  /**
   * 見出しの階層をチェック
   */
  static checkHeadingHierarchy(container: HTMLElement = document.body): {
    isValid: boolean;
    issues: string[];
  } {
    const headings = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    const issues: string[] = [];
    let previousLevel = 0;

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      
      if (index === 0 && level !== 1) {
        issues.push('最初の見出しはh1である必要があります');
      }
      
      if (level > previousLevel + 1) {
        issues.push(`見出しレベルが${previousLevel}から${level}に飛んでいます`);
      }
      
      previousLevel = level;
    });

    return {
      isValid: issues.length === 0,
      issues,
    };
  }

  /**
   * 色のコントラスト比をチェック
   */
  static checkColorContrast(
    foreground: string,
    background: string,
    fontSize: number = 16,
    fontWeight: number = 400
  ): {
    ratio: number;
    passAA: boolean;
    passAAA: boolean;
    isLargeText: boolean;
  } {
    const isLargeText = fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);
    const requiredRatioAA = isLargeText ? 3 : 4.5;
    const requiredRatioAAA = isLargeText ? 4.5 : 7;

    // 簡単なコントラスト比計算（実際にはより複雑）
    const ratio = this.calculateContrastRatio(foreground, background);

    return {
      ratio,
      passAA: ratio >= requiredRatioAA,
      passAAA: ratio >= requiredRatioAAA,
      isLargeText,
    };
  }

  private static calculateContrastRatio(color1: string, color2: string): number {
    // 実際の実装では、より正確な色の輝度計算が必要
    // ここでは簡略化した実装
    return 4.5; // プレースホルダー値
  }
}

/**
 * アクセシビリティ設定の管理
 */
export class AccessibilitySettings {
  private settings: {
    reducedMotion: boolean;
    highContrast: boolean;
    largeText: boolean;
    screenReader: boolean;
  };

  constructor() {
    this.settings = {
      reducedMotion: this.detectReducedMotion(),
      highContrast: this.detectHighContrast(),
      largeText: false,
      screenReader: this.detectScreenReader(),
    };

    this.applySettings();
  }

  private detectReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  private detectHighContrast(): boolean {
    return window.matchMedia('(prefers-contrast: high)').matches;
  }

  private detectScreenReader(): boolean {
    // スクリーンリーダーの検出は困難なため、簡単な方法を使用
    return window.navigator.userAgent.includes('NVDA') ||
           window.navigator.userAgent.includes('JAWS') ||
           window.speechSynthesis !== undefined;
  }

  private applySettings(): void {
    const root = document.documentElement;

    if (this.settings.reducedMotion) {
      root.classList.add('reduce-motion');
    }

    if (this.settings.highContrast) {
      root.classList.add('high-contrast');
    }

    if (this.settings.largeText) {
      root.classList.add('large-text');
    }

    if (this.settings.screenReader) {
      root.classList.add('screen-reader');
    }
  }

  getSettings() {
    return { ...this.settings };
  }

  updateSetting(key: keyof typeof this.settings, value: boolean): void {
    this.settings[key] = value;
    this.applySettings();
  }
}

// グローバルインスタンス
export const liveAnnouncer = new LiveAnnouncer();
export const accessibilitySettings = new AccessibilitySettings();