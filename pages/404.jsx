import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

function Error404() {
  return (
    <div className="container">
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="relative w-[350px] h-[350px] mb-8">
            <Image src="/flame-error.png" layout="fill" objectFit="contain" />
          </div>
          <h1 className="font-light mb-8 text-gray-500">Seem the page is not existed</h1>
          <Link href="/">
            <a>
              <button className="bg-black text-white py-2 px-6 rounded-md">Make your own resume</button>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Error404;