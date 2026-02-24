from services.weather import get_geocode_from_location, get_weather_from_geocode
from fastapi import APIRouter, HTTPException
from datetime import datetime
import logging

router = APIRouter()

logging.basicConfig(
    level=logging.INFO,
    format="%(levelname)s: WEATHER-API %(asctime)s %(message)s",
)


# e.g. http://127.0.0.1:8000/weather/data?location=__LOCATION__
# fix type of output of function
@router.get("/data")
async def get_weather_current(location: str) -> dict:
    """
    Returns current weather information for a location.

    Args:
        location (str): The locataion whose geocode we need .

    Returns:
        dict: JSON object of current weather information for a specific location.
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
                "temperature": round(current.get("temperature_2m")),
                "apparent_temperature": round(current.get("apparent_temperature")),
                "precipitation": current.get("precipitation"),
                "humidity": current.get("relative_humidity_2m"),
                "wind": round(current.get("wind_speed_10m")),
                "current_day": now.strftime("%A"),
                "current_time": now.strftime("%H:%M"),
            },
            "hourly": hourly,
            "daily": daily,
        }

    except HTTPException:
        raise  # Pass our 404 through
    except Exception as e:
        logging.error(f"Failed to fetch weather for {location}. Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
