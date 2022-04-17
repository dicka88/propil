import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import Cookies from 'universal-cookie';
import jwtDecode from 'jwt-decode';
import PropTypes from 'prop-types';

import useAuth from '../../zustand/auth';
import { getUser, addUser } from '../../services/auth.service';

export default function Signup({ setMode, toggle }) {
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState();

  const handleGoogleRegister = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const { user } = await signInWithPopup(getAuth(), provider);
      const accessToken = user.accessToken;

      const token = jwtDecode(accessToken);

      const data = {
        user_id: token.user_id,
        name: token.name,
        email: token.email,
        picture: token.picture
      };

      const userFirestore = await getUser(token.user_id);

      if (userFirestore.user_id) {
        setErrorMessage("Google is already registered, please use login");
        return;
      };

      await addUser(data);

      const cookies = new Cookies();
      cookies.set('token', accessToken, { path: '/' });

      login(data);
      toggle();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <p>Sign Up with you google account, just one click</p>
      {errorMessage && (
        <p className="text-red-500">{errorMessage}</p>
      )}
      <button
        className="w-full p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-300 disabled:opacity-50"
        onClick={handleGoogleRegister}
      >
        <FcGoogle className='inline mr-4' size={22} />
        Continue Sign Up with Google
      </button>

      <p className="text-gray-500">
        If you didn't yet have account, you can
        {" "}
        <span className="cursor-pointer text-blue-700 hover:underline" onClick={() => setMode('signin')}>signin</span>
      </p>
    </>
  );
}

Signup.propTypes = {
  toggle: PropTypes.func.isRequired,
  setMode: PropTypes.func.isRequired
};