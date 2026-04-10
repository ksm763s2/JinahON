const tracks = [
  {
    title: "01. The Way For Us",
    url: "여기에_1번곡_URL"
  },
  {
    title: "02. Good Bye",
    url: "여기에_2번곡_URL"
  },
  {
    title: "03. Flower Heart",
    url: "여기에_3번곡_URL"
  },
  {
    title: "04. You already have",
    url: "여기에_4번곡_URL"
  },
  {
    title: "05. Pretend To Be",
    url: "여기에_5번곡_URL"
  },
  {
    title: "06. The Dreamer",
    url: "여기에_6번곡_URL"
  }
];

const audioPlayer = document.getElementById("audioPlayer");
const trackList = document.getElementById("trackList");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");

let currentTrackIndex = 0;

function loadTrack(index) {
  currentTrackIndex = index;
  audioPlayer.src = tracks[index].url;
  renderTrackList();
}

function playTrack(index) {
  loadTrack(index);
  audioPlayer.play();
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

prevButton.addEventListener("click", () => {
  const newIndex =
    currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
  playTrack(newIndex);
});

nextButton.addEventListener("click", () => {
  const newIndex =
    currentTrackIndex === tracks.length - 1 ? 0 : currentTrackIndex + 1;
  playTrack(newIndex);
});

audioPlayer.addEventListener("ended", () => {
  const newIndex =
    currentTrackIndex === tracks.length - 1 ? 0 : currentTrackIndex + 1;
  playTrack(newIndex);
});

loadTrack(0);
