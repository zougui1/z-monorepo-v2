import clsx from 'clsx';

export const ResourceGoal = ({ icon, amount, remaining, progress, className }: ResourceGoalProps) => {
  return (
    <article
      style={{ minWidth: 145 }}
      className={clsx('flex flex-col gap-2 items-center px-4 py-3 border border-gray-700 rounded-md', className)}
    >
      <div className="w-8 md:w-10">{icon}</div>

      <div className="flex flex-col w-full text-xs md:text-md">
        <span>Amount: {amount}</span>
        <span>Remaining: {remaining}</span>
        <span>Progress: {progress}</span>
      </div>
    </article>
  );
}

export interface ResourceGoalProps {
  icon?: React.ReactNode;
  amount: number | string;
  remaining: number | string;
  progress: string;
  className?: string;
}
