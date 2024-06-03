import { ModalSubmitInteraction, ModalBuilder, Interaction } from 'discord.js';

import { BaseComponent } from '../BaseComponent';
import { InteractionType } from '../../InteractionType';

export class ModalComponent extends BaseComponent<ModalSubmitInteraction, ModalBuilder> {
  constructor(name: string) {
    super(InteractionType.ModalSubmit, ModalBuilder, name);
  }

  isValidInteractionType = (interaction: Interaction): interaction is ModalSubmitInteraction => {
    return interaction.isModalSubmit();
  }
}
