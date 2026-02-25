from services.weather import get_geocode_from_location, get_weather_from_geocode
from fastapi import APIRouter, HTTPException
from datetime import datetime
import logging

router = APIRouter()

logger = logging.getLogger(__name__)


def _safe_get(value):
    return value if value is not None else "--"


def _safe_round(value):
    return round(value) if value is not None else "--"


# e.g. http://127.0.0.1:8000/weather/data?location=__LOCATION__
# fix type of output of function
@router.get("/data")
async def get_weather_dashboard(location: str) -> dict:
    """
    Returns weather information (current, hourly, and daily)
    for a location.

    Args:
        location (str): The location whose geocode we need.

    Returns:
        dict: JSON object containing current, hourly, and daily
        weather information for a specific location.
    """
    try:
        location_results = await get_geocode_from_location(
            location=location, page_count="1"
        )
        if not location_results:
            raise HTTPException(
                status_code=404, detail=f"Location '{location}' not found"
            )

        city_data = location_results[0]
        lat, lon = city_data.get("latitude"), city_data.get("longitude")
        current, hourly, daily = await get_weather_from_geocode(lat=lat, lon=lon)

        now = datetime.now()

        # FIX: Need to be careful of timezone for the time
        return {
            "current": {
                "weather_code": current.get("weather_code"),
                "temperature": _safe_round(current.get("temperature_2m")),
                "apparent_temperature": _safe_round(
                    current.get("apparent_temperature")
                ),
                "precipitation": _safe_get(current.get("precipitation")),
                "humidity": _safe_get(current.get("relative_humidity_2m")),
                "wind": _safe_round(current.get("wind_speed_10m")),
                "is_day": current.get("is_day", 1),
                "current_day": now.strftime("%A"),
                "current_time": now.strftime("%H:%M"),
            },
            "hourly": hourly,
            "daily": daily,
        }

    except HTTPException:
        raise  # Pass our 404 through
    except Exception as e:
        logger.error(f"Failed to fetch weather for {location}. Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
