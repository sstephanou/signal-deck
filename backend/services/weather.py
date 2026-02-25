import httpx
import logging

logger = logging.getLogger(__name__)

HOURLY_FIELD_RENAMES = {
    "temperature_2m": "temperature",
    "precipitation_probability": "precipitation",
    "wind_speed_10m": "wind",
}

DAILY_FIELD_RENAMES = {
    "temperature_2m_max": "temperature_max",
    "temperature_2m_min": "temperature_min",
}


def _rename_keys(data: dict, mapping: dict) -> dict:
    """Return a copy of data with keys renamed according to mapping.
    Keys not in mapping are kept as-is.
    """
    return {mapping.get(k, k): v for k, v in data.items()}


async def get_geocode_from_location(
    location: str,
    page_count: str = "10",
    language: str = "en",
    response_format: str = "json",
) -> list:
    """
    Returns geocode from a location.

    Args:
        location (str): The location whose geocode we need.
        page_count (str): Number of results to return.
        language (str): Language of the results.
        response_format (str): Format of the results.

    Returns:
        list: List of geolocations.
    """
    url = "https://geocoding-api.open-meteo.com/v1/search"
    params = {
        "name": location,
        "count": page_count,
        "language": language,
        "response_format": response_format,
    }
    logger.info(f"Searching geocode for: {location}")

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
            "snowfall",
            "weather_code",
            "wind_speed_10m",
        ],
        "timezone": "auto",
    }

    logger.info(
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
        logger.error("Weather API: 'current' data is missing or empty.")

    hourly_json = data_json.get("hourly", {})
    if hourly_json and "time" in hourly_json:
        n_hours = len(hourly_json["time"])
        hourly_weather_list = [
            _rename_keys(
                {col: values[i] for col, values in hourly_json.items()},
                HOURLY_FIELD_RENAMES,
            )
            for i in range(n_hours)
        ]
    else:
        logger.error("Weather API: 'hourly' data is missing or empty.")
        hourly_weather_list = []

    daily_json = data_json.get("daily", {})
    if daily_json and "time" in daily_json:
        n_days = len(daily_json["time"])
        daily_weather_list = [
            _rename_keys(
                {col: values[i] for col, values in daily_json.items()},
                DAILY_FIELD_RENAMES,
            )
            for i in range(n_days)
        ]
    else:
        logger.error("Weather API: 'daily' data is missing or empty.")
        daily_weather_list = []

    return current_weather_dict, hourly_weather_list, daily_weather_list
