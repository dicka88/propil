import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { HiDocumentText, HiLogout, HiUser } from 'react-icons/hi';
import Cookies from 'universal-cookie';

import useAuth from '../../zustand/auth';
import useModalState from '../../zustand/modal';
import ModalAuth from '../ModalAuth';

export default function Header() {
  const router = useRouter();
  const { isLoggedIn, user, logout } = useAuth();
  const { setModalAuthMode, toggleModalAuth } = useModalState();

  const handleSigninClick = () => {
    setModalAuthMode('signin');
    toggleModalAuth();
  };

  const handleSignupClick = () => {
    setModalAuthMode('signup');
    toggleModalAuth();
  };

  const handleLogout = () => {
    logout();
    const cookies = new Cookies();
    cookies.remove('token');
    router.push('/');
  };

  return (
    <>
      <header className="mb-2">
        <nav className='p-4 bg-white rounded-md shadow flex justify-between items-center'>
          <Link href="/" passHref>
            <a>
              <div className="flex items-center text-green-500">
                <HiDocumentText className="inline mr-2" size={36} />
                <h1 className="font-bold">
                  Propil
                </h1>
              </div>
            </a>
          </Link>
          <div className="flex gap-2 items-center">
            {isLoggedIn ? (
              <>
                <span>
                  {user.name}
                </span>
                <div className="group relative">
                  <div className="aspect-square rounded-full bg-gray-100 h-[50px] min-h-[50px] overflow-hidden cursor-pointer">
                    <img src={user.picture} />
                  </div>
                  <div className="absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 top-full right-0 py-4 z-10">
                    <div className="bg-white rounded-md shadow py-4 min-w-[160px]">
                      <button className="py-1 text-gray-500 hover:bg-gray-100 text-left px-4 w-full opacity-60">
                        <HiUser className='inline mr-4' />
                        Profile
                      </button>
                      <button className="py-2 text-red-500 hover:bg-gray-100 text-left px-4 w-full" onClick={handleLogout}>
                        <HiLogout className='inline mr-4' />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <button className="py-2 px-4 rounded-lg bg-green-500 text-white" onClick={handleSigninClick}>Sign In</button>
                <button className="py-2 px-4 rounded-lg bg-gray-100" onClick={handleSignupClick}>Sign Up</button>
              </>
            )}
          </div>
        </nav>
      </header>

      <ModalAuth />
    </>
  );
}
