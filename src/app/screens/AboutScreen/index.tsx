import { useStore } from "@/app/Store";
import Image from "next/image";


export const AboutScreen = () => {
  const store = useStore((state) => state);
  const { scene } = store;

  const visible = scene === "about";

  return (
    <div className={`${visible ? "": "hidden"} w-full md:h-screen bg-gradient-to-r from-[purple]/40 to-[pink]/60 transition-all duration-300 overflow-x-hidden overflow-y-scroll`}>
      <div className="flex flex-col md:flex-row items-center justify-evenly my-40 mx-md md:mx-40">
        <div className="max-md:relative w-full md:w-1/2">
          <h2 className="leading-none md:text-nowrap mb-0 antialiased">Fullstack Developer</h2>
          <h3 className="text-nowrap mb-8 font-black font-mono">UI/UX/web</h3>

          <p className="text-pretty font-sans">
            <span className="leading-none tracking-none text-[1.5em] font-semibold font-mono antialiased">Stockholm & Tokyo-based. </span>
            I specialize in creating beautiful, responsive, and user-friendly websites and applications.
            With a strong background in both front-end and back-end development, I am able to bring ideas to life from concept to completion.
          </p>
          <p className="font-sans mb-4">
            My passion for design and technology drives me to continuously learn and improve my skills, ensuring that I stay up-to-date with the latest trends and best practices in the industry.
          </p>
          <h2 className="text-nowrap font-black font-mono antialiased">４６４９・衛理守</h2>
        </div>

        <div className="flex flex-col items-center">
          <h2>Socials</h2>
          <Image src="/images/texture_text_test.png" alt="About Image" width={300} height={300} className="mb-8" />
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
