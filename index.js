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

const getAlbumArtCovers = async (mbid) => {
  var url = `https://coverartarchive.org/release/${mbid}`;

  let response = await fetch(url, {
    method: "GET",
    headers: { accept: "application/json" },
  });

  console.log("what is my response", response);
  if (response.status === 400 || response.status === 404) {
    return;
  } else {
    let result = await response.json();
    previewFile(result.images[0].image);
  }
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

  let i = 1; //  set your counter to 1

  function myLoop() {
    //  create a loop function
    setTimeout(function () {
      //  call a 3s setTimeout when the loop is called
      getAlbumArtCovers(final[i]);
      i++; //  increment the counter
      if (i < final.length) {
        //  if the counter < 10, call the loop function
        myLoop(); //  ..  again which will trigger another
      } //  ..  setTimeout()
    }, 5000);
  }

  myLoop(); //  start the loop
};

getArtistGenres();
