# Weather Dashboard Application

A responsive, beginner-friendly weather dashboard built with HTML5, CSS3, and modern JavaScript. It allows users to search for a city and view its current weather conditions using the Open-Meteo API.

## Features

- City search with a clear input and search button
- Loading indicator while weather data is being fetched
- Current city, country, temperature, weather condition, description, and icon
- Humidity, wind speed, feels-like temperature, and atmospheric pressure
- Friendly validation and network error messages
- Responsive layout for desktop, tablet, and mobile devices
- Smooth transitions and hover effects
- API integration separated into reusable asynchronous functions

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- Open-Meteo Geocoding and Forecast APIs
- Fetch API and async/await
- Git and GitHub

## API Used

This project uses [Open-Meteo](https://open-meteo.com/), a free weather API with no API key requirement for the included endpoints.

### API setup

No API key is required for the Open-Meteo geocoding and forecast requests used in this project. The application sends requests directly from the browser.

If you later switch to an API that requires a key:

1. Create a `.env` file in the project root.
2. Add the key using a variable such as `WEATHER_API_KEY=your_key_here`.
3. Load the variable in a small server-side script or build step.
4. Never commit the `.env` file or real credentials to GitHub.

A secure structure would be:

```text
.env
.env.example
```

The `.env` file should contain secrets only. The `.env.example` file can safely show the variable name without a real value.

## How to Run the Project

There are no package dependencies to install.

1. Open the project folder in a code editor.
2. Start a local static web server from the project root. For example:

```bash
python3 -m http.server 8000
```

3. Open `http://localhost:8000` in your browser.

## Project Structure

```text
weather-dashboard/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── .gitignore
└── README.md
```

## Error Handling

The application handles:

- Empty search input
- Invalid or missing city names
- Cities that cannot be found
- Network or API connection failures
- Invalid API responses
- Rate-limit or authorization responses from the API

Messages are displayed in the form-status area or error panel so that users can understand what went wrong and try again.

## ES6+ Concepts Demonstrated

- `const` and `let`
- Arrow functions
- Template literals
- Destructuring
- Promises
- `async` and `await`
- `fetch()`
- `try`/`catch`/`finally`
- `URLSearchParams`
- Optional chaining
- ES modules via `type="module"`

## AI-Assisted Development

AI tools were used throughout the project to support development:

- **API integration:** AI helped select an appropriate public API, structure the request functions, and map weather codes to readable labels and icons.
- **Error identification:** AI assisted with diagnosing invalid responses, missing data, and user-facing error scenarios.
- **Git commit messages:** AI suggested clear, meaningful commit messages for each development stage.
- **Documentation:** AI helped write the project description, setup instructions, feature list, and future improvement ideas.

## Git and GitHub

Initialize the repository and publish it with the commands below:

```bash
git init
git add .
git commit -m "Initial commit - Weather Dashboard Application"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

### Suggested Commit Messages

- `Initial project setup`
- `Added weather API integration`
- `Added city search functionality`
- `Added error handling`
- `Improved responsive design`
- `Updated documentation`

## Future Improvements

- Add hourly and multi-day forecasts
- Add search suggestions while typing
- Add unit switching between Celsius and Fahrenheit
- Add dark mode
- Save recent searches in local storage
- Add automatic location detection
- Add weather charts and trend visualizations

## License

This project is intended for educational use and is provided without a specific license.
