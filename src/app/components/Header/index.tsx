"use client";
import { Settings } from "../svg";

export const Header = () => {
  const items = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <div className="absolute w-full h-12 z-50 px-sm lg:px-lg">
      <div className="w-full flex flex-row items-baseline justify-between">
        <a href="/">
          <h1 className="text-4xl font-bold underline underline-offset-[0.5em] p-2 [text-shadow:_0_0px_1px_rgb(99_102_241_/_0.8)] dark:[text-shadow:_0_0px_1px_rgb(99_102_241_/_0.8)]">
            cactus_cat
          </h1>
        </a>
        <div className="max-md:hidden flex flex-row items-center gap-2 lg:gap-4 my-4">
          <div className="flex flex-col justify-center text-lg lg:text-xl font-bold border-r-4 border-foreground [box-shadow:_0.8px_0px_0px_rgb(99_102_241_/_0.6)] dark:[box-shadow:_0.8px_0px_0px_rgb(99_102_241_/_0.8)] p-4 py-2 gap-2 lg:gap-4">
            {items.map((item, index) => (
              <a className="text-foreground [text-shadow:_0_0px_2px_rgb(99_102_241_/_0.4)] dark:[text-shadow:_0_0px_2px_rgb(99_102_241_/_0.8)]" key={index} href={item.href}>
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
