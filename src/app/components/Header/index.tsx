"use client";
import { Settings } from "../svg";

export const Header = () => {
  const items = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <div className="absolute w-full h-12 z-50 px-sm md:px-lg">
      <div className="w-full flex flex-row items-baseline justify-between">
        <a href="/">
          <h1 className="text-white text-4xl font-bold underline underline-offset-[0.5em] p-2 [text-shadow:_0_0px_2px_rgb(99_102_241_/_1)]">
            cactus_cat
          </h1>
        </a>
        <div className="max-md:hidden flex flex-row items-center gap-4 my-4">
          <div className="text-foreground flex flex-col justify-center text-xl font-bold border-r-4 border-[black] [box-shadow:_0.8px_0px_0px_rgb(99_102_241_/_0.6)] p-4 py-2 gap-4">
            {items.map((item, index) => (
              <a key={index} href={item.href}>
                {item.name}
              </a>
            ))}
          </div>
          <button
            type="button"
            title="settings"
            className="transition duration-300 ease-in-out hover:-rotate-45 hover:scale-110"
          >
            <Settings />
          </button>
        </div>
      </div>
    </div>
  );
};
