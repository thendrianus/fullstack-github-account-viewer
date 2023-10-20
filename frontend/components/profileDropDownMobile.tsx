import { Dialog, Transition, Menu } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { useRouter } from 'next/navigation';
import UserProfileHeader from './userProfileHeader';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import { selectAuthState, setLogOut } from '@/store/authSlice';
import { AppDispatch } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { loginWithGithub } from '@/utils/github';

export default function ProfileDropDownMobile() {
  const authState = useSelector(selectAuthState);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function viewProfile () {
    closeModal()
    router.push(`/${authState.githubUsername}`);
  }

  function logOutHandle () {
    closeModal()
    dispatch(setLogOut())
    router.push('/');
  }

  const mobileMenus = () => {
    return (
      <div>
        <div className="mb-5">
          <UserProfileHeader email={authState.email} name={authState.name} picture={authState.picture}/>
        </div>
        <div className="py-1 border-b border-gray-100">
          <a
            href="#"
            onClick={()=> viewProfile()}
            className="block px-4 py-2 text-sm font-semibold text-gray-700"
          >
            View Profile
          </a>
        </div>
        <div className="py-1">
          <a
            onClick={() => logOutHandle()}
            href="#"
            className="block px-4 py-2 text-sm font-semibold text-gray-700"
          >
            Logout
          </a>
        </div>
      </div>
    );
  };

  return (
    <>
      {isOpen ? (
        <button onClick={() => closeModal()}>
          <XMarkIcon
            className="-mr-1 h-8 w-7 text-gray-900"
            aria-hidden="true"
          />
        </button>
      ) : (
        <button onClick={() => openModal()}>
          <Bars3Icon
            className="-mr-1 h-8 w-7 text-gray-900"
            aria-hidden="true"
          />
        </button>
      )}

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex pt-20 h-full items-center justify-center text-center">
              <Transition.Child
                as={Fragment}
                enter="transition ease duration-500 transform"
                enterFrom="opacity-0 -translate-y-12"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease duration-300 transform"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 -translate-y-12"
              >
                <Dialog.Panel className="w-full h-full transform overflow-hidden bg-white pt-3 text-left align-middle shadow-xl transition-all">
                  {authState.authState ? (
                    mobileMenus()
                  ) : (
                    <div className="my-5 mx-4 ">
                      <button
                        className="btn btn-primary w-full"
                        onClick={() => loginWithGithub()}
                      >
                        Login with Github
                      </button>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
