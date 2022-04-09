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
var pageLoad = true;

// Fetch call at PageLoad to obtain user's IP address and relevant information
var freeGeoIP = 'https://api.freegeoip.app/json/?apikey=74824920-b48a-11ec-aeb7-87f5f0610281';

fetch(freeGeoIP)
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
            //Populating IP address and relevant info to HTML 
            console.log(data);
            console.log(data.region_name);
            document.querySelector('#ip-address').textContent = data.ip;
            document.querySelector('#state').textContent = data.region_name;
            document.querySelector('#city').textContent = data.city;
            document.querySelector('#zip-code').textContent = data.zip_code;
            document.querySelector('#latitude').textContent = data.latitude;
            document.querySelector('#longitude').textContent = data.longitude;
            // stateNameIP.textContent = data.region_name;
            // cityIP.textContent = data.city;
            // zipCodeIP.textContent = data.zip_code;
            // latIP.textContent = data.latitude;
            // lonIP.textContent = data.longitude;
            // ISP.textContent = data.ip;
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
                // populationIP.textContent = data.population
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
                document.querySelector('#quality-score').textContent = data.teleport_city_score.toFixed(2);
                    for (let i = 0; i < data.categories.length; i++) {
                        if(data.categories[i].name == 'Cost of Living')
                            document.querySelector('#cost-of-living').textContent = data.categories[i].score_out_of_10.toFixed(2);
                        if(data.categories[i].name == 'Safety')
                            document.querySelector('#safety').textContent = data.categories[i].score_out_of_10.toFixed(2);
                        if(data.categories[i].name == 'Environmental Quality')
                            document.querySelector('#environmental-quality').textContent = data.categories[i].score_out_of_10.toFixed(2);
                        if(data.categories[i].name == 'Taxation')
                            document.querySelector('#taxation').textContent = data.categories[i].score_out_of_10.toFixed(2);
                        if(data.categories[i].name == 'Internet Access')
                            document.querySelector('#internet-access').textContent = data.categories[i].score_out_of_10.toFixed(2);
                    }

                    // 
                    if(!pageLoad){
                        var cookie_data = '', found = false, new_cookie_data = '';
                        if(getCookie('search-history')){
                            cookie_data = getCookie('search-history');
                            cookie_data = cookie_data.split(':');
                            for (var i = 0; i < cookie_data.length; i++) {
                                if(cookie_data[i] != ''){
                                    var x = cookie_data[i].split('=');
                                    if(x[0] == dropdown.options[dropdown.selectedIndex].text){
                                        found = true;
                                        new_cookie_data += x[0] + '=' + data.teleport_city_score.toFixed(2) + ':';
                                    }else{
                                        new_cookie_data += x[0] + '=' + x[1] + ':';
                                    }
                                }
                            }
                        }
                        if(!found){
                            new_cookie_data += dropdown.options[dropdown.selectedIndex].text + '=' + data.teleport_city_score.toFixed(2) + ':';
                        }
                        setCookie('search-history', new_cookie_data, 365);
                        setSearchHistory();
                    }
                    // 

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
let dropdown = document.getElementById('city-dropdown');
// dropdown.length = 0;

// let defaultOption = document.createElement('option');
// defaultOption.text = 'Choose a City';

// dropdown.add(defaultOption);
// dropdown.selectedIndex = 0;

const cities_url = './Assets/urban_areas.json';

function getCitiesData(){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', cities_url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        var data = JSON.parse(JSON.stringify(xhr.response));
        for (var k in data){
            if (data.hasOwnProperty(k)) {
                var option = document.createElement('option');
                option.text = k;
                option.value = data[k];
                dropdown.add(option);
                // console.log("Key is " + k + ", value is " + );
            }
        }
        // console.log(data);
        // xhr.response.json().then(function(data) {
        //         console.log(data);  
        //     // let option;
        //     //     for (let i = 0; i < data.length; i++) {
        //     //     option = document.createElement('option');
        //     //     option.text = data[i].name;
        //     //     option.value = data[i].abbreviation;
        //     //     dropdown.add(option);
        //  //     }    
        //     });
      } else {  
      }
    }
    xhr.send();
}

getCitiesData();

function fetchcitydata(){
    if(dropdown.value && dropdown.value != ''){
        pageLoad = false;
        var url = 'https://api.teleport.org/api/urban_areas/slug:'+dropdown.value+'/';
        getUrbanAreaQualOfLifeScores(url);
        document.getElementById('h3-location-name').textContent = dropdown.options[dropdown.selectedIndex].text;

    }
}

// fetch(cities_url)  
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

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setSearchHistory(){
    document.getElementById('search-history').innerHTML = '';
    if(getCookie('search-history')){
        var cookie_data = getCookie('search-history'), html = '';
        cookie_data = cookie_data.split(':');
        for (var i = 0; i < cookie_data.length; i++) {
            if(cookie_data[i] != ''){
                var d = cookie_data[i].split('=');
                html += '<p>'+d[0]+': '+d[1]+'</p>';
            }
        }
        document.getElementById('search-history').innerHTML = html;
    }
}

setSearchHistory();