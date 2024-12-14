import { useEffect } from "react";

export const ProjectDetailScreen = (props) => {
  const ALLOWED_WIDTH = window.innerWidth - window.innerWidth / 10;
  const ALLOWED_HEIGHT = window.innerHeight - window.innerHeight / 10;

  const setDetailsScreenPosition = () => {
    const detailsL = document.getElementById("details-screen-l");
    const detailsR = document.getElementById("details-screen-r");

    if (!detailsL || !detailsR) {
      return;
    }

    const lPosx =
      props.selectedPosition.x -
      window.innerWidth / 3 +
      (props.selectedPosition.x - window.innerWidth / 4) / 2;
    const lPosy = props.selectedPosition.y - window.innerHeight / 2;

    const rPosx =
      props.selectedPosition.x +
      window.innerWidth / 7 +
      (props.selectedPosition.x - window.innerWidth / 2) / 2;
    const rPosy = lPosy;

    if (
      lPosx > ALLOWED_WIDTH ||
      props.selectedPosition.x < 0 ||
      props.selectedPosition.y > ALLOWED_HEIGHT ||
      props.selectedPosition.y < 0
    ) {
      detailsL.style.display = "none";
    } else {
      detailsL.style.display = "block";
    }
    if (
      lPosy > ALLOWED_WIDTH ||
      props.selectedPosition.x < 0 ||
      props.selectedPosition.y > ALLOWED_HEIGHT ||
      props.selectedPosition.y < 0
    ) {
      detailsL.style.display = "none";
    } else {
      detailsL.style.display = "block";
    }
    if (
      rPosx > ALLOWED_WIDTH ||
      props.selectedPosition.x < 0 ||
      props.selectedPosition.y > ALLOWED_HEIGHT ||
      props.selectedPosition.y < 0
    ) {
      detailsR.style.display = "none";
    } else {
      detailsR.style.display = "block";
    }
    if (
      rPosy > ALLOWED_WIDTH ||
      props.selectedPosition.x < 0 ||
      props.selectedPosition.y > ALLOWED_HEIGHT ||
      props.selectedPosition.y < 0
    ) {
      detailsR.style.display = "none";
    } else {
      detailsR.style.display = "block";
    }

    detailsL.style.left = `${lPosx}px`;
    detailsL.style.top = `${lPosy}px`;

    detailsR.style.left = `${rPosx}px`;
    detailsR.style.top = `${rPosy}px`;

    requestAnimationFrame(setDetailsScreenPosition);
  };

  useEffect(() => {
    setDetailsScreenPosition();
  }, [props.animationReady]);

  return (
    <>
      <div id="details-screen-l" className="w-1/4 absolute pr-12">
        <h2 className="text-2xl font-bold">{props.title || "title_"}</h2>
        <h3 className="text-lg">This is a test project</h3>
        <p className="text-md pt-4 text-balance bg-blend-difference">
          Recusandae, quae adipisci ab doloremque nobis ullam aliquid voluptatem
          reiciendis id? Mollitia.
        </p>
      </div>
      <div className="absolute size-20 bg-[blue]"></div>

      <div id="details-screen-r" className="w-1/4 absolute pl-12">
        <h3 className="text-lg font-bold">This is a test project</h3>
        <p className="text-md pt-4 text-balance bg-blend-difference">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Optio itaque
          temporibus at voluptates dolor quos possimus consectetur quod.
        </p>
        <ul className="text-md pt-4 text-balance bg-blend-difference list-disc list-inside">
          <li>Recusandae</li>
          <li>Quae adipisci</li>
          <li>Ab doloremque</li>
        </ul>
      </div>
    </>
  );
};
