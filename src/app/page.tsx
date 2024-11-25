'use client';

import { useState } from 'react';
import { UpArrow } from '@/app/components/svg';

import { CanvasRotation } from '@/app/components/CanvasRotation';


export default function Home() {
  const [cover, setCover] = useState(true);

  const fadeOverlay = () => {
    setCover(false);
  };

  return (
    <>
      <div className={`w-full absolute ${cover ? '-z-50' : ''}`}>
        <CanvasRotation />
      </div>

      {cover && (
        <div>
          <div className='absolute w-full h-full bg-[lightpink]/30 -z-40'></div>
          <div className='absolute w-1/3 flex flex-col bottom-40 right-0 pr-12 text-[black]/90 '>
            <h2 className='text-4xl font-bold'>Welcome to the site</h2>
            <p className='text-2xl'>This is a test site for a three.js project</p>
            <p className='invisible md:visible text-md pt-4 text-balance'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Optio itaque temporibus at voluptates dolor quos possimus consectetur quod. Recusandae, quae adipisci ab doloremque nobis ullam aliquid voluptatem reiciendis id? Mollitia.</p>
          </div>

          <button type="button" className='w-full flex flex-row absolute bottom-[10%] justify-center' onClick={() => fadeOverlay()}>
            <div className='flex flex-col items-center cursor-pointer animate-bounce'>
              <UpArrow width={40} height={40} />
              <h2 className='w-fit text-2xl'>See some projects</h2>
            </div>
          </button>
        </div>      
      )}
    </>
  );
}
