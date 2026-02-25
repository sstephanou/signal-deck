import { getWeatherIcon, getWeatherDescription } from "./weatherIcons";
import type { CurrentWeather, Location } from "../types";
import React, { useState } from "react";

type Props = {
  currentWeather: CurrentWeather;
  location?: Location;
  onSearch: (location: string) => void;
};

export default function WeatherHeader({currentWeather, location, onSearch}: Props) {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      onSearch(input.trim());
    }
  };

  return (
    <div className="header-redesign">
      <div className="header-main-row">
        <div className="header-icon-temp-metrics">
          <div className="header-icon">
            <div className="header-title">Weather</div>
            <div className="big-weather-icon">{getWeatherIcon(currentWeather.weather_code, currentWeather.is_day)}</div>
          </div>
          <div className="header-temp">
            <div className="big-temperature">{currentWeather.temperature}°C</div>
            <div className="feels-like-temperature">Feels like: {currentWeather.apparent_temperature}°C</div>
          </div>
          <div className="header-metrics-vertical">
            <div className="header-metric">Precipitation: {currentWeather.precipitation} mm</div>
            <div className="header-metric">Humidity: {currentWeather.humidity}%</div>
            <div className="header-metric">Wind: {currentWeather.wind} km/h</div>
          </div>
        </div>
          <div className="header-daytime">
          <input
            className="header-location-input"
            placeholder="Enter city…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="City name"
          />
          {location && <div className="header-location">{location}</div>}
          <div className="header-day">{currentWeather.current_day}</div>
          <div className="header-time">{currentWeather.current_time}</div>
          <div className="header-weather-description">{getWeatherDescription(currentWeather.weather_code)}</div>
        </div>
      </div>
    </div>
  );
}
