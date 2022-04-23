import Head from 'next/head';
import React from 'react';
import { HiFlag, HiGlobeAlt, HiUser } from 'react-icons/hi';

import Header from '../../src/components/Header';

export default function analytics() {
  return (
    <>
      <Head>
        <title>Analytics - Propil</title>
      </Head>

      <Header />

      <div className="container my-4">
        <h1 className="font-bold mb-4">Analytics</h1>
        <div className="flex gap-4">
          <div className="w-[200px] text-gray-500">
            <button type="button" className="block w-full p-2 text-left rounded-lg hover:bg-gray-200 hover:text-black">
              <HiUser className="inline mr-2" />
              Page View
            </button>
            <button type="button" className="block w-full p-2 text-left rounded-lg hover:bg-gray-200 hover:text-black">
              <HiUser className="inline mr-2" />
              Unique Users
            </button>
            <button type="button" className="block w-full p-2 text-left rounded-lg hover:bg-gray-200 hover:text-black">
              <HiUser className="inline mr-2" />
              Sources
            </button>
            <button type="button" className="block w-full p-2 text-left rounded-lg hover:bg-gray-200 hover:text-black">
              <HiGlobeAlt className="inline mr-2" />
              Browser
            </button>
            <button type="button" className="block w-full p-2 text-left rounded-lg hover:bg-gray-200 hover:text-black">
              <HiFlag className="inline mr-2" />
              Country
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-between w-full">
            <div className="shadow bg-white rounded-md p-4">
              <span className="font-semibold block mb-2">Today</span>
              <div className="bg-gray-200 h-[150px] rounded-lg m-1" />
            </div>
            <div className="shadow bg-white rounded-md p-4">
              <span className="font-semibold block mb-2">Yesterday</span>
              <div className="bg-gray-200 h-[150px] rounded-lg m-1" />
            </div>
            <div className="shadow bg-white rounded-md p-4">
              <span className="font-semibold block mb-2">This Month</span>
              <div className="bg-gray-200 h-[150px] rounded-lg m-1" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
