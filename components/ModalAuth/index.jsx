import React, { useState } from 'react';
import { HiX } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';

import Modal from '../Modal';
import Signin from './Signin';
import Signup from './Signup';

export default function ModalAuth({ open, toggle }) {
  const [mode, setMode] = useState('signin');

  return (
    <Modal open={open} toggle={toggle}>
      <div className="space-y-6">

        <div className="flex justify-between">
          <h1 className="font-bold">{mode === 'signin' ? 'Signin' : 'Register'}</h1>
          <button className='p-2 hover:bg-gray-100 rounded-full' onClick={toggle}>
            <HiX />
          </button>
        </div>

        {mode == 'signin' ? (
          <Signin setMode={setMode} toggle={toggle} />
        ) : (
          <Signup setMode={setMode} toggle={toggle} />
        )}
      </div>

    </Modal>
  );
}
