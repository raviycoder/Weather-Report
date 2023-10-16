document.addEventListener("DOMContentLoaded", function () {
  const cityInput = document.querySelector(".city-input");
  const searchBTN = document.querySelector(".search-btn");
  const locationBTN = document.querySelector(".location-btn");
  const currentWeatherdiv = document.querySelector(".current-weather");
  const weatherCardsdiv = document.querySelector(".weather-cards");

  const weatherapi = "03571cd5029dfd52c69a8ab9c7ee0982";

  const createWeatherCard = (cityName, weatherItem, index) => {
    if (index === 0) {
      return `<div class="details">
                  <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                  <h6>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                  <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                  <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                  <div class="icon2">
                     <img src="http://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                     <h6>${weatherItem.weather[0].description}</h6>
                  </div>
              </div>`;
    } else {
      return `<li class="card">
                 <h3>(${weatherItem.dt_txt.split(" ")[0]})</h2>
                 <img src="http://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" class="icon" alt="weather-icon">
                 <h6>${weatherItem.weather[0].description}</h6>
                 <h6>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                 <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                 <h6>Humidity: ${weatherItem.main.humidity}%</h6>
              </li>`;
    }
  };

  const getWeatherDetails = (cityName, latitude, longitude) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${weatherapi}`;

    fetch(WEATHER_API_URL).then(response => response.json()).then(data => {
      // Filter the forecasts to get only one forecast per day
      const uniqueForecastDays = [];
      const fiveDaysForecast = data.list.filter(forecast => {
          const forecastDate = new Date(forecast.dt_txt).getDate();
          if (!uniqueForecastDays.includes(forecastDate)) {
              return uniqueForecastDays.push(forecastDate);
          }
      });
        cityInput.value = "";
        currentWeatherdiv.innerHTML = "";
        weatherCardsdiv.innerHTML = "";

        fiveDaysForecast.forEach((weatherItem, index) => {
          const html = createWeatherCard(cityName, weatherItem, index);
          if (index === 0) {
            currentWeatherdiv.insertAdjacentHTML("beforeend", html);
          } else {
            weatherCardsdiv.insertAdjacentHTML("beforeend", html);
          }
        });
      })
      .catch(() => {
        alert(
          "An error occurred while fetching the weather forecast. Please try again"
        );
      });
  };

  const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (cityName === "") return;
    const API_URl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${weatherapi}`;
    fetch(API_URl).then(response => response.json()).then(data => {
        if (!data.length) return alert(`No Coordinates found for ${cityName}`);
        const { lat, lon, name } = data[0];
        getWeatherDetails(name, lat, lon);
      }).catch(() => {
        alert("An error occurred while fetching Coordinates! Please try again");
      });
  };

  const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const API_URl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${weatherapi}`;
        fetch(API_URl).then(response => response.json()).then(data => {
            const { name } = data[0];
            getWeatherDetails(name, latitude, longitude);
          }).catch(() => {
            alert(
              "An error occurred while fetching the city name! Please try again");
          });
      },
      error => {
        if (error.code === error.PERMISSION_DENIED) {
          alert("Geolocation request denied. Please reset location permission to access your location");
        } else {
          alert("Geolocation request error. Please reset location permission");
        }
      }
    );
  };

  locationBTN.addEventListener("click", getUserCoordinates);
  searchBTN.addEventListener("click", getCityCoordinates);
  cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates()
  );
});



// document.addEventListener("DOMContentLoaded", function () {
//   const cityInput = document.querySelector(".city-input");
//   const searchButton = document.querySelector(".search-btn");
//   const locationButton = document.querySelector(".location-btn");
//   const currentWeatherDiv = document.querySelector(".current-weather");
//   const weatherCardsDiv = document.querySelector(".weather-cards");

//   const API_KEY = "03571cd5029dfd52c69a8ab9c7ee0982"; // Replace with your OpenWeatherMap API key

//   const createWeatherCard = (cityName, weatherItem, index) => {
//       if (index === 0) {
//           return `<div class="details">
//                       <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
//                       <h6>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
//                       <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
//                       <h6>Humidity: ${weatherItem.main.humidity}%</h6>
//                   </div>
//                   <div class="icon">
//                       <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
//                       <h6>${weatherItem.weather[0].description}</h6>
//                   </div>`;
//       } else {
//           return `<li class="card">
//                       <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
//                       <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
//                       <h6>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
//                       <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
//                       <h6>Humidity: ${weatherItem.main.humidity}%</h6>
//                   </li>`;
//       }
//   };

//   const getWeatherDetails = (cityName, latitude, longitude) => {
//       const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

//       fetch(WEATHER_API_URL)
//           .then(response => response.json())
//           .then(data => {
//               const uniqueForecastDays = [];
//               const fiveDaysForecast = data.list.filter(forecast => {
//                   const forecastDate = new Date(forecast.dt_txt).getDate();
//                   if (!uniqueForecastDays.includes(forecastDate)) {
//                       return uniqueForecastDays.push(forecastDate);
//                   }
//               });

//               cityInput.value = "";
//               currentWeatherDiv.innerHTML = "";
//               weatherCardsDiv.innerHTML = "";

//               fiveDaysForecast.forEach((weatherItem, index) => {
//                   const html = createWeatherCard(cityName, weatherItem, index);
//                   if (index === 0) {
//                       currentWeatherDiv.insertAdjacentHTML("beforeend", html);
//                   } else {
//                       weatherCardsDiv.insertAdjacentHTML("beforeend", html);
//                   }
//               });
//           })
//           .catch(() => {
//               alert("An error occurred while fetching the weather forecast!");
//           });
//   };

//   const getCityCoordinates = () => {
//       const cityName = cityInput.value.trim();
//       if (cityName === "") return;
//       const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

//       fetch(API_URL)
//           .then(response => response.json())
//           .then(data => {
//               if (!data.length) return alert(`No coordinates found for ${cityName}`);
//               const { lat, lon, name } = data[0];
//               getWeatherDetails(name, lat, lon);
//           })
//           .catch(() => {
//               alert("An error occurred while fetching the coordinates!");
//           });
//   };

//   const getUserCoordinates = () => {
//       navigator.geolocation.getCurrentPosition(
//           position => {
//               const { latitude, longitude } = position.coords;
//               const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;

//               fetch(API_URL)
//                   .then(response => response.json())
//                   .then(data => {
//                       const { name } = data[0];
//                       getWeatherDetails(name, latitude, longitude);
//                   })
//                   .catch(() => {
//                       alert("An error occurred while fetching the city name!");
//                   });
//           },
//           error => {
//               if (error.code === error.PERMISSION_DENIED) {
//                   alert("Geolocation request denied. Please reset location permission to grant access again.");
//               } else {
//                   alert("Geolocation request error. Please reset location permission.");
//               }
//           }
//       );
//   };

//   locationButton.addEventListener("click", getUserCoordinates);
//   searchButton.addEventListener("click", getCityCoordinates);
//   cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());
// });

