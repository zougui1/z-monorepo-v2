import { GameBreadcrumb } from '~/components/molecules/GameBreadcrumb';
import { Divider } from '~/components/atoms/Divider';


export const GameHeader = () => {
  return (
    <div className="w-full flex flex-col">
      <div className="flex justify-between p-4">
        <div>Characters</div>

        <GameBreadcrumb />
      </div>

      <Divider />
    </div>
  );
}
