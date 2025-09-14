import React, { useState, useEffect } from "react";
import { getToken } from "../functions/TokenTools";
import { useParams } from "react-router-dom";
import Config from "../Config";
import { useAuth } from "../functions/AuthContext";

import PopulationDensityChart from "../components/PopulationDensityChart";
import VolcanoDetailsCard from "../components/VolcanoDetailsCard";
import VolcanoMap from "../components/VolcanoMap";

export default function VolcanoDetails() {
  const { id } = useParams();
  const { logged, handleLogout } = useAuth();
  const [volcanoDetailData, setVolcanoDetailData] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchVolcanoDetails = async () => {
      try {
        const token = getToken();
        let headers = {};
        if (logged && token) {
          headers = {
            Authorization: `Bearer ${token}`,
          };
        }
        const response = await fetch(`${Config.API_BASE_URL}/volcano/${id}`, {
          headers,
        });
        if (response.ok) {
          const data = await response.json();
          setVolcanoDetailData(data);
        } else if (response.status === 401) {
          handleLogout();
          setMessage(
            //"Token expired or invalid. Please login again or refresh."
          );
        } else {
          setMessage("Get volcano details failed");
        }
      } catch (error) {
        setMessage("Get volcano details failed");
      }
    };

    fetchVolcanoDetails();
  }, [logged, id, handleLogout]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <h5 className="card-header">
              {message && (
                <div className="alert alert-info" role="alert">
                  message: {message}
                </div>
              )}
              {volcanoDetailData && volcanoDetailData.name}
            </h5>
            <div className="card-body">
              <VolcanoDetailsCard volcanoDetailData={volcanoDetailData} />
            </div>
            <div className="card-footer"> </div>
          </div>
        </div>
        <div className="col-md-8">
          <VolcanoMap volcanoDetailData={volcanoDetailData} />
        </div>
      </div>

      {logged && volcanoDetailData && (
        <PopulationDensityChart volcanoDetailData={volcanoDetailData} />
      )}
    </div>
  );
}
