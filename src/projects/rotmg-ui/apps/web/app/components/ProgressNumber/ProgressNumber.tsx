import clsx from 'clsx';

export const ProgressNumber = ({ label, value, total }: ProgressNumberProps) => {
  return (
    <div>
      <span>{label}: </span>
      <span
        className={clsx({ 'text-yellow-500': value >= total })}
      >
        {value}/{total}
      </span>
    </div>
  );
}

export interface ProgressNumberProps {
  label: string;
  value: number;
  total: number;
}
