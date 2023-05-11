$(document).ready(function () {

    //clear history button
    let clearHistory = document.getElementById('clear-history');
    clearHistory.onclick = function() {
    localStorage.clear();
    clearSearchHistoryUI();
    };

    function clearSearchHistoryUI() {
        let cityElements = [cityOne, cityTwo, cityThree, cityFour, cityFive, citySix, citySeven, cityEight];
        cityElements.forEach((city) => {
        city.textContent = "";
        });
      }

    //declaring variables and looping the local storage to the UI
    let cityOne = document.getElementById('city-1')
    let cityTwo = document.getElementById('city-2')
    let cityThree = document.getElementById('city-3')
    let cityFour = document.getElementById('city-4')
    let cityFive = document.getElementById('city-5')
    let citySix = document.getElementById('city-6')
    let citySeven = document.getElementById('city-7')
    let cityEight = document.getElementById('city-8')
    
    let history = JSON.parse(localStorage.getItem("history"));

    if (history !== null && history !== undefined) {
    for (let i = 0; i < history.length; i++) {
    let city = document.getElementById(`city-${i+1}`);
      city.onclick = function() {
      searchWeather(history[i]);
    };
    if (history.length > 0) cityOne.textContent = history[0];
    if (history.length > 1) cityTwo.textContent = history[1];
    if (history.length > 2) cityThree.textContent = history[2];
    if (history.length > 3) cityFour.textContent = history[3];
    if (history.length > 4) cityFive.textContent = history[4];
    if (history.length > 5) citySix.textContent = history[5];
    if (history.length > 6) citySeven.textContent = history[6];
    if (history.length > 7) cityEight.textContent = history[7];
  }
}
  
   //function to save the user input as a search value
   $("#search-button").on("click", function(){
    var searchValue = $("#search-value").val();
    console.log(searchValue);
    $("#search-value").val("");
    saveSearchHistory(searchValue);
    searchWeather(searchValue);
    
});

    //function that saves search history to local storage
    function saveSearchHistory(searchValue) {
        let searchHistory = JSON.parse(localStorage.getItem("history")) || [];
        searchHistory.push(searchValue);
        localStorage.setItem("history", JSON.stringify(searchHistory));

        // update the city elements on the UI
        let cityElements = [cityOne, cityTwo, cityThree, cityFour, cityFive, citySix, citySeven, cityEight];
        for (let i = 0; i < searchHistory.length && i < cityElements.length; i++) {
        cityElements[i].textContent = searchHistory[i];
        }
    }
   
    //APIkey from openweatherAPI
    let APIkey ="9f1a5aabe8598c1da8fae3c2f589e48d"

    for (let i = 0; i < history.length; i++) {
        let city = document.getElementById(`city-${i+1}`);
        city.onclick = function() {
          searchWeather(history[i]);
        };
      }
      
    //fetch call with the user input
    function searchWeather(searchValue) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchValue}&appid=${APIkey}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data,"Data 1");

        //formula to convert Kelvin to Fahrenheit 
        let tempF = ((data.main.temp - 273.15) * 1.80 + 32).toFixed(1);
        
        //setting variables for lattitude and longitude for API call
        let lattitude = data.coord.lat
        let longitude = data.coord.lon

        //grabbing the values from the data object and assigning them to HTML ids
        $(".forecast-temp").text("Temperature: " + tempF + " °F")
        $(".forecast-hws").text("Humidity: " + data.main.humidity + "%")
        $(".forecast-ws").text("Wind: " + data.wind.speed + " MPH")
    
        //second fetch call to get the five day forecast
         fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lattitude}&lon=${longitude}&appid=${APIkey}`)
          .then(response => response.json())
           .then(data2 => {
            console.log(data2,"Data 2");
        
            function timeConverter(date) {
                return new Date(date).toLocaleDateString();
              }
              
              //setting variables for the various days of the forecast
              if (data2.list && data2.list.length >= 6) {
                const today = dayjs().format('MM/DD/YYYY');
                const dayOne = dayjs(data2.list[8].dt * 1000).format('MM/DD/YYYY');
                const dayTwo = dayjs(data2.list[16].dt * 1000).format('MM/DD/YYYY');
                const dayThree = dayjs(data2.list[24].dt * 1000).format('MM/DD/YYYY');
                const dayFour = dayjs(data2.list[32].dt * 1000).format('MM/DD/YYYY');
                const dayFive = dayjs(data2.list[39].dt * 1000).format('MM/DD/YYYY');
              
                //grabbing the forecast date and assigning them to the HTML
                $(".forecast-ones").text(timeConverter(dayOne));
                $(".forecast-twos").text(timeConverter(dayTwo));
                $(".forecast-threes").text(timeConverter(dayThree));
                $(".forecast-fours").text(timeConverter(dayFour));
                $(".forecast-fives").text(timeConverter(dayFive));
              
                // Grabbing city name value and assigning them to the HTML
                $(".city-name").text(searchValue + " " + today);
                $(".date-1").text(dayOne);
                $(".date-2").text(dayTwo);
                $(".date-3").text(dayThree);
                $(".date-4").text(dayFour);
                $(".date-5").text(dayFive);
                
              } else {
                // Display an error message or fallback text
                $(".city-name").text("Forecast data unavailable");
                $(".date-1").text("");
                $(".date-2").text("");
                $(".date-3").text("");
                $(".date-4").text("");
                $(".date-5").text("");
              }
              
        //url for the icons
        let iconURL = "https://openweathermap.org/img/w/";

        //grabbing icon value and assigning them to the HTML
        if (data2.list && data2.list.length > 0) {
            $("#icon-main").attr("src", iconURL + data2.list[0].weather[0].icon + ".png");
            $("#icon-one").attr("src", iconURL + data2.list[8].weather[0].icon + ".png");
            $("#icon-two").attr("src", iconURL + data2.list[16].weather[0].icon + ".png");
            $("#icon-three").attr("src", iconURL + data2.list[24].weather[0].icon + ".png");
            $("#icon-four").attr("src", iconURL + data2.list[32].weather[0].icon + ".png");
            $("#icon-five").attr("src", iconURL + data2.list[39].weather[0].icon + ".png");
          }

        //Kelvin to Fahrenheit formula
        let tempFOne = ((data2.list[8].main.temp - 273.15) * 1.80 + 32).toFixed(1);
        let tempFTwo = ((data2.list[16].main.temp - 273.15) * 1.80 + 32).toFixed(1);
        let tempFThree = ((data2.list[24].main.temp - 273.15) * 1.80 + 32).toFixed(1);
        let tempFFour = ((data2.list[32].main.temp - 273.15) * 1.80 + 32).toFixed(1);
        let tempFFive = ((data2.list[39].main.temp - 273.15) * 1.80 + 32).toFixed(1);

        //grabbing the forecast temp and assigning them to the HTML
        $(".forecast-temp-one").text("Temp: " + tempFOne + " °F");
        $(".forecast-temp-two").text("Temp: " + tempFTwo + " °F");
        $(".forecast-temp-three").text("Temp: " + tempFThree + " °F");
        $(".forecast-temp-four").text("Temp: " + tempFFour + " °F");
        $(".forecast-temp-five").text("Temp: " + tempFFive + " °F");

        //grabbing the forecast humidity data and assigning them to the HTML
        $(".forecast-hum-one").text("Humidity: " + data2.list[8].main.humidity + "%");
        $(".forecast-hum-two").text("Humidity: " + data2.list[16].main.humidity + "%");
        $(".forecast-hum-three").text("Humidity: " + data2.list[24].main.humidity + "%");
        $(".forecast-hum-four").text("Humidity: " + data2.list[32].main.humidity + "%");
        $(".forecast-hum-five").text("Humidity: " + data2.list[39].main.humidity + "%");

        //grabbing the forecast wind speed data and assigning them to the HTML
        $(".forecast-ws-one").text("Wind: " + data2.list[8].wind.speed + " MPH");
        $(".forecast-ws-two").text("Wind: " + data2.list[16].wind.speed + " MPH");
        $(".forecast-ws-three").text("Wind: " + data2.list[24].wind.speed + " MPH");
        $(".forecast-ws-four").text("Wind: " + data2.list[32].wind.speed + " MPH");
        $(".forecast-ws-five").text("Wind: " + data2.list[39].wind.speed + " MPH");
        })

            .catch(error => {
            console.error('Error:', error);
            });
        }
     )
            .catch(error => {
            console.error('Error:', error);
            });
        }
    }
)