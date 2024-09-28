export const CharacterCardImage = ({ src, name }: CharacterCardImageProps) => {
  return (
    <img
      className="max-w-full"
      src={src}
      alt={src}
      height="100%"
    />
  );
}

export interface CharacterCardImageProps {
  src: string;
  name: string;
}
