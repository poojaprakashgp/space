import React, { useState, useEffect, useRef } from 'react'
const ProgressBar = ({ play, onProgessCompleted }) => {
  const [width, setWidth] = useState(0);
  const timer = useRef(null)

  useEffect(()=>{
    if(play){
      timer.current = setInterval(() => {
        setWidth(prev => {
          if (prev >= 100) {
            clearInterval(timer.current);
            onProgessCompleted()
            return 100;
          } else {
            return prev + 1;
          }
        })
      }, 100)
    }
   
    return ()=>clearInterval(timer.current)
  }, [play])
 
 
  return <>
    <div className='barBorder'>
      <div className="bar" style={{ width: `${width}%` }}></div>
    </div>
  </>
}

export default ProgressBar
