export const Tabs = ({ children }: TabsProps) => {
  return (
    <div className="flex">
      {children}
    </div>
  );
}

export interface TabsProps {
  children: React.ReactNode;
}
