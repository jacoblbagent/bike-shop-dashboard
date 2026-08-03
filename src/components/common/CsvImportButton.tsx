import { useRef } from 'react';
import Papa from 'papaparse';
import toast from 'react-hot-toast';
import Button from './Button';

interface CsvImportButtonProps {
  onData: (data: Record<string, any>[]) => void;
  label?: string;
  validate?: (row: Record<string, any>) => string | null;
}

export default function CsvImportButton({ onData, label = 'Import CSV', validate }: CsvImportButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          toast.error(`CSV parse error: ${results.errors[0].message}`);
          return;
        }
        const rows = results.data as Record<string, any>[];
        if (rows.length === 0) {
          toast.error('CSV file is empty');
          return;
        }

        if (validate) {
          const errors: string[] = [];
          for (let i = 0; i < rows.length; i++) {
            const err = validate(rows[i]);
            if (err) errors.push(`Row ${i + 2}: ${err}`);
          }
          if (errors.length > 0) {
            toast.error(`Validation errors:\n${errors.slice(0, 5).join('\n')}`);
            return;
          }
        }

        onData(rows);
        toast.success(`Imported ${rows.length} rows from ${file.name}`);
      },
      error: (err) => toast.error(`Import failed: ${err.message}`),
    });

    e.target.value = '';
  };

  return (
    <>
      <input ref={inputRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={handleFile} />
      <Button variant="outline" onClick={() => inputRef.current?.click()}>
        {label}
      </Button>
    </>
  );
}