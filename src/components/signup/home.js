import React, { useRef } from "react";
import "./home.styles.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Chart from "../chart/chart";
import GoogleMap from "../map/map";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export const Home = () => {
  const [dataTemp, setDataTemp] = useState([]);
  const [dataTime, setDataTime] = useState([]);
  const [it, setIt] = useState(false);
  const [lat, setLat] = useState(10.7612);
  const [long, setLong] = useState(78.809);
  const [latTemp, setLatTemp] = useState();
  const [longTemp, setLongTemp] = useState();
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState("Trichy:");

  useEffect(() => {
    const func = async () => {
      const data = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m`
      );
      console.log(data.data.hourly.temperature_2m);
      console.log(data);

      setDataTemp(data.data.hourly.temperature_2m);
      setDataTime(data.data.hourly.time);
      setIt(true);
    };
    func();
  }, [lat, long]);

  useEffect(() => {
    const mega = async () => {
      const res = await axios.get("http://localhost:5000/cities");
      setCities(res.data);
    };
    mega();
  }, []);

  useEffect(() => {
    console.log("dataTime:", dataTime);
    console.log("temperatureData:", dataTemp);
  }, [dataTime, dataTemp]);
  return (
    <div className="home">
      <div className="title">
        <p>Weather Data Visualizer</p>
        <p className="cities-title">(Indian Cities)</p>
      </div>

      <div className="input">
        <input
          type="text"
          placeholder="Lat"
          value={latTemp}
          onChange={(e) => {
            if (e.target.value > 90) {
              alert("Latitude must be less than 90°N");
            } else if (e.target.value < -90) {
              alert("Latitude must be greater than -90°N");
            } else {
              setLatTemp(e.target.value);
            }
          }}
        />
        <input
          type="text"
          placeholder="Long"
          value={longTemp}
          onChange={(e) => {
            if (e.target.value > 180) {
              alert("Longitude must be less than 180°E");
            } else if (e.target.value < -180) {
              alert("Longitude must be greater than -180°E");
            } else {
              setLongTemp(e.target.value);
            }
          }}
        />
        <button
          onClick={() => {
            setCity("");
            setLat(latTemp);
            setLong(longTemp);
            setLatTemp("");
            setLongTemp("");
          }}
        >
          submit
        </button>
      </div>
      <div className="showLocation">
        {`${city}`} {lat}° N, {long}° E
      </div>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={cities}
        sx={{
          "& .MuiInputBase-input": {
            color: "white",
          },
          "& fieldset": {
            borderColor: "white",
          },
          "& label": {
            color: "white", // Change the label color here
          },
          width: "300px",
          height: "100px",
          color: "white",
          padding: "10px",
          // background: "white",
          display: "flex",
          alignItems: "center",
          outline: "white",
        }}
        renderInput={(params) => <TextField {...params} label="Cities" />}
        getOptionLabel={(option) => option.label}
        onChange={(e, coordinates) => {
          if (
            e.target.value === "" ||
            !coordinates.latitude ||
            !coordinates.longitude
          ) {
            console.log("noe");
          } else {
            setLat(coordinates.latitude);
            setLong(coordinates.longitude);
            setCity(`${coordinates.label}:`);
          }
        }}
      />
      <div className="middle-container">
        {" "}
        <GoogleMap lat={lat} long={long} />
        <Chart dataTime={dataTime} dataTemp={dataTemp} />
      </div>
    </div>
  );
};
