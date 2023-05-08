$(document).ready(function () {
    //function to save the user input as a search value
    $("#search-button").on("click", function(){
        var searchValue = $("#search-value").val();
        console.log(searchValue);
        $("#search-value").val("");
        searchWeather(searchValue);
    });
    //function for search history and store to local storage
    $("#search-button").on("click", function () {
        var searchHistory = $("#search-value").val();
        console.log(searchHistory)
        localStorage.setItem("history", JSON.stringify(searchHistory))
    });

    //APIkey from openweatherAPI
    let APIkey ="a07bb7b0548f60a69959f3c0e403e4ce"

    //AJAX call with the user input
    function searchWeather(searchValue) {
    $.ajax({
        type: "GET",
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&appid=" + APIkey,
        dataType: "json",
        success: function (data) {

            //formula to convert Kelvin to Fahrenheit 
            let tempF = ((data.main.temp - 273.15) * 1.80 + 32).toFixed(1);
            
            //setting variables for lattitude and longitude for API call
            let lattitude = data.coord.lat
            let longitude = data.coord.lon

            //grabbing the values from the data object and assigning them to HTML ids
            $(".forecast-temp").text("Temperature (F): " + tempF)
            $(".forecast-hws").text("Humidity: " + data.main.humidity)
            $(".forecast-ws").text("Wind Speed: " + data.wind.speed)
        }
    });
  
    //second AJAX call to get the five day forecast
    $.ajax({
        type: "GET",
        url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + lattitude + "&lon=" + longitude + "&exclude=hourly,minutely,current,alerts&appid=" + APIkey,
        dataType: "json",
        success: function (data2) {

            //setting variables for the various days of the forecas
            let today = data2.daily[0].dt
            let dayOne = data2.daily[1].dt
            let dayTwo = data2.daily[2].dt
            let dayThree = data2.daily[3].dt
            let dayFour = data2.daily[4].dt
            let dayFive = data2.daily[5].dt

            //function that converts the date value into mm/dd/yyyy
            function timeConverter(value) {
                var dt = new Date(value * 1000);
                var year = dt.getFullYear();
                var month = (dt.getMonth() + 1);
                var newdate = dt.getDate();
                var formattedTime = month + '/' + newdate + '/' + year
                console.log(formattedTime);
                return (formattedTime);
            };

             //url for the icons
             let iconURL = "https://openweathermap.org/img/w/";

             //grabbing city name value and assigning them to the HTML
             $(".city-name").text(searchValue + " " + timeConverter(today));

             //grabbing icon value and assigning them to the HTML
             $("#icon-main").attr("src", iconURL + data2.daily[0].weather[0].icon + ".png")
             $("#icon-one").attr("src", iconURL + data2.daily[1].weather[0].icon + ".png")
             $("#icon-two").attr("src", iconURL + data2.daily[1].weather[0].icon + ".png")
             $("#icon-three").attr("src", iconURL + data2.daily[1].weather[0].icon + ".png")
             $("#icon-four").attr("src", iconURL + data2.daily[1].weather[0].icon + ".png")
             $("#icon-five").attr("src", iconURL + data2.daily[1].weather[0].icon + ".png")

             //grabbing the forecast date and assigning them to the HTML
             $(".forecast-ones").text(timeConverter(dayOne));
             $(".forecast-twos").text(timeConverter(dayTwo));
             $(".forecast-threes").text(timeConverter(dayThree));
             $(".forecast-fours").text(timeConverter(dayFour));
             $(".forecast-fives").text(timeConverter(dayFive));


        }
    })
    }
})
