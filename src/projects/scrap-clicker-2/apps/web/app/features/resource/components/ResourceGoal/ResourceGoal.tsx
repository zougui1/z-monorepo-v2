export const ResourceGoal = ({ icon, amount, remaining, progress }: ResourceGoalProps) => {
  return (
    <article
      style={{ maxWidth: 145 }}
      className="flex flex-col gap-2 items-center px-4 py-3 border border-gray-700 rounded-md"
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
}
