import { Settings } from "../svg";

export const Header = () => {
  const items = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <div className="absolute w-full h-12 z-50 px-12">
      <div className="w-full flex flex-row items-baseline justify-between">
        <a href="/">
          <h1 className="text-4xl font-bold border-b-4 border-[black] p-2">
            cactus_cat
          </h1>
        </a>
        <div className="invisible md:visible flex flex-row items-center gap-8">
          <div className="flex flex-row text-xl font-bold border-b-4 border-[black] p-2 gap-4">
            {items.map((item, index) => (
              <a key={index} href={item.href}>
                {item.name}
              </a>
            ))}
          </div>

          <button type="button" title="settings">
            <Settings />
          </button>
        </div>
      </div>
    </div>
  );
};
