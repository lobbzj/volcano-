import React from "react";
import VolcanosTable from "../components/VolcanosTable";
import { useState, useEffect } from "react";
import Config from "../Config";

export default function VolcanoList() {
  const [country, setCountry] = useState("");
  const [distance, setDistance] = useState("");
  const [data, setData] = useState([]);
  const [countries, setCountries] = useState([]);
  useEffect(() => {
    fetch(`${Config.API_BASE_URL}/countries`)
      .then((response) => response.json())
      .then((countries) => {
        setCountries(countries);
        if (countries.length > 0) {
          setCountry(countries[0]);
          fetchList(countries[0]);
        }
      });
  }, []);

  function fetchList(country) {
    if (country) {
      fetch(
        `${Config.API_BASE_URL}/volcanoes?country=${country}&populatedWithin=${distance}`
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((data) => setData(data))
        .catch((error) => {
          setCountry("");
          setDistance("");
        });
    }
  }

  function handleSearch(event) {
    event.preventDefault();
    fetchList(country);
  }

  return (
    <div className="container  ">
      <div className="row">
        <div className="col-md-12">
          <form onSubmit={handleSearch}>
            <label>Country:</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              {countries.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </select>
            <label>Populated Within:</label>
            <select
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
            >
              <option value="">-</option>
              <option value="5km">5km</option>
              <option value="10km">10km</option>
              <option value="30km">30km</option>
              <option value="100km">100km</option>
            </select>
            <button type="submit">search</button>
          </form>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <VolcanosTable data={data} />
        </div>
      </div>
    </div>
  );
}
