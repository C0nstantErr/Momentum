'use strict';
/*================= 1. date ad time ============================= */
const time = document.querySelector('.time');
const date = document.querySelector('.date');

function showTime() {
  const currentDate = new Date();
  const dayTime = getTimeOfDay(currentDate);

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

function getTimeOfDay(d) {
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
  personName.value = null;
}

function changeFocus(e) {
  if (e.keyCode === 13 || e.keyCode === 27) {
    e.target.blur();
  }
}
/*================= 3. change img ============================= */