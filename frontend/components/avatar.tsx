import type { NextPage } from 'next';
import Image from 'next/image';


interface AvatarProps {
  height?: number;
  width?: number;
  src: string;
  cursor?: boolean;
  handleClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const Avatar: NextPage<AvatarProps> = ({
  height = 30,
  width = 30,
  src = '/avatar.png',
  cursor = false,
  handleClick = () => {},
}: AvatarProps) => {
  return (
    <Image
      className={`inline-block rounded-full ring-2 ring-white ${
        cursor ? 'hover:cursor-pointer' : ''
      }`}
      src={src}
      alt=""
      width={width}
      height={height}
      onClick={handleClick}
    />
  );
};

export default Avatar;
