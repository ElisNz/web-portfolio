import { useStore } from "@/app/Store";

export const ContactScreen = () => {
  const store = useStore((state) => state);
  const { scene } = store;

  const visible = scene === "contact";

  return (
    <div className={`${visible ? "": "hidden"} w-full h-screen bg-gradient-to-r from-[pink]/60 to-[white]/60 transition-all duration-100`}>
      <div className="h-full flex flex-col items-center justify-center">
        <h1>Contact</h1>
        <p>I am a </p>
      </div>
    </div>
  );
};
