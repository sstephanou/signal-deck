import { useState } from "react";
import type { WeatherTab, Location, CurrentWeather, HourlyWeather, DailyWeather, WeatherAPIResponse } from "./types";
import WeatherHeader from "./components/WeatherHeader";
import WeatherTabs from "./components/WeatherTabs";
import HourlyChart from "./components/HourlyChart";
import DailyForecast from "./components/DailyForecast";

const defaultCurrentWeather: CurrentWeather = {
  weather_code: 0, temperature: 0, apparent_temperature: 0,
  precipitation: 0, humidity: 0, wind: 0,
  current_day: "Monday", current_time: "00:00",
  is_day: 1,
};

function makeDateString(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function generateDefaultHourly(baseDate: Date): HourlyWeather {
  const dateStr = makeDateString(baseDate);
  const arr: HourlyWeather = [];
  for (let h = 0; h < 24; h++) {
    arr.push({
      time: `${dateStr}T${h.toString().padStart(2, "0")}:00`,
      temperature: 0,
      precipitation: 0,
      weather_code: 0,
      wind: 0,
      wind_direction_10m: 0,
    });
  }
  return arr;
}

function generateDefaultDaily(startDate: Date): DailyWeather {
  const out: DailyWeather = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    out.push({
      time: makeDateString(d),
      weather_code: 0,
      temperature_max: 0,
      temperature_min: 0,
    });
  }
  return out;
}

function Dashboard() {
  const [activeTab, setActiveTab] = useState<WeatherTab>("temperature");
  const [selectedDay, setSelectedDay] = useState(0);
  const [location, setLocation] = useState<Location | null>(null);
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather>(defaultCurrentWeather);
  const [hourlyWeather, setHourlyWeather] = useState<HourlyWeather>(() => generateDefaultHourly(new Date()));
  const [dailyWeather, setDailyWeather] = useState<DailyWeather>(() => generateDefaultDaily(new Date()));

  const fetchWeather = async (loc: string) => {
    try {
      const response = await fetch(`/weather/data?location=${encodeURIComponent(loc)}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: WeatherAPIResponse = await response.json();
      if (!data?.current || !data?.hourly || !data?.daily) {
        throw new Error("Invalid response shape from weather API");
      }
      setLocation(loc);
      setSelectedDay(0);
      setCurrentWeather(data.current);
      setHourlyWeather(data.hourly);
      setDailyWeather(data.daily);
    } catch (error) {
      console.error("Failed to fetch weather:", error);
    }
  };

  return (
    <div className="weather-card">
      <WeatherHeader currentWeather={currentWeather} location={location ?? undefined} onSearch={fetchWeather} />
      <WeatherTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Only render charts if we have data */}
      {hourlyWeather.length > 0 && (
        <HourlyChart
          activeTab={activeTab}
          selectedDayIndex={selectedDay}
          hourlyData={hourlyWeather}
          dailyData={dailyWeather}
        />
      )}

      <DailyForecast
        dailyData={dailyWeather}
        selectedDayIndex={selectedDay}
        onSelectDay={setSelectedDay}
      />
    </div>
  );
}

export default function App() {
  return (
    <div className="app-root">
      <Dashboard />
    </div>
  );
}
