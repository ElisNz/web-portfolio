import { useEffect } from "react";

export const Miniloader = () => {
  const loadingSequence = ["▙", "▚", "▛", "▞", "▜", "▚", "▟", "▞"];
  useEffect(() => {
    const loader = document.getElementById("loader");
    let i = 0;

    const interval = setInterval(() => {
      loader.innerHTML = loadingSequence[i % loadingSequence.length];
      i++;
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <div className="flex justify-end items-end h-screen">
        <div id="loader" className="text-4xl"></div>
      </div>
    </div>
  );
};
