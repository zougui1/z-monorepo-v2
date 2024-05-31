import type { AutocompleteInteraction } from 'discord.js';

export type AutocompleteHandler = ({ interaction }: AutocompleteContext) => AutocompletionOption[] | Promise<AutocompletionOption[]>;

export type AutocompleteContext = {
  interaction: AutocompleteInteraction;
  value: string;
};

export type AutocompletionOption = string | {
  name: string;
  value: string;
};
