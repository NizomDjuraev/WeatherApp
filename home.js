const weatherForm = document.querySelector('#weather-form');
const weatherResults = document.querySelector('#weather-results');
const moreResults = document.getElementById('more-results');

const setBackgroundColor = () => {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const percentage = ((hours * 60 + minutes) / (24 * 60 / 4)) * 100 + seconds / (24 * 60 * 60);

    const clampedPercentage = Math.max(percentage, 10);

    const backgroundColor = `hsl(0, 0%, ${clampedPercentage}%)`;

    document.body.style.backgroundColor = backgroundColor;
    };

    setBackgroundColor();

    setInterval(setBackgroundColor, 1000);

const fetchWeatherData = (input, isZipCode) => {
    let endpoint;
    if (isZipCode) {
      endpoint = `https://api.openweathermap.org/data/2.5/weather?zip=${input}&appid=3ef77aa98d6ea1d1af2650d37873c808`;
    } else {
      endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=3ef77aa98d6ea1d1af2650d37873c808`;
    }
  
    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            weatherResults.innerHTML = "";
            moreResults.innerHTML = "";

            const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

            const weatherCity = document.createElement("h2");
            weatherCity.textContent = `${data.name}`;
            weatherResults.appendChild(weatherCity);

            const weatherIcon = document.createElement("img");
            weatherIcon.src = iconUrl;
            weatherResults.appendChild(weatherIcon);

            const weatherTemperature = document.createElement("p");
            weatherTemperature.textContent = `${(Math.round(data.main.temp - 273.15) * 9 / 5 + 32).toFixed(0)}\u00B0 F`;
            weatherResults.appendChild(weatherTemperature);

            const weatherDescription = document.createElement("p");
            const description = data.weather[0].description;
            const capitalizedDescription =
            description.charAt(0).toUpperCase() + description.slice(1);
            weatherDescription.textContent = capitalizedDescription;
            weatherResults.appendChild(weatherDescription);

            const weatherFeelsLike = document.createElement('p');
            weatherFeelsLike.textContent = `Feels like: ${(Math.round(data.main.feels_like - 273.15) * 9/5 + 32).toFixed(0)}\u00B0 F`;
            moreResults.appendChild(weatherFeelsLike);

            const weatherWindSpeed = document.createElement('p');
            weatherWindSpeed.textContent = `Wind Speed: ${data.wind.speed} mph`;
            moreResults.appendChild(weatherWindSpeed);


            const cardinalDirections = ['North', 'North East', 'East', 'South East', 'South', 'South West', 'West', 'North West'];
            const index = Math.floor(data.wind.deg % 45 / 8);
            const windDirection = cardinalDirections[index];
            const weatherWindDirection = document.createElement('p');
            weatherWindDirection.textContent = `Wind Direction: ${windDirection}`;
            moreResults.appendChild(weatherWindDirection);
        })
        .catch(error => {
            console.error(error);
            weatherResults.innerHTML = "<p>An error occurred while getting the weather data</p>";
        });
};
  
weatherForm.addEventListener("submit", searchZip => {
    searchZip.preventDefault();
    const input = document.querySelector("#zipcode").value;
    if (!isNaN(input)) {
        fetchWeatherData(input, true);
    } else {
        fetchWeatherData(input, false);
    }
});