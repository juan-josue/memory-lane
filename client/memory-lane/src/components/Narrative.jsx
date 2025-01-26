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
        const response = await fetch("http://127.0.0.1:5000/get-narrative", {
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
        <div>
          <button onClick={handlePrev}><FontAwesomeIcon icon={faArrowLeft} /></button>
          <Slide body={narrative[chapterNumber]} />
          <button onClick={handleNext}><FontAwesomeIcon icon={faArrowRight} /></button>
        </div>
      ) : null}
    </div>
  );
}

export default Narrative;
