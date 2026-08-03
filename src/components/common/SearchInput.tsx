import { FiSearch } from 'react-icons/fi';
import styles from './SearchInput.module.scss';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchInput({ value, onChange, placeholder = 'Search...' }: SearchInputProps) {
  return (
    <div className={styles.wrapper}>
      <FiSearch className={styles.icon} size={16} />
      <input type="text" className={styles.input} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      {value && <button className={styles.clear} onClick={() => onChange('')}>✕</button>}
    </div>
  );
}