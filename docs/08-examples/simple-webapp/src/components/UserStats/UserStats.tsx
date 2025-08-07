import React, { useMemo } from 'react';
import { UserStats as UserStatsType } from '@/types/user';
import styles from './UserStats.module.css';

/**
 * UserStatsコンポーネントのProps
 */
interface UserStatsProps {
  /** ユーザー統計情報 */
  stats: UserStatsType;
  /** 検索クエリ（検索中かどうかの判定用） */
  searchQuery?: string;
  /** 統計情報が無効化されているかどうか */
  disabled?: boolean;
  /** コンパクト表示モード */
  compact?: boolean;
  /** 追加の統計情報を表示するかどうか */
  showExtendedStats?: boolean;
}

/**
 * ユーザー統計情報表示コンポーネント
 */
export const UserStats: React.FC<UserStatsProps> = ({
  stats,
  searchQuery = '',
  disabled = false,
  compact = false,
  showExtendedStats = false,
}) => {
  // 検索中かどうかの判定
  const isSearching = searchQuery.trim().length > 0;

  // 統計データの計算
  const statisticsData = useMemo(() => {
    const { total, filtered } = stats;
    
    // 基本統計
    const basicStats = [
      {
        key: 'total',
        label: isSearching ? '全ユーザー数' : 'ユーザー数',
        value: total,
        icon: '👥',
        color: 'blue',
        description: isSearching ? '登録されている全ユーザーの数' : '現在登録されているユーザーの総数',
      },
    ];

    // 検索中の場合は検索結果も表示
    if (isSearching) {
      basicStats.unshift({
        key: 'filtered',
        label: '検索結果',
        value: filtered,
        icon: '🔍',
        color: 'green',
        description: `「${searchQuery}」に一致するユーザーの数`,
      });
    }

    // 拡張統計（今後の機能拡張用）
    const extendedStats = showExtendedStats ? [
      {
        key: 'growth',
        label: '今月の新規登録',
        value: 0, // 実装時に計算ロジックを追加
        icon: '📈',
        color: 'purple',
        description: '今月新しく登録されたユーザーの数',
      },
      {
        key: 'active',
        label: '最近更新',
        value: 0, // 実装時に計算ロジックを追加
        icon: '🔄',
        color: 'orange',
        description: '最近情報が更新されたユーザーの数',
      },
    ] : [];

    return [...basicStats, ...extendedStats];
  }, [stats, searchQuery, isSearching, showExtendedStats]);

  // 検索効率の計算
  const searchEfficiency = useMemo(() => {
    if (!isSearching || stats.total === 0) return null;
    
    const percentage = Math.round((stats.filtered / stats.total) * 100);
    return {
      percentage,
      level: percentage >= 50 ? 'high' : percentage >= 20 ? 'medium' : 'low',
    };
  }, [isSearching, stats.total, stats.filtered]);

  return (
    <div className={`${styles.container} ${disabled ? styles.disabled : ''} ${compact ? styles.compact : ''}`}>
      {/* メイン統計 */}
      <div className={styles.statsGrid}>
        {statisticsData.map((stat) => (
          <div
            key={stat.key}
            className={`${styles.statCard} ${styles[`color-${stat.color}`]}`}
            title={stat.description}
          >
            <div className={styles.statIcon} aria-hidden="true">
              {stat.icon}
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue} aria-label={`${stat.label}: ${stat.value}件`}>
                {stat.value.toLocaleString()}
              </div>
              <div className={styles.statLabel}>
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 検索効率インジケーター */}
      {searchEfficiency && !compact && (
        <div className={styles.searchEfficiency}>
          <div className={styles.efficiencyHeader}>
            <span className={styles.efficiencyLabel}>検索効率</span>
            <span className={`${styles.efficiencyValue} ${styles[`efficiency-${searchEfficiency.level}`]}`}>
              {searchEfficiency.percentage}%
            </span>
          </div>
          <div className={styles.efficiencyBar}>
            <div
              className={`${styles.efficiencyFill} ${styles[`efficiency-${searchEfficiency.level}`]}`}
              style={{ width: `${searchEfficiency.percentage}%` }}
              aria-label={`検索効率 ${searchEfficiency.percentage}%`}
            />
          </div>
          <div className={styles.efficiencyDescription}>
            {searchEfficiency.level === 'high' && '検索条件が適切です'}
            {searchEfficiency.level === 'medium' && '検索条件を調整すると良いかもしれません'}
            {searchEfficiency.level === 'low' && '検索条件を変更してみてください'}
          </div>
        </div>
      )}

      {/* 詳細情報（非コンパクトモード） */}
      {!compact && (
        <div className={styles.details}>
          {isSearching ? (
            <div className={styles.searchSummary}>
              <p className={styles.summaryText}>
                「<span className={styles.searchTerm}>{searchQuery}</span>」で検索中：
                <strong> {stats.filtered} 件</strong>の結果が見つかりました
                {stats.total > 0 && (
                  <span className={styles.totalInfo}>
                    （全 {stats.total} 件中）
                  </span>
                )}
              </p>
            </div>
          ) : (
            <div className={styles.generalSummary}>
              <p className={styles.summaryText}>
                {stats.total === 0 ? (
                  'まだユーザーが登録されていません。最初のユーザーを追加してみましょう。'
                ) : stats.total === 1 ? (
                  '1 人のユーザーが登録されています。'
                ) : (
                  `${stats.total} 人のユーザーが登録されています。`
                )}
              </p>
            </div>
          )}
        </div>
      )}

      {/* アクセシビリティ用の隠しテキスト */}
      <div className={styles.srOnly} aria-live="polite" aria-atomic="true">
        {isSearching ? (
          `検索結果: ${stats.filtered}件、全ユーザー数: ${stats.total}件`
        ) : (
          `ユーザー数: ${stats.total}件`
        )}
      </div>
    </div>
  );
};