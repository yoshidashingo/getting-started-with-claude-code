import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  loadUsersFromStorage,
  saveUsersToStorage,
  clearUsersFromStorage,
  generateId,
  formatDate,
  isValidEmail,
  isValidName,
  filterUsers,
  highlightText,
  sortUsers,
  isStorageAvailable,
} from './storage';
import { User } from '@/types/user';

// LocalStorageのモック
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('storage utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loadUsersFromStorage', () => {
    it('should return empty array when no data exists', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const result = loadUsersFromStorage();
      
      expect(result).toEqual([]);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('userManagementApp_users');
    });

    it('should parse and return users with converted dates', () => {
      const mockData = {
        users: [
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z',
          },
        ],
        version: '1.0.0',
        lastUpdated: '2023-01-01T00:00:00.000Z',
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockData));
      
      const result = loadUsersFromStorage();
      
      expect(result).toHaveLength(1);
      expect(result[0].createdAt).toBeInstanceOf(Date);
      expect(result[0].updatedAt).toBeInstanceOf(Date);
    });

    it('should handle parsing errors gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');
      
      const result = loadUsersFromStorage();
      
      expect(result).toEqual([]);
    });
  });

  describe('saveUsersToStorage', () => {
    it('should save users to localStorage with metadata', () => {
      const users: User[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
        },
      ];

      saveUsersToStorage(users);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'userManagementApp_users',
        expect.stringContaining('"users"')
      );
    });

    it('should throw error when localStorage fails', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage full');
      });

      expect(() => saveUsersToStorage([])).toThrow('データの保存に失敗しました');
    });
  });

  describe('clearUsersFromStorage', () => {
    it('should remove users from localStorage', () => {
      clearUsersFromStorage();
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('userManagementApp_users');
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
    });
  });

  describe('formatDate', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2023-01-01T12:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should format recent dates correctly', () => {
      const now = new Date('2023-01-01T12:00:00Z');
      const fiveMinutesAgo = new Date('2023-01-01T11:55:00Z');
      const twoHoursAgo = new Date('2023-01-01T10:00:00Z');
      const threeDaysAgo = new Date('2022-12-29T12:00:00Z');
      const twoWeeksAgo = new Date('2022-12-18T12:00:00Z');

      expect(formatDate(now)).toBe('たった今');
      expect(formatDate(fiveMinutesAgo)).toBe('5分前');
      expect(formatDate(twoHoursAgo)).toBe('2時間前');
      expect(formatDate(threeDaysAgo)).toBe('3日前');
      expect(formatDate(twoWeeksAgo)).toContain('2022');
    });

    it('should handle invalid dates', () => {
      const invalidDate = new Date('invalid');
      
      expect(formatDate(invalidDate)).toBe('不明');
    });
  });

  describe('isValidEmail', () => {
    it('should validate email addresses correctly', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@domain.co.uk')).toBe(true);
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('isValidName', () => {
    it('should validate names correctly', () => {
      expect(isValidName('John Doe')).toBe(true);
      expect(isValidName('A')).toBe(true);
      expect(isValidName('A'.repeat(50))).toBe(true);
      expect(isValidName('')).toBe(false);
      expect(isValidName('   ')).toBe(false);
      expect(isValidName('A'.repeat(51))).toBe(false);
    });
  });

  describe('filterUsers', () => {
    const users: User[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@test.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    it('should return all users when query is empty', () => {
      expect(filterUsers(users, '')).toEqual(users);
      expect(filterUsers(users, '   ')).toEqual(users);
    });

    it('should filter users by name', () => {
      const result = filterUsers(users, 'John');
      
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('John Doe');
    });

    it('should filter users by email', () => {
      const result = filterUsers(users, 'test.com');
      
      expect(result).toHaveLength(1);
      expect(result[0].email).toBe('jane@test.com');
    });

    it('should be case insensitive', () => {
      const result = filterUsers(users, 'JOHN');
      
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('John Doe');
    });
  });

  describe('highlightText', () => {
    it('should return unhighlighted text when query is empty', () => {
      const result = highlightText('Hello World', '');
      
      expect(result.highlighted).toBe(false);
      expect(result.parts).toEqual([{ text: 'Hello World', isHighlight: false }]);
    });

    it('should highlight matching text', () => {
      const result = highlightText('Hello World', 'World');
      
      expect(result.highlighted).toBe(true);
      expect(result.parts).toEqual([
        { text: 'Hello ', isHighlight: false },
        { text: 'World', isHighlight: true },
      ]);
    });

    it('should handle case insensitive matching', () => {
      const result = highlightText('Hello World', 'world');
      
      expect(result.highlighted).toBe(true);
      expect(result.parts[1].text).toBe('World');
    });

    it('should handle no matches', () => {
      const result = highlightText('Hello World', 'xyz');
      
      expect(result.highlighted).toBe(false);
      expect(result.parts).toEqual([{ text: 'Hello World', isHighlight: false }]);
    });
  });

  describe('sortUsers', () => {
    const users: User[] = [
      {
        id: '1',
        name: 'Charlie',
        email: 'charlie@example.com',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
      {
        id: '2',
        name: 'Alice',
        email: 'alice@example.com',
        createdAt: new Date('2023-01-02'),
        updatedAt: new Date('2023-01-02'),
      },
      {
        id: '3',
        name: 'Bob',
        email: 'bob@example.com',
        createdAt: new Date('2023-01-03'),
        updatedAt: new Date('2023-01-03'),
      },
    ];

    it('should sort by name ascending', () => {
      const result = sortUsers(users, 'name', 'asc');
      
      expect(result.map(u => u.name)).toEqual(['Alice', 'Bob', 'Charlie']);
    });

    it('should sort by name descending', () => {
      const result = sortUsers(users, 'name', 'desc');
      
      expect(result.map(u => u.name)).toEqual(['Charlie', 'Bob', 'Alice']);
    });

    it('should sort by createdAt', () => {
      const result = sortUsers(users, 'createdAt', 'asc');
      
      expect(result[0].name).toBe('Charlie');
      expect(result[2].name).toBe('Bob');
    });

    it('should not mutate original array', () => {
      const originalOrder = users.map(u => u.name);
      sortUsers(users, 'name', 'asc');
      
      expect(users.map(u => u.name)).toEqual(originalOrder);
    });
  });

  describe('isStorageAvailable', () => {
    it('should return true when localStorage is available', () => {
      expect(isStorageAvailable()).toBe(true);
    });

    it('should return false when localStorage throws error', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage not available');
      });

      expect(isStorageAvailable()).toBe(false);
    });
  });
});