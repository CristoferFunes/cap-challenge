import React, { useEffect, useRef, useState } from "react";
import Popup from "./popup";

const Canvas = () => {

  const positionRef = useRef();

  const [state, setState] = useState({
    new_point: false,
    mouse_x: '',
    mouse_y: '',
    points_size: 16,
    points: [],
    route_population : null,
    population_size: 100,
    mutation_rate: 0.05,
    best_distance: Infinity,
    given_cicles: 1000,
    count: 0,
    edit: false
  });

  //Function that helped me get a random number between a range
  const getRandomNumber = (min, max) => {
    return Math.random() * (max - min) + min;
  }

  //Function that randomizes the position of all the points
  const handleRamdomize = () => {
    setState(prev => ({...prev, best_order: undefined, best_distance: Infinity, points: prev.points.map((element, index) => {return {x: getRandomNumber(0, 1024), y: getRandomNumber(0, 512), order: index}})}));
  }

  //Function that meassures the distance between all the points in a given array and returns it inverted and exponeciated
  const getFitness = (array) => {
    let distance = 0;
    array.forEach((point, index, points) => {
      if(index<points.length -1){
        let x = Math.abs(point.x-points[index+1].x);
        let y = Math.abs(point.y-points[index+1].y);
        distance += Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
      }
    });
    if(distance<state.best_distance){
      setState(prev => ({...prev, best_distance: distance, best_order: array, count: 0}));
    }
    return Math.pow(1/(distance+1), 3);
  }

  //Function for normalizing the fitness value of a given population
  const normalizeFitness = (population) => {
    let sum_of_population = 0
    population.forEach(route => sum_of_population+=route.fitness);
    return population.map(route => {return{...route, fitness: route.fitness/sum_of_population}})
  }

  //Takes a population and returns a more fit one
  const getNextGen = (population) => {
    const selectAccordingToProbability = (array) => {
      let i = 0;
      let selector = Math.random();
      while(selector>0){
        selector -= array[i].fitness;
        i++;
      }
      return array[i-1];
    }
    const nextGen = [];
    population.forEach(()=>{
      //Crossover
      let parent1 = selectAccordingToProbability(population);
      let parent2 = selectAccordingToProbability(population);
      let chance = parent1.fitness / (parent1.fitness+parent2.fitness);
      let child = {fitness: 0, route: Array(parent1.route.length)};
      let forgoten = [];
      for(let index = 0; index < child.route.length; index++){
        if(Math.random() < chance && !child.route.includes(parent1.route[index])){
          child.route[index] = parent1.route[index]
          continue;
        }
        if(!child.route.includes(parent2.route[index])){
          child.route[index] = parent2.route[index]
          continue;
        }
        if(!child.route.includes(parent1.route[index])){
          child.route[index] = parent1.route[index]
          continue;
        }
        forgoten.push(index);
      }
      forgoten.forEach(indexNum => child.route[indexNum] = parent1.route.filter(element => !child.route.includes(element))[0]);
      //Mutation
      let mutation = state.mutation_rate;
      let thisMutation = Math.random();
      mutation -= thisMutation;
      let count = 0;
      while(mutation > 0){
        if(state.best_order && thisMutation < state.mutation_rate/10){
          child = {fitnes: 0, route: state.best_order}
          break;
        }
        if(thisMutation < state.mutation_rate/5){
          let hold = child.route[0];
          const newOrder = child.route.slice(1);
          newOrder.push(hold);
          child.route = newOrder;
          break;
        }
        let indexA = Math.floor(getRandomNumber(0, child.route.length -1));
        let indexB = Math.floor(getRandomNumber(0, child.route.length -1))
        let hold = child.route[indexA];
        child.route[indexA] = child.route[indexB];
        child.route[indexB] = hold;
        mutation -= thisMutation;
        count++;
      }
      nextGen.push(child);
    });
    return nextGen;
  }

  //React hook that itereates over generations
  useEffect(()=>{
    if(!state.route_population || !state.run) return;
    let route_population = state.route_population.map(route => {
      return {...route, fitness: getFitness(route.route)}
    })
    route_population = normalizeFitness(route_population);
    route_population = getNextGen(route_population);
    setState(prev => ({...prev, route_population: route_population, count: prev.count + 1, run: state.count<state.given_cicles}));
  },[state.route_population, state.run]);

  const handleStart = () => {
    if(state.points.length <= 0) return;
    const population = []
    for(let i = 0; i<state.population_size; i++){
      population.push({fitness: 0, route: [...state.points].sort(()=>Math.random()-0.5)});
    }
    setState(prev => ({...prev, route_population: population, run: true, count: 0}));
  }

  const handleMouseMove = (event) => {
    const canvas_x = positionRef.current.offsetLeft;
    const canvas_y = positionRef.current.offsetTop;
    let x = event.clientX -canvas_x;
    let y = event.clientY -canvas_y;
    setState(prev => ({...prev, mouse_x: x < 0 ? 0 : x > 1024 ? 1024 : x, mouse_y: y < 0 ? 0 : y > 512 ? 512 : y}));
  };

  const handleAdd = () => {
    setState(prev => ({...prev, new_point: !state.new_point}));
  };

  const handleOnClick = () => {
    if(!state.new_point) return;
    const newPoint = state.points;
    newPoint.push({x: state.mouse_x, y: state.mouse_y, order: state.points.length});
    setState(prev => ({...prev, new_point: false, points: newPoint, best_order: undefined, best_distance: Infinity}));
  }

  const handleDeleteLast = () => {
    const newPoint = state.points;
    newPoint.pop();
    setState(prev => ({...prev, new_point: false, points: newPoint, best_order: undefined, best_distance: Infinity}));
  }

  const clickOnPoint = (index) => {
    if(state.new_point || state.run) return;
    const newPoint = state.points;
    newPoint.splice(index, 1);
    setState(prev => ({...prev, new_point: false, points: newPoint, best_order: undefined, best_distance: Infinity}));
  }

  const handleResetAll = () => {
    setState(prev => ({...prev, new_point: false, points: [], best_order: undefined, best_distance: Infinity}));
  }

  const handlePopup = () => {
    setState(prev => ({...prev, edit: !state.edit}));
  }

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setState((prev) => ({...prev, [name]: Number(value)}))
  }

  return(
    <>
    {state.edit && <Popup handleClose={handlePopup} size={state.population_size} cicles={state.given_cicles} rate={state.mutation_rate} handleOnChange={handleOnChange}/>}
    <div className="main_container">
      <div className="drawing_area"
      onMouseMove={handleMouseMove}
      onClick={handleOnClick}
      ref={positionRef}
      >
        <svg width="1024" height="512">
          {state.best_order?.length === state.points.length && state.best_order?.map((point, index) => {
            if (index < state.points.length - 1) {
              return (
                <line
                  key={index+"line"}
                  x1={point.x}
                  y1={point.y}
                  x2={state.best_order[index + 1].x}
                  y2={state.best_order[index + 1].y}
                  stroke="white"
                  strokeWidth="2"
                />
              );
            }
            return null;
          })}
        </svg>
        {state.new_point && <span className="location_point"
        style={{top: Math.floor(state.mouse_y-(state.points_size/2))+"px", 
        left: Math.floor(state.mouse_x-(state.points_size/2))+"px",
        width: state.points_size+"px",
        height: state.points_size+"px"
        }}>{"N"}</span>}
          {state.points.map((point, i) => {
            return(
              <span className="location_point"
              key={i+"point"}
              onClick={()=>clickOnPoint(i)}
              style={{top: (point.y-(state.points_size/2))+"px", 
              left: (point.x-(state.points_size/2))+"px",
              width: state.points_size+"px",
              height: state.points_size+"px"
              }}>{i}</span>
            );
          })}
      </div>
      <div className="controls_container">
        <button className={"button" + (state.new_point ? " active_button" : "")} onClick={handleAdd} disabled={state.run}>{state.new_point ? "Cancel" : "Add point"}</button>
        <button className="button" onClick={handleRamdomize} disabled={state.run}>Randomize existing</button>
        <button className="button" onClick={handleDeleteLast} disabled={state.run}>Delete last</button>
        <button className="button" onClick={handleResetAll} disabled={state.run}>Reset all</button>
        <button className="button" onClick={handlePopup} disabled={state.run}>Edit parameters</button>
      </div>
      <div className="buttons_container">
        <button className="primary_button" onClick={handleStart} disabled={state.run}>{state.run ? "Running..." : "Start test"}</button>
      </div>
      <div className="buttons_container">
        <div>{"Best: "+state.best_distance}</div>
        <div>{"Order: "+state.best_order?.map(point => point.order).toString()}</div>
      </div>
    </div>
    </>
  );
}

export default Canvas;