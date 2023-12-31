function getWeather() {
    const apiKey ='de2b53dbc2927b9e20daa4d7a6e0eb50';
    const locationInput = document.getElementById('location');
    const location = locationInput.value;

    if (location === '') {
        // If the location input is empty, try to get the current location
        getCurrentLocation();
    } else {
        // If the location input is not empty, fetch weather for the specified location
        fetchWeather(location);
    }
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                fetchWeatherByCoords(latitude, longitude);
            },
            error => {
                console.error('Error getting current location:', error.message);
                alert('Error getting current location. Please enter a location manually.');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser. Please enter a location manually.');
    }
}

function fetchWeatherByCoords(latitude, longitude) {
    const apiKey = 'de2b53dbc2927b9e20daa4d7a6e0eb50';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`API request failed with status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error.message);
            alert('Error fetching weather data. Please try again.');
        });
}

function fetchWeather(location) {
    const apiKey = 'de2b53dbc2927b9e20daa4d7a6e0eb50';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }
        return response.text(); // Use text() instead of json()
    })
    .then(data => {
        console.log('Raw JSON response:', data); // Log the raw response
        return JSON.parse(data);
    })
    .then(parsedData => {
        displayWeather(parsedData);
    })
    .catch(error => {
        console.error('Error fetching or parsing weather data:', error.message);
        alert('Error fetching or parsing weather data. Please try again.');
    });
}
function displayWeather(data) {
    const weatherInfo = document.getElementById('weather-info');

    if (!data || !data.main || !data.weather || !data.name || !data.sys || !data.sys.country) {
        // Handle missing or unexpected properties
        console.error('Invalid API response:', data);
        weatherInfo.innerHTML = '<p>Error retrieving weather data. Please try again.</p>';
        return;
    }

    weatherInfo.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Conditions: ${data.weather[0].description}</p>
    `;
}

