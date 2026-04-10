const tracks = [
  {
    title: "01. The Way For Us",
    url: "https://github.com/ksm763s2/JinahON/releases/download/v1.0/01-TheWayForUs.flac"
  },
  {
    title: "02. Good Bye",
    url: "https://github.com/ksm763s2/JinahON/releases/download/v1.0/02-GoodBye.flac"
  },
  {
    title: "03. Flower Heart",
    url: "https://github.com/ksm763s2/JinahON/releases/download/v1.0/03-FlowerHeart.flac"
  },
  {
    title: "04. You already have",
    url: "https://github.com/ksm763s2/JinahON/releases/download/v1.0/04-YouAlreadyHave.flac"
  },
  {
    title: "05. Pretend To Be",
    url: "https://github.com/ksm763s2/JinahON/releases/download/v1.0/05-PretendToBe.flac"
  },
  {
    title: "06. The Dreamer",
    url: "https://github.com/ksm763s2/JinahON/releases/download/v1.0/06-TheDreamer.flac"
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
