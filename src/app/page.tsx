import {  GLtest, Tree, Header } from './components';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen pb-20 font-[family-name:var(--font-geist-sans)]">
      
      <div className='w-full h-screen'>
        <Header />
        <div className='absolute w-full h-full bg-[white]/30 -z-40'></div>
        <GLtest />
        <div className='absolute w-1/3 flex flex-col bottom-40 right-0 pr-12 text-[black]/90 '>
          <h2 className='text-4xl font-bold'>Welcome to the site</h2>
          <p className='text-2xl'>This is a test site for a three.js project</p>
          <p className='text-md pt-4 text-balance'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Optio itaque temporibus at voluptates dolor quos possimus consectetur quod. Recusandae, quae adipisci ab doloremque nobis ullam aliquid voluptatem reiciendis id? Mollitia.</p>
        </div>
      </div>

      <div>
        <Tree />
      </div>
    </div>
  );
}
