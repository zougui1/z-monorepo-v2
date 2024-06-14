import type { IconComponent } from '~/utils/component-factory';

export enum ItemType {
  Repeat = 'repeat',
  Sequence = 'sequence',
  Infinite = 'infinite',
}

export interface Item {
  id: string;
  name: string;
  image?: string;
  /**
   * @deprecated use the property image instead
   */
  Icon?: IconComponent;
  /**
   * @default 'repeat'
   */
  type?: ItemType;
  sequence?: Item[];
  tier?: string;
  enchantable?: boolean;
  defaultEnchanted?: boolean;
  shiny?: boolean;
  count?: number;
}

export interface ItemSection {
  image?: string;
  Icon?: IconComponent;
  label: string;
  items: Item[];
}

export type FullItemObject = (
  | Record<string, Item>
  | Record<string, Record<string, Item>>
);
