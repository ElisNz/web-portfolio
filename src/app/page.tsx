'use client';

import { useState } from 'react';
import { UpArrow } from '@/app/components/svg';

import { CanvasRotationScene } from '@/app/components';


export default function Home() {
  const [cover, setCover] = useState(true);
  const [overview, setOverview] = useState(false);

  const fadeOverlay = () => {
    setCover(false);
  };


  return (
    <>
      <div className={`size-full fixed ${cover ? '-z-50' : ''}`}>
        <CanvasRotationScene cover={cover} overview={overview} setOverview={setOverview} />
      </div>

      {cover && (
        <>
          <div className={`fixed w-full h-full bg-[coral]/60 -z-40`}></div>
          <div className='invisible md:visible fixed w-1/3 flex flex-col bottom-20 xl:bottom-40 right-0 pr-12'>
            <h2 className='text-4xl font-bold'>Welcome to my site</h2>
            <p className='text-2xl'>This is a test site for a three.js project</p>
            <p className='text-md pt-4 text-balance bg-blend-difference'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Optio itaque temporibus at voluptates dolor quos possimus consectetur quod. Recusandae, quae adipisci ab doloremque nobis ullam aliquid voluptatem reiciendis id? Mollitia.</p>
          </div>

          <div className='w-full flex flex-row fixed bottom-[10%] justify-center'>
            <button type="button" onClick={() => {fadeOverlay(); setOverview(true);}}>
              <div className='flex flex-col items-center'>
                <UpArrow width={40} height={40} />
                <h2 className='w-fit text-2xl'>See some projects</h2>
              </div>
            </button>
          </div>
        </>      
      )}
      {!cover && 
        <div className='w-full flex flex-row fixed bottom-[3%] justify-center'>
          <button type="button" onClick={() => {if(overview) { setCover(true) } else { setOverview(true) }}}>
            <div className='flex flex-col items-center'>
              <UpArrow width={40} height={40} rotate={180} />
              <h2 className='w-fit text-2xl'>{overview ? 'Home' : 'Overview'}</h2>
            </div>
          </button>
        </div>
      }
    </>
  );
}
