import random


def get_current_weather(location, unit="fahrenheit"):
    if unit == "celsius":
        temperature = random.randint(-34, 43)
    else:
        temperature = random.randint(-30, 110)

    print('GET_CURRENT_WEATHER', temperature, unit, location)
    return {
        "temperature": temperature,
        "unit": unit,
        "location": location,
    }