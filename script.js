//main current day box
let currentDayCityName = document.querySelector(".city-name");
let currentDayWeatherIcon = document.querySelector(".current-weather-icon");
let currentDayTemperature = document.querySelector(".temperature");
let currentDayWind = document.querySelector(".wind");
let currentDayHumidity = document.querySelector(".humidity");
let currentDayUV = document.querySelector(".uv");
let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
let currentDayIcon = document.querySelector(".currentWeather");
let breakLine = document.querySelector(".break");
let userHistory = document.querySelector(".city-history");
let clearBtn = document.querySelector(".clear-btn");
let APIKey = "18ea5b0d2b1aa0a96ef25a7aa406676f";
let city = document.querySelector(".city-input");
let searchBtn = document.querySelector(".search-btn");
let historyItemBtn = document.querySelector(".form-control");

//q= is the query parameter, where we can add any user input

let getCity = function (cityName) {
  let queryURL ="https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
  fetch(queryURL)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function (data) {
      console.log(data);
      // to set the chosen city name and date using the object data
      let currentDate = new Date(data.dt * 1000);
      let day = currentDate.getDate();
      let month = currentDate.getMonth() + 1;
      let year = currentDate.getFullYear();
      currentDayCityName.innerHTML = data.name + " " + "(" + month + "/" + day + "/" + year + ")";
      //to set the chosen city's current weather icon beside the city name and date
      //icons found on this URL https://openweathermap.org/weather-conditions
      let currentWeatherIcon = document.createElement("img");
      currentWeatherIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");
      currentWeatherIcon.setAttribute("alt", data.weather[0].description);
      currentDayIcon.innerHTML = ""
      currentDayIcon.append(currentWeatherIcon);
      // currentDayWeatherIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + currentWeatherIcon + "@2x.png")
      // currentDayWeatherIcon.setAttribute("alt", data.weather[0].description)
      currentDayTemperature.innerHTML ="Temperature: " + kelvinToCelsius(data.main.temp) + " " + "&#8451";
      currentDayWind.innerHTML = "Wind Speed: " + data.wind.speed + " " + "MPH";
      currentDayHumidity.innerHTML ="Humidity: " + data.main.humidity + " " + "%";

      let lat = data.coord.lat;
      let lon = data.coord.lon;
      console.log(lat);
      console.log(lon);
      let uvURL ="https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;
      fetch(uvURL)
        .then(function (response) {
          console.log(response);
          if (response.ok) {
            return response.json();
          }
        })
        .then(function (data) {
          console.log(data);
          let UVSpan = document.createElement("span");
          currentDayUV.innerHTML = "UV Index: " 
          UVSpan.innerHTML = + data.daily[0].uvi;
          UVSpan.setAttribute("class", "badge")
          currentDayUV.append(UVSpan)
          if (data.daily[0].uvi === 0) {
            UVSpan.setAttribute("class", "neutral-color");
          } else if (data.daily[0].uvi <= 2) {
            UVSpan.settAttribute("class", "green-color");
          } else if (data.daily[0].uvi > 3 && data.daily[0].uvi < 5) {
            UVSpan.setAttribute("class", "yellow-color");
          } else if (data.daily[0].uvi > 5 && data.daily[0].uvi < 7) {
            UVSpan.setAttribute("class", "orange-color");
          } else if (data.daily[0].uvi > 7  && data.daily[0].uvi <= 10) {
            UVSpan.setAttribute("class", "red-color");
          } else if (data.daily[0].uvi > 11) {
            UVSpan.setAttribute("class", "purple-color");
          }
        });
    })
    .catch(function (error) {
      console.log(error);
    });
};

let GetWeeklyForecast = function (cityName) {
  let weeklyURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + APIKey;
  fetch(weeklyURL)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function (data) {
      console.log(data);
      let forecastCardEl = document.querySelectorAll(".future-forecast");
      for (let i = 0; i < forecastCardEl.length; i++) {
        forecastCardEl[i].innerHTML = "";
        let forecastIndex = i * 8 + 5;
        let forecastDate = new Date(data.list[forecastIndex].dt_txt);
        let forecastDay = forecastDate.getDate();
        let forecastMonth = forecastDate.getMonth() + 1;
        let forecastYear = forecastDate.getFullYear();
        let cardDate = document.createElement("h6");
        cardDate.setAttribute("class", "m-1 text-center forecast-date");
        cardDate.innerHTML ="(" + forecastMonth + "/" + forecastDay + "/" + forecastYear + ")";
        forecastCardEl[i].append(cardDate);
        let cardImg = document.createElement("img");
        cardImg.setAttribute("class", "align-items-center");
        cardImg.setAttribute("src", "https://openweathermap.org/img/wn/" + data.list[forecastIndex].weather[0].icon + "@2x.png");
        cardImg.setAttribute("alt", data.list[forecastIndex].weather[0].description);
        forecastCardEl[i].append(cardImg);
        let cardTemp = document.createElement("p");
        cardTemp.innerHTML ="Temp: " + kelvinToCelsius(data.list[forecastIndex].main.temp) + " " + "&#8451";
        forecastCardEl[i].append(cardTemp);
        let cardFeel = document.createElement("p");
        cardFeel.innerHTML ="Humidity: " + data.list[forecastIndex].main.humidity + "%";
        forecastCardEl[i].append(cardFeel);
        let cardWind = document.createElement("p");
        cardWind.innerHTML ="Wind: " + data.list[forecastIndex].wind.speed + " " + "MPH";
        forecastCardEl[i].append(cardWind);
      }
    });
};

//function to return kelvin to celcius
function kelvinToCelsius(k) {
  return Math.floor(k - 273.15);
}

function renderSearchHistory(){
  userHistory.innerHTML = "";
  for (let i=0; i<searchHistory.length; i++){
    let historyItem = document.createElement("input");
    console.log(historyItem)
    historyItem.setAttribute("type", "text");
    historyItem.setAttribute("readonly", true);
    historyItem.setAttribute("class", "form-control d-block bg-white");
    historyItem.setAttribute("value", searchHistory[i]);
    historyItem.addEventListener("click", function(){
      console.log(historyItem.value)
      let cityName = historyItem.value;
      getCity(cityName);
      GetWeeklyForecast(cityName);
    })
    userHistory.append(historyItem);
  }
}

searchBtn.addEventListener("click",function() {
  let cityName = city.value.trim();
  getCity(cityName);
  GetWeeklyForecast(cityName);
  searchHistory.push(cityName);
  localStorage.setItem("search",JSON.stringify(searchHistory));
  renderSearchHistory();
})

clearBtn.addEventListener("click", function(){
  searchHistory = [];
  localStorage.clear();
})


