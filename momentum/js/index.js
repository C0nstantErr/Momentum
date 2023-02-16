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

/*================= 6. audio player (simple) ============================= */
const player = document.querySelector('.player');
const playerControls = document.querySelector('.player__controls');
const playerList = document.querySelector('.player__list');
const playIcon = document.querySelector('.player__icon_play');
const audio = new Audio();
audio.currentTime = 0;
let playNum = 0; 
let isPlay = false;
const playList = [
  {
    title: 'Aqua Caelestis',
    src: './sounds/Aqua_Caelestis.mp3',
    duration: '39'
  },
  {
    title: 'River Flows In You',
    src: './sounds/River_Flows_In_You.mp3',
    duration: '97'
  },
  {
    title: 'Ennio Morricone',
    src: './sounds/Ennio_Morricone.mp3',
    duration: '97'
  },
  {
    title: 'Summer Wind',
    src: './sounds/Summer_Wind.mp3',
    duration: '110'
  }
];
const playListDuration = [];
let idShowCurMusTime; // id for set interval; 
let idChangeProgressBar; // id for set interval;
audio.src = playList[playNum].src; 

playList.forEach((item, index) => {
  let playItem = document.createElement('li');
  playItem.classList.add('play-item');
  playItem.textContent = item.title;
  playItem.dataset.index = index;
  playerList.append(playItem);

  let min = padZero(Math.floor(item.duration / 60).toString(), 2);
  let sec = padZero(Math.floor(item.duration % 60).toString(), 2);
  playListDuration.push(`${min}:${sec}`);
})

function showAudioDuration(elem, n) {
  elem.textContent = playListDuration[n];
}

function playAudio(e) {
  if (e.target.classList.contains('player__icon_play')) {
    if (!isPlay) {
      audio.play();
      isPlay = true;
      changePlayItemStyle(playerList.children[playNum]);
      e.target.classList.toggle('pause');
      showAudioDuration(duration, playNum);
      idShowCurMusTime = setInterval(showCurrentMusicTime, 500);
      idChangeProgressBar = setInterval(changeProgressBar, 500);
      showSongTitle(playerTitle, playNum, playList);

      // найти песню которой нужно поменять иконку
      // removeSongPlayIcon();
      findSong().classList.toggle('paused');
      // changeSongStatus();
    } else {
      audio.pause();
      isPlay = false;
      changePlayItemStyle(playerList.children[playNum]);
      e.target.classList.toggle('pause');
      clearInterval(idShowCurMusTime);
      clearInterval(idChangeProgressBar);
      // findSong().classList.toggle('paused');
      removeSongPlayIcon();
    }
    addSelectedStyle(playerList.children[playNum]);
  } else if (e.target.classList.contains('player__icon_prev')) {
    playNum = playNum > 0 ? --playNum : playList.length-1;
    audio.src = playList[playNum].src;
    addSelectedStyle(playerList.children[playNum]);
    showCurrentMusicTime();
    showAudioDuration(duration, playNum);
    showSongTitle(playerTitle, playNum, playList);
    setDefaultWidth(progressPlay, progressBarIndicator.offsetWidth);
    // clearInterval(idChangeProgressBar);
    if (isPlay) {
      audio.play();
      changePlayItemStyle(playerList.children[playNum]);

      removeSongPlayIcon();
      findSong().classList.toggle('paused');
      // showAudioDuration(duration, playNum);
    }
  } else if (e.target.classList.contains('player__icon_next')) {
    playNum = playNum < playList.length-1 ? ++playNum : 0;
    audio.src = playList[playNum].src;
    addSelectedStyle(playerList.children[playNum]);
    showCurrentMusicTime()
    showAudioDuration(duration, playNum);
    showSongTitle(playerTitle, playNum, playList);
    setDefaultWidth(progressPlay, progressBarIndicator.offsetWidth);
    // clearInterval(idChangeProgressBar);
    if (isPlay) {
      audio.play();
      changePlayItemStyle(playerList.children[playNum]);
      // showAudioDuration(duration, playNum);
      removeSongPlayIcon();
      findSong().classList.toggle('paused');
    }
  } else if (e.target.matches('.play-item')) {
   
    // e.target.classList.toggle ('paused');
    // console.log(playNum)
    // Array.from(playerList.children).forEach(item => item.classList.remove('paused'));
    // меняем иконку проигрыв
    // музыка не играла
    if (!isPlay) {
      playNum = +e.target.dataset.index;
      audio.src = playList[playNum].src;
      isPlay = true;
      audio.play(); // включаем музыку
      addSelectedStyle(playerList.children[playNum]);

      showAudioDuration(duration, playNum);
      idShowCurMusTime = setInterval(showCurrentMusicTime, 500);
      idChangeProgressBar = setInterval(changeProgressBar, 500);
      showSongTitle(playerTitle, playNum, playList);

      e.target.classList.add ('paused');
      playIcon.classList.add('pause');
    } else if (isPlay) {
      if (playNum === +e.target.dataset.index) {
        isPlay = false;
        audio.pause();
        playIcon.classList.remove('pause');
        e.target.classList.remove('paused');
        clearInterval(idShowCurMusTime);
        clearInterval(idChangeProgressBar);
      } else {
        Array.from(playerList.children).forEach(item => item.classList.remove('paused'));
        playNum = +e.target.dataset.index;
        audio.src = playList[playNum].src;
        audio.play();
        addSelectedStyle(playerList.children[playNum]);
        e.target.classList.add ('paused');
        
        showAudioDuration(duration, playNum);
        idShowCurMusTime = setInterval(showCurrentMusicTime, 500);
        idChangeProgressBar = setInterval(changeProgressBar, 500);
        showSongTitle(playerTitle, playNum, playList);
      }
      
    }
      
  }

}

function changePlayItemStyle(item) {
  Array.from(playerList.children).forEach(elem => {
    elem.classList.remove('item-active');
  });
  if(isPlay) {
    item.classList.add('item-active');
  }
}

function infinitePlay() {
  playNum = playNum < playList.length-1 ? ++playNum : 0;
  audio.src = playList[playNum].src;
  changePlayItemStyle(playerList.children[playNum]);
  addSelectedStyle(playerList.children[playNum]);
  audio.play();
  showAudioDuration(duration, playNum);
  showSongTitle(playerTitle, playNum, playList);
}

function addSelectedStyle(item) {
  Array.from(playerList.children).forEach(elem => {
    elem.classList.remove('item_selected');
  });
  item.classList.add('item_selected');
}

player.addEventListener('click', playAudio);
// playerControls.addEventListener('click', playAudio);
audio.addEventListener('ended', infinitePlay);

/*================= 7. audio player (advanced) ============================= */
const animationBox = document.querySelector('.player__animation');
const duration = document.querySelector('.duration');
const currentTime = document.querySelector('.currentTime');
const playerTitle = document.querySelector('.player__title');
const progressBar = document.querySelector('.progress-bar');
const progressBarIndicator = document.querySelector('.progress-bar__indicator');
const progressPlay = document.querySelector('.progress-bar__field');
const progressBarWidth = progressBar.offsetWidth - progressPlay.offsetWidth;

audio.addEventListener('play', musicAnimation);
audio.addEventListener('pause', musicAnimation);

function musicAnimation() {
  if(isPlay) {
    Array.from(animationBox.children).forEach(elem => elem.classList.add('play_start'));
  } else {
    Array.from(animationBox.children).forEach(elem => elem.classList.remove('play_start'));
  }
}

function showCurrentMusicTime() {
  const min = padZero(Math.floor(audio.currentTime / 60).toString(), 2);
  const sec = padZero(Math.floor(audio.currentTime % 60).toString(), 2);
  currentTime.textContent = `${min}:${sec}`;
}

function showSongTitle(elem, num, info) {
  elem.textContent = info[num].title;
}

function changeProgressBar() {
  let duration = Math.floor(audio.duration);
  let curTime = +((audio.currentTime + Number.EPSILON).toFixed(2));
  let curPercent = Math.floor(curTime * 100 / duration); 
  let w = Math.floor(curPercent * progressBarWidth / 100 + 8); // in px
  let percent = (w < progressBar.offsetWidth) ? Math.floor(w * 100 / progressBar.offsetWidth) : 100; // in %

  progressPlay.style.width = `${percent}%`;
  }

  function setDefaultWidth(elem, num) {
    elem.style.width = `${num}px`;
  }

  // playerList.addEventListener('click', playSong);

  // function playSong(e) {
  //   let item = e.target;
  //   console.log(item.matches('.play-item'));
  //   if (item.matches('.play-item')) {
  //     item.classList.toggle ('paused');
  //     playNum = item.dataset.index;
  //     audio.play();
  //     playItem.dataset.index = index;
  //   }
  // }

  function findSong() {
    return Array.from(playerList.children).find(song => +song.dataset.index === playNum);
  }

  function removeSongPlayIcon() {
    Array.from(playerList.children).forEach(song => song.classList.remove('paused'));
    // findSong().classList.toggle('paused');
  }