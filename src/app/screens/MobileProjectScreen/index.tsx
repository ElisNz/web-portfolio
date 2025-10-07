import { useMemo } from "react";
import Image from "next/image";

import { useStore } from "@/app/Store";
import { getDataUtility } from "@/app/files";

import { MobileProjectDetailScreen } from "../MobileProjectDetailScreen";

export default function MobileProjectScreen() {
  const store = useStore((state) => state);
  const { scene, setScene, project, setProject } = store;
  const projects = useMemo(() => getDataUtility("projects"), []);

  const ProjectCard = ({ title, images }) => (
    <button
      type="button"
      title={title}
      className="flex flex-col text-center items-center justify-center lg:justify-center lg:gap-4 select-none"
      onClick={() => {
        setProject(title);
        setScene("details");
      }}
    >
      <div className="size-[10rem] relative bg-[white]/20">
        <Image draggable="false" src={images[0]} alt={title} fill objectFit="fit" />
      </div>
      <h2 className={`${scene === 'cover' ? 'invisible' : ''} pt-2 break-all text-lg lg:text-xl xl:text-2xl`}>{title}</h2>
    </button>
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
      backgroundStyle = "bg-transparent";
  }

  return (
    <div className={`fixed w-full h-full ${backgroundStyle} text-background`}>
      <div
        className={`fixed w-full ${
          scene === "overview" ? "opacity-100" : "opacity-10 scale-[0.95] pointer-events-none"
        } transition-all duration-500 overflow-hidden`}
      >
        <div className="h-[75vh] w-full flex flex-wrap mt-20 justify-center gap-4 scrollbar-custom lg:gap-8">
          {projects?.map((project, index) =>
            project.title ? <ProjectCard key={index} {...project} /> : null
          )}
        </div>
      </div>

      {scene !== "cover" && 
        <MobileProjectDetailScreen />
      }
    </div>
  );
}
