import React, { useEffect, useState } from "react";
import geocoding from "../services/geocoding";
import partlyCloudyDay from "../public/icons/partly-cloudy-day.png";
import partlyCloudyNight from "../public/icons/partly-cloudy-night.png";
import clearDay from "../public/icons/clear-day.png";
import clearNight from "../public/icons/clear-night.png";
import cloudy from "../public/icons/cloudy.png";
import fog from "../public/icons/fog.png";
import hail from "../public/icons/hail.png";
import rainSnowShowersDay from "../public/icons/rain-snow-showers-day.png";
import rainSnowShowersNight from "../public/icons/rain-snow-showers-night.png";
import rainSnow from "../public/icons/rain-snow.png";
import rain from "../public/icons/rain.png";
import showersDay from "../public/icons/showers-day.png";
import showersNight from "../public/icons/showers-night.png";
import sleet from "../public/icons/sleet.png";
import snowShowersDay from "../public/icons/snow-showers-day.png";
import snowShowersNight from "../public/icons/snow-showers-night.png";
import snow from "../public/icons/snow.png";
import thunderRain from "../public/icons/thunder-rain.png";
import thunderShowersDay from "../public/icons/thunder-showers-day.png";
import thunderShowersNight from "../public/icons/thunder-showers-night.png";
import thunder from "../public/icons/thunder.png";
import wind from "../public/icons/wind.png";

const iconMap = {
  "partly-cloudy-day": partlyCloudyDay,
  "partly-cloudy-night": partlyCloudyNight,
  "clear-day": clearDay,
  "clear-night": clearNight,
  cloudy: cloudy,
  fog: fog,
  hail: hail,
  "rain-snow-showers-day": rainSnowShowersDay,
  "rain-snow-showers-night": rainSnowShowersNight,
  "rain-snow": rainSnow,
  rain: rain,
  "showers-day": showersDay,
  "showers-night": showersNight,
  sleet: sleet,
  "snow-showers-day": snowShowersDay,
  "snow-showers-night": snowShowersNight,
  snow: snow,
  "thunder-rain": thunderRain,
  "thunder-showers-day": thunderShowersDay,
  "thunder-showers-night": thunderShowersNight,
  thunder: thunder,
  wind: wind,
};

const Weather = () => {
  const [queryLocation, setQueryLocation] = useState("");
  const [resolvedAddress, setResolvedAddress] = useState("");
  const [weatherData, setWeatherData] = useState({}); // Initialize as an empty object
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");

  const handleInputChange = (value) => {
    setInput(value);
  };

  const API_CONFIG = {
    BASE_URI:
      "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline",
    KEY: "98MLY5YPF6K4TKDJ94V5DKLPR",
  };

  const search = (query) => {
    setQueryLocation(query);
  };

  useEffect(() => {
    if (!input && !queryLocation) {
      setIsLoading(true);
      getLocationDetails();
    }
  }, [input, queryLocation]);

  useEffect(() => {
    if (queryLocation) {
      getWeatherDetails();
    }
  }, [queryLocation]);

  const getLocationDetails = async () => {
    if (navigator.geolocation && !input) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude.toFixed(4);
        const long = position.coords.longitude.toFixed(4);
        setQueryLocation(`${lat},${long}`);
        const address = await geocoding(lat, long);
        setResolvedAddress(address);
      });
    }
  };

  const getWeatherDetails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URI}/${queryLocation}/today/next7days?key=${API_CONFIG.KEY}&unitGroup=metric`
      );
      const data = await response.json();
      console.log(data);
      setWeatherData(data);
    } catch (e) {
      console.error("Error fetching weather details: ", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="justify-center flex items-center">
        <input
          type="text"
          className="w-1/5 border-b-3 border-b-gray-500 rounded-[0 16px 0 16px] outline-none"
          placeholder="Location..."
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              search(input);
              setResolvedAddress(input);
            }
          }}
        ></input>
      </div>
      <div className="flex flex-col justify-center items-center mt-20">
        {isLoading ? (
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          ></div>
        ) : (
          <>
            <div className="flex flex-col justify-center items-center">
              <div className="font-semibold text-3xl">{resolvedAddress}</div>
              {weatherData.currentConditions ? (
                // Check if currentConditions exists
                <>
                  <p className="text-lg mt-5 ">
                    {weatherData.currentConditions.conditions}
                  </p>
                  <div className="flex flex-row justify-center items-center mt-7">
                    <p className="text-6xl">
                      {weatherData.currentConditions.temp}°C
                    </p>
                    <img
                      src={iconMap[weatherData.currentConditions.icon]}
                      alt={weatherData.currentConditions.icon || "default"}
                      className="size-25"
                    />
                  </div>
                </>
              ) : (
                <p className="text-lg mt-5">No weather data available</p>
              )}
            </div>
            <p className="mt-10 text-lg font-bold">7-Day Forecast</p>
            <div className="flex flex-row overflow-auto scroll-smooth shrink-0 flex-nowrap">
              {weatherData.days ? (
                weatherData.days.map((day) => (
                  <div className="p-13 flex justify-center flex-col flex-nowrap items-center">
                    <p className="font-[700]">{day.datetime}</p>
                    <p className="">{day.conditions}</p>
                    <img src={iconMap[day.icon]} />
                    <p className="text-3xl font-bold">{day.temp}°C</p>
                  </div>
                ))
              ) : (
                <></>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Weather;
