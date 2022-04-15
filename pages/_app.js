import { useEffect } from 'react';
import Cookies from 'universal-cookie';
import jwtDecode from 'jwt-decode';

import '../firebase/firebase';
import useAuth from '../zustand/auth';

import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const { login } = useAuth();

  useEffect(() => {
    const cookies = new Cookies();

    let user;
    const accessToken = cookies.get('token');

    if (accessToken) {
      try {
        user = jwtDecode(accessToken);
        login(user);
      } catch (err) {

      }
    }
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
