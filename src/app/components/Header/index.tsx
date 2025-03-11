'use client';
import { Settings } from "../svg";

export const Header = () => {
  const items = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <div className="absolute w-full h-12 z-50 px-12 [text-shadow:_0_0px_2px_rgb(99_102_241_/_0.6)]">
      <div className="w-full flex flex-row items-baseline justify-between">
        <a href="/">
          <h1 className="text-4xl font-bold underline underline-offset-[0.5em] p-2">
            cactus_cat
          </h1>
        </a>
        <div className="invisible md:visible flex flex-row items-center gap-4 my-4">
          <div className="flex flex-col justify-center text-xl font-bold border-r-4 border-[black] pr-4 py-2 gap-4">
            
            {items.map((item, index) => (
              <a key={index} href={item.href}>
                {item.name}
              </a>
            ))}
          </div>
          <button type="button" title="settings" className="transition duration-300 ease-in-out hover:-rotate-45 hover:scale-110">
            <Settings />
          </button>
          
        </div>
      </div>
    </div>
  );
};
