import React, { useEffect, useState } from "react";

const Canvas = () => {

  const [state, setState] = useState({
    points: [
      {x: 10, y: 10, order: 0},
      {x: 20, y: 40, order: 1},
      {x: 30, y: 80, order: 2},
      {x: 30, y: 160, order: 3},
      {x: 30, y: 320, order: 4}
    ]
  });

  /*useEffect(()=>{
    getTotalDistance();
  },[state.points]);*/

  const getRandomInteger = (min, max) => {
    return Math.random() * (max - min) + min;
  }

  const handleRamdomize = () => {
    setState(prev => ({...prev, points: prev.points.map((element, index) => {return {x: getRandomInteger(0, 1024), y: getRandomInteger(0, 512), order: index}})}));
  }

  const getTotalDistance = (array) => {
    let distance = 0;
    array.forEach((point, index, points) => {
      if(index<points.length -1){
        let x = Math.abs(point.x-points[index+1].x);
        let y = Math.abs(point.y-points[index+1].y);
        distance += Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
      }
    });
    return distance;
  }

  const bruteForceGetShortest = () => {
    let loop = true
    const currentPoints = state.points
    const swapArray = (givenArray, index1, index2) => {
      let hold = givenArray[index1]
      givenArray[index1] = givenArray[index2];
      givenArray[index2] = hold;
    }
    let lesserDistance = getTotalDistance(currentPoints);
    let lesserOrder = [...currentPoints.map(p=>p.order)];
    while(loop){
      //console.log(...currentPoints.map(point=>point.order));
      let greatestLesserThan = -1;
      for(let i = 0; i<currentPoints.length -1; i++){
        if(currentPoints[i].order < currentPoints[i+1].order){
          greatestLesserThan = i
        }
      }
      if(greatestLesserThan < 0) break;
      let greatestLesserThanPrevious = -1
      for(let i = 0; i<currentPoints.length; i++){
        if(currentPoints[greatestLesserThan].order < currentPoints[i].order){
          greatestLesserThanPrevious = i
        }
      }
      swapArray(currentPoints, greatestLesserThan, greatestLesserThanPrevious);
      let lastSection = currentPoints.splice(greatestLesserThan +1)
      currentPoints.push(...lastSection.reverse());
      let currentDistance = getTotalDistance(currentPoints);
      if(currentDistance < lesserDistance){
        lesserDistance = currentDistance;
        lesserOrder = [...currentPoints.map(p=>p.order)];
      }
      //console.log(getTotalDistance(currentPoints));
    }
    console.log(lesserDistance, lesserOrder);
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
    <button onClick={()=>console.log(state)}>state</button>
    <button onClick={bruteForceGetShortest}>permutations</button>
    </>
  );
}

export default Canvas;