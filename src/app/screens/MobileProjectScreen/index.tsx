import { useStore } from "@/app/Store";
import Image from "next/image";

const projects = [
  {
    title: "Project 1",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/images/texture_text_test.png",
  },
  {
    title: "Project 2",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/images/texture_text_test.png",
  },
  {
    title: "Project 3",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/images/texture_text_test.png",
  },
  {
    title: "Project 4",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/images/texture_text_test.png",
  },
];

export default function MobileProjectScreen() {
  const store = useStore((state) => state);
  const { scene, setScene } = store;

  const ProjectCard = ({ title, description, image }) => (
    <button type="button" title={title} className="flex flex-col text-center items-center" onClick={() => setScene(title)}>
      <div className="h-20 w-20 bg-[white]/20">
        <Image src={image} alt={title} width={100} height={100} />
      </div>
      <h2 className="pt-2">{title}</h2>
    </button>
  );


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
        {projects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>
    </div>
  );
}
