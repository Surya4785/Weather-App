const cityName = document.querySelector("input");
const searchBtn = document.querySelector(".search-button");
const apiKey = "1c217b554320ce241d0cc2c7b8daaf41";
const notFoundSection = document.querySelector(".not-found-section");
const weatherSection = document.querySelector(".weather-section");
const searchSection = document.querySelector(".search-city");
//element selection
const locationName = document.querySelector(".location-name");
const currentDate = document.querySelector(".current-date");
const temperature = document.querySelector(".temperature");
const weatherCondition = document.querySelector(".weather-condition");
const humidityValue = document.querySelector(".humidity-value");
const windValue = document.querySelector(".wind-value");
const weatherIcon = document.querySelector(".weather-summary img");
const forecastContainer = document.querySelector(".forecast-container");
const background = document.querySelector("body");
const predictionElement = document.getElementById("prediction");
const chartCanvas = document.getElementById("trend-graph");
const chartCanvas2 = document.getElementById("min-max-graph");
const chartCanvas3 = document.getElementById("line-graph");
// const section1 = document.querySelector('.graph1')
// const section2 = document.querySelector('.graph2')
// const section3 = document.querySelector('.graph3')

let weatherChart; // Variable to hold the Chart.js instance

searchBtn.addEventListener("click", (event) => {
  if (cityName.value.trim() != "") {
    updateWeatherInfo(cityName.value);
    getWeatherAnalysis(cityName.value);
    event.preventDefault();
  }
  cityName.value = "";
  cityName.blur();
  //.trim() = koi spaces bhi aa jayein agar texts ke bahar "   City  ", so it will display: "City"
  //.blur() = opposite of :focus in css, i.e removes the focus from the element
});
cityName.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && cityName.value.trim() != "") {
    updateWeatherInfo(cityName.value);
    getWeatherAnalysis(cityName.value);
    event.preventDefault();
    cityName.value = "";
    cityName.blur();
    //added inside 'if' condition because as we were jotting any key stroke, wo blur kar raha tha focus turant
  }
});
function getWeatherIcon(id) {
  if (id <= 232) return "thunderstorm";
  if (id <= 321) return "drizzle";
  if (id <= 531) return "rain";
  if (id <= 622) return "snow";
  if (id <= 781) return "atmosphere";
  if (id <= 800) return "clear";
  else return "clouds";
}
function getBackgroundImage(id) {
  if (id <= 232) return "thunderstorm-bg";
  if (id <= 321) return "drizzle-bg";
  if (id <= 531) return "drizzle-bg";
  if (id <= 622) return "snow-bg";
  else return "bg";
}
function getCurrentDate() {
  const todayDate = new Date();
  const option = {
    weekday: "short",
    day: "2-digit",
    month: "short",
  };
  return todayDate.toLocaleDateString("en-GB", option);
}
async function getFetchData(endPoint, city) {
  let response = await fetch(
    `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`
  );
  let data = await response.json();
  return data;
}
async function updateWeatherInfo(city) {
  const weatherData = await getFetchData("weather", city);
  if (weatherData.cod != 200) {
    updateSection(notFoundSection);
    return;
  }
  const {
    name: country,
    main: { temp, humidity },
    weather: [{ id, main }],
    wind: { speed },
  } = weatherData;

  currentDate.textContent = getCurrentDate();
  locationName.textContent = country;
  temperature.textContent = Math.floor(temp) + "°C";
  weatherCondition.textContent = main;
  humidityValue.textContent = humidity + "%";
  windValue.textContent = speed + "M/s";
  weatherIcon.src = `assets/weather/${getWeatherIcon(id)}.svg`;
  background.style.backgroundImage = `url(./assets/${getBackgroundImage(
    id
  )}.jpg`;

  await updateForecastInfo(city);
  updateSection(weatherSection);
  console.log(weatherData);
}
async function updateForecastInfo(city) {
  const forecastData = await getFetchData("forecast", city);
  const timeTaken = "12:00:00";
  const todayDate = new Date().toISOString().split("T")[0];
  forecastContainer.innerHTML = "";
  forecastData.list.forEach((forecastWeather) => {
    if (forecastWeather.dt_txt.includes(timeTaken)) {
      updateForecastItems(forecastWeather);
    }
  });
}
function updateForecastItems(weatherData) {
  const {
    dt_txt: date,
    weather: [{ id }],
    main: { temp },
  } = weatherData;
  const dateTaken = new Date(date);
  const dateOption = {
    day: "2-digit",
    month: "short",
  };
  const dateResult = dateTaken.toLocaleDateString("en-GB", dateOption);

  const forecastItem = `
                <div class="forecast-item">
                    <h5 class="forecast-date regular-txt">
                        ${dateResult}
                    </h5>
                    <img src="assets/weather/${getWeatherIcon(id)}.svg">
                    <h5 class="forecast-temp regular-txt">${Math.round(
                      temp
                    )}°C</h5>
                </div>
    `;
  forecastContainer.insertAdjacentHTML("beforeend", forecastItem);
}
function updateSection(section) {
  [weatherSection, notFoundSection, searchSection].forEach(
    (section) => (section.style.display = "none")
  );
  section.style.display = "flex";
}

const slider = document.querySelector(".slider");
let currentIndex = 0;
const totalSlides = document.querySelectorAll(".slider section").length;
const dots = document.querySelectorAll(".dot");

function updateSlide() {
    // Ensure the transform is applied correctly
    const translateX = -currentIndex * 100;
    slider.style.transform = `translateX(${translateX}%)`;
    
    // Update active dot
    dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex);
    });
}

const nextBtn = document.querySelector(".next");
const prvBtn = document.querySelector(".previous");

// Next Button Click
nextBtn.addEventListener("click", () => {
    if (currentIndex < totalSlides - 1) {
        currentIndex++;
    } else {
        currentIndex = 0;
    }
    updateSlide();
});

// Previous Button Click
prvBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
        currentIndex--;
    } else {
        currentIndex = totalSlides - 1;
    }
    updateSlide();
});

// Dot navigation
dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
        currentIndex = index;
        updateSlide();
    });
});

// Initialize the slider position
updateSlide();

//nextBtn.addEventListener("click", (event)=>{
//     event.preventDefault();
//     console.log(event);
//     section1.style.display = 'none';
//     section2.style.display = 'block';
// })
// nextBtn.addEventListener("click", (event)=>{
//     event.preventDefault();
//     section1.style.display = 'block';
//     section2.style.display = 'none';
// })

//analysis
// Ensure updateChart is declared before calling it
function updateChart(days, temperatures, city) {
  if (weatherChart) {
    weatherChart.destroy(); // Destroy existing chart before creating a new one
  }

  weatherChart = new Chart(chartCanvas, {
    type: "line",
    data: {
      labels: days.map((day) => `Day ${day}`),
      datasets: [
        {
          label: `Temperature Trend for ${city.toUpperCase()}`,
          data: temperatures,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(0, 255, 255, 0.2)",
          pointBackgroundColor: "white",
          borderWidth: 3,
          pointRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: { color: "#ffffff" },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Days",
            color: "#ffffff",
            font: { size: 20 },
          },
          ticks: { color: "#ffffff", font: { size: 20 } },
          grid: { color: "rgba(252, 252, 252, 0.5)" },
        },
        y: {
          title: {
            display: true,
            text: "Temperature (°C)",
            color: "#ffffff",
            font: { size: 20 },
          },
          ticks: { color: "#ffffff", font: { size: 20 } },
          grid: { color: "rgba(252, 252, 252, 0.5)" },
        },
      },
    },
  });
}

let tempVariationChart; // Variable for chart 2
let humidityWindChart; // Variable for chart 3

async function updateTempVariationChart(city) {
  const forecastData = await getFetchData("forecast", city);
  const days = [];
  const minTemps = [];
  const maxTemps = [];

  forecastData.list.forEach((entry) => {
    const date = entry.dt_txt.split(" ")[0];
    if (!days.includes(date)) {
      days.push(date);
      minTemps.push(entry.main.temp_min);
      maxTemps.push(entry.main.temp_max);
    }
  });

  if (tempVariationChart) {
    tempVariationChart.destroy(); // Destroy the existing chart before creating a new one
  }

  tempVariationChart = new Chart(chartCanvas2, {
    type: "bar",
    data: {
      labels: days,
      datasets: [
        {
          label: "Max Temperature (°C)",
          data: maxTemps,
          backgroundColor: "rgba(255, 99, 132, 0.7)", // Red bars
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
        {
          label: "Min Temperature (°C)",
          data: minTemps,
          backgroundColor: "rgba(54, 162, 235, 0.7)", // Blue bars
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: "white" },
        },
      },
      scales: {
        x: {
          ticks: { color: "white" },
          grid: { color: "rgba(200, 200, 200, 0.2)" },
        },
        y: {
          ticks: { color: "white" },
          grid: { color: "rgba(200, 200, 200, 0.2)" },
          title: { display: true, text: "Temperature (°C)", color: "white" },
        },
      },
    },
  });
}

async function updateHumidityWindChart(city) {
  const forecastData = await getFetchData("forecast", city);
  const days = [];
  const humidity = [];
  const windSpeed = [];

  forecastData.list.forEach((entry) => {
    const date = entry.dt_txt.split(" ")[0];
    if (!days.includes(date)) {
      days.push(date);
      humidity.push(entry.main.humidity);
      windSpeed.push(entry.wind.speed);
    }
  });

  if (humidityWindChart) {
    humidityWindChart.destroy(); // Destroy the existing chart before creating a new one
  }

  humidityWindChart = new Chart(chartCanvas3, {
    type: "line",
    data: {
      labels: days,
      datasets: [
        {
          label: "Humidity (%)",
          data: humidity,
          borderColor: "rgba(75, 192, 192, 1)", // Teal
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          yAxisID: "y1",
          pointBackgroundColor: "#ffffff",
        },
        {
          label: "Wind Speed (m/s)",
          data: windSpeed,
          pointBackgroundColor: "#ffffff",
          borderColor: "rgba(255, 206, 86, 1)", // Yellow
          backgroundColor: "rgba(255, 206, 86, 0.2)",
          yAxisID: "y2",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: "white" },
        },
      },
      scales: {
        y1: {
          type: "linear",
          position: "left",
          ticks: { color: "white" },
          title: { display: true, text: "Humidity (%)", color: "white" },
        },
        y2: {
          type: "linear",
          position: "right",
          grid: { drawOnChartArea: false },
          ticks: { color: "white" },
          title: { display: true, text: "Wind Speed (m/s)", color: "white" },
        },
        x: {
          ticks: { color: "white" },
          grid: { color: "rgba(200, 200, 200, 0.2)" },
        },
      },
    },
  });
}

// Updated getWeatherAnalysis to dynamically update all charts
async function getWeatherAnalysis(city) {
  try {
    console.log("Fetching analysis for city:", city);
    const response = await fetch(
      `https://weather-app-emiw.onrender.com/api/analysis?city=${city}`
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    console.log("Received analysis data:", data);

    if (data.error) {
      console.log("Error in analysis data:", data.error);
      document.getElementById("analysis-report").style.display = "none";
      updateSection(notFoundSection);
    } else {
      console.log("Displaying analysis report");
      document.getElementById("analysis-report").style.display = "block";
      predictionElement.textContent = `Predicted Temperature for 6th Day: ${data.prediction}`;

      // Update all charts
      updateChart(data.days, data.temperature, city); // Graph 1
      await updateTempVariationChart(city); // Graph 2
      await updateHumidityWindChart(city); // Graph 3
    }
  } catch (error) {
    console.error("Error fetching analysis:", error);
    document.getElementById("analysis-report").style.display = "none";
    updateSection(notFoundSection);
  }
}
