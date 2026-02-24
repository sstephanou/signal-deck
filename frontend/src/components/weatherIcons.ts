export function getWeatherIcon(code: number, isDay: number): string | [string, string] {
  const iconMap: Record<number, string | [string, string]> = {
    0: isDay ? "☀️" : "🌙",
    1: isDay ? "🌤️" : "🌙",
    2: isDay ? "⛅" : "☁️",
    3: "☁️",
    45: "🌫️",
    48: "🌁",
    51: isDay ? "🌦️" : "🌧️",
    53: "🌧️",
    55: "🌧️",
    56: "🌧️",
    57: "🌧️",
    61: "🌧️",
    63: "🌧️",
    65: "🌧️",
    66: "🌧️",
    67: "🌧️",
    71: "❄️",
    73: "❄️",
    75: "❄️",
    77: "🌨️",
    80: isDay ? "🌦️" : "🌧️",
    81: "🌧️",
    82: "🌧️",
    85: "🌨️",
    86: "🌨️",
    95: "⛈️",
    96: "⛈️",
    99: "⛈️",
  };

  return iconMap[code] ?? "❓";
}

export function getWeatherDescription(code: number) {
  if (code === 0) return "Sunny";
  if (code < 3) return "Partly Cloudy";
  if (code < 60) return "Cloudy";
  if (code < 70) return "Rainy";
  return "Snowy";
}
