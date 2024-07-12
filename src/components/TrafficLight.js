import {useState, useEffect, useRef} from 'react';
const arr = [{light:'green', delay: '3000'}, {light:'yellow', delay: '500'},{light:'red', delay: '4000'}]
export default function TrafficLight() {
  const [active, setActive] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    if (timer.current) {
      clearInterval(timer.current);
    }
    timer.current = setInterval(() => {
      setActive((prev) => (prev + 1) % arr.length);
    }, +(arr[active]?.delay));

    return () => clearInterval(timer.current);
  }, [active]);

    const renderLights = () => {
    return arr.map((ele) => (
      <div key={ele?.light} style={{ transition: 'background 3s ease', padding: '4px' }}>
        <div
          style={{
            background: ele.light === arr[active].light ? arr[active].light : 'white',
            width: '30px',
            height: '40px',
            padding: '2px',
            border: '1px solid gray',
            borderRadius: '50%',
          }}
        ></div>
      </div>
    ));
  };
  
  return <div>
    <div style={{ width: '50px', height: '160px', border: '1px solid black', background: 'black', margin: '20px' }}>
        {renderLights()}
      </div>
      <div style={{ width: '50px', height: '160px', border: '1px solid black', background: 'black', margin: '20px' }}>
        {renderLights()}
      </div>
  </div>;
}
