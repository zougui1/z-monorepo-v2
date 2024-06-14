import { Typography } from '@mui/material';

export const SideSection = ({ title, children, icon, className }: SideSectionProps) => {
  return (
    <div className={className}>
      <div className="flex justify-between items-center pb-2">
        <Typography variant="h5">{title}</Typography>

        {icon}
      </div>

      {children}
    </div>
  );
}

export interface SideSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}
