//main current day box
let currentDayCityName = document.querySelector(".city-name")
let currentDayTemperature = document.querySelector(".temperature")
let currentDayWind = document.querySelector(".wind")
let currentDayHumidity = document.querySelector(".humidity")
let currentDayUV = document.querySelector(".uv")


let APIKey = "18ea5b0d2b1aa0a96ef25a7aa406676f";
let city = document.querySelector(".city-input");
let searchBtn = document.querySelector(".search-btn");
//q= is the query parameter, where we can add any user input



let getCity = function () {  
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city.value.trim() + "&appid=" + APIKey;

    fetch(queryURL)
    .then(function (response) {
      if (response.ok) {
        return response.json()
      }
    }).then(function (data) {
        console.log(data);
      }).catch(function (error) {
        console.log(error)
      });
} 
    
searchBtn.addEventListener("click", getCity)



