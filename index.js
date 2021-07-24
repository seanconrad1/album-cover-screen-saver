var rgb = getAverageRGB(document.getElementById("i"));
let body = document.createElement("body");

async function previewFile(url) {
  let img = document.createElement("img");

  img.src = url;

  img.crossOrigin = "Anonymous";

  await new Promise((resolve, reject) => {
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve();
    };

    img.onerror = (err) => reject(err);
  });

  getAverageRGB(img);
}

function getAverageRGB(imgEl) {
  console.log(imgEl);

  const val = document.getElementById("i");

  imgEl.id = "i";

  val.parentNode.replaceChild(imgEl, val);

  const colorThief = new ColorThief();

  document.body.style.backgroundColor =
    "rgb(" +
    colorThief.getColor(imgEl)[0] +
    "," +
    colorThief.getColor(imgEl)[1] +
    "," +
    colorThief.getColor(imgEl)[2] +
    ")";
}

const getMe = async (mbid) => {
  var url = `https://coverartarchive.org/release/${mbid}`;

  let response = await fetch(url, {
    method: "GET",
    headers: { accept: "application/json" },
  });

  let result = await response.json();

  previewFile(result.images[0].image);
};

let interval = 15000; //  = 2s
let increment = 1;

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const genres = [
  "gangsta rap",
  "hip hop",
  "indie",
  "latin pop",
  "pop punk",
  "pop",
  "pop rap",
  "punk rock",
  "r&b",
  "reggaeton",
  "west coast hip hop",
  "classic rock",
  "deep house",
  "surf rock",
  "uk drill",
];
const limit = 5;

const getArtistGenres = async () => {
  let genre = encodeURI(genres[getRandomInt(genres.length)]);
  let randomNum = getRandomInt(1000);
  // offset;

  let url = `https://musicbrainz.org/ws/2/release/?query=tag:${genre}%20AND%20country:US&fmt=json&limit=${limit}&offset=${randomNum}`;

  console.log(url);
  let response = await fetch(url, { method: "GET" });

  let result = await response.json();

  let final = result.releases.map((i) => i.id);

  final.forEach(async (id) => {
    var runner = setTimeout(function () {
      // Do your stuff.
      getMe(id);

      clearTimeout(runner);
    }, interval * increment);

    increment = increment + 1;
  });
  getArtistGenres();
};

getArtistGenres();
