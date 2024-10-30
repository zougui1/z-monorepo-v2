import { createImgIcon } from '~/utils/component-factory';

import magnet from '~/assets/images/Magnet.png';
import goldenScrap from '~/assets/images/GoldenScrap.png';
import star from '~/assets/images/Star.png';
import starFragment from '~/assets/images/StarFragment.png';
import scrapyardV2 from '~/assets/images/ScrapyardV2.webp';

export const MagnetIcon = createImgIcon({
  src: magnet,
  alt: 'Magnet',
});

export const GoldenScrapIcon = createImgIcon({
  src: goldenScrap,
  alt: 'Golden Scrap',
});

export const StarIcon = createImgIcon({
  src: star,
  alt: 'Star',
});

export const StarFragmentIcon = createImgIcon({
  src: starFragment,
  alt: 'Star Fragment',
});

export const ScrapyardV2Icon = createImgIcon({
  src: scrapyardV2,
  alt: 'Scrapyard V2',
});
