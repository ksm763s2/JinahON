const playlistId = "OLAK5uy_nxQfdi3BTYk4rRbBmURXYdIWcMs6Ayp-s";

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

let player = null;
let tracks = [];
let currentTrackIndex = 0;
let lastVolume = 100;
let progressTimer = null;
let playlistReady = false;
let userIsSeeking = false;

function formatTime(time) {
  if (!isFinite(time) || time < 0) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function updateProgressBackground(value) {
  progressBar.style.background =
    `linear-gradient(to right, #1ed760 0%, #1ed760 ${value}%, #313844 ${value}%, #313844 100%)`;
}

function updateVolumeBackground(value) {
  const percent = Number(value) * 100;
  volumeBar.style.background =
    `linear-gradient(to right, #ffffff 0%, #ffffff ${percent}%, #313844 ${percent}%, #313844 100%)`;
}

function updatePlayButton() {
  const state = player?.getPlayerState?.();

  if (state === YT.PlayerState.PLAYING) {
    playIcon.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true" class="pause-svg">
        <rect x="6" y="5" width="4" height="14" rx="1"></rect>
        <rect x="14" y="5" width="4" height="14" rx="1"></rect>
      </svg>
    `;
    playPauseBtn.setAttribute("aria-label", "일시정지");
    coverImage.classList.add("playing");
    coverImage.classList.remove("paused");
  } else {
    playIcon.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true" class="play-svg">
        <path d="M8 6L18 12L8 18V6Z" />
      </svg>
    `;
    playPauseBtn.setAttribute("aria-label", "재생");
    if (coverImage.classList.contains("playing")) {
      coverImage.classList.add("paused");
    }
  }
}

function updateVolumeIcon(value) {
  const v = Number(value);

  if (player?.isMuted?.() || v === 0) {
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

function makeFallbackTitle(index) {
  return `Track ${String(index + 1).padStart(2, "0")}`;
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

  trackCount.textContent = `${tracks.length} Tracks`;
}

function scrollToActiveTrack() {
  const active = document.querySelector("#trackList li.active");
  if (!active) return;

  active.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

function updateNowPlaying() {
  const current = tracks[currentTrackIndex];
  nowPlayingTitle.textContent = current ? current.title : "재생 대기 중";
}

function syncCurrentIndexFromPlayer() {
  if (!player || !playlistReady) return;

  const index = player.getPlaylistIndex();
  if (typeof index === "number" && index >= 0 && index < tracks.length) {
    currentTrackIndex = index;
    updateNowPlaying();
    renderTrackList();
  }
}

function startProgressLoop() {
  stopProgressLoop();

  progressTimer = window.setInterval(() => {
    if (!player || typeof player.getCurrentTime !== "function") return;

    const current = player.getCurrentTime();
    const duration = player.getDuration();
    const progress = duration > 0 ? (current / duration) * 100 : 0;

    if (!userIsSeeking) {
      progressBar.value = progress;
      updateProgressBackground(progress);
    }

    currentTimeEl.textContent = formatTime(current);
    durationEl.textContent = formatTime(duration);
    syncCurrentIndexFromPlayer();
  }, 250);
}

function stopProgressLoop() {
  if (progressTimer) {
    clearInterval(progressTimer);
    progressTimer = null;
  }
}

function buildTracksFromPlaylist() {
  const playlist = player.getPlaylist();

  if (!Array.isArray(playlist) || playlist.length === 0) {
    return false;
  }

  tracks = playlist.map((videoId, index) => ({
    videoId,
    title: makeFallbackTitle(index)
  }));

  currentTrackIndex = Math.max(0, player.getPlaylistIndex());
  playlistReady = true;

  updateNowPlaying();
  renderTrackList();
  scrollToActiveTrack();

  return true;
}

function waitForPlaylistData(tries = 0) {
  const ok = buildTracksFromPlaylist();

  if (ok) return;
  if (tries > 30) {
    nowPlayingTitle.textContent = "재생목록을 불러오지 못했어요";
    trackCount.textContent = "0 Tracks";
    return;
  }

  setTimeout(() => waitForPlaylistData(tries + 1), 500);
}

function playTrack(index) {
  if (!player || !playlistReady) return;
  currentTrackIndex = index;
  player.playVideoAt(index);
  updateNowPlaying();
  renderTrackList();
  scrollToActiveTrack();
}

function playPrevTrack() {
  if (!player || !playlistReady) return;
  player.previousVideo();
}

function playNextTrack() {
  if (!player || !playlistReady) return;
  player.nextVideo();
}

function togglePlayPause() {
  if (!player) return;

  const state = player.getPlayerState();

  if (
    state === YT.PlayerState.UNSTARTED ||
    state === YT.PlayerState.CUED ||
    state === YT.PlayerState.PAUSED
  ) {
    player.playVideo();
  } else if (state === YT.PlayerState.PLAYING) {
    player.pauseVideo();
  }
}

function toggleMute() {
  if (!player) return;

  if (player.isMuted() || player.getVolume() === 0) {
    player.unMute();
    const restoreVolume = lastVolume > 0 ? lastVolume : 100;
    player.setVolume(restoreVolume);
    volumeBar.value = restoreVolume / 100;
  } else {
    lastVolume = player.getVolume();
    player.mute();
    volumeBar.value = 0;
  }

  updateVolumeBackground(volumeBar.value);
  updateVolumeIcon(volumeBar.value);
}

function onPlayerReady(event) {
  event.target.setVolume(100);
  updateVolumeBackground(1);
  updateVolumeIcon(1);
  waitForPlaylistData();
  startProgressLoop();
}

function onPlayerStateChange(event) {
  updatePlayButton();

  if (
    event.data === YT.PlayerState.PLAYING ||
    event.data === YT.PlayerState.PAUSED ||
    event.data === YT.PlayerState.CUED
  ) {
    syncCurrentIndexFromPlayer();
    scrollToActiveTrack();
  }

  if (event.data === YT.PlayerState.ENDED) {
    syncCurrentIndexFromPlayer();
  }
}

function onPlayerError() {
  nowPlayingTitle.textContent = "유튜브 재생 오류";
}

function onYouTubeIframeAPIReady() {
  player = new YT.Player("youtubePlayer", {
    width: "220",
    height: "220",
    playerVars: {
      listType: "playlist",
      list: playlistId,
      controls: 0,
      rel: 0,
      playsinline: 1
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
      onError: onPlayerError
    }
  });
}

prevBtn.addEventListener("click", playPrevTrack);
nextBtn.addEventListener("click", playNextTrack);
playPauseBtn.addEventListener("click", togglePlayPause);

volumeBar.addEventListener("input", () => {
  if (!player) return;

  const volumeValue = Math.round(Number(volumeBar.value) * 100);

  if (volumeValue > 0) {
    player.unMute();
    lastVolume = volumeValue;
  }

  player.setVolume(volumeValue);
  updateVolumeBackground(volumeBar.value);
  updateVolumeIcon(volumeBar.value);
});

muteBtn.addEventListener("click", toggleMute);

progressBar.addEventListener("input", () => {
  userIsSeeking = true;
  updateProgressBackground(progressBar.value);
});

progressBar.addEventListener("change", () => {
  if (!player) return;

  const duration = player.getDuration();
  if (!duration || !isFinite(duration)) {
    userIsSeeking = false;
    return;
  }

  const nextTime = (Number(progressBar.value) / 100) * duration;
  player.seekTo(nextTime, true);
  userIsSeeking = false;
});

window.addEventListener("beforeunload", stopProgressLoop);

// 초기 UI
updateProgressBackground(0);
updateVolumeBackground(1);
updateVolumeIcon(1);
renderTrackList();
