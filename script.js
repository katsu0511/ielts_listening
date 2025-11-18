let audio = null;
const plays = document.getElementsByClassName('sound');
const playArray = Array.from(plays);
playArray.forEach(function(play) {
  play.addEventListener('click', () => {
    const p = play.previousElementSibling;
    const num = p.textContent;
    if (audio != null) audio.pause();
		audio = new Audio(`./mp3/${num}.mp3`);
		audio.play();
  });
});

const stops = document.getElementsByClassName('no-sound');
const stopArray = Array.from(stops);
stopArray.forEach(function(stop) {
  stop.addEventListener('click', () => {
    audio.pause();
    audio = null;
  });
});
