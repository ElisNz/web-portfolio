import { useStore } from "@/app/Store";


export const AboutScreen = () => {
  const store = useStore((state) => state);
  const { scene } = store;

  const visible = scene === "about";

  return (
    <div className={`${visible ? "": "hidden"} w-full h-screen bg-gradient-to-r from-[purple]/40 to-[pink]/60 transition-all duration-300`}>
      <div className="h-full flex flex-row items-center justify-evenly mx-40">
        <div className="w-1/2">
          <h2 className="leading-none text-nowrap mb-0">Fullstack Developer</h2>
          <h3 className="text-nowrap mb-8 font-black font-mono">UI/UX/web</h3>

          <p className="text-pretty font-sans indent-8">
            <span className="leading-none tracking-none text-[1.5em] font-semibold font-mono">Stockholm & Tokyo-based. </span>
            I specialize in creating beautiful, responsive, and user-friendly websites and applications.
            With a strong background in both front-end and back-end development, I am able to bring ideas to life from concept to completion.
          </p>
          <p className="font-sans indent-8 mb-4">
            My passion for design and technology drives me to continuously learn and improve my skills, ensuring that I stay up-to-date with the latest trends and best practices in the industry.
          </p>
          <div className="size-[4rem] leading-[4rem] text-[4rem] text-nowrap font-black font-mono origin-center rotate-90 align-bottom">猫好キ</div>
        </div>

        <div className="flex flex-col items-center">
          <h2>Socials</h2>
          <ul className="leading-[3rem] flex flex-row justify-evenly align-baseline">
            <li className="leading-[3rem] px-sm">
              <a href="/">
                <h3 className="font-black">LinkedIn</h3>
              </a>
            </li>
            <span className="text-[3rem] font-black select-none">•</span>
            <li className="px-sm">
              <a href="/">
                <h3 className="font-black">Discord</h3>
              </a>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};
