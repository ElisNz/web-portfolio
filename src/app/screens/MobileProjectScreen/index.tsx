import { useMemo, Suspense } from "react";
import Image from "next/image";

import { useStore } from "@/app/Store";
import { getDataUtility } from "@/app/files";

import { MobileProjectDetailScreen } from "../MobileProjectDetailScreen";

export default function MobileProjectScreen() {
  const store = useStore((state) => state);
  const { scene, setScene, setProject } = store;
  const projects = useMemo(() => getDataUtility("projects"), []);

  const ProjectCard = ({ title, images }) => (
    <Suspense fallback={<p>Loading...</p>}>
      <button
        type="button"
        title={title}
        className="flex flex-col text-center items-center justify-center lg:justify-center lg:gap-4 select-none hover:scale-[1.1] transition-scale duration-300"
        onClick={() => {
          setProject(title?.toLowerCase());
          setScene("details");
        }}
      >
        <div className="size-[15rem] relative">
          {images[0] ?  
            <Image draggable="false" src={images[0]} alt={title} fill /> : 
            <div className="size-full place-content-center">
              <strong className="text-[10em] uppercase font-black">{title[0]}</strong>
            </div>
          }
        </div>
        <h2
          className={`${scene !== "overview" ? "invisible" : ""} capitalize tracking-tighter pt-2 break-all text-lg lg:text-xl xl:text-2xl max-w-[8rem] lg:max-w-[15rem] h-[1em]`}
        >
          {title}
        </h2>
      </button>
    </Suspense>
  );

  let backgroundStyle = "";

  switch (scene) {
    case "cover":
      backgroundStyle = "bg-transparent";
      break;
    case "overview":
      backgroundStyle = "bg-gradient-to-r from-[pink] to-[coral]/40";
      break;
    case "details":
      backgroundStyle = "bg-gradient-to-b from-[pink] to-[coral]/60";
      break;
    default:
      backgroundStyle = "bg-transparent -z-50";
  }

  return (
    <div className={`fixed w-full h-full ${backgroundStyle} text-background`}>
      <div
        className={`fixed w-full ${
          scene === "overview"
            ? "opacity-100"
            : "opacity-10 scale-[0.95] pointer-events-none blur-sm"
        } transition-all duration-500 overflow-hidden`}
      >
        <div className="h-[75vh] w-full flex flex-wrap mt-20 justify-center gap-4 scrollbar-custom lg:gap-8">
          {projects?.map((project, index) =>
            project.title ? <ProjectCard key={index} {...project} /> : null,
          )}
        </div>
      </div>

      {scene !== "cover" && <MobileProjectDetailScreen />}
    </div>
  );
}
