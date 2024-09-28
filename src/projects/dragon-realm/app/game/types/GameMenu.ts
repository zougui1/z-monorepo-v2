export interface GameMenuOption {
  text: string;
  action: () => void;
}

export interface GameMenu {
  options: GameMenuOption[];
}
