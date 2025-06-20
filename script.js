const weatherApiKey = "4eaee633f1d74fa185890753252006";
const loading = document.getElementById("loading");

let weatherChart;
let cryptoChart;

function getWeather() {
  const city = document.getElementById("citySelector").value;
  loading.style.display = "inline";

  fetch(`https://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${city}&days=1&aqi=no&alerts=no`)
    .then(res => res.json())
    .then(data => {
      const current = data.current;
      const forecast = data.forecast.forecastday[0].hour;

      // Display weather
      document.getElementById('weather-data').innerText =
        `${data.location.name}: ${current.temp_c}°C, ${current.condition.text}`;

      // AI Suggestion
      const suggestion = current.temp_c > 35 ? "🥵 Stay Hydrated!" :
                         current.temp_c < 20 ? "🧥 Wear Warm Clothes!" :
                         "🌤️ Great day to go out!";
      document.getElementById("ai-suggestion").innerText = suggestion;

      // Temperature chart
      const labels = forecast.map(f => f.time.split(" ")[1]);
      const temps = forecast.map(f => f.temp_c);

      if (weatherChart) weatherChart.destroy();
      const ctx = document.getElementById("weatherChart").getContext("2d");
      weatherChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: "Hourly Temp (°C)",
            data: temps,
            borderColor: "orange",
            backgroundColor: "rgba(255,165,0,0.2)",
            tension: 0.3,
            fill: true
          }]
        },
        options: {
          responsive: true
        }
      });

      loading.style.display = "none";
    })
    .catch(err => {
      console.error(err);
      document.getElementById("weather-data").innerText = "❌ Error loading weather data";
      loading.style.display = "none";
    });
}

// Load default city on start
getWeather();

// Load real-time crypto chart
function loadCryptoChart() {
  fetch("https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=inr&days=1")
    .then(res => res.json())
    .then(data => {
      const prices = data.prices.map(p => p[1]);
      const labels = data.prices.map((_, i) => `T${i}`);

      if (cryptoChart) cryptoChart.destroy();
      const ctx = document.getElementById("cryptoChart").getContext("2d");
      cryptoChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: "Bitcoin Price (₹)",
            data: prices,
            borderColor: "green",
            backgroundColor: "rgba(0,255,0,0.1)",
            tension: 0.3,
            fill: true
          }]
        },
        options: {
          responsive: true
        }
      });

      document.getElementById('crypto-data').innerText =
        `₹${prices[prices.length - 1].toLocaleString()}`;
    })
    .catch(err => {
      document.getElementById('crypto-data').innerText = "❌ Failed to load";
      console.error(err);
    });
}

loadCryptoChart();

// Dark mode toggle
document.getElementById("toggle-theme").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});
