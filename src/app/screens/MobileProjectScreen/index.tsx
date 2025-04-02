import { useStore } from "@/app/Store";

export default function MobileProjectScreen() {
  const store = useStore((state) => state);
  const { scene } = store;

  let backgroundStyle = "";

  switch (scene) {
    case "cover":
      backgroundStyle = "bg-transparent";
      break;
    case "overview":
      backgroundStyle = "bg-gradient-to-r from-[coral] to-[pink]/60";
      break;
    case "details":
      backgroundStyle = "bg-gradient-to-r from-[pink] to-pink-200/60";
      break;
    default:
      backgroundStyle = "bg-transparent";
  }

  return (
    <div
      className={`fixed w-full h-full ${backgroundStyle} ${scene === "cover" ? "opacity-0" : "opacity-100"}`}
    >
      <div className="h-full flex flex-wrap items-center justify-evenly py-[15vh] gap-4 p-md">
        <div className="h-20 w-20 bg-[white] text-center">
          <div className="h-20 w-20 bg-[white]"></div>
          <h2 className="pt-2">Name_name</h2>
        </div>
        <div className="h-20 w-20 bg-[white] text-center">
          <div className="h-20 w-20 bg-[white]"></div>
          <h2 className="pt-2">Name_name</h2>
        </div>
        <div className="h-20 w-20 bg-[white] text-center">
          <div className="h-20 w-20 bg-[white]"></div>
          <h2 className="pt-2">Name_name</h2>
        </div>
        <div className="h-20 w-20 bg-[white] text-center">
          <div className="h-20 w-20 bg-[white]"></div>
          <h2 className="pt-2">Name_name</h2>
        </div>
        <div className="h-20 w-20 bg-[white] text-center">
          <div className="h-20 w-20 bg-[white]"></div>
          <h2 className="pt-2">Name_name</h2>
        </div>
      </div>
    </div>
  );
}
