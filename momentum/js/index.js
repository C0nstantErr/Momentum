'use strict';
/*================= 1. date ad time ============================= */
const time = document.querySelector('.time');
const date = document.querySelector('.date');

function showTime() {
  const currentDate = new Date();
  // const dayTime = getTimeOfDay(currentDate);
  const dayTime = getTimeOfDay();

  time.textContent = currentDate.toLocaleTimeString();

  showDate(currentDate);
  showGreetings(dayTime);
}

function showDate(d) {
  const options = {
    month: 'long',
    day: '2-digit', 
    weekday: 'long',
    timeZone: 'UTC'
  }
  date.textContent = (d.toLocaleDateString('en-US', options));
}

setInterval(showTime, 1000);
/*================= 2. greetings ============================= */
const greetingText = document.querySelector('.greeting__text');
const personName = document.querySelector('.name');
const timesOfDay = ['night', 'morning', 'afternoon', 'evening'];

// function getTimeOfDay(d) {
//   let hour = d.getHours();
//   let timeOfDay = timesOfDay[Math.floor(hour / 6)];
//   return timeOfDay; 
// }

function getTimeOfDay() {
  let d = new Date();
  let hour = d.getHours();
  let timeOfDay = timesOfDay[Math.floor(hour / 6)];
  return timeOfDay; 
}

function showGreetings(time) {
  if (localStorage.getItem('name')) {
    greetingText.textContent = `Good ${time},`;
  } else {
    greetingText.textContent = `Good ${time}`;
  }
}

function setLocalStorage() {
  localStorage.setItem('name', personName.value);
  localStorage.setItem('city', city.value);
}

function getLocalStorage() {
  let name = localStorage.getItem('name');
  if (name) {
    personName.value = name; 
  }
  city.value = localStorage.getItem('city') || 'Minsk';
  // console.log('get', city.value);
}

window.addEventListener('beforeunload', setLocalStorage);
window.addEventListener('load', getLocalStorage);
window.addEventListener('load',  getWeather);
personName.addEventListener('focus', removeValue);
personName.addEventListener('keydown', changeFocus);

function removeValue() {
  this.value = null;
}

function changeFocus(e) {
  if (e.keyCode === 13 || e.keyCode === 27) {
    e.target.blur();
  }
}
/*================= 3. change img ============================= */
const imgWrapper = document.querySelector('.wrapper');
const slidePrev = document.querySelector('.slider-icon_prev');
const slideNext = document.querySelector('.slider-icon_next');
let randomNum = getRandomNum(1, 20);

slidePrev.addEventListener('click', getSlidePrev);
slideNext.addEventListener('click', getSlideNext);

function getRandomNum(min, max) {
 return Math.floor(Math.random() * (max - min + 1) + min);
}

function getSlideNext() {
  if (randomNum < 20) {
    randomNum += 1; 
  } else randomNum = 1; 
  setBg(imgWrapper);
}

function getSlidePrev() {
  if (randomNum > 1) {
    randomNum -= 1; 
  } else randomNum = 20; 
  setBg(imgWrapper);
}

function padZero(s, n) {
  if (s.length < n) { 
    return s.padStart(n, '0');
  }
  return s;
}

function setBg(elem) {
  const source = 'https://raw.githubusercontent.com/C0nstantErr/momentum_img/main/img';
  let timeOfDay = getTimeOfDay();
  let imgIndex = padZero(randomNum.toString(), 2);
  const img = new Image();
  const url = `${source}/${timeOfDay}/${imgIndex}.webp`;
  img.src = url;
  console.log(img);
  img.onload = () => {
    elem.style.backgroundImage = `url("${source}/${timeOfDay}/${imgIndex}.webp")`;
  }
}

setBg(imgWrapper);

/*================= 4. weather ============================= */
const city = document.querySelector('.city');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const weatherErorr = document.querySelector('.weather-error');

city.addEventListener('change', getWeather);
city.addEventListener('keydown', changeFocus);

async function getWeather() {
  let cityName = city.value;
  let lang = 'en';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&lang=${lang}&appid=e25844e58c1fb53f5fd60c34379f7f12&units=metric`;
 
  const result = await fetch(url);
  if (result.ok) {
    const data = await result.json();
    weatherErorr.classList.remove('happen');
    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    weatherDescription.textContent = data.weather[0].description;
    temperature.textContent = `${data.main.temp}${String.fromCharCode(67)}${String.fromCharCode(176)}`;
    wind.textContent = `Wind speed: ${Math.round(data.wind.speed)}m/s`;
    humidity.textContent = `Humidity: ${Math.round(data.main.humidity)}${String.fromCharCode(37)}`;
  } else {
    weatherErorr.classList.add('happen');
    weatherIcon.className = 'weather-icon owf';
    weatherDescription.textContent = null;
    temperature.textContent = null;
    wind.textContent = null;
    humidity.textContent = null;
  }
}
/*================= 5. quote ============================= */
const author = document.querySelector('.quote__author');
const quote = document.querySelector('.quote__text');
const quoteReload = document.querySelector('.change-quote');
let index; 

async function getQuotes() {
  const url = 'https://raw.githubusercontent.com/C0nstantErr/momentum_img/main/quotes/quotes.json';
  const result = await fetch(url);
  const data = await result.json();

  let i;
  do {
    i = getRandomNum(0, data.quotes.length-1);
  } while (i === index);
  index = i; 

  quote.textContent = `'${data.quotes[i].quote}'`;
  author.textContent = data.quotes[i].author;
  
}

document.addEventListener('DOMContentLoaded', getQuotes);
quoteReload.addEventListener('click', getQuotes);
