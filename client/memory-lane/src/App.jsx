import { useState } from "react";
import "./App.css";

import Chat from "./components/Chat";
import Narrative from "./components/Narrative";

function App() {
  const [begin, setBegin] = useState(false);
  const [end, setEnd] = useState(false);

  const handleClick = () => {
    // const audioUrl = "http://127.0.0.1:5000/get-intro";
    // const audio = new Audio(audioUrl);
    // audio.play();
    setBegin(true);
  };

  const handleEnd = () => {
    setEnd(true);
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center p-10">
      {!begin ? (
        <>
          <h1 className="text-5xl font-bold">Memory Lane</h1>
          <img
            src="/logo.png"
            alt="Image not loading..."
            className="rounded w-[300px] h-[300px]"
          ></img>
          <button
            className="w-[220px] p-3 bg-black rounded text-white"
            onClick={handleClick}
          >
            Let's Begin Our Session
          </button>
        </>
      ) : end ? (
        <Narrative />
      ) : (
        <>
          <h1 className="text-3xl font-bold">Memory Lane</h1>
          <img
            src="/logo.png"
            alt="Image not loading..."
            className="rounded w-[100px] h-[100px] mb-[100px]"
          ></img>
          <Chat onEnd={handleEnd} />
        </>
      )}
    </div>
  );
}

export default App;
