export interface User {
  name?: string;
  email?: string;
  picture?: string;
  /** "google" for SSO users, "guest" for unauthenticated local access. */
  authType: "google" | "guest";
  /** RBAC role names assigned in backend/users.json, e.g. ["admin", "weather_viewer"]. */
  roles: string[];
  /** Resolved dashboard keys this user may access, e.g. ["weather"]. */
  permissions: string[];
}

export type WeatherTab = "temperature" | "precipitation" | "wind";

export type Location = string;

export type CurrentWeather = {
  weather_code: number;
  temperature: number | "--";
  apparent_temperature: number | "--";
  precipitation: number | "--";
  humidity: number | "--";
  wind: number | "--";
  current_day: string;
  current_time: string;
  is_day: number;
};

export type HourlyWeatherEntry = {
  time: string;
  temperature: number;
  precipitation: number;
  weather_code: number;
  wind: number;
  wind_direction_10m: number;
};

export type HourlyWeather = HourlyWeatherEntry[];

export type DailyWeatherEntry = {
  time: string;
  weather_code: number;
  temperature_max: number;
  temperature_min: number;
};

export type DailyWeather = DailyWeatherEntry[];

export interface WeatherAPIResponse {
  current: CurrentWeather;
  hourly: HourlyWeather;
  daily: DailyWeather;
}
