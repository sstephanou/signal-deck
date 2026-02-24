import type { WeatherTab, HourlyWeather, DailyWeather } from "../types";

interface Props {
  activeTab: WeatherTab;
  selectedDayIndex: number;
  hourlyData: HourlyWeather;
  dailyData: DailyWeather;
}

export default function HourlyChart({ activeTab, selectedDayIndex, hourlyData, dailyData }: Props) {
  // 1. Find the date string for the selected day (e.g., "2026-02-15")
  const selectedDate = dailyData[selectedDayIndex]?.time;

  // 2. Filter hourly data for that day (expect up to 24 points)
  const fullDay = hourlyData.filter((item) => item.time.startsWith(selectedDate));

  // Rotate so the chart starts at 03:00 if present; otherwise use whatever sequence we have.
  let displayData = fullDay.slice();

  // Detect whether the hourly dataset contains real values (not just placeholders)
  const hasRealValues = hourlyData.some((d) => {
    return (
      (typeof d.temperature === 'number' && d.temperature !== 0) ||
      (d.precipitation != null && d.precipitation !== 0) ||
      (d.wind != null && d.wind !== 0) ||
      (d.weather_code != null && d.weather_code !== 0)
    );
  });

  // If this is Today and we have real values, start at the current hour and show the next 21 hours
  if (selectedDayIndex === 0 && hasRealValues) {
    const now = new Date();
    const currentHour = now.getHours();

    const globalIdx = hourlyData.findIndex((d) => {
      const [date, time] = d.time.split("T");
      const h = Number(time.slice(0, 2));
      return date === selectedDate && h === currentHour;
    });

    if (globalIdx !== -1) {
      const end = Math.min(hourlyData.length, globalIdx + 22);
      displayData = hourlyData.slice(globalIdx, end);
    } else {
      // fallback to rotating the day's hours to start at 03:00
      if (fullDay.length >= 24) {
        const idx3 = fullDay.findIndex((d) => Number(d.time.split("T")[1].slice(0, 2)) === 3);
        if (idx3 !== -1) displayData = fullDay.slice(idx3).concat(fullDay.slice(0, idx3));
      }
    }
  } else {
    // Default behavior: rotate so the chart starts at 03:00 if present
    if (fullDay.length >= 24) {
      const idx3 = fullDay.findIndex((d) => {
        const h = Number(d.time.split("T")[1].slice(0, 2));
        return h === 3;
      });
      if (idx3 !== -1) displayData = fullDay.slice(idx3).concat(fullDay.slice(0, idx3));
    }
  }

  if (displayData.length === 0) return null;

  // Helper to extract hour number and formatted label
  const getHour = (timeStr: string) => Number(timeStr.split("T")[1].slice(0, 2));
  const getHourLabel = (timeStr: string) => `${getHour(timeStr).toString().padStart(2, "0")}:00`;

  // Determine whether to show labels/values for a given index: show every 3 positions
  const shouldShowLabel = (_timeStr: string, idx: number) => idx % 3 === 0;

  const values = displayData.map((d) => d[activeTab]);
  const max = Math.max(...values);
  const min = Math.min(...values);

  // Add small padding to temp range so tiny variations don't create large vertical swings
  const padding = Math.max(2, (max - min) * 0.2);
  const tempMin = min - padding;
  const tempMax = max + padding;
  const verticalSpan = 50; // controls how tall the temperature area is

  return (
    <div className="hourly">
      {activeTab === "temperature" && (
        <>
          <svg className="temp-simple-line" width="100%" height="80" viewBox="0 0 100 80" preserveAspectRatio="none">
            <polygon
              fill="rgba(250,204,21,0.18)"
              points={displayData.map((d, i) => {
                const x = (i / (displayData.length - 1)) * 100;
                const y = 80 - ((d.temperature - tempMin) / (tempMax - tempMin || 1) * verticalSpan);
                return `${x},${y}`;
              }).join(' ') + ` 100,80 0,80`}
            />
            <polyline
              fill="none"
              stroke="#facc15" strokeWidth="0.5"
              points={displayData.map((d, i) => {
                const x = (i / (displayData.length - 1)) * 100;
                const y = 80 - ((d.temperature - tempMin) / (tempMax - tempMin || 1) * verticalSpan);
                return `${x},${y}`;
              }).join(' ')}
            />
          </svg>
          <div className="hourly-flex-row temp-values">
            {displayData.map((d, i) => (
              <div key={i} className="temp-value">
                {shouldShowLabel(d.time, i) ? `${d.temperature.toFixed(0)}°` : ""}
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === "precipitation" && (
        <>
          <div className="hourly-flex-row precip-bars">
            {displayData.map((d, i) => {
              const isZero = (d.precipitation ?? 0) === 0;
              const height = isZero ? 4 : (d.precipitation / 100) * 60 + 10;
              return (
                <div key={i} className="precip-bar-wrapper">
                  <div className={`precip-bar ${isZero ? 'precip-zero' : ''}`} style={{ height: `${height}px` }} />
                </div>
              );
            })}
          </div>

          <div className="hourly-flex-row precip-values">
            {displayData.map((d, i) => (
              <div key={i} className="precip-value">{shouldShowLabel(d.time, i) ? `${d.precipitation.toFixed(0)}%` : ""}</div>
            ))}
          </div>
        </>
      )}

      {activeTab === "wind" && (
        <>
          <div className="hourly-flex-row wind-values">
            {displayData.map((d, i) => (
              <div key={i} className="wind-value">
                {shouldShowLabel(d.time, i) ? (
                  <>
                    <span className="wind-speed">{d.wind.toFixed(0)}</span>
                    <span className="wind-unit">mph</span>
                  </>
                ) : ""}
              </div>
            ))}
          </div>

          <div className="hourly-flex-row wind-arrows">
            {displayData.map((d, i) => (
              <div key={i} className="wind-arrow-cell">
                {shouldShowLabel(d.time, i) && typeof d.wind_direction_10m === 'number' ? (
                  <div className="wind-arrow" style={{ transform: `rotate(${d.wind_direction_10m}deg)` }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M12 2 L19 12 L13 12 L13 22 L11 22 L11 12 L5 12 Z" fill="currentColor" />
                    </svg>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Shared Time Labels */}
      <div className="hourly-flex-row hour-labels">
        {displayData.map((d, i) => (
          <div key={i} className="hour-label">{shouldShowLabel(d.time, i) ? getHourLabel(d.time) : ""}</div>
        ))}
      </div>
    </div>
  );
}
