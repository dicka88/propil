import React from 'react';
import { HiX } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import Cookies from 'universal-cookie';
import jwtDecode from 'jwt-decode';

import Modal from '../Modal';
import useAuth from '../../zustand/auth';

export default function ModalAuth({ open, toggle }) {
  const { login } = useAuth();

  const handleGoogleSignin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const { user } = await signInWithPopup(getAuth(), provider);
      const accessToken = user.accessToken;

      const token = jwtDecode(accessToken);

      const credential = {
        user_id: token.user_id,
        name: token.name,
        email: token.email,
        picture: token.picture
      };

      console.log(credential);

      const cookies = new Cookies();
      cookies.set('token', accessToken, { path: '/' });

      login(credential);
      toggle();
    } catch (err) {
      alert("Something error happen");
    }
  };

  return (
    <Modal open={open} toggle={toggle}>
      <div className="space-y-6">

        <div className="flex justify-between">
          <h1 className="font-bold">Signin</h1>
          <button className='p-2 hover:bg-gray-100 rounded-full' onClick={toggle}>
            <HiX />
          </button>
        </div>

        <p>There not yet another option to sign, just with Google account you here</p>

        <button
          className="w-full p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-300 disabled:opacity-50"
          onClick={handleGoogleSignin}
        >
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
  );
}
