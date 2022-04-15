import React from 'react';
import { HiDocumentText, HiX } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';

import Modal from '../Modal';
import useModal from '../../hooks/useModal';

export default function Header() {
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
          <div className="flex gap-2">
            <button className="py-2 px-4 rounded-lg bg-green-500 text-white" onClick={toggle}>Login</button>
            <button className="py-2 px-4 rounded-lg bg-gray-100" onClick={toggle}>Register</button>
          </div>
        </nav>
      </header>

      <Modal open={open} toggle={toggle}>
        <div className="space-y-6">

          <div className="flex justify-between">
            <h1 className="font-bold">Signin</h1>
            <button className='p-2 hover:bg-gray-100 rounded-full' onClick={toggle}>
              <HiX />
            </button>
          </div>

          <p>There not yet another option to sign, just with Google account you here</p>

          <button className="w-full p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-300">
            <FcGoogle className='inline mr-4' size="1.5rem" />
            Continue Sign In with Google
          </button>

          <p className="text-gray-500">
            If you didn't yet have account, you can
            {" "}
            <span className="cursor-pointer text-blue-700 hover:underline">register</span>
          </p>
        </div>

      </Modal>
    </>

  );
}
