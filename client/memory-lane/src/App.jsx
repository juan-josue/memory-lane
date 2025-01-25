import { useState } from "react";
import "./App.css";

import Chat from "./components/Chat";

function App() {
  const [begin, setBegin] = useState(false);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center p-10"> 
      {!begin ? (
        <button className="w-[220px] p-3 bg-black rounded text-white" onClick={() => setBegin(true)}>Let's Begin Our Session</button>
      ) : (
        <Chat />
      )}
    </div>
  );
}

export default App;
