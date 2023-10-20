import type { NextComponentType, NextPage } from 'next';
import Image from 'next/image';
import ProfileDropDown from './profileDropDown';
import ProfileDropDownMobile from '@/components/profileDropDownMobile';
import { selectAuthState } from '@/store/authSlice';
import { AppDispatch } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { loginWithGithub } from '@/utils/github';
import { useRouter } from 'next/navigation';

const NavbarLogo: NextComponentType = () => {
  const router = useRouter();
  return (
    <div className='cursor-pointer' onClick={() => router.push('/')}>
      <Image src="/logo.svg" alt="Logo" width={150} height={50}></Image>
    </div>
  );
};

interface NavbarActionsProps {
  isUserLoggedIn?: boolean;
}

const NavbarActionsDesktop: NextPage<NavbarActionsProps> = ({
  isUserLoggedIn = false,
}: NavbarActionsProps) => {
  return (
    <div className="relative hidden lg:flex items-center ml-auto">
      {isUserLoggedIn ? (
        <ProfileDropDown />
      ) : (
        <button className="btn btn-primary" onClick={() => loginWithGithub()}>
          Login with Github
        </button>
      )}
    </div>
  );
};

const NavbarActionsMobile: NextComponentType = () => {
  return (
    <div className="relative lg:hidden items-center ml-auto">
      <ProfileDropDownMobile></ProfileDropDownMobile>
    </div>
  );
};

const Navbar: NextComponentType = () => {
  const authState = useSelector(selectAuthState);
  const dispatch = useDispatch<AppDispatch>();

  const navbarActionsProps: NavbarActionsProps = {
    isUserLoggedIn: authState.authState,
  };
  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-white supports-backdrop-blur:bg-white/95 dark:bg-slate-900/75">
      <div className="max-w-6xl mx-auto">
        <div className="py-4 border-b border-slate-900/10 lg:border-0 dark:border-slate-300/10 px-4 lg:mx-0">
          <div className="relative flex items-center">
            <NavbarLogo />
            <NavbarActionsDesktop {...navbarActionsProps} />
            <NavbarActionsMobile />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
