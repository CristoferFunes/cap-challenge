import React, { useState } from "react";

const LocationPoint = () => {

  const [state, setState] = useState({
    points: []
  });

  return(
    <>
      <span className="location_point"></span>
    </>
  );
}

export default LocationPoint;