let apiKey = "4825cc349a06a66b9d4460dfc9faf508";

document.getElementById('search-button').addEventListener('click', function() {
    const city = document.getElementById('city-input').value;
    if (city) {
        clearWeatherData();
        getWeather(city);
    } else {
        alert("Please enter a city name");
    }
});

function clearWeatherData() {
    const cityName = document.getElementById('city-name');
    const currentDate = document.getElementById('current-date');
    const currentTemp = document.getElementById('current-temp');
    const currentWind = document.getElementById('current-wind');
    const currentHumidity = document.getElementById('current-humidity');
    const forecastContainer = document.getElementById('forecast-container');

    if (cityName) cityName.textContent = '';
    if (currentDate) currentDate.textContent = '';
    if (currentTemp) currentTemp.textContent = '';
    if (currentWind) currentWind.textContent = '';
    if (currentHumidity) currentHumidity.textContent = '';
    if (forecastContainer) forecastContainer.innerHTML = '';
}

function getWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching data');
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Debug log
            displayCurrentWeather(data);
            displayForecast(data);
            addToHistory(city);
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error.message);
        });
}

function displayCurrentWeather(data) {
    const cityName = document.getElementById('city-name');
    const currentDate = document.getElementById('current-date');
    const currentTemp = document.getElementById('current-temp');
    const currentWind = document.getElementById('current-wind');
    const currentHumidity = document.getElementById('current-humidity');

    if (!cityName || !currentDate || !currentTemp || !currentWind || !currentHumidity) {
        console.error("One or more elements not found in the DOM");
        return;
    }

    const currentWeather = data.list[0];
    cityName.textContent = `${data.city.name} (${currentWeather.dt_txt.split(' ')[0]})`;
    currentDate.textContent = `Date: ${currentWeather.dt_txt.split(' ')[0]}`;
    currentTemp.textContent = `Temp: ${currentWeather.main.temp}°F`;
    currentWind.textContent = `Wind: ${currentWeather.wind.speed} MPH`;
    currentHumidity.textContent = `Humidity: ${currentWeather.main.humidity}%`;
}

function displayForecast(data) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = '';

    for (let i = 1; i <= 5; i++) {
        const forecast = data.list[i * 8 - 1];
        const forecastDiv = document.createElement('div');
        forecastDiv.classList.add('forecast-day');
        forecastDiv.innerHTML = `
            <p>${forecast.dt_txt.split(' ')[0]}</p>
            <p>Temp: ${forecast.main.temp}°F</p>
            <p>Wind: ${forecast.wind.speed} MPH</p>
            <p>Humidity: ${forecast.main.humidity}%</p>
        `;
        forecastContainer.appendChild(forecastDiv);
    }
}

function addToHistory(city) {
    const searchHistory = document.getElementById('search-history');
    const historyItems = searchHistory.getElementsByTagName('li');

    // Check if the city is already in the history
    for (let i = 0; i < historyItems.length; i++) {
        if (historyItems[i].textContent.toLowerCase() === city.toLowerCase()) {
            return; // City already exists, so do not add it again
        }
    }

    // Add the city to the history if it doesn't already exist
    const historyItem = document.createElement('li');
    historyItem.textContent = city;
    historyItem.addEventListener('click', function() {
        document.getElementById('city-input').value = city; // Set the city's name in the search bar
        getWeather(city);
    });
    searchHistory.appendChild(historyItem);
}
