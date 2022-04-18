import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import Cookies from 'universal-cookie';
import jwtDecode from 'jwt-decode';
import PropTypes from 'prop-types';

import useAuth from '../../zustand/auth';
import { getUser } from '../../services/auth.service';

export default function Signin({ setMode, toggle }) {
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState();

  const handleGoogleSignin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const { user } = await signInWithPopup(getAuth(), provider);
      const { accessToken } = user;

      const token = jwtDecode(accessToken);

      const data = {
        user_id: token.user_id,
        name: token.name,
        email: token.email,
        picture: token.picture,
      };

      const userFirestore = await getUser(token.user_id);

      if (!userFirestore.user_id) {
        setErrorMessage("Google didn't yet registered, please sign up first");
        return;
      }

      const cookies = new Cookies();
      cookies.set('token', accessToken, { path: '/' });

      login(data);
      toggle();
    } catch (err) {
      // console.log(err);
    }
  };

  return (
    <>
      <p>There not yet another option to sign, just with Google account you here</p>
      {errorMessage && (
        <p className="text-red-500">{errorMessage}</p>
      )}
      <button
        type="button"
        className="w-full p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-300 disabled:opacity-50"
        onClick={handleGoogleSignin}
      >
        <FcGoogle className="inline mr-4" size={22} />
        Continue Sign In with Google
      </button>

      <p className="text-gray-500">
        If you didn't yet have account, you can
        {' '}
        <span className="cursor-pointer text-blue-700 hover:underline" onClick={() => setMode('signup')}>signup</span>
      </p>
    </>
  );
}

Signin.propTypes = {
  toggle: PropTypes.func.isRequired,
  setMode: PropTypes.func.isRequired,
};
