const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');
const notFoundSection = document.querySelector('.not-found');
const searchCitySection = document.querySelector('.search-city');
const weatherInfoSection = document.querySelector('.weather-info');

const countryTxt = document.querySelector('.country');
const dateTxt = document.querySelector('.current-date-txt')
const weatherSummaryImg = document.querySelector('.weather-summary-img')
const tempTxt = document.querySelector('.temp-txt')
const conditionTxt = document.querySelector('.condition-txt')
const humidityTxt = document.querySelector('.humidity-val-txt')
const windTxt = document.querySelector('.wind-val-txt')

const forecastItemsContainer = document.querySelector('.forecast-items-container');


const apikeys = '6ecf558e5b8c3dfebb76243730d29e93';
searchBtn.addEventListener('click', () =>{
    if(cityInput.value.trim()!=''){
        updateWeatherInfo(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
})

cityInput.addEventListener('keydown', (event)=>{
    if(event.key == 'Enter' && cityInput.value.trim()!=''){
        updateWeatherInfo(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
})

function getWeatherIcon(id){
    if( id <= 232 ) return 'thunderstorm.svg';
    if( id <= 321 ) return 'drizzle.svg';
    if( id <= 531 ) return 'rain.svg';
    if( id <= 622 ) return 'snow.svg';
    if( id <= 781 ) return 'atmosphere.svg';
    if( id <= 800 ) return 'clear.svg';
    if( id <= 804 ) return 'clouds.svg';
}

function getCurrentDate(){
    const currentDate = new Date();
    const options = {
        weekday : 'short',
        day: '2-digit',
        month: 'short'
    }
    return currentDate.toLocaleDateString('en-GB', options)
}

async function getFetchData(endPoint, city){
    const apiURL = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apikeys}&units=metric`;
    const response = await fetch(apiURL)
    return response.json();
}

async function updateWeatherInfo(city){
    const weatherData = await getFetchData('weather',city);
    if(weatherData.cod!=200){
        showDisplaySection(notFoundSection)
        return;
    }
    // console.log(weatherData);

    const {
        name : country,
        main : {temp, humidity},
        weather : [{id, main}],
        wind : {speed},

    }=weatherData;

    countryTxt.textContent = country;
    tempTxt.textContent = Math.round(temp) + ' °C'
    humidityTxt.textContent = humidity+'%';
    windTxt.textContent = speed+' M/s';
    conditionTxt.textContent = main;
    weatherSummaryImg.src = `./weather/${getWeatherIcon(id)}`;
    dateTxt.textContent = getCurrentDate();

    await updateForecastInfo(city);


    showDisplaySection(weatherInfoSection);
}

async function updateForecastInfo(city) {
    const forecastsData = await getFetchData('forecast', city)
    const timeTaken = '12:00:00';
    const todayDate = new Date().toISOString().split('T')[0];
    console.log(todayDate);

    forecastItemsContainer.innerHTML='';

    
    forecastsData.list.forEach(forecastWeather =>{
        if(forecastWeather.dt_txt.includes(timeTaken) &&
            !forecastWeather.dt_txt.includes(todayDate)){ 
                updateForecastItems(forecastWeather);
        }
    })
}

function updateForecastItems(weatherData){
    console.log(weatherData)
    const {
        dt_txt: date,
        weather : [{ id }],
        main : { temp }
    } = weatherData

    const dateTaken = new Date(date);
    const dateOption = {
        day : '2-digit',
        month : 'short'
    }

    const dateResult = dateTaken.toLocaleDateString('en-US',dateOption);
    const forecastItem = ` 
        <div class="forecast-item">
            <h5 class="forecast-date-txt regular-txt">${dateResult}</h5>
            <img src="./weather/${getWeatherIcon(id)}" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
        </div>
    `
    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem)
    
}

function showDisplaySection(section){
    [weatherInfoSection, searchCitySection, notFoundSection]
    .forEach(section => section.style.display='none')

    section.style.display='flex';
}