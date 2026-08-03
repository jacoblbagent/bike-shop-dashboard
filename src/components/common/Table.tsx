import React, { useState } from 'react';
import { FiChevronUp, FiChevronDown, FiChevronsUp, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styles from './Table.module.scss';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  sortKey?: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  page?: number;
  total?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  loading?: boolean;
  emptyMessage?: string;
}

export default function Table<T extends Record<string, any>>({
  columns, data, keyExtractor, onRowClick,
  page = 1, total = 0, limit = 20, onPageChange,
  loading = false, emptyMessage = 'No data found',
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const sorted = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const col = columns.find(c => c.key === sortKey);
    const sortField = col?.sortKey ?? sortKey;
    const aVal = a[sortField]; const bVal = b[sortField];
    if (typeof aVal === 'string' && typeof bVal === 'string')
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    return sortDir === 'asc' ? (aVal - bVal) : (bVal - aVal);
  });

  const totalPages = Math.ceil(total / limit);

  return (
    <div className={styles.wrapper}>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key}
                  className={`${styles.th} ${col.sortable ? styles.sortable : ''}`}
                  style={{ width: col.width }}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <span className={styles.headerInner}>
                    <span>{col.header}</span>
                    {col.sortable && sortKey === col.key
                      ? (sortDir === 'asc' ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />)
                      : col.sortable ? <FiChevronsUp size={14} className={styles.sortIcon} /> : null}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={columns.length} className={styles.loading}>Loading...</td></tr>
            ) : sorted.length === 0 ? (
              <tr><td colSpan={columns.length} className={styles.empty}>{emptyMessage}</td></tr>
            ) : sorted.map(row => (
              <tr key={keyExtractor(row)}
                className={`${styles.tr} ${onRowClick ? styles.clickable : ''}`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map(col => (
                  <td key={col.key} className={styles.td}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && onPageChange && (
        <div className={styles.pagination}>
          <span className={styles.pageInfo}>Page {page} of {totalPages} ({total} total)</span>
          <div className={styles.pageBtns}>
            <button disabled={page <= 1} onClick={() => onPageChange(page - 1)} className={styles.pageBtn}>
              <FiChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let p: number;
              if (totalPages <= 5) p = i + 1;
              else if (page <= 3) p = i + 1;
              else if (page >= totalPages - 2) p = totalPages - 4 + i;
              else p = page - 2 + i;
              return (
                <button key={p} className={`${styles.pageBtn} ${p === page ? styles.active : ''}`} onClick={() => onPageChange(p)}>{p}</button>
              );
            })}
            <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className={styles.pageBtn}>
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}