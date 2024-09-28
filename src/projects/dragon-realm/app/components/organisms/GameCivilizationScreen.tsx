import { useGameMenu, useGameDialog, useGame } from '~/contexts';
import { Menu } from '~/components/molecules/Menu';
import { DialogTextBlock } from '~/components/molecules/DialogTextBlock';

const GameMenu = () => {
  const menu = useGameMenu();

  if (!menu) {
    return null;
  }

  return <Menu options={menu.options} />;
}

const GameDialog = () => {
  const game = useGame();
  const dialog = useGameDialog();

  if (!dialog) {
    return null;
  }

  return (
    <DialogTextBlock
      text={dialog.text}
      label={dialog.villager.name}
      onContinue={game.finishDialog}
    />
  );
}

export const GameCivilizationScreen = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-between">
      <div>
        <GameMenu />
      </div>

      <div className="w-full">
        <GameDialog />
      </div>
    </div>
  );
}
