const id = (elementId) => document.getElementById(elementId);
const selector = (elementSelector) => document.querySelector(elementSelector);
const selectorAll = (elementsSelector) =>
  document.querySelectorAll(elementsSelector);

const cityNameInput = id("cityNameInput");
const searchBtn = id("searchBtn");
// --------------------------------------------------------------
// const resultMain = id("resultMain");
const resultMain = selectorAll(".resultMain"); // *has city name and temp.

const wetherDetails = selectorAll(".wetherDetails"); //* has 3 elements to be set [feelsLike, Humidity, smthelse]

// const weatherIcon = selector(".weatherIcon");
const conditionDetails = selectorAll(".conditionDetails"); //* has weather icon and condition

const windData = selectorAll(".windData"); //* has 4 divs each has [icon,p[/span/]]
// const createH4 = document.createElement("h4");

// function api() {
//   const baseUrl = "http://api.weatherstack.com/";

//   const req = new XMLHttpRequest();
//   if (!validateInput) alert("Invalid city name");
//   req.open(
//     "GET",
//     (baseUrl += `current?access_key=a669fda8b3a246099b9210751253006q=${cityNameInput.value}`)
//   );
//   //req.send()

//   req.addEventListener("load", function () {
//     responseBody = JSON.parse(req.response);
//     console.log("full response: ", responseBody);
//     console.log("response location: ", responseBody.location);
//     console.log("response current: ", responseBody.current);
//     result = {
//       countryName: responseBody.location.country,
//       cityName: responseBody.location.name,
//       lat: responseBody.location.lat,
//       lon: responseBody.location.lon,
//       temp: responseBody.current.temperature,
//       weatherIcon: responseBody.current.weather_icons[0],
//       weatherDesc: responseBody.current.weather_descriptions[0],
//       feelsLike: responseBody.current.feelslike,
//       humidity: responseBody.current.humidity,
//     };
//     console.log("created result: ", result);

//     displayResult(result);
//   });
// }

const secondaryCards = selectorAll(".secondary-card");

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  api();
});
async function api() {
  const baseUrl = "http://api.weatherapi.com";
  const endPoint = `/v1/forecast.json?key=a669fda8b3a246099b9210751253006&q=${cityNameInput.value}&days=3&aqi=no&alerts=no`;
  if (!validateInput()) {
    alert("Please enter city name");
    return;
  }
  const response = await (await fetch(baseUrl + endPoint)).json();
  console.log(`response: `, response);

  const todayWeather = {
    cityName: response.location.name,
    temp: response.current.temp_c,
    feelsLike: response.current.feelslike_c,
    humidity: response.current.humidity,
    windSpeed: response.current.wind_kph,
    windDirection: response.current.wind_dir,
    vis: response.current.vis_km,
    uv: response.current.uv,
    conditionIcon: response.current.condition.icon,
    condition: response.current.condition.text,
  };
  weatherArrayNext1 = response.forecast.forecastday[1];
  weatherArrayNext2 = response.forecast.forecastday[2];

  console.log("Next day 1: ", weatherArrayNext1);
  console.log("Next day 2: ", weatherArrayNext2);
  // displayNextDaysResult(weatherArrayNext1,);
  displayTodayResult(todayWeather);
  displayNextDaysResult(weatherArrayNext1, secondaryCards[0]);
  displayNextDaysResult(weatherArrayNext2, secondaryCards[1]);
  // console.log("today weather Obj", todayWeather);

  // displayResult(weatherObject, weatherArrayPast);
  // console.log(response);
}
function validateInput() {
  return cityNameInput.value.trim().length > 2;
}

function displayTodayResult(result) {
  //* city name and temp
  resultMain[0].firstElementChild.innerText = result.cityName;
  resultMain[0].lastElementChild.querySelector("span").innerText =
    result.temp + "°";

  //* icon and condition
  conditionDetails[0].firstElementChild.setAttribute(
    "src",
    result.conditionIcon
  );
  conditionDetails[0].lastElementChild.innerText = result.condition;
  //* weather data [feelsLike, Humidity, smthelse]

  const fields = wetherDetails[0].querySelectorAll("span");

  fields[0].innerText = result.feelsLike + "°";
  fields[1].innerText = result.humidity;
  // fields[2].innerText = "result!! TODO";
  fields[2].innerText = result.windSpeed;
  fields[3].innerText = result.windDirection;
  fields[4].innerText = result.vis;
  fields[5].innerText = result.uv;

  //the main backgroundImage
  const mainScreen = document.querySelector("main");
  if (result.condition == "Clear") {
    mainScreen.style.backgroundImage = "url(./images/clear-sky.jpg)";
  } else if (result.condition == "Heavy rain") {
    mainScreen.style.backgroundImage = "url(./images/drizzle.jpeg)";
  } else if (result.condition == "Moderate rain") {
    mainScreen.style.backgroundImage = "url(./images/light-rain.jpeg)";
  } else if (result.condition == "Mist") {
    mainScreen.style.backgroundImage = "url(../images/mist.jpeg)";
  } else if (result.condition == "Partly cloudy") {
    mainScreen.style.backgroundImage = "url(./images/Scattered-Clouds.jpg)";
  } else if (result.condition == "Patchy rain nearby") {
    mainScreen.style.backgroundImage = "url(./images/Overcast-Clouds.jpg)";
  }
}

function displayNextDaysResult(dayResult, card) {
  // TODO
  const cardDetails = card.querySelectorAll("h4");
  cardDetails[0].firstElementChild.innerText = dayResult.day.maxtemp_c;
  cardDetails[1].firstElementChild.innerText = dayResult.day.mintemp_c;

  //formatting the date
  const date = dayResult.date.split("-");
  date.splice(0, 1);
  console.log(date);

  cardDetails[1].nextElementSibling.lastElementChild.innerText = `${date[1]} - ${date[0]}`;

  console.log(dayResult.day.condition);

  cardDetails[2].innerText = dayResult.day.condition.text;

  cardDetails[2].previousElementSibling.setAttribute(
    "src",
    dayResult.day.condition.icon
  );
}
function displayResult(result, weatherArrayPast) {
  //* Condition start
  conditionDetails.firstElementChild.setAttribute("src", result.conditionIcon); //img of the condition ##Done##

  conditionDetails.lastElementChild.innerHTML = String(result.condition); //img of the condition ##Done##
  //* Condition end

  resultMain.firstElementChild.innerText = result.cityName; //* city-name => h4 ##Done##

  resultMain.lastElementChild.firstElementChild.innerText = result.temp + "°"; //* temp. => h4 => span ##Done##

  let firstDetailsParagraph = wetherDetails.firstElementChild;
  // let lastDetailsParagraph = resultDetails.lastElementChild; // <div id="windData">...</div>

  firstDetailsParagraph.firstElementChild.innerText = result.feelsLike + "°C"; //##Done##
  firstDetailsParagraph.nextElementSibling.firstElementChild.innerText = // -> humidity ##Done##
    result.humidity + "%";

  // lastDetailsParagraph.firstElementChild.innerText = result.lat + "°";
  // lastDetailsParagraph.previousElementSibling.firstElementChild.innerText =
  //   result.lon + "°";
  const rows = windData.querySelectorAll(".rows span");
  // rows[0].lastElementChild
  console.log(rows);
  rows[0].innerText = result.windSpeed; // windSpeed
  rows[1].innerText = result.windDirection; // wind_dir
  rows[2].innerText = result.vis; // visibility
  rows[3].innerText = result.uv; // uv index
}

// As API but without a real request
function demoAPI() {
  //open connection [Get,endpoint]
  //send the request

  //*eventlistener -> [load]:
  let result = {
    countryName: "Egypt", //responseBody.location.country,
    cityName: "Cairo", //responseBody.location.name,
    lat: 30.0444, //responseBody.location.lat,
    lon: 31.2357, //responseBody.location.lon,
    temp: 31, //responseBody.current.temperature,
    weatherIcon: "images/tempicons/snow.svg", //responseBody.current.weather_icons[0],
    weatherDesc: "Sunny", //responseBody.current.weather_descriptions[0],
    feelsLike: 33, //responseBody.current.feelslike,
    humidity: 32, //responseBody.current.humidity,
  };
  displayResult(result);
}

function setMainBackground(weatherCondition) {}
// api();
// demoAPI();

// For styling
(function () {
  const mainCard = document.querySelector(".main-card");
  mainCard.style.height = getComputedStyle(selector(".secondary-card")).height;
})();
