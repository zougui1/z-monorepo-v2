import { useRef } from 'react';
import { Typography } from '@mui/material';
import { sum } from 'radash';

import { CopyButton } from '~/components/CopyButton';
import type { Potions } from '~/types';

import { PotionList } from '../PotionList';
import { stringifyPotions } from '../../utils';

/**
 * ! prototype to copy the potions as an image
 ** onClick
 *   const copyContent = (): string => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return '';

    canvas.toBlob(blob => {
      if (blob) {
        navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob,
          }),
        ]);
      }
    });

    return '';
  }

  ** draw the canvas prior to copying it
  const drawCanvas = () => {
    const canvas = canvasRef.current;

    if (
      !canvas ||
      !lifePotionImgRef.current ||
      !manaPotionImgRef.current ||
      !attackPotionImgRef.current ||
      !defensePotionImgRef.current ||
      !speedPotionImgRef.current ||
      !dexterityPotionImgRef.current ||
      !vitalityPotionImgRef.current ||
      !wisdomPotionImgRef.current
    ) return;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const startX = 20;
    const startY = 10;
    let x = startX;
    let y = startY;

    ctx.font = '1rem Arial';

    ctx.fillStyle = 'rgb(55 65 81)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#fff';

    const imgWidth = 40;
    const imgHeight = 40;
    const textWidth = 40;

    ctx.drawImage(lifePotionImgRef.current, x, y);
    ctx.fillText('19', x += imgWidth, y + 25);
    ctx.drawImage(manaPotionImgRef.current, x += textWidth, y);
    ctx.fillText('40', x += imgWidth, y + 25);
    ctx.globalAlpha = 0.4;
    ctx.drawImage(attackPotionImgRef.current, x += textWidth, y);
    ctx.fillText('0', x += imgWidth, y + 25);
    ctx.drawImage(defensePotionImgRef.current, x += textWidth, y);
    ctx.fillText('0', x += imgWidth, y + 25);
    ctx.globalAlpha = 1;
    ctx.drawImage(speedPotionImgRef.current, x = startX, y += imgHeight);
    ctx.fillText('22', x += imgWidth, y + 25);
    ctx.drawImage(dexterityPotionImgRef.current, x += textWidth, y);
    ctx.fillText('72', x += imgWidth, y + 25);
    ctx.drawImage(vitalityPotionImgRef.current, x += textWidth, y);
    ctx.fillText('10', x += imgWidth, y + 25);
    ctx.drawImage(wisdomPotionImgRef.current, x += textWidth, y);
    ctx.fillText('40', x += imgWidth, y + 25);

    navigator.clipboard.writeText(canvas.toDataURL());

    console.log('draw');
  }

  ** prepare the refs to use to draw into the canvas
  import {
    LifePotionIcon,
    ManaPotionIcon,
    AttackPotionIcon,
    DefensePotionIcon,
    SpeedPotionIcon,
    DexterityPotionIcon,
    VitalityPotionIcon,
    WisdomPotionIcon,
  } from '~/components/icons';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lifePotionImgRef = useRef<HTMLImageElement | null>(null);
  const manaPotionImgRef = useRef<HTMLImageElement | null>(null);
  const attackPotionImgRef = useRef<HTMLImageElement | null>(null);
  const defensePotionImgRef = useRef<HTMLImageElement | null>(null);
  const speedPotionImgRef = useRef<HTMLImageElement | null>(null);
  const dexterityPotionImgRef = useRef<HTMLImageElement | null>(null);
  const vitalityPotionImgRef = useRef<HTMLImageElement | null>(null);
  const wisdomPotionImgRef = useRef<HTMLImageElement | null>(null);

  ** prepare the dom for the images and the canvas itself
  <LifePotionIcon ref={lifePotionImgRef} hidden />
  <ManaPotionIcon ref={manaPotionImgRef} hidden />
  <AttackPotionIcon ref={attackPotionImgRef} hidden />
  <DefensePotionIcon ref={defensePotionImgRef} hidden />
  <SpeedPotionIcon ref={speedPotionImgRef} hidden />
  <DexterityPotionIcon ref={dexterityPotionImgRef} hidden />
  <VitalityPotionIcon ref={vitalityPotionImgRef} hidden />
  <WisdomPotionIcon ref={wisdomPotionImgRef} hidden />
  <canvas ref={canvasRef} width="350" height="100" />
 */

export const PotionListSection = ({ title, potions }: PotionListSectionProps) => {
  const total = sum(Object.values(potions));

  return (
    <>
      <div className="flex justify-between items-center">
        <Typography variant="h6">
          {title} ({total})
        </Typography>

        <CopyButton
          content={() => stringifyPotions(potions)}
          disabled={total <= 0}
        />
      </div>

      <PotionList potions={potions} />
    </>
  );
}

export interface PotionListSectionProps {
  title: string;
  potions: Potions;
}
