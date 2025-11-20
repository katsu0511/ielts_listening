let audio = null;
const plays = document.getElementsByClassName('sound');
const playArray = Array.from(plays);
const pauses = document.getElementsByClassName('pause');
const pauseArray = Array.from(pauses);
const stops = document.getElementsByClassName('stop');
const stopArray = Array.from(stops);

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
  button.classList.add('disabled');
  button.disabled = true;
}

const enable = (button) => {
  button.classList.remove('disabled');
  button.disabled = false;
}

playArray.forEach(function(play) {
  play.addEventListener('click', () => {
    const p = play.previousElementSibling;
    const num = p.textContent;
    if (audio != null) audio.pause();
		audio = new Audio(`./mp3/${num}.mp3`);
		audio.play();
    pauseArray.forEach(function(pause) {
      const pauseImg = pause.querySelector('.pause_img');
      const playImg = pause.querySelector('.play_img');
      if (pauseImg.classList.contains('hide')) changeToPause(pauseImg, playImg);
      if (pause.classList.contains('disabled')) enable(pause);
    });
    stopArray.forEach(function(stop) {
      if (stop.classList.contains('disabled')) enable(stop);
    });
  });
});

pauseArray.forEach(function(pause) {
  pause.addEventListener('click', () => {
    if (audio != null) {
      pauseArray.forEach(function(p) {
        const pauseImg = p.querySelector('.pause_img');
        const playImg = p.querySelector('.play_img');
        if (pauseImg.classList.contains('show')) changeToPlay(pauseImg, playImg);
        else changeToPause(pauseImg, playImg);
      });
      if (audio.paused) audio.play();
      else audio.pause();
    }
  });
});

stopArray.forEach(function(stop) {
  stop.addEventListener('click', () => {
    if (audio != null) {
      pauseArray.forEach(function(pause) {
        const pauseImg = pause.querySelector('.pause_img');
        const playImg = pause.querySelector('.play_img');
        if (pauseImg.classList.contains('hide')) changeToPause(pauseImg, playImg);
        if (!pause.classList.contains('disabled')) disable(pause);
      });
      stopArray.forEach(function(stop) {
        if (!stop.classList.contains('disabled')) disable(stop);
      });
      audio.pause();
      audio.currentTime = 0;
      audio = null;
    }
  });
});
