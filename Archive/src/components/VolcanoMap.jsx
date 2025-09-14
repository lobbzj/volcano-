import React from 'react';
import { Map, Marker } from 'pigeon-maps';

const VolcanoMap = ({ volcanoDetailData }) => {
  if (!volcanoDetailData) {
    return <div></div>; 
  }

  return (
    <Map
      height={300}
      defaultCenter={[
        parseFloat(volcanoDetailData.latitude),
        parseFloat(volcanoDetailData.longitude),
      ]}
      defaultZoom={10}
    >
      <Marker
        width={50}
        anchor={[
          parseFloat(volcanoDetailData.latitude),
          parseFloat(volcanoDetailData.longitude),
        ]}
      />
    </Map>
  );
};

export default VolcanoMap;