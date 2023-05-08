$(document).ready(function () {
    //function to save the user input as a search value
    $("#search-button").on("click", function(){
        var searchValue = $("#search-value").val();
        console.log(searchValue);
        $("#search-value").val("");
        searchWeather(searchValue);
    })
    //function for search history and store to local storage
    $("#search-button").on("click", function () {
        var searchHistory = $("#search-value").val();
        console.log(searchHistory)
        localStorage.setItem("history", JSON.stringify(searchHistory))
    })
})
