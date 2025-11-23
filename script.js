let audio = null;
const fast = document.getElementById('fast');
const normal = document.getElementById('normal');
const slow = document.getElementById('slow');
const slower = document.getElementById('slower');
const current = document.getElementById('current_time');
const playTime = document.getElementById('play_time');
const leftTime = document.getElementById('left_time');
const back = document.getElementById('back');
const forward = document.getElementById('forward');
const playArray = Array.from(document.getElementsByClassName('sound'));
const pauseArray = Array.from(document.getElementsByClassName('pause'));
const stopArray = Array.from(document.getElementsByClassName('stop'));

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
  forward.classList.add('disabled');
  forward.disabled = true;
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
  forward.classList.remove('disabled');
  forward.disabled = false;
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

const playAudio = (play) => {
  const p = play.previousElementSibling;
  const num = p.textContent;
  if (audio && !audio.paused) audio.pause();
  audio = new Audio(`./mp3/${num}.mp3`);
  audio.play();
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

const reset = () => {
  audio.removeEventListener('loadedmetadata', getDuration);
  audio.removeEventListener('timeupdate', updateTime);
  audio.removeEventListener('ended', reset);
  disableFuncs();
  resetButtons();
  stopAudio();
}

const addLoadedMetadata = () => audio.addEventListener('loadedmetadata', getDuration);
const addTimeUpdate = () => audio.addEventListener('timeupdate', updateTime);
const addEnded = () => audio.addEventListener('ended', reset);

fast.addEventListener('click', () => {
  if (audio && audio.playbackRate != 1.5) audio.playbackRate = 1.5;
});

normal.addEventListener('click', () => {
  if (audio && audio.playbackRate != 1.0) audio.playbackRate = 1.0;
});

slow.addEventListener('click', () => {
  if (audio && audio.playbackRate != 0.75) audio.playbackRate = 0.75;
});

slower.addEventListener('click', () => {
  if (audio && audio.playbackRate != 0.5) audio.playbackRate = 0.5;
});

back.addEventListener('click', () => {
  if (audio && audio.currentTime > 5) audio.currentTime -= 5;
});

forward.addEventListener('click', () => {
  if (audio && audio.currentTime < audio.duration - 5) audio.currentTime += 5;
});

playArray.forEach(function(play) {
  play.addEventListener('click', () => {
    playAudio(play);
    addLoadedMetadata();
    addTimeUpdate();
    addEnded();
    enableFuncs();
    managePauseButtons(false);
    manageStopButtons(false);
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
