import React from 'react';
import { HiChevronDown, HiDocumentText } from 'react-icons/hi';

import useModal from '../../hooks/useModal';
import useAuth from '../../zustand/auth';
import ModalAuth from '../ModalAuth';

export default function Header() {
  const { isLoggedIn, user } = useAuth();
  const { open, toggle } = useModal();

  return (
    <>
      <header className="mb-2">
        <nav className='p-4 bg-white rounded-md shadow flex justify-between'>
          <div className="flex items-center text-green-500">
            <HiDocumentText className="inline mr-2" size={24} />
            <h1 className="font-bold">
              Propil
            </h1>
          </div>
          <div className="flex gap-2 items-center">
            {isLoggedIn ? (
              <>
                <span>
                  {user.name}
                </span>
                <div className="aspect-square rounded-full bg-gray-100 h-[50px] min-h-[50px] overflow-hidden">
                  <img src={user.picture} alt={user.name} />
                </div>
                <button>
                  <HiChevronDown />
                </button>
              </>
            ) : (
              <>
                <button className="py-2 px-4 rounded-lg bg-green-500 text-white" onClick={toggle}>Login</button>
                <button className="py-2 px-4 rounded-lg bg-gray-100" onClick={toggle}>Register</button>
              </>
            )}
          </div>
        </nav>
      </header>

      <ModalAuth open={open} toggle={toggle} />
    </>
  );
}
