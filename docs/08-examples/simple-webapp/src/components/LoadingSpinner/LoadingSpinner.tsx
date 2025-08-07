import React from 'react';
import styles from './LoadingSpinner.module.css';

/**
 * LoadingSpinnerコンポーネントのProps
 */
interface LoadingSpinnerProps {
  /** ローディングメッセージ */
  message?: string;
  /** スピナーのサイズ */
  size?: 'sm' | 'md' | 'lg';
  /** 全画面表示かどうか */
  fullScreen?: boolean;
  /** カスタムクラス名 */
  className?: string;
  /** インライン表示かどうか */
  inline?: boolean;
}

/**
 * ローディング状態を表示するスピナーコンポーネント
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  size = 'md',
  fullScreen = false,
  className = '',
  inline = false,
}) => {
  const containerClass = [
    styles.container,
    fullScreen ? styles.fullScreen : '',
    inline ? styles.inline : '',
    className,
  ].filter(Boolean).join(' ');

  const spinnerClass = [
    styles.spinner,
    styles[`size-${size}`],
  ].join(' ');

  return (
    <div className={containerClass} role="status" aria-live="polite">
      <div className={styles.content}>
        <div className={spinnerClass} aria-hidden="true">
          <div className={styles.spinnerInner}></div>
        </div>
        {message && (
          <div className={styles.message}>
            {message}
          </div>
        )}
      </div>
      <span className={styles.srOnly}>読み込み中...</span>
    </div>
  );
};

/**
 * スケルトンローディングコンポーネント
 */
interface SkeletonProps {
  /** 幅 */
  width?: string | number;
  /** 高さ */
  height?: string | number;
  /** 円形かどうか */
  circle?: boolean;
  /** 行数（テキスト用） */
  lines?: number;
  /** カスタムクラス名 */
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  circle = false,
  lines = 1,
  className = '',
}) => {
  const skeletonClass = [
    styles.skeleton,
    circle ? styles.circle : '',
    className,
  ].filter(Boolean).join(' ');

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  if (lines > 1) {
    return (
      <div className={styles.skeletonGroup}>
        {Array.from({ length: lines }, (_, index) => (
          <div
            key={index}
            className={skeletonClass}
            style={{
              ...style,
              width: index === lines - 1 ? '75%' : style.width, // 最後の行は短く
            }}
            aria-hidden="true"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={skeletonClass}
      style={style}
      aria-hidden="true"
    />
  );
};

/**
 * カードスケルトンコンポーネント
 */
export const CardSkeleton: React.FC = () => {
  return (
    <div className={styles.cardSkeleton}>
      <div className={styles.cardHeader}>
        <Skeleton circle width={48} height={48} />
        <div className={styles.cardHeaderText}>
          <Skeleton width="60%" height="1.25rem" />
          <Skeleton width="40%" height="1rem" />
        </div>
      </div>
      <div className={styles.cardBody}>
        <Skeleton lines={3} height="1rem" />
      </div>
      <div className={styles.cardFooter}>
        <Skeleton width="80px" height="2rem" />
        <Skeleton width="80px" height="2rem" />
      </div>
    </div>
  );
};

/**
 * リストスケルトンコンポーネント
 */
interface ListSkeletonProps {
  /** アイテム数 */
  count?: number;
}

export const ListSkeleton: React.FC<ListSkeletonProps> = ({ count = 3 }) => {
  return (
    <div className={styles.listSkeleton}>
      {Array.from({ length: count }, (_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
};