import React from 'react';

const VolcanoDetailsCard = ({ volcanoDetailData }) => {
  if (!volcanoDetailData) {
    return <div><p>No volcano data available.</p></div>;
  }

  return (
    <div className="card">
      <div className="card-body">
        <p className="card-text">Country: {volcanoDetailData.country}</p>
        <p className="card-text">Region: {volcanoDetailData.region}</p>
        <p className="card-text">Subregion: {volcanoDetailData.subregion}</p>
        <p className="card-text">Last Eruption: {volcanoDetailData.last_eruption}</p>
        <p className="card-text">Summit: {volcanoDetailData.summit} m</p>
        <p className="card-text">Elevation: {volcanoDetailData.elevation} ft</p>
      </div>  
    </div>
  );
};

export default VolcanoDetailsCard;