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
const trackCount = document.getElementById("trackCount");
const nowPlayingTitle = document.getElementById("nowPlayingTitle");
const coverImage = document.querySelector(".cover-image");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const playPauseBtn = document.getElementById("playPauseBtn");
const playIcon = document.getElementById("playIcon");

const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

const volumeBar = document.getElementById("volumeBar");
const muteBtn = document.getElementById("muteBtn");
const volumeIcon = document.getElementById("volumeIcon");

let currentTrackIndex = 0;
let lastVolume = 1;

function formatTime(time) {
  if (!isFinite(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function updateProgressBackground(value) {
  progressBar.style.background = `linear-gradient(to right, #1ed760 0%, #1ed760 ${value}%, #313844 ${value}%, #313844 100%)`;
}

function updateVolumeBackground(value) {
  const percent = Number(value) * 100;
  volumeBar.style.background = `linear-gradient(to right, #ffffff 0%, #ffffff ${percent}%, #313844 ${percent}%, #313844 100%)`;
}

function updatePlayButton() {
  if (audioPlayer.paused) {
    playIcon.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true" class="play-svg">
        <path d="M8 6L18 12L8 18V6Z" />
      </svg>
    `;
    playPauseBtn.setAttribute("aria-label", "재생");
  } else {
    playIcon.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true" class="pause-svg">
        <rect x="6" y="5" width="4" height="14" rx="1"></rect>
        <rect x="14" y="5" width="4" height="14" rx="1"></rect>
      </svg>
    `;
    playPauseBtn.setAttribute("aria-label", "일시정지");
  }
}

function updateVolumeIcon(value) {
  const v = Number(value);

  if (audioPlayer.muted || v === 0) {
    volumeIcon.innerHTML = `
      <path d="M5 10V14H8L12 18V6L8 10H5Z"></path>
      <line x1="16" y1="9" x2="20" y2="15"></line>
      <line x1="20" y1="9" x2="16" y2="15"></line>
    `;
    muteBtn.setAttribute("aria-label", "음소거 해제");
    return;
  }

  if (v < 0.5) {
    volumeIcon.innerHTML = `
      <path d="M5 10V14H8L12 18V6L8 10H5Z"></path>
      <path d="M16 10.5C16.8 11.2 17.2 12 17.2 13C17.2 14 16.8 14.8 16 15.5"></path>
    `;
    muteBtn.setAttribute("aria-label", "음소거");
    return;
  }

  volumeIcon.innerHTML = `
    <path d="M5 10V14H8L12 18V6L8 10H5Z"></path>
    <path d="M16 9C17.2 10 18 11.4 18 13C18 14.6 17.2 16 16 17"></path>
    <path d="M14.5 6.5C16.9 8.1 18.5 10.8 18.5 13.9C18.5 17 16.9 19.7 14.5 21.3"></path>
  `;
  muteBtn.setAttribute("aria-label", "음소거");
}

function scrollToActiveTrack() {
  const active = document.querySelector("#trackList li.active");
  if (!active) return;

  active.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
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
      currentTrackIndex = index;
      updateNowPlaying();
      playTrack(index);
    });

    trackList.appendChild(li);
  });
}

function updateNowPlaying() {
  nowPlayingTitle.textContent = tracks[currentTrackIndex].title;
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
  updateNowPlaying();
  renderTrackList();
  scrollToActiveTrack();
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
  if (!audioPlayer.src) {
    playTrack(currentTrackIndex);
    return;
  }

  if (audioPlayer.paused) {
    audioPlayer.play().catch((error) => {
      console.error("재생 실패:", error);
    });
  } else {
    audioPlayer.pause();
  }
}

function toggleMute() {
  if (audioPlayer.muted || audioPlayer.volume === 0) {
    audioPlayer.muted = false;
    audioPlayer.volume = lastVolume > 0 ? lastVolume : 1;
    volumeBar.value = audioPlayer.volume;
  } else {
    lastVolume = audioPlayer.volume;
    audioPlayer.muted = true;
    volumeBar.value = 0;
  }

  updateVolumeBackground(volumeBar.value);
  updateVolumeIcon(volumeBar.value);
}

trackCount.textContent = `${tracks.length} Tracks`;

volumeBar.addEventListener("input", () => {
  const volumeValue = Number(volumeBar.value);

  audioPlayer.muted = false;
  audioPlayer.volume = volumeValue;

  if (volumeValue > 0) {
    lastVolume = volumeValue;
  }

  updateVolumeBackground(volumeValue);
  updateVolumeIcon(volumeValue);
});

muteBtn.addEventListener("click", toggleMute);

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

  audioPlayer.currentTime = (Number(progressBar.value) / 100) * audioPlayer.duration;
  updateProgressBackground(progressBar.value);
});

audioPlayer.addEventListener("play", () => {
  updatePlayButton();
  coverImage.classList.add("playing");
});

audioPlayer.addEventListener("pause", () => {
  updatePlayButton();
  coverImage.classList.remove("playing");
});

audioPlayer.addEventListener("ended", playNextTrack);

window.addEventListener("load", () => {
  scrollToActiveTrack();
});

audioPlayer.volume = 1;
volumeBar.value = 1;

updateVolumeBackground(1);
updateVolumeIcon(1);
loadTrack(0);
