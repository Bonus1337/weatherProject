const express = require("express");

const https = require("https");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  const query = req.body.city;
  const apiKey = "614fa9ef6c5643304c0b0c69e34b14ff";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}`;

  https.get(url, function (response) {
    console.log(response.statusCode);

    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const temp = (weatherData.main.temp - 273.15) | 0;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const iconUrl = "http://openweathermap.org/img/w/" + icon + ".png";
      res.write("<p>The weather is currently " + weatherDescription + "</p>");
      res.write(
        `<h1>The temperature in ${query} is ${temp} degrees Celcius.</h1>`
      );
      res.write("<img src=" + iconUrl + ">");
      res.send();
    });
  });
});

app.listen(3000, () => console.log("Server is running on port 3000"));
