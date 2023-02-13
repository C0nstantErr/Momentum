'use strict';
/*================= 1. date ad time ============================= */
const time = document.querySelector('.time');
const date = document.querySelector('.date');

function showTime() {
  const currentDate = new Date();
  time.textContent = currentDate.toLocaleTimeString();
  showDate(currentDate);
  // setTimeout(showTime, 1000);
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

// showTime();
setInterval(showTime, 1000);
/*================= 2. greetings ============================= */
