import React from 'react';
import styles from './DetailGrid.module.scss';

export interface DetailItem {
  label: string;
  value: React.ReactNode;
}

export function DetailGrid({ items }: { items: DetailItem[] }) {
  return (
    <div className={styles.grid}>
      {items.map((item, i) => (
        <div key={i} className={styles.item}
          style={item.label === '' ? { gridColumn: '1 / -1', marginTop: 'var(--space-lg)' } : {}}
        >
          {item.label === '' ? (
            <div className={styles.sectionTitle}>{item.value}</div>
          ) : (
            <>
              <div className={styles.label}>{item.label}</div>
              <div className={styles.value}>{item.value}</div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export interface DetailTableColumn<T> {
  key: string;
  header: string;
  align?: 'left' | 'right';
  render?: (row: T) => React.ReactNode;
}

interface DetailTableProps<T> {
  columns: DetailTableColumn<T>[];
  rows: T[];
  footer?: React.ReactNode;
}

export function DetailTable<T extends Record<string, any>>({ columns, rows, footer }: DetailTableProps<T>) {
  return (
    <table className={styles.itemsTable}>
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.key} className={`${styles.itemsTh} ${c.align === 'right' ? styles.alignRight : ''}`}>
              {c.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className={styles.itemsTd}>
              No items
            </td>
          </tr>
        ) : (
          rows.map((row, i) => (
            <tr key={i}>
              {columns.map((c) => (
                <td key={c.key} className={`${styles.itemsTd} ${c.align === 'right' ? styles.alignRight : ''}`}>
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
      {footer && (
        <tfoot>
          <tr>
            <td colSpan={columns.length} className={styles.itemsFooter}>
              {footer}
            </td>
          </tr>
        </tfoot>
      )}
    </table>
  );
}
