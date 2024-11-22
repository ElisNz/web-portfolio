export const Header = () => {

  const items = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <div className='absolute w-full h-12 z-50 px-12'>
      <div className="flex flex-row items-baseline justify-between">
      <h1 className="text-4xl font-bold pl-2 pointer-events-none border-b-4 border-black p-2">Portfolio_test</h1>
        <div className='flex flex-row text-xl font-bold pr-2 border-b-4 border-black p-2'>
          {items.map((item, index) => (
            <a key={index}
              className='pl-2'
              href={item.href}
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
