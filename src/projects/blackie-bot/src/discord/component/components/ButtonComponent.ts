import { ButtonInteraction, ButtonBuilder, Interaction } from 'discord.js';

import { BaseComponent } from '../BaseComponent';
import { InteractionType } from '../../InteractionType';

export class ButtonComponent extends BaseComponent<ButtonInteraction, ButtonBuilder> {
  constructor(name: string) {
    super(InteractionType.Button, ButtonBuilder, name);
  }

  isValidInteractionType = (interaction: Interaction): interaction is ButtonInteraction => {
    return interaction.isButton();
  }
}
