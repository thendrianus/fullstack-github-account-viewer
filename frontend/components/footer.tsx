import type { NextComponentType } from 'next';

const Footer: NextComponentType = () => {
  return (
    <footer className='h-12 text-center bg-gray-100 p-3'>
      <span className='text-gray-500 text-sm'>© 2023 Pixel8Labs. All rights reserved.</span>
    </footer>
  );
};

export default Footer;
