const tracks = [
  {
    title: "Ⅰ. 우리의 방식  The Way For Us",
    url: "https://github.com/ksm763s2/JinahON/releases/download/v1.0/01-TheWayForUs.flac"
  },
  {
    title: "Ⅱ. 잘 가  Good Bye",
    url: "https://github.com/ksm763s2/JinahON/releases/download/v1.0/02-GoodBye.flac"
  },
  {
    title: "Ⅲ. 꽃말  Flower Heart",
    url: "https://github.com/ksm763s2/JinahON/releases/download/v1.0/03-FlowerHeart.flac"
  },
  {
    title: "Ⅳ. You already have",
    url: "https://github.com/ksm763s2/JinahON/releases/download/v1.0/04-YouAlreadyHave.flac"
  },
  {
    title: "Ⅴ. 어른처럼 (with. 죠지)  Pretend To Be",
    url: "https://github.com/ksm763s2/JinahON/releases/download/v1.0/05-PretendToBe.flac"
  },
  {
    title: "Ⅵ. 여행가  The Dreamer",
    url: "https://github.com/ksm763s2/JinahON/releases/download/v1.0/06-TheDreamer.flac"
  }
];

const audioPlayer = document.getElementById("audioPlayer");
const trackList = document.getElementById("trackList");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const playPauseBtn = document.getElementById("playPauseBtn");
const playIcon = document.getElementById("playIcon");

const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

let currentTrackIndex = 0;

function formatTime(time) {
  if (!isFinite(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function updateProgressBackground(value) {
  progressBar.style.background = `linear-gradient(to right, #1ed760 0%, #1ed760 ${value}%, #444 ${value}%, #444 100%)`;
}

function updatePlayButton() {
  if (audioPlayer.paused) {
    playIcon.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true" class="play-svg">
        <path d="M8 6L18 12L8 18V6Z" />
      </svg>
    `;
  } else {
    playIcon.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true" class="pause-svg">
        <rect x="6" y="5" width="4" height="14" rx="1"></rect>
        <rect x="14" y="5" width="4" height="14" rx="1"></rect>
      </svg>
    `;
  }
}

function renderTrackList() {
  trackList.innerHTML = "";

  tracks.forEach((track, index) => {
    const li = document.createElement("li");
    li.textContent = track.title;

    if (index === currentTrackIndex) {
      li.classList.add("active");
    }

    li.addEventListener("click", () => {
      playTrack(index);
    });

    trackList.appendChild(li);
  });
}

function loadTrack(index) {
  currentTrackIndex = index;
  audioPlayer.src = tracks[index].url;
  audioPlayer.load();

  currentTimeEl.textContent = "0:00";
  durationEl.textContent = "0:00";
  progressBar.value = 0;
  updateProgressBackground(0);
  updatePlayButton();
  renderTrackList();
}

function playTrack(index) {
  loadTrack(index);
  audioPlayer.play().catch((error) => {
    console.error("재생 실패:", error);
  });
}

function playPrevTrack() {
  const newIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
  playTrack(newIndex);
}

function playNextTrack() {
  const newIndex = currentTrackIndex === tracks.length - 1 ? 0 : currentTrackIndex + 1;
  playTrack(newIndex);
}

function togglePlayPause() {
  if (!audioPlayer.src) return;

  if (audioPlayer.paused) {
    audioPlayer.play().catch((error) => {
      console.error("재생 실패:", error);
    });
  } else {
    audioPlayer.pause();
  }
}

const volumeBar = document.getElementById("volumeBar");

volumeBar.addEventListener("input", () => {
  audioPlayer.volume = volumeBar.value;
});

audioPlayer.volume = 1;

prevBtn.addEventListener("click", playPrevTrack);
nextBtn.addEventListener("click", playNextTrack);
playPauseBtn.addEventListener("click", togglePlayPause);

audioPlayer.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audioPlayer.duration);
});

audioPlayer.addEventListener("timeupdate", () => {
  const progress = audioPlayer.duration
    ? (audioPlayer.currentTime / audioPlayer.duration) * 100
    : 0;

  progressBar.value = progress;
  currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
  updateProgressBackground(progress);
});

progressBar.addEventListener("input", () => {
  if (!audioPlayer.duration) return;

  audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
  updateProgressBackground(progressBar.value);
});

audioPlayer.addEventListener("play", updatePlayButton);
audioPlayer.addEventListener("pause", updatePlayButton);
audioPlayer.addEventListener("ended", playNextTrack);

loadTrack(0);
