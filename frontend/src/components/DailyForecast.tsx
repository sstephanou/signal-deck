import type { DailyWeather } from "../types";
import { getWeatherIcon } from "./weatherIcons";

interface Props {
  dailyData: DailyWeather;
  selectedDayIndex: number;
  onSelectDay: (i: number) => void;
}

export default function DailyForecast({ dailyData, selectedDayIndex, onSelectDay }: Props) {
  const getDayName = (dateStr: string, index: number) => {
    if (index === 0) return "Today";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  return (
    <div className="daily">
      {dailyData.map((day, i) => (
        <div
          key={day.time}
          className={`day ${selectedDayIndex === i ? "active" : ""}`}
          onClick={() => onSelectDay(i)}
        >
          <div className="day-name">{getDayName(day.time, i)}</div>
          <div className="day-icon">{getWeatherIcon(day.weather_code, 1)}</div>
          <div className="day-temp">
            {Math.round(day.temperature_min)}° / {Math.round(day.temperature_max)}°
          </div>
        </div>
      ))}
    </div>
  );
}
