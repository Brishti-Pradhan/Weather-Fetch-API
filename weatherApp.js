const searchBox = document.querySelector("#location");
const searchBtn = document.querySelector("#search-button");
const weatherIcon = document.querySelector(".weather-icon");
const container = document.querySelector(".container");
const weatherBox = document.querySelector(".weather-box");
const weatherDetails = document.querySelector(".weather-details");
const error = document.querySelector(".error");
const forecast = document.querySelector(".forecast-container");


async function fetchForecast(city) {
  const apiKey = 'f13cac1829944989a15104231242409';
  const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=10`;
  const response = await fetch(forecastUrl);

  //console.log("forecast-", response);
  const todayDate= new Date().toISOString().split('T')[0];
  //console.log(todayDate)

  forecast.innerHTML = '';
  const data = await response.json();
  //console.log(data);
  data.forecast.forecastday.forEach(forcastWeather => {
      //console.log(forcastWeather);
      updateForcastItems(forcastWeather)
    
  });

}

function updateForcastItems(weatherData) {
  //console.log(weatherData);

  const {
    date,  
    day: { avgtemp_c, condition: { code, icon, text } }
  } = weatherData;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    day: 'numeric', 
    month: 'short'
  });

  const weatherIcon = `https:${icon}`;

  const forecastItem = `
    <div class="forecast-item">
      <h5 class="date">${formattedDate}</h5>
      <img src="${weatherIcon}" class="forecast-item-img" alt="Weather icon">
      <h5 class="forecast-temp">${Math.round(avgtemp_c)}°C</h5>
      <p class="forecast-description">${text}</p>
    </div>
  `;

  forecast.insertAdjacentHTML('beforeend', forecastItem);
}


async function checkWeather(city) {
  const apiKey = 'f13cac1829944989a15104231242409';
  const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;
  const response = await fetch(apiUrl);
  //console.log(response);

  if (response.status == 400) {
    container.style.height = '400px'
    error.classList.add('active');
    weatherBox.classList.remove('active');
    weatherDetails.classList.remove('active');
  }
  else {
    var data = await response.json();
    //console.log(data);
    //console.log("Condition: ", data.current.condition.text);

    document.querySelector(".city").innerHTML = data.location.name;
    document.querySelector(".temp").innerHTML = Math.round(data.current.temp_c) + "°C";
    document.querySelector(".info-humidity span").innerHTML = data.current.humidity + "%";
    document.querySelector(".info-wind span").innerHTML = data.current.wind_kph + " km/h";
    document.querySelector(".desc").innerHTML = data.current.
      condition.text;

    /*const currentWeatherIcon = `https:${data.current.condition.icon}`;
    weatherIcon.src = currentWeatherIcon
    */


    if (data.current.condition.text == "Cloudy"|| data.current.condition.text == "cloudy" || data.current.condition.text == "Overcast") {
      weatherIcon.src = "image/cloud.png";
    }
    else if (data.current.condition.text == "Clear" || data.current.condition.text == "Sunny") {
      weatherIcon.src = "image/clear.png";
    }
    else if (data.current.condition.text.includes("rain with thunder")) {
      weatherIcon.src = "image/thunderstorm.png";
    }
    else if (data.current.condition.text.includes("rain")) {
      weatherIcon.src = "image/rain.png";
    }
    else if (data.current.condition.text.includes("Drizzle")) {
      weatherIcon.src = "image/drizzle.png";
    }
    else if (data.current.condition.text == "Mist" || data.current.condition.text == "Fog") {
      weatherIcon.src = "image/mist.png";
    }
    else if (data.current.condition.text.includes("Snow")) {
      weatherIcon.src = "image/snow.png";
    }
    else if (data.current.condition.text.includes("thunderstorm") || data.current.condition.text.includes("Storm")) {
      weatherIcon.src = "image/thunderstorm.png";
    }
    else if (data.current.condition.text.includes("Haze")) {
      weatherIcon.src = "image/haze.png";
    }
    else {
      weatherIcon.src = "image/default.png";
    }

    //console.log("Icon set to: ", weatherIcon.src);

    await fetchForecast(city);


    container.style.height = '800px'
    error.classList.remove('active');
    weatherBox.classList.add('active');
    weatherDetails.classList.add('active');
    forecast.classList.add('active');
  }
}

searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
  //console.log("Input: ", searchBox.value);
})

