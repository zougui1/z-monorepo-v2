import type { AnyCommand, CommandObject } from './Command';

export class CommandMap {
  readonly commands: Record<string, AnyCommand> = {};

  add(command: AnyCommand): this {
    this.commands[command.name] = command;
    return this;
  }

  get(name: string): AnyCommand | undefined {
    return this.commands[name];
  }

  /**
   * @returns the commands in an array
   */
  asArray(): AnyCommand[] {
    return Object.values(this.commands);
  }

  /**
   * @returns the commands converted to objects
   */
  toArray(): CommandObject[] {
    return this.asArray().map(command => command.toObject());
  }

  isEmpty(): boolean {
    return Object.values(this.commands).length === 0;
  }
}
