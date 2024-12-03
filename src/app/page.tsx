'use client';

import { useState } from 'react';
import { UpArrow } from '@/app/components/svg';

import { CanvasRotationScene } from '@/app/components';


export default function Home() {

  const [scene, setScene] = useState('cover');


  const fadeOverlay = () => {
    // Fade out overlay
  };


  return (
    <>
      <div className={`size-full fixed ${scene === 'cover' ? '-z-50' : ''}`}>
        <CanvasRotationScene scene={scene} setScene={setScene} />
      </div>

      {scene === 'cover' && (
        <>
          <div className={`fixed w-full h-full bg-[coral]/60 -z-40`}></div>
          <div className='invisible md:visible fixed w-1/3 flex flex-col bottom-20 xl:bottom-40 right-0 pr-12'>
            <h2 className='text-4xl font-bold'>Welcome to my site</h2>
            <p className='text-2xl'>This is a test site for a three.js project</p>
            <p className='text-md pt-4 text-balance bg-blend-difference'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Optio itaque temporibus at voluptates dolor quos possimus consectetur quod. Recusandae, quae adipisci ab doloremque nobis ullam aliquid voluptatem reiciendis id? Mollitia.</p>
          </div>

          <div className='w-full flex flex-row fixed bottom-[10%] justify-center'>
            <button type="button" onClick={() => {fadeOverlay(); setScene('overview')}}>
              <div className='flex flex-col items-center'>
                <UpArrow width={40} height={40} />
                <h2 className='w-fit text-2xl'>See some projects</h2>
              </div>
            </button>
          </div>
        </>      
      )}
      {scene !== 'cover' && 
        <div className='w-full flex flex-row fixed bottom-[3%] justify-center'>
          <button type="button" onClick={() => {if(scene === 'overview') { setScene('cover') } else { setScene('overview'); }}}>
            <div className='flex flex-col items-center'>
              <UpArrow width={40} height={40} rotate={180} />
              <h2 className='w-fit text-2xl'>{scene === 'overview' ? 'Home' : 'Overview'}</h2>
            </div>
          </button>
        </div>
      }
    </>
  );
}
