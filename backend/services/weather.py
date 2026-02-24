import pandas as pd
import httpx
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(levelname)s: WEATHER-MONITOR %(asctime)s %(message)s",
)
logging.getLogger("httpx").setLevel(logging.WARNING)


async def get_geocode_from_location(
    location: str, page_count: str = "10", language: str = "en", format: str = "json"
) -> list:
    """
    Returns geocode from a location.

    Args:
        location (str): The locataion whose geocode we need .
        page_count (str): Number of results to return.
        language (str): Language of the results.
        format (str): Format of the results.

    Returns:
        list: List of geolocations.
    """
    url = "https://geocoding-api.open-meteo.com/v1/search"
    params = {
        "name": location,
        "count": page_count,
        "language": language,
        "format": format,
    }
    logging.info(f"Searching geocode for: {location}")

    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        response.raise_for_status()

    return response.json().get("results", [])


async def get_weather_from_geocode(lat: float = 0, lon: float = 0) -> tuple:
    """
    Returns weather information from geocode.

    Args
        lat (float): Latitude of location.
        lon (float): Longitude of location.

    Returns:
        tuple: Tuple of current, hourly and daily weather information.
    """
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lon,
        "daily": ["weather_code", "temperature_2m_max", "temperature_2m_min"],
        "hourly": [
            "temperature_2m",
            "precipitation_probability",
            "weather_code",
            "wind_speed_10m",
            "wind_direction_10m",
        ],
        "current": [
            "temperature_2m",
            "relative_humidity_2m",
            "apparent_temperature",
            "is_day",
            "precipitation",
            "rain",
            "relative_humidity_2m",
            "snowfall",
            "weather_code",
            "wind_speed_10m",
        ],
        "timezone": "auto",
    }

    logging.info(
        f"Searching Weather information for latitude: {lat} and longitude: {lon}"
    )

    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        response.raise_for_status()
    data_json = response.json()

    # Check if the current, hourly and daily dicts contain the values we
    # expect, e.g. check if not temperature_2m, etc
    current_weather_dict = data_json.get("current", {})
    if not current_weather_dict:
        logging.error("Weather API: 'current' data is missing or empty.")

    hourly_json = data_json.get("hourly", {})
    if hourly_json:
        hourly_df = pd.DataFrame(hourly_json)
        hourly_df = hourly_df.rename(
            columns={
                "temperature_2m": "temperature",
                "precipitation_probability": "precipitation",
                "wind_speed_10m": "wind",
            }
        )
        hourly_df["time"] = hourly_df["time"].astype(str)
        hourly_weather_list = hourly_df.to_dict(orient="records")
    else:
        logging.error("Weather API: 'hourly' data is missing or empty.")
        hourly_weather_list = []

    daily_json = data_json.get("daily", {})
    if daily_json:
        daily_df = pd.DataFrame(daily_json)
        daily_df = daily_df.rename(
            columns={
                "temperature_2m_max": "temperature_max",
                "temperature_2m_min": "temperature_min",
                "precipitation_sum": "precipitation_sum",
            }
        )
        daily_df["time"] = daily_df["time"].astype(str)
        daily_weather_list = daily_df.to_dict(orient="records")
    else:
        logging.error("Weather API: 'daily' data is missing or empty.")
        daily_weather_list = []

    return current_weather_dict, hourly_weather_list, daily_weather_list
