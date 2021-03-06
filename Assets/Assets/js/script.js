// var userFormEl = document.querySelector('#user-form');
// var citySearchEl = document.querySelector('#citySearch')

// Setting variables to link querySelectors in HTML
var stateNameIP = document.querySelector('#stateName');
var cityIP = document.querySelector('#city');
var zipCodeIP = document.querySelector('#zipCode');
var latIP = document.querySelector('#lat');
var lonIP = document.querySelector('#lon');
var ISP = document.querySelector('#ISP');
var populationIP = document.querySelector('#population');

// Fetch call at PageLoad to obtain user's IP address and relevant information
var freeGeoIP = 'https://api.freegeoip.app/json/?apikey=74824920-b48a-11ec-aeb7-87f5f0610281';

fetch(freeGeoIP)
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
            //Populating IP address and relevant info to HTML 
            console.log(data);
            console.log(data.region_name)
            stateNameIP.textContent = data.region_name;
            cityIP.textContent = data.city;
            zipCodeIP.textContent = data.zip_code;
            latIP.textContent = data.latitude;
            lonIP.textContent = data.longitude;
            ISP.textContent = data.ip;
            // Creating variables to pass down to next function
            var ownCity = data.city;
            var ownState = data.region_name;
            // To use Teleport API as we want, must obtain GeoNameId 
            getCityGeonameID(ownCity, ownState);
            });
        } else {
            console.log(response.statusText);
        }
    })
    .catch(function (error) {
          console.log('Fetch Error -', error);
    });

// Function for obtaining Teleport GeoNameID for IP address city
var getCityGeonameID = function (ownCity, ownState){
    var teleportCity = "https://api.teleport.org/api/cities/?search="+ownCity+","+ownState;
    fetch(teleportCity)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                // Saving ID link to a variable
                console.log(data);            
                var cityGeonameIDlink = data._embedded['city:search-results'][0]._links['city:item'].href
                //Passing ID to next fetch function, which will get nearest Urban Area/city to IP address city    
                getNearestUrbanArea(cityGeonameIDlink)
                });
            } else {
                console.log(response.statusText);
            }
        })
        .catch(function (error) {
            console.log('Fetch Error -', error);
    });
}
//Fetch function for getting nearest Urban Area/city to IP address city
var getNearestUrbanArea = function(cityGeonameIDlink){
    fetch(cityGeonameIDlink)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                //Getting population number for IP address city and displaying to HTML 
                populationIP.textContent = data.population
                // Saving nearest Teleport Urban Area to a variable
                var urbanArea = data._links['city:urban_area'].href
                //Passing urban area/city to next function    
                getUrbanAreaQualOfLifeScores(urbanArea);
                });
            } else {
                console.log(response.statusText);
            }
        })
        .catch(function (error) {
            console.log('Fetch Error -', error);
        });
}
// Fetch function for obtaining nearest urban area/city quality of life Teleport scores
var getUrbanAreaQualOfLifeScores = function(urbanArea){
    fetch(urbanArea+'scores/')
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                console.log(data);
                });
            } else {
                console.log(response.statusText);
            }
        })
        .catch(function (error) {
            console.log('Fetch Error -', error);
        });
}
// Creating dropdown menu for user to obtain other Teleport city scores
// let dropdown = document.getElementById('city-dropdown');
// dropdown.length = 0;

// let defaultOption = document.createElement('option');
// defaultOption.text = 'Choose a City';

// dropdown.add(defaultOption);
// dropdown.selectedIndex = 0;

// const url = 'https://developers.teleport.org/assets/urban_areas.json';

// fetch(url)  
//     .then(function(response) {  
//         if (response.ok) {  
//             response.json().then(function(data) {
//                 console.log(data);  
//             // let option;
//             //     for (let i = 0; i < data.length; i++) {
//             //     option = document.createElement('option');
//             //     option.text = data[i].name;
//             //     option.value = data[i].abbreviation;
//             //     dropdown.add(option);
//     	    //     }    
//             });
//       } else {
//             console.log(response.statusText);
//       }
//     })  
//     .catch(function(error) {  
//         console.error('Fetch Error -', error);  
//     });

    // document.addEventListener('DOMContentLoaded', function() {
    //     var elems = document.querySelectorAll('.dropdown-trigger');
    //     var instances = M.Dropdown.init(elems, options);
    //   });
    //   instance.open();
    

// var formSubmitHandler = function (event) {
//     event.preventDefault();
  
//     var cityName = citySearchEl.value.trim();
  
//     if (cityName) {
//       getCityQualityInfo(cityName);
  
//     //   cityContainerEl.textContent = '';
//       citySearchEl.value = '';
//     } else {
//       alert('Please enter a city name');
//     }
//   };


//   userFormEl.addEventListener('submit', formSubmitHandler);