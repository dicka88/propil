import React, { useEffect, useState } from 'react';
import App from 'next/app';
import Head from 'next/head';
import jwtDecode from 'jwt-decode';
import PropTypes from 'prop-types';
import { Toaster } from 'react-hot-toast';

import BackdropLoader from '../components/BackdropLoader';
import '../firebase/firebase';
import useAuth from '../zustand/auth';
import useHasMounted from '../hooks/useHasMounted';

import '../styles/globals.css';

function MyApp({ Component, pageProps, user }) {
  const { login } = useAuth();

  const isMounted = useHasMounted();

  useEffect(() => {
    if (user) {
      login(user);
    }
  }, []);

  if (!isMounted) {
    return (
      <BackdropLoader open />
    );
  }

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
      <Toaster />
      <Component {...pageProps} />
    </>
  );
}

MyApp.getInitialProps = async (appContext) => {
  App.getInitialProps(appContext);

  let user;
  const accessToken = appContext.ctx.req?.cookies?.token;

  if (accessToken) {
    try {
      user = jwtDecode(accessToken);
    } catch (err) {
      console.log(err);
    }
  }

  return {
    user,
  };
};

export default MyApp;

MyApp.defaultProps = {
  Component: null,
  pageProps: {},
  user: null,
};

MyApp.propTypes = {
  Component: PropTypes.func,
  pageProps: PropTypes.object,
  user: PropTypes.object,
};
