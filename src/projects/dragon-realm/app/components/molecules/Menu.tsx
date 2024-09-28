import { useState } from 'react';

import type { GameMenuOption } from '~/game';

import { Dropdown } from './Dropdown';

export const Menu = ({ options }: MenuProps) => {
  const [selectedChoice, setSelectedChoice] = useState<string>();

  return (
    <Dropdown.Root open>
      <Dropdown.Trigger className="always-open hidden" />

      <Dropdown.Content>
        <Dropdown.RadioGroup value={selectedChoice} onValueChange={setSelectedChoice}>
          {options.map((option) => (
            <Dropdown.RadioItem
              key={option.text}
              value={option.text}
              onClick={option.action}
            >
              {option.text}
            </Dropdown.RadioItem>
          ))}
        </Dropdown.RadioGroup>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}

export interface MenuProps {
  options: GameMenuOption[];
}
