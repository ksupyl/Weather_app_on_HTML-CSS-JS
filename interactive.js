let map;
        let weatherMarker;

        function initializeMap(lat, lon) {
            if(!map) {
                map = L.map('map').setView([lat, lon], 10);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                }).addTo(map);
            } else{
                map.setView([lat, lon], 10);
            }

            if(weatherMarker) {
                weatherMarker.remove();
            }
        }

        function getWeatherIcon(id) {
            if (id === 800) return'☀️';
            if(id >= 200 && id <= 232) return '🌩';
            if(id >= 300 && id <= 321) return '🌦';
            if(id >= 500 && id <= 531) return '🌧';
            if(id >= 600 && id <= 622) return '🌨';
            if(id >= 701 && id <= 781) return '🌫';
            if(id >= 801 && id <= 804) return '☁️';
            return '⭐️';
        }

        function getWeather() {
            const city = document.getElementById('cityInput').value;
            const apiKey = ${{ secrets.WEATHER_API_KEY }};
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=en&appid=${apiKey}`;

            fetch(url)
                .then(responce => responce.json())
                .then(data => {
                    if (data.cod === 200) {
                        const weatherIcon = getWeatherIcon(data.weather[0].id);

                        document.getElementById('weatherInfo').innerHTML = `
                            <p>City: ${data.name}</p>
                            <p>Temperature: ${data.main.temp}°C</p>
                            <p>Weather: ${data.weather[0].description} ${weatherIcon}</p>
                            <p>Humidity: ${data.main.humidity}%</p>
                        `;

                        initializeMap(data.coord.lat, data.coord.lon);
                        weatherMarker = L.marker([data.coord.lat, data.coord.lon])
                        .addTo(map)
                        .bindPopup(`Weather: ${data.weather[0].description} ${weatherIcon}`)
                        .openPopup();
                    } else {
                        document.getElementById('weatherInfo').innerHTML = '<p>City has not found</p>'
                    }
                }).catch(() => {
                    document.getElementById('weatherInfo').innerHTML = '<p>Error getting data from server</p>'
                })
        }
