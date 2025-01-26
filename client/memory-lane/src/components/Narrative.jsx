import React, { useEffect, useState } from "react";
import Slide from "./Slide";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function Narrative() {
  const [narrative, setNarrative] = useState([]);
  const [chapterNumber, setChapterNumber] = useState(0);

  useEffect(() => {
    const fetchNarrative = async () => {
      try {
        const response = await fetch("https://memory-lane-a4e9.onrender.com/get-narrative", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error:${response.statusText}`);
        }
        const data = await response.json();
        console.log("narrative", data);
        console.log("type", typeof data);
        setNarrative(data.chapters);
      } catch (error) {
        console.error("Failed to fetch narrative:", error);
      }
    };
    fetchNarrative();
  }, []);

  const handleNext = () => {
    setChapterNumber((prev) => (prev + 1) % narrative.length);
  };

  const handlePrev = () => {
    setChapterNumber(
      (prev) => (prev - 1 + narrative.length) % narrative.length
    );
  };

  return (
    <div>
      {narrative.length > 0 ? (
        <div className="  flex flex-row items-center justify-center bg-[url('')]  bg-no-repeat bg-center bg-cover">
          <button className='  p-30 text-[100px] ' onClick={handlePrev}><FontAwesomeIcon icon={faArrowLeft} /></button>
          <div className=" flex flex-col">

            
            <div className="  w-190 h-100  overflow-">
              <img src="/fisherman.webp" alt="Image not loading..." className="rounded"></img>
            </div>
            <div className=" mt-10 w-190 h-40 overflow-">
              <Slide body={narrative[chapterNumber]} />
            </div>
            

          </div>
          <button className='p-30 text-[100px] ' onClick={handleNext}><FontAwesomeIcon icon={faArrowRight} /></button>
        </div>
      ) : null}
    </div>
  );
}

export default Narrative;
