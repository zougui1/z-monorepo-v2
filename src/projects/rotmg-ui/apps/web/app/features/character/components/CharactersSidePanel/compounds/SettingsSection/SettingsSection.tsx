import { useRef } from 'react';
import { useFetcher, useSearchParams } from '@remix-run/react';
import { FormControl, FormLabel, RadioGroup } from '@mui/material';

import { LabelledRadio } from '~/components/LabelledRadio';
import { PotionSize } from '~/features/character/enums';
import { usePotionSize } from '~/features/character/hooks';

import { SideSection } from '../../../../../../components/SideSection';

export const SettingsSection = () => {
  const fetchers = useFetcher();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const potionSize = usePotionSize();

  const handleChange = () => {
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      const formParams = new URLSearchParams(formData);

      setSearchParams(new URLSearchParams({
        ...Object.fromEntries(searchParams),
        ...Object.fromEntries(formParams),
      }));
    }
  }

  return (
    <SideSection title="Settings">
      <fetchers.Form ref={formRef} onChange={handleChange}>
        <FormControl>
          <FormLabel id="SettingsSection-potionSize">
            Potion size
          </FormLabel>

          <RadioGroup
            row
            name="potionSize"
            value={potionSize}
            aria-labelledby="SettingsSection-potionSize"
          >
            <LabelledRadio label="Small" value={PotionSize.Small} />
            <LabelledRadio label="Greater" value={PotionSize.Greater} />
            <LabelledRadio label="Auto" value={PotionSize.Auto} />
          </RadioGroup>
        </FormControl>
      </fetchers.Form>
    </SideSection>
  );
}
