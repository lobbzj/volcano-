import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  
const PopulationDensityChart = ({ volcanoDetailData }) => {

    const chartData = {
        labels: ["5km", "10km", "30km", "100km"],
        datasets: [
          {
            label: "Population",
            backgroundColor: "rgba(75,192,192,1)",
            borderColor: "rgba(0,0,0,1)",
            borderWidth: 2,
            data: [
              volcanoDetailData?.population_5km || 0,
              volcanoDetailData?.population_10km || 0,
              volcanoDetailData?.population_30km || 0,
              volcanoDetailData?.population_100km || 0,
            ],
          },
        ],
      };
      const options = {
        responsive: true,
        scales: {
          x: {
            scaleLabel: {
              display: true,
              labelString: 'Month'  
            }
          },
          y: {
            scaleLabel: {
              display: true,
              labelString: 'Value'
            }
          }
        },
        title: {
            display: true,
            text: "Populations",
            fontSize: 20,
          },
          legend: {
            display: true,
            position: "right",
          },
      };
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12 text-center" style={{ marginTop: "20px" }}>
          <h3>Population density</h3>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div
            style={{
              marginTop: "20px",
              marginBottom: "20px",
              width: "800px",
              height: "400px",
              margin: "0 auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Bar
              data={chartData}
              options={ options}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopulationDensityChart;