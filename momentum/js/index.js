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
}

function getLocalStorage() {
  let name = localStorage.getItem('name');
  if (name) {
    personName.value = name; 
  }
}

window.addEventListener('beforeunload', setLocalStorage);
window.addEventListener('load', getLocalStorage);
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
