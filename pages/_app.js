import React, { useEffect } from 'react';
import Head from 'next/head';
import Cookies from 'universal-cookie';
import jwtDecode from 'jwt-decode';
import PropTypes from 'prop-types';

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
        // console.log(err);
      }
    }
  }, []);

  return (
    <>
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

MyApp.defaultProps = {
  pageProps: {},
};

MyApp.propTypes = {
  Component: PropTypes.node.isRequired,
  pageProps: PropTypes.object,
};
