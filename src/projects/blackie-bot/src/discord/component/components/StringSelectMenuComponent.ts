import { StringSelectMenuInteraction, StringSelectMenuBuilder, Interaction } from 'discord.js';

import { BaseComponent } from '../BaseComponent';
import { InteractionType } from '../../InteractionHandlerSet';

export class StringSelectMenuComponent extends BaseComponent<StringSelectMenuInteraction, StringSelectMenuBuilder> {
  constructor(name: string) {
    super(InteractionType.StringSelectMenu, StringSelectMenuBuilder, name);
  }

  isValidInteractionType = (interaction: Interaction): interaction is StringSelectMenuInteraction => {
    return interaction.isStringSelectMenu();
  }
}
