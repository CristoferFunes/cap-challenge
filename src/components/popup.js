import React from 'react';

const Popup = (props) => {
  return (
    <div className="popup_background" onClick={props.handleClose}>
      <div className="popup_content" onClick={(e)=>e.stopPropagation()}>
        <div className='options_container'>
          <div className='best_container'>
            <label>Population size</label>
            <input className="input_number" value={props.size} name="population_size" onChange={props.handleOnChange} type="number"></input>
          </div>
          <div className='best_container'>
            <label>Mutation rate</label>
            <input className="input_number" value={props.rate} name="mutation_rate" step={0.01} onChange={props.handleOnChange} type="number"></input>
          </div>
          <div className='best_container'>
            <label>Cicles</label>
            <input className="input_number" value={props.cicles} name="given_cicles" step={0.01} onChange={props.handleOnChange} type="number"></input>
          </div>
        </div>
        <div className='options_container'>
          <button className='button' onClick={props.handleClose}>Accept</button>
        </div>
      </div>
    </div>
  );
};

export default Popup;