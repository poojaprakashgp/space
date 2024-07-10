import React, { useState } from 'react';
import ProgressBar from '/progressBar.js'

export default function ProgressBarContainer() {
  const [activeBar, setActiveBar] = useState(1);
  const [widthsOfBars, setWidthsOfBars] = useState([]);


  const handleClick = () => {
    setWidthsOfBars((prev) => [...prev, { id: prev?.length+1 }]);
  };

  return (
    <main>
      <button onClick={handleClick}>+ Add</button>
        {widthsOfBars.map((ele, i) => (
          <ProgressBar key={ele.id} id={ele.id} play={activeBar === ele.id} onProgessCompleted={()=>{setActiveBar(ele.id+1)}}/>
        ))}
    </main>
  );
}
