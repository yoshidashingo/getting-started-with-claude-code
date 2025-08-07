import '@testing-library/jest-dom';
import { vi } from 'vitest';

// ResizeObserver のモック
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// IntersectionObserver のモック
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// matchMedia のモック
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// scrollIntoView のモック
Element.prototype.scrollIntoView = vi.fn();

// localStorage のモック
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// sessionStorage のモック
Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock,
});

// URL.createObjectURL のモック
Object.defineProperty(URL, 'createObjectURL', {
  writable: true,
  value: vi.fn(() => 'mocked-url'),
});

Object.defineProperty(URL, 'revokeObjectURL', {
  writable: true,
  value: vi.fn(),
});

// fetch のモック
global.fetch = vi.fn();

// console のモック（テスト中のログを抑制）
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = vi.fn();
  console.warn = vi.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// 各テスト後のクリーンアップ
afterEach(() => {
  vi.clearAllMocks();
  localStorageMock.clear();
});

// グローバルなテストユーティリティ
export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  name: 'Test User',
  email: 'test@example.com',
  createdAt: new Date('2023-01-01T00:00:00Z'),
  updatedAt: new Date('2023-01-01T00:00:00Z'),
  ...overrides,
});

export const createMockUsers = (count = 3) => {
  return Array.from({ length: count }, (_, index) =>
    createMockUser({
      id: `user-${index + 1}`,
      name: `User ${index + 1}`,
      email: `user${index + 1}@example.com`,
    })
  );
};

// カスタムレンダラー（必要に応じて）
import { render } from '@testing-library/react';
import { ReactElement } from 'react';

export const renderWithProviders = (ui: ReactElement, options = {}) => {
  // 将来的にContext Providerが必要になった場合はここに追加
  return render(ui, options);
};

// テスト用のユーティリティ関数
export const waitForLoadingToFinish = () => {
  return new Promise(resolve => setTimeout(resolve, 0));
};

export const mockAsyncOperation = <T>(
  result: T,
  delay = 0,
  shouldReject = false
): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldReject) {
        reject(new Error('Mock async operation failed'));
      } else {
        resolve(result);
      }
    }, delay);
  });
};