export const ResourceGoal = ({ icon, amount, remaining, progress }: ResourceGoalProps) => {
  return (
    <article style={{ minWidth: 190 }} className="flex flex-col gap-4 items-center px-4 py-3 border border-gray-700 rounded-md">
      <div className="w-16">{icon}</div>

      <div className="flex flex-col w-full">
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
}
