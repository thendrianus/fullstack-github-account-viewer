import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Bars3Icon } from '@heroicons/react/24/solid'
import type { NextComponentType } from 'next';
import Avatar from './avatar';
import {joinClassNames} from '@/utils/className'
import UserProfileHeader from './userProfileHeader';
import { useRouter } from 'next/navigation';

import {
  selectAuthState,
  setLogOut
} from '@/store/authSlice';
import { AppDispatch } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';

const ProfileDropDown: NextComponentType = () => {
  const authState = useSelector(selectAuthState);
  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();
  function viewProfile () {
    router.push(`/${authState.githubUsername}`);
  }

  function logOutHandle () {
    dispatch(setLogOut())
    router.push('/');
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-full bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:cursor-pointer">
          <Avatar src={authState.picture}/>
          <Bars3Icon className="-mr-1 h-8 w-7 text-gray-900" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <UserProfileHeader email={authState.email} name={authState.name} picture={authState.picture}/>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  onClick={()=> viewProfile()}
                  className={joinClassNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                >
                  View Profile
                </a>
              )}
            </Menu.Item>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={joinClassNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                  onClick={() => logOutHandle()}
                >
                  Logout
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}


export default ProfileDropDown;
