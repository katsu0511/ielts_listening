const fast = document.getElementById('fast');
const normal = document.getElementById('normal');
const slow = document.getElementById('slow');
const slower = document.getElementById('slower');
const current = document.getElementById('current_time');
const playTime = document.getElementById('play_time');
const leftTime = document.getElementById('left_time');
const back = document.getElementById('back');
const activeBack = back.querySelector('.active_back');
const inactiveBack = back.querySelector('.inactive_back');
const forward = document.getElementById('forward');
const activeForward = forward.querySelector('.active_forward');
const inactiveForward = forward.querySelector('.inactive_forward');
const next = document.getElementById('next');
const nextImg = next.querySelector('.next');
const endImg = next.querySelector('.end');
const playArray = Array.from(document.getElementsByClassName('sound'));
const pauseArray = Array.from(document.getElementsByClassName('pause'));
const stopArray = Array.from(document.getElementsByClassName('stop'));
const mode = localStorage.getItem('mode') ?? 'next';
let audio = null;

const changeToPause = (pauseImg, playImg) => {
  pauseImg.classList.remove('hide');
  pauseImg.classList.add('show');
  playImg.classList.remove('show');
  playImg.classList.add('hide');
}

const changeToPlay = (pauseImg, playImg) => {
  pauseImg.classList.remove('show');
  pauseImg.classList.add('hide');
  playImg.classList.remove('hide');
  playImg.classList.add('show');
}

const changeToEnd = () => {
  next.classList.remove('next');
  next.classList.add('end');
  nextImg.classList.remove('show');
  nextImg.classList.add('hide');
  endImg.classList.remove('hide');
  endImg.classList.add('show');
  localStorage.setItem('mode', 'end');
}

const changeToNext = () => {
  next.classList.remove('end');
  next.classList.add('next');
  nextImg.classList.remove('hide');
  nextImg.classList.add('show');
  endImg.classList.remove('show');
  endImg.classList.add('hide');
  localStorage.setItem('mode', 'next');
}

const changePlaybackRate = (rate) => {
  if (audio && audio.playbackRate != Number(rate)) {
    audio.playbackRate = Number(rate);
    localStorage.setItem('speed', rate);
    enableFuncs();
    disableCurrentSpeed(rate);
  }
}

const disable = (button) => {
  if (!button.classList.contains('disabled')) {
    button.classList.add('disabled');
    button.disabled = true;
  }
}

const enable = (button) => {
  if (button.classList.contains('disabled')) {
    button.classList.remove('disabled');
    button.disabled = false;
  }
}

const disableFuncs = () => {
  fast.classList.add('disabled');
  fast.disabled = true;
  normal.classList.add('disabled');
  normal.disabled = true;
  slow.classList.add('disabled');
  slow.disabled = true;
  slower.classList.add('disabled');
  slower.disabled = true;
  back.classList.add('disabled');
  back.disabled = true;
  activeBack.classList.remove('show');
  activeBack.classList.add('hide');
  inactiveBack.classList.remove('hide');
  inactiveBack.classList.add('show');
  forward.classList.add('disabled');
  forward.disabled = true;
  activeForward.classList.remove('show');
  activeForward.classList.add('hide');
  inactiveForward.classList.remove('hide');
  inactiveForward.classList.add('show');
}

const enableFuncs = () => {
  fast.classList.remove('disabled');
  fast.disabled = false;
  normal.classList.remove('disabled');
  normal.disabled = false;
  slow.classList.remove('disabled');
  slow.disabled = false;
  slower.classList.remove('disabled');
  slower.disabled = false;
  back.classList.remove('disabled');
  back.disabled = false;
  activeBack.classList.remove('hide');
  activeBack.classList.add('show');
  inactiveBack.classList.remove('show');
  inactiveBack.classList.add('hide');
  forward.classList.remove('disabled');
  forward.disabled = false;
  activeForward.classList.remove('hide');
  activeForward.classList.add('show');
  inactiveForward.classList.remove('show');
  inactiveForward.classList.add('hide');
}

const disableCurrentSpeed = (speed) => {
  if (speed === '0.5') {
    slower.classList.add('disabled');
    slower.disabled = true;
  } else if (speed === '0.75') {
    slow.classList.add('disabled');
    slow.disabled = true;
  } else if (speed === '1.0') {
    normal.classList.add('disabled');
    normal.disabled = true;
  } else {
    fast.classList.add('disabled');
    fast.disabled = true;
  }
}

const managePauseButtons = (isDisabled) => {
  pauseArray.forEach(function(pause) {
    const pauseImg = pause.querySelector('.pause_img');
    const playImg = pause.querySelector('.play_img');
    if (pauseImg.classList.contains('hide')) changeToPause(pauseImg, playImg);
    if (isDisabled) disable(pause);
    else enable(pause);
  });
}

const togglePauseButtons = () => {
  pauseArray.forEach(function(pause) {
    const pauseImg = pause.querySelector('.pause_img');
    const playImg = pause.querySelector('.play_img');
    if (pauseImg.classList.contains('show')) changeToPlay(pauseImg, playImg);
    else changeToPause(pauseImg, playImg);
  });
}

const manageStopButtons = (isDisabled) => {
  stopArray.forEach(function(stop) {
    if (isDisabled) disable(stop);
    else enable(stop);
  });
}

const manageAudioPlay = () => {
  if (audio.paused) audio.play();
  else audio.pause();
}

const getMinutes = (second) => {
  let minute = 0;
  while (second >= 60) {
    minute++;
    second -= 60;
  }
  if (second < 10) second = `0${second}`;
  return `${minute}:${second}`;
}

const playMP3 = (number) => {
  audio = new Audio(`./mp3/${number}.mp3`);
  audio.play();
  const speed = localStorage.getItem('speed') ?? '1.0';
  if (audio.playbackRate != Number(speed)) audio.playbackRate = Number(speed);
  disableCurrentSpeed(speed);
}

const playAudio = (play) => {
  const p = play.previousElementSibling;
  const number = p.textContent;
  if (audio && !audio.paused) audio.pause();
  playMP3(number);
}

const getNextAudio = () => {
  const cur = Number(audio.src.split('/mp3/')[1].substring(0, 2));
  if (cur === 40) return '01';
  return cur + 1 < 10 ? `0${cur + 1}` : `${cur + 1}`;
}

const nextAudio = () => {
  resetListeners();
  audio.pause();
  const next = getNextAudio();
  playMP3(next);
  addListeners();
}

const manageAudio = () => {
  if (next.classList.contains('next')) nextAudio();
  else reset();
}

const stopAudio = () => {
  audio.pause();
  audio.currentTime = 0;
  audio = null;
}

const resetDisplay = () => {
  playTime.textContent = '0:00';
  leftTime.textContent = '--:--';
  current.style.left = '0px';
}

const resetButtons = () => {
  managePauseButtons(true);
  manageStopButtons(true);
  resetDisplay();
}

const getDuration = () => {
  const duration = Math.round(audio.duration);
  leftTime.textContent = getMinutes(duration);
}

const updateTime = () => {
  const duration = Math.round(audio.duration);
  const currentTime = Math.floor(audio.currentTime);
  const leftDuration = duration - currentTime;
  const lengthOfTimeBar = 286;
  playTime.textContent = getMinutes(currentTime);
  leftTime.textContent = getMinutes(leftDuration);
  const lengthOfPlayTime = Math.round(currentTime / duration * lengthOfTimeBar);
  current.style.left = lengthOfPlayTime + 'px';
}

const addListeners = () => {
  audio.addEventListener('loadedmetadata', getDuration);
  audio.addEventListener('timeupdate', updateTime);
  audio.addEventListener('ended', manageAudio);
}

const resetListeners = () => {
  audio.removeEventListener('loadedmetadata', getDuration);
  audio.removeEventListener('timeupdate', updateTime);
  audio.removeEventListener('ended', manageAudio);
}

const reset = () => {
  resetListeners();
  disableFuncs();
  resetButtons();
  stopAudio();
}

fast.addEventListener('click', () => {
  changePlaybackRate('1.5');
});

normal.addEventListener('click', () => {
  changePlaybackRate('1.0');
});

slow.addEventListener('click', () => {
  changePlaybackRate('0.75');
});

slower.addEventListener('click', () => {
  changePlaybackRate('0.5');
});

back.addEventListener('click', () => {
  if (audio && audio.currentTime >= 5) audio.currentTime -= 5;
  else if (audio && audio.currentTime < 5) audio.currentTime = 0;
});

forward.addEventListener('click', () => {
  if (audio && audio.currentTime <= audio.duration - 5) audio.currentTime += 5;
  else if (audio && audio.currentTime > audio.duration - 5) audio.currentTime = audio.duration;
});

next.addEventListener('click', () => {
  if (nextImg.classList.contains('show')) changeToEnd();
  else changeToNext();
});

playArray.forEach(function(play) {
  play.addEventListener('click', () => {
    enableFuncs();
    managePauseButtons(false);
    manageStopButtons(false);
    playAudio(play);
    addListeners();
  });
});

pauseArray.forEach(function(pause) {
  pause.addEventListener('click', () => {
    if (audio) {
      togglePauseButtons();
      manageAudioPlay();
    }
  });
});

stopArray.forEach(function(stop) {
  stop.addEventListener('click', () => {
    if (audio) reset();
  });
});

if (mode === 'end') changeToEnd();
