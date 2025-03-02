import React, { useState, useEffect } from "react";
import searchImage from "../assets/search.png";
import clear from "../assets/clear.png";
import cloud from "../assets/cloud.png";
import drizzle from "../assets/drizzle.png";
import rain from "../assets/rain.png";
import snow from "../assets/snow.png";
import wind from "../assets/wind.png";
import humidity from "../assets/humidity.png";
import "./weather.css";

const Weather = () => {
  const [city, setCity] = useState(""); // State for city input
  const [weatherData, setWeatherData] = useState(null); // State for weather data

  const allIcons = {
    "01d": clear,
    "01n": clear,
    "02d": cloud,
    "02n": cloud,
    "03d": cloud,
    "03n": cloud,
    "04d": drizzle,
    "04n": drizzle,
    "09d": rain,
    "09n": rain,
    "10d": rain,
    "10n": rain,
    "13d": snow,
    "13n": snow,
  };

  const search = async (city) => {
    const API = import.meta.env.VITE_APP_API_ID;

    if (!API) {
      console.error("API key is missing! Check your .env file.");
      return;
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API}&units=metric`;
      console.log("Fetching from:", url);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Fix: Correct the API response handling
      const iconCode = data.weather[0].icon;
      const icon = allIcons[iconCode] || clear;

      setWeatherData({
        humidity: data.main.humidity,
        wind: data.wind.speed,
        temperature: data.main.temp,
        country: data.sys.country,
        icon: icon,
      });

      console.log("Weather Data:", data);
    } catch (error) {
      console.error("Error fetching weather data:", error.message);
    }
  };

  const handleInputChange = (event) => {
    setCity(event.target.value);
  };

  useEffect(() => {
    search("London"); // Default search
  }, []);

  return (
    <div className="weather">
      <h1>WEATHER</h1>
      <div className="searchbar">
        <input
          type="text"
          placeholder="Enter your city"
          value={city}
          onChange={handleInputChange}
          aria-label="City name input"
        />
        <img
          src={searchImage}
          alt="Search"
          onClick={() => search(city)}
          style={{ cursor: "pointer" }}
        />
      </div>

      {weatherData && (
        <>
          <img src={weatherData.icon} alt="Weather Icon" />
          <h1>{Math.round(weatherData.temperature)}&deg;C</h1>
          <h1>{weatherData.country}</h1>
          <div className="humidity">
            <img src={humidity} alt="Humidity" />
            <h1>{weatherData.humidity}%</h1>
          </div>
          <div className="wind">
            <img src={wind} alt="Wind" />
            <h1>{weatherData.wind} m/s</h1>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;
