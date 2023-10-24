import React, { useEffect, useState } from "react";

const Canvas = () => {

  const [state, setState] = useState({
    points: [
      {x: 10, y: 10},
      {x: 20, y: 40},
      {x: 30, y: 80},
      {x: 30, y: 160},
      {x: 30, y: 320}
    ]
  });

  useEffect(()=>{
    getDistances();
  },[state.points]);

  const getRandomInteger = (min, max) => {
    return Math.random() * (max - min) + min;
  }

  const handleRamdomize = () => {
    setState(prev => ({...prev, points: prev.points.map(() => {return {x: getRandomInteger(0, 1024), y: getRandomInteger(0, 512)}})}));
  }

  const getDistances = () => {
    const distances = [];
    state.points.forEach((point, index, points) => {
      if(index<points.length -1){
        let x = Math.abs(point.x-points[index+1].x);
        let y = Math.abs(point.y-points[index+1].y);
        let distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        console.log(distance);
      }
    });
  }

  return(
    <>
    <div className="drawing_area">
      {state.points.map((point, i) => {
        return(
          <span className="location_point"
          style={{top: point.y+"px", left: point.x+"px"}}>{i}</span>
        );
      })}
    </div>
    <button onClick={handleRamdomize}>click me</button>
    </>
  );
}

export default Canvas;