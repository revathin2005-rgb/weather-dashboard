const API_BASE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_BASE_URL = "https://api.open-meteo.com/v1/forecast";

const form = document.querySelector("#search-form");
const cityInput = document.querySelector("#city-input");
const formMessage = document.querySelector("#form-message");
const loadingState = document.querySelector("#loading-state");
const errorState = document.querySelector("#error-state");
const weatherCard = document.querySelector("#weather-card");
const searchButton = document.querySelector(".search-button");

const weatherElements = {
  cityName: document.querySelector("#city-name"),
  countryName: document.querySelector("#country-name"),
  temperature: document.querySelector("#temperature"),
  condition: document.querySelector("#weather-condition"),
  description: document.querySelector("#weather-description"),
  icon: document.querySelector("#weather-icon"),
  humidity: document.querySelector("#humidity"),
  windSpeed: document.querySelector("#wind-speed"),
  feelsLike: document.querySelector("#feels-like"),
  pressure: document.querySelector("#pressure"),
};

const weatherCodes = {
  0: { label: "Clear sky", icon: "☀️" },
  1: { label: "Mainly clear", icon: "🌤️" },
  2: { label: "Partly cloudy", icon: "⛅" },
  3: { label: "Overcast", icon: "☁️" },
  45: { label: "Fog", icon: "🌫️" },
  48: { label: "Rime fog", icon: "🌫️" },
  51: { label: "Light drizzle", icon: "🌦️" },
  53: { label: "Drizzle", icon: "🌦️" },
  55: { label: "Heavy drizzle", icon: "🌧️" },
  56: { label: "Freezing drizzle", icon: "🌧️" },
  57: { label: "Heavy freezing drizzle", icon: "🌧️" },
  61: { label: "Light rain", icon: "🌦️" },
  63: { label: "Rain", icon: "🌧️" },
  65: { label: "Heavy rain", icon: "🌧️" },
  66: { label: "Freezing rain", icon: "🌧️" },
  67: { label: "Heavy freezing rain", icon: "🌧️" },
  71: { label: "Light snow", icon: "🌨️" },
  73: { label: "Snow", icon: "❄️" },
  75: { label: "Heavy snow", icon: "❄️" },
  77: { label: "Snow grains", icon: "❄️" },
  80: { label: "Rain showers", icon: "🌦️" },
  81: { label: "Heavy rain showers", icon: "🌧️" },
  82: { label: "Violent rain showers", icon: "⛈️" },
  85: { label: "Snow showers", icon: "🌨️" },
  86: { label: "Heavy snow showers", icon: "❄️" },
  95: { label: "Thunderstorm", icon: "⛈️" },
  96: { label: "Thunderstorm with hail", icon: "⛈️" },
  99: { label: "Severe thunderstorm", icon: "⛈️" },
};

const setStatusMessage = (message, type = "") => {
  formMessage.textContent = message;
  formMessage.classList.toggle("error", type === "error");
};

const setLoadingState = (isLoading) => {
  searchButton.disabled = isLoading;
  searchButton.classList.toggle("loading", isLoading);
  loadingState.classList.toggle("hidden", !isLoading);
  weatherCard.classList.add("hidden");
  errorState.classList.add("hidden");
};

const showWeather = (weather) => {
  const { city, country, temperature, condition, description, icon, humidity, windSpeed, feelsLike, pressure } = weather;

  weatherElements.cityName.textContent = city;
  weatherElements.countryName.textContent = country;
  weatherElements.temperature.textContent = `${temperature}°C`;
  weatherElements.condition.textContent = condition;
  weatherElements.description.textContent = description;
  weatherElements.icon.textContent = icon;
  weatherElements.icon.setAttribute("aria-label", condition);
  weatherElements.humidity.textContent = `${humidity}%`;
  weatherElements.windSpeed.textContent = `${windSpeed} km/h`;
  weatherElements.feelsLike.textContent = `${feelsLike}°C`;
  weatherElements.pressure.textContent = `${pressure} hPa`;

  weatherCard.classList.remove("hidden");
};

const showError = (message) => {
  errorState.textContent = message;
  errorState.classList.remove("hidden");
};

const buildForecastUrl = ({ latitude, longitude, timezone }) => {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: "temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,pressure_msl,wind_speed_10m",
    timezone,
  });

  return `${FORECAST_BASE_URL}?${params}`;
};

const getWeatherCodeDetails = (code) => {
  const fallback = { label: "Weather conditions", icon: "🌤️" };
  return weatherCodes[code] ?? fallback;
};

const getCoordinates = async (city) => {
  const params = new URLSearchParams({
    name: city,
    count: "1",
    language: "en",
    format: "json",
  });

  const response = await fetch(`${API_BASE_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`Location search failed with status ${response.status}.`);
  }

  const data = await response.json();

  if (!data?.results?.length) {
    throw new Error("No location matched your search. Please try another city.");
  }

  const [location] = data.results;
  const { name, country, latitude, longitude, timezone } = location;

  return { name, country, latitude, longitude, timezone };
};

const getWeatherForecast = async ({ latitude, longitude, timezone }) => {
  const response = await fetch(buildForecastUrl({ latitude, longitude, timezone }));

  if (!response.ok) {
    const errorMessage = response.status === 401
      ? "The weather service rejected the request. Please check your API configuration."
      : response.status === 429
        ? "The weather service is rate-limiting requests. Please wait a moment and try again."
        : `Weather data request failed with status ${response.status}.`;

    throw new Error(errorMessage);
  }

  const data = await response.json();

  if (!data?.current) {
    throw new Error("The weather service returned an invalid response. Please try again.");
  }

  const { temperature_2m, apparent_temperature, relative_humidity_2m, pressure_msl, wind_speed_10m, weather_code } = data.current;
  const codeDetails = getWeatherCodeDetails(weather_code);

  return {
    temperature: Math.round(temperature_2m),
    feelsLike: Math.round(apparent_temperature),
    humidity: Math.round(relative_humidity_2m),
    pressure: Math.round(pressure_msl),
    windSpeed: Math.round(wind_speed_10m),
    condition: codeDetails.label,
    description: codeDetails.label,
    icon: codeDetails.icon,
  };
};

const fetchWeatherForCity = async (city) => {
  const location = await getCoordinates(city);
  const forecast = await getWeatherForecast(location);

  return {
    city: location.name,
    country: location.country,
    ...forecast,
  };
};

const handleWeatherSearch = async (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();

  if (!city) {
    setStatusMessage("Please enter a city name before searching.", "error");
    cityInput.focus();
    return;
  }

  setStatusMessage("");
  setLoadingState(true);

  try {
    const weather = await fetchWeatherForCity(city);
    showWeather(weather);
    setStatusMessage(`Showing weather for ${weather.city}.`);
  } catch (error) {
    showError(error?.message || "Unable to load weather data. Please try again.");
  } finally {
    setLoadingState(false);
  }
};

form.addEventListener("submit", handleWeatherSearch);

setStatusMessage("Search for a city to view its current weather.");
