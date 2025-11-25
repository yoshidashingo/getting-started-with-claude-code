import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserCard } from './UserCard';
import { User } from '@/types/user';

const mockUser: User = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
  createdAt: new Date('2023-01-01T10:00:00Z'),
  updatedAt: new Date('2023-01-01T10:00:00Z'),
};

const defaultProps = {
  user: mockUser,
  onEdit: vi.fn(),
  onDelete: vi.fn(),
  searchQuery: '',
  disabled: false,
};

describe('UserCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render user information correctly', () => {
    render(<UserCard {...defaultProps} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText(/作成:/)).toBeInTheDocument();
  });

  it('should show edit and delete buttons', () => {
    render(<UserCard {...defaultProps} />);

    expect(screen.getByLabelText(/John Doeを編集/)).toBeInTheDocument();
    expect(screen.getByLabelText(/John Doeを削除/)).toBeInTheDocument();
  });

  it('should enter edit mode when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<UserCard {...defaultProps} />);

    const editButton = screen.getByLabelText(/John Doeを編集/);
    await user.click(editButton);

    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('保存')).toBeInTheDocument();
    expect(screen.getByText('キャンセル')).toBeInTheDocument();
  });

  it('should enter edit mode when double-clicked', async () => {
    const user = userEvent.setup();
    render(<UserCard {...defaultProps} />);

    const displayInfo = screen.getByText('John Doe').closest('.displayInfo');
    await user.dblClick(displayInfo!);

    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
  });

  it('should save changes when save button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnEdit = vi.fn().mockResolvedValue({ success: true });
    
    render(<UserCard {...defaultProps} onEdit={mockOnEdit} />);

    // 編集モードに入る
    const editButton = screen.getByLabelText(/John Doeを編集/);
    await user.click(editButton);

    // 名前を変更
    const nameInput = screen.getByDisplayValue('John Doe');
    await user.clear(nameInput);
    await user.type(nameInput, 'John Smith');

    // 保存
    const saveButton = screen.getByText('保存');
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockOnEdit).toHaveBeenCalledWith('user-1', {
        name: 'John Smith',
        email: 'john@example.com',
      });
    });
  });

  it('should cancel edit when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<UserCard {...defaultProps} />);

    // 編集モードに入る
    const editButton = screen.getByLabelText(/John Doeを編集/);
    await user.click(editButton);

    // 名前を変更
    const nameInput = screen.getByDisplayValue('John Doe');
    await user.clear(nameInput);
    await user.type(nameInput, 'John Smith');

    // キャンセル
    const cancelButton = screen.getByText('キャンセル');
    await user.click(cancelButton);

    // 元の表示に戻る
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('John Smith')).not.toBeInTheDocument();
  });

  it('should handle keyboard shortcuts in edit mode', async () => {
    const user = userEvent.setup();
    const mockOnEdit = vi.fn().mockResolvedValue({ success: true });
    
    render(<UserCard {...defaultProps} onEdit={mockOnEdit} />);

    // 編集モードに入る
    const editButton = screen.getByLabelText(/John Doeを編集/);
    await user.click(editButton);

    const nameInput = screen.getByDisplayValue('John Doe');
    
    // Enterキーで保存
    await user.type(nameInput, '{Enter}');

    await waitFor(() => {
      expect(mockOnEdit).toHaveBeenCalled();
    });
  });

  it('should cancel edit with Escape key', async () => {
    const user = userEvent.setup();
    render(<UserCard {...defaultProps} />);

    // 編集モードに入る
    const editButton = screen.getByLabelText(/John Doeを編集/);
    await user.click(editButton);

    const nameInput = screen.getByDisplayValue('John Doe');
    
    // Escapeキーでキャンセル
    await user.type(nameInput, '{Escape}');

    // 表示モードに戻る
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('保存')).not.toBeInTheDocument();
  });

  it('should show confirmation dialog when delete button is clicked', async () => {
    const user = userEvent.setup();
    const mockConfirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const mockOnDelete = vi.fn().mockResolvedValue({ success: true });
    
    render(<UserCard {...defaultProps} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByLabelText(/John Doeを削除/);
    await user.click(deleteButton);

    expect(mockConfirm).toHaveBeenCalledWith(
      expect.stringContaining('「John Doe」を削除しますか？')
    );
    expect(mockOnDelete).toHaveBeenCalledWith('user-1');

    mockConfirm.mockRestore();
  });

  it('should not delete when confirmation is cancelled', async () => {
    const user = userEvent.setup();
    const mockConfirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const mockOnDelete = vi.fn();
    
    render(<UserCard {...defaultProps} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByLabelText(/John Doeを削除/);
    await user.click(deleteButton);

    expect(mockConfirm).toHaveBeenCalled();
    expect(mockOnDelete).not.toHaveBeenCalled();

    mockConfirm.mockRestore();
  });

  it('should highlight search query in text', () => {
    render(<UserCard {...defaultProps} searchQuery="John" />);

    const highlightedText = screen.getByText('John');
    expect(highlightedText).toHaveClass('highlight');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<UserCard {...defaultProps} disabled={true} />);

    const editButton = screen.getByLabelText(/John Doeを編集/);
    const deleteButton = screen.getByLabelText(/John Doeを削除/);

    expect(editButton).toBeDisabled();
    expect(deleteButton).toBeDisabled();
  });

  it('should show validation errors in edit mode', async () => {
    const user = userEvent.setup();
    const mockOnEdit = vi.fn().mockResolvedValue({
      success: false,
      errors: ['名前は必須です'],
    });
    
    render(<UserCard {...defaultProps} onEdit={mockOnEdit} />);

    // 編集モードに入る
    const editButton = screen.getByLabelText(/John Doeを編集/);
    await user.click(editButton);

    // 名前を空にする
    const nameInput = screen.getByDisplayValue('John Doe');
    await user.clear(nameInput);

    // 保存を試行
    const saveButton = screen.getByText('保存');
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('名前は必須です')).toBeInTheDocument();
    });
  });

  it('should show updated timestamp when different from created', () => {
    const userWithUpdate: User = {
      ...mockUser,
      updatedAt: new Date('2023-01-02T10:00:00Z'),
    };

    render(<UserCard {...defaultProps} user={userWithUpdate} />);

    expect(screen.getByText(/作成:/)).toBeInTheDocument();
    expect(screen.getByText(/更新:/)).toBeInTheDocument();
  });

  it('should not show updated timestamp when same as created', () => {
    render(<UserCard {...defaultProps} />);

    expect(screen.getByText(/作成:/)).toBeInTheDocument();
    expect(screen.queryByText(/更新:/)).not.toBeInTheDocument();
  });

  it('should handle edit errors gracefully', async () => {
    const user = userEvent.setup();
    const mockOnEdit = vi.fn().mockRejectedValue(new Error('Network error'));
    
    render(<UserCard {...defaultProps} onEdit={mockOnEdit} />);

    // 編集モードに入る
    const editButton = screen.getByLabelText(/John Doeを編集/);
    await user.click(editButton);

    // 保存を試行
    const saveButton = screen.getByText('保存');
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('予期しないエラーが発生しました')).toBeInTheDocument();
    });
  });

  it('should handle delete errors gracefully', async () => {
    const user = userEvent.setup();
    const mockConfirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const mockOnDelete = vi.fn().mockResolvedValue({
      success: false,
      error: 'Delete failed',
    });
    
    render(<UserCard {...defaultProps} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByLabelText(/John Doeを削除/);
    await user.click(deleteButton);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('削除に失敗しました: Delete failed');
    });

    mockConfirm.mockRestore();
    mockAlert.mockRestore();
  });
});