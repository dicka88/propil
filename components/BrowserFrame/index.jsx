import React from 'react';
import { HiLockClosed } from 'react-icons/hi';
import propTypes from 'prop-types';

export default function BrowserFrame({ url, children }) {
  return (
    <div className="rounded-md overflow-hidden shadow sticky top-4">
      <header className="bg-gray-200 flex items-center px-4 py-2">
        <div className="flex mr-6">
          <span className="rounded-full aspect-square h-[15px] bg-red-500 mx-1" />
          <span className="rounded-full aspect-square h-[15px] bg-yellow-500 mx-1" />
          <span className="rounded-full aspect-square h-[15px] bg-green-500 mx-1" />
        </div>
        <div>
          <div className="py-1 px-4 text-gray-500 bg-gray-300 rounded-md min-w-[400px]">
            <HiLockClosed className="inline mr-4" size={14} />
            {url}
          </div>
        </div>
        <span />
      </header>
      <main className='min-h-[600px] border-l border border-b border-r border-gray-200 bg-white'>
        {children}
      </main>
    </div>
  );
}

BrowserFrame.propTypes = {
  url: propTypes.string,
  children: propTypes.node
};