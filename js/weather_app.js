const api = {
    key:'your-openweather-api-key-here',
    baseurl: 'https://api.openweathermap.org/data/2.5/'
}

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);

let now = new Date();
const forecast = document.querySelector('.forecast');

function setQuery(evt){
    if (evt.keyCode == 13){
        getLocation(searchbox.value);
    }
}

function getLocation(query){
    fetch(`${api.baseurl}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then(location => {
        return location.json();
    }).then(getResults);
}

function getResults(location){
    let lon = location.coord.lon;
    let lat = location.coord.lat;
    let city = document.querySelector('.location .city');
    city.innerHTML = `${location.name}, ${location.sys.country}`;
    fetch(`${api.baseurl}onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=metric&APPID=${api.key}`)
    .then(weather => {
        return weather.json();
    }).then(displayCurrent);
}

function displayCurrent(weather){
    let date = document.querySelector('.location .date');
    date.innerHTML = dateBuilder(now);

    let temp = document.querySelector('.current .temp');
    temp.innerHTML = `${Math.round(weather.current.temp)}<span>°C</span>`;

    let weather_el = document.querySelector('.current .weather');
    weather_el.innerText = weather.current.weather[0].main;

    let feels_like = document.querySelector('.feels-like');
    feels_like.innerText = `Feels like ${Math.round(weather.current.feels_like)}°C`;
    displayForecast(weather.daily);
}

function displayForecast(weather){
    weather.splice(5,3);
    for (let i=0;i<weather.length;i++){
        createDay(weather[i], i+1);
    }
}

function createDay(day, to_add){
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let n = now.getDay() + to_add;
    let name = n <= 6 ? days[n] : days[n - 7];
    const item = document.createElement('div');
    item.classList.add('day');
    
    item.innerHTML = `<div class="name">${name}</div>
                        <div class="temp">${Math.round(day.temp.max)}° / ${Math.round(day.temp.min)}°</div>
                        <div class="weather">${day.weather[0].main}</div>`;
    forecast.appendChild(item);                   
}

function dateBuilder(d){
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
}