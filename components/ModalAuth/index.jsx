import React, { useState } from 'react';
import { HiX } from 'react-icons/hi';

import useModalState from '../../zustand/modal';
import Modal from '../Modal';
import Signin from './Signin';
import Signup from './Signup';

export default function ModalAuth() {
  const { modalAuthOpen, toggleModalAuth, modalAuthMode, setModalAuthMode } = useModalState();

  return (
    <Modal open={modalAuthOpen} toggle={toggleModalAuth}>
      <div className="space-y-6">
        <div className="flex justify-between">
          <h1 className="font-bold">{modalAuthMode === 'signin' ? 'Sign In' : 'Sign Up'}</h1>
          <button className='p-2 hover:bg-gray-100 rounded-full' onClick={toggleModalAuth}>
            <HiX />
          </button>
        </div>

        {modalAuthMode == 'signin' ? (
          <Signin setMode={setModalAuthMode} toggle={toggleModalAuth} />
        ) : (
          <Signup setMode={setModalAuthMode} toggle={toggleModalAuth} />
        )}
      </div>
    </Modal>
  );
}
