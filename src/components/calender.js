import React, { useMemo } from 'react';
import { Data } from '/data.js';
import { Data1 } from '/data.js';

export default function App() {
  const getHours = useMemo(() => {
    let arr = [];
    for (let i = 0; i < 24; i++) {
      let hour = i === 0 ? '' : (i <= 12 ? `${i}.00AM` : ((i - 12) !== 12 ? `${i - 12}.00PM` : ''));
      arr.push({ hour: hour, time: `${i}:00` });
    }
    return arr;
  }, []);

  return (
    <main>
      <section className="container">
        {getHours.map((ele, i) => (
          <div className="hour" key={ele.time}>
            <div style={{marginTop:'-8px'}}>{ele.hour}</div>
            <div className="hourborder"></div>
          </div>
        ))}
        <Schedules />
      </section>
    </main>
  );
}

// below is for not overlapped one
const getBlocks = () => {
  let blocked = []
  for (let i = 0; i < Data1.length; i++) {
    const [sh, sm] = Data1[i].startTime.split(':');
    const [eh, em] = Data1[i].endTime.split(':');
    const totalHrs = eh - sh + ((em - sm) / 60);
    const boxHeight = 60 * totalHrs;
    const top = 60 * sh + 60 * (sm / 60);
    blocked.push({
      top: top,
      color: Data1[i].color,
      startTime: Data1[i].startTime,
      endTime: Data1[i].endTime,
      title: Data1[i].title,
      boxHeight: boxHeight,
    })
  }
  return blocked
}

const getBlocks1 = () => {
  let blocked = [];
  const blockedCalender = new Map();
  for (let i = 0; i < Data.length; i++) {
    let currentEvent = Data[i];

    const [sh, sm] = currentEvent.startTime.split(":").map(Number);
    const [eh, em] = currentEvent.endTime.split(":").map(Number);

    for (let k = sh; k <= eh; k++) {
      if (blockedCalender.has(k)) {
        blockedCalender.set(k, blockedCalender.get(k) + 1);
      } else {
        blockedCalender.set(k, 1);
      }
    }

    let start = sh * 60 + sm;
    let end = eh * 60 + em;
    const max = Math.max(blockedCalender.get(sh), blockedCalender.get(eh));

    const boxHeight = `${end - start}px`;
    const top = `${start}px`;
    const zIndex = `${i + 1}`;
    const width = `${(100 - ((max * 10))) - 10}%`;

    blocked.push({
      top: top,
      color: currentEvent.color,
      startTime: currentEvent.startTime,
      endTime: currentEvent.endTime,
      title: currentEvent.title,
      boxHeight: boxHeight,
      width: width,
      zIndex: zIndex
    });
  }
  return blocked;
}

const Schedules = () => {
  const blocks = useMemo(() => getBlocks1(), []);
  console.log("===", blocks)
  return (
    <div className="schedules">
      {blocks?.map((ele, i) => (
        <Schedule details={ele} key={i} />
      ))}
    </div>
  );
}

const Schedule = ({ details }) => {
  return (
    <div
      className="schedule"
      style={{
        background: details.color,
        top: details.top,
        zIndex: details?.zIndex || '999',
        height: details.boxHeight,
        width: details?.width || '100%',
        position: 'absolute'
      }}
    >
      <span style={{ position:'absolute', ':hover': {zIndex:9999}}}>{details.title}: {details.startTime} - {details.endTime}</span>
    </div>
  );
}
