const fs = require('fs');
const path = require('path');

// Path to the Bookmarks folder
const bookmarksFolderPath = path.join(__dirname, 'WeatherBookmarks'); // Update folder name

function addWeatherBookmark(city, weatherData) {
    const file = path.join(bookmarksFolderPath, `${city}.txt`);
    const contents = JSON.stringify(weatherData); // Store weather details as JSON string
    fs.writeFile(file, contents, (err) => {
        if (err) {
            console.error('Error creating weather bookmark:', err);
            return;
        }
        console.log(`${city} weather bookmark was created`);
    });
}


function buttonClicked() {
    var city = document.getElementById("city-input").value.trim();
    if (city === "") {
        city = "Beranang"; // Use default city if input is empty
    }
    var apiKey = "9fd7a449d055dba26a982a3220f32aa2"; // Your OpenWeatherMap API key

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            if (data.cod === 200) { // Check if the response code indicates success
                addWeatherBookmark(city, data); // Add weather bookmark
                displayWeather(city, data); // Display weather content
            } else {
                alert(`No weather data found for the city '${city}'.`);
            }
        })
        .catch(error => console.error('Error Fetching Weather Data: ', error));
}

document.addEventListener("DOMContentLoaded", function() {
    // Event listener for the "Bookmark" button
    document.getElementById("add-bookmark-btn").addEventListener("click", function() {
        buttonClicked();
    });
    fetchDefaultNews(); // Fetch default news data
});
function displayWeather(city, weatherData) {
    const weatherContainer = document.getElementById('weatherContainer');
    const sunriseTime = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString();
    const sunsetTime = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString();
    let currentTime = new Date().toLocaleTimeString();

    weatherContainer.innerHTML = `
        <div id="title">
            <h2>${city}</h2>
            <p><strong>Current Time:</strong> <span id="currentTime">${currentTime}</span></p>
        </div>
        <div id="weatherInfo" style="display: none;">
            <p><strong>Country:</strong> ${weatherData.sys.country}</p>
            <p><strong>Weather:</strong> ${weatherData.weather[0].description}</p>
            <p><strong>Temperature:</strong> ${weatherData.main.temp} K</p>
            <p><strong>Humidity:</strong> ${weatherData.main.humidity}%</p>
            <p><strong>Sunrise:</strong> ${sunriseTime}</p>
            <p><strong>Sunset:</strong> ${sunsetTime}</p>
        </div>
        <div>
            <p><strong>Coordinates:</strong> ${weatherData.coord.lat}, ${weatherData.coord.lon}</p>
            <p><strong>Timezone:</strong> ${weatherData.timezone}</p>
        </div>
        <button id="seeMoreBtn">See More</button>
    `;

    const seeMoreBtn = document.getElementById('seeMoreBtn');
    const weatherInfo = document.getElementById('weatherInfo');

    seeMoreBtn.addEventListener('click', function() {
        if (weatherInfo.style.display === 'none') {
            weatherInfo.style.display = 'block';
            seeMoreBtn.textContent = 'See Less';
        } else {
            weatherInfo.style.display = 'none';
            seeMoreBtn.textContent = 'See More';
        }
    });

    // Update current time every second
    setInterval(() => {
        currentTime = new Date().toLocaleTimeString();
        const currentTimeElement = document.getElementById('currentTime');
        if (currentTimeElement) {
            currentTimeElement.textContent = currentTime;
        }
    }, 1000);
}
