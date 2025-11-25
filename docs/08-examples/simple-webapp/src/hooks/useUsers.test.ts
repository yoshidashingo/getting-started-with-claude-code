import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUsers } from './useUsers';
import * as storageUtils from '@/utils/storage';

// モック
vi.mock('@/utils/storage');
vi.mock('./useLocalStorage');

const mockStorageUtils = vi.mocked(storageUtils);

describe('useUsers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // デフォルトのモック実装
    mockStorageUtils.loadUsersFromStorage.mockReturnValue([]);
    mockStorageUtils.saveUsersToStorage.mockImplementation(() => {});
    mockStorageUtils.generateId.mockReturnValue('mock-id');
    mockStorageUtils.filterUsers.mockImplementation((users, query) => 
      query ? users.filter(u => u.name.includes(query)) : users
    );
  });

  it('should initialize with empty users', () => {
    const { result } = renderHook(() => useUsers());

    expect(result.current.users).toEqual([]);
    expect(result.current.filteredUsers).toEqual([]);
    expect(result.current.searchQuery).toBe('');
    expect(result.current.stats).toEqual({ total: 0, filtered: 0 });
  });

  it('should add user successfully', async () => {
    const { result } = renderHook(() => useUsers());

    await act(async () => {
      const response = await result.current.addUser({
        name: 'John Doe',
        email: 'john@example.com',
      });
      
      expect(response.success).toBe(true);
    });

    expect(mockStorageUtils.generateId).toHaveBeenCalled();
    expect(mockStorageUtils.saveUsersToStorage).toHaveBeenCalled();
  });

  it('should handle validation errors when adding user', async () => {
    const { result } = renderHook(() => useUsers());

    await act(async () => {
      const response = await result.current.addUser({
        name: '',
        email: 'invalid-email',
      });
      
      expect(response.success).toBe(false);
      expect(response.errors).toBeDefined();
    });
  });

  it('should update user successfully', async () => {
    // 既存ユーザーをセットアップ
    const existingUser = {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockStorageUtils.loadUsersFromStorage.mockReturnValue([existingUser]);

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      const response = await result.current.updateUser('user-1', {
        name: 'John Smith',
      });
      
      expect(response.success).toBe(true);
    });

    expect(mockStorageUtils.saveUsersToStorage).toHaveBeenCalled();
  });

  it('should handle user not found when updating', async () => {
    const { result } = renderHook(() => useUsers());

    await act(async () => {
      const response = await result.current.updateUser('non-existent', {
        name: 'New Name',
      });
      
      expect(response.success).toBe(false);
      expect(response.errors).toContain('ユーザーが見つかりません');
    });
  });

  it('should delete user successfully', async () => {
    const existingUser = {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockStorageUtils.loadUsersFromStorage.mockReturnValue([existingUser]);

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      const response = await result.current.deleteUser('user-1');
      
      expect(response.success).toBe(true);
    });

    expect(mockStorageUtils.saveUsersToStorage).toHaveBeenCalled();
  });

  it('should handle user not found when deleting', async () => {
    const { result } = renderHook(() => useUsers());

    await act(async () => {
      const response = await result.current.deleteUser('non-existent');
      
      expect(response.success).toBe(false);
      expect(response.error).toBe('ユーザーが見つかりません');
    });
  });

  it('should update search query', () => {
    const { result } = renderHook(() => useUsers());

    act(() => {
      result.current.setSearchQuery('test query');
    });

    expect(result.current.searchQuery).toBe('test query');
  });

  it('should clear search query', () => {
    const { result } = renderHook(() => useUsers());

    act(() => {
      result.current.setSearchQuery('test query');
    });

    act(() => {
      result.current.clearSearch();
    });

    expect(result.current.searchQuery).toBe('');
  });

  it('should get user by ID', () => {
    const existingUser = {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockStorageUtils.loadUsersFromStorage.mockReturnValue([existingUser]);

    const { result } = renderHook(() => useUsers());

    const user = result.current.getUserById('user-1');
    expect(user).toEqual(existingUser);

    const nonExistentUser = result.current.getUserById('non-existent');
    expect(nonExistentUser).toBeUndefined();
  });

  it('should return correct user count', () => {
    const users = [
      {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'user-2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockStorageUtils.loadUsersFromStorage.mockReturnValue(users);

    const { result } = renderHook(() => useUsers());

    expect(result.current.getUserCount()).toBe(2);
  });

  it('should clear all users', async () => {
    const { result } = renderHook(() => useUsers());

    await act(async () => {
      await result.current.clearAllUsers();
    });

    expect(mockStorageUtils.saveUsersToStorage).toHaveBeenCalledWith([]);
  });

  it('should handle storage errors gracefully', async () => {
    mockStorageUtils.saveUsersToStorage.mockImplementation(() => {
      throw new Error('Storage error');
    });

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      const response = await result.current.addUser({
        name: 'John Doe',
        email: 'john@example.com',
      });
      
      expect(response.success).toBe(false);
      expect(response.errors).toContain('ユーザーの追加に失敗しました');
    });
  });

  it('should update stats when users change', () => {
    const users = [
      {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'user-2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockStorageUtils.loadUsersFromStorage.mockReturnValue(users);
    mockStorageUtils.filterUsers.mockReturnValue(users);

    const { result } = renderHook(() => useUsers());

    expect(result.current.stats).toEqual({
      total: 2,
      filtered: 2,
    });
  });

  it('should filter users based on search query', () => {
    const users = [
      {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'user-2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockStorageUtils.loadUsersFromStorage.mockReturnValue(users);
    mockStorageUtils.filterUsers.mockImplementation((users, query) => 
      query === 'John' ? [users[0]] : users
    );

    const { result } = renderHook(() => useUsers());

    act(() => {
      result.current.setSearchQuery('John');
    });

    expect(mockStorageUtils.filterUsers).toHaveBeenCalledWith(users, 'John');
  });
});