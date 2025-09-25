let tab = [
  {
    id: 1,
    src: "img/1.jpg",
  },
  {
    id: 2,
    src: "img/2.jpg",
  },
  {
    id: 3,
    src: "img/3.jpg",
  },
  {
    id: 4,
    src: "img/4.jpg",
  },
  {
    id: 5,
    src: "img/5.jpg",
  },
  {
    id: 6,
    src: "img/6.jpg",
  },
  {
    id: 7,
    src: "img/7.jpg",
  },
  {
    id: 8,
    src: "img/8.jpg",
  },

  {
    id: 1,
    src: "img/1.jpg",
  },
  {
    id: 2,
    src: "img/2.jpg",
  },
  {
    id: 3,
    src: "img/3.jpg",
  },
  {
    id: 4,
    src: "img/4.jpg",
  },
  {
    id: 5,
    src: "img/5.jpg",
  },
  {
    id: 6,
    src: "img/6.jpg",
  },
  {
    id: 7,
    src: "img/7.jpg",
  },
  {
    id: 8,
    src: "img/8.jpg",
  },
];

let grid = document.querySelector(".grid");

let img;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const shuffledTab = shuffle([...tab]);

shuffledTab.map((t) => {
  img = document.createElement("img");
  img.src = "img/0.jpg";
  img.classList.add("img");
  img.dataset.id = t.id;

  grid.append(img);
});

let imgs = document.querySelectorAll(".img");
let click = 0;
let firstImg;
let secondImg;
let matchedPairs = 0;
let isChecking = false;

function checkWin() {
  if (matchedPairs == 8) {
    alert("brawo wygrałeś");
  }
}

imgs.forEach((img) => {
  img.addEventListener("click", () => {
    if (
      isChecking ||
      click >= 2 ||
      img == firstImg ||
      img.classList.contains("matched")
    ) {
      return;
    }

    if (click == 0) {
      firstImg = img;
    } else if (click == 1) {
      secondImg = img;

      isChecking = true;
    }

    img.src = `img/${img.dataset.id}.jpg`;
    click++;
    if (firstImg && secondImg) {
      if (firstImg.dataset.id == secondImg.dataset.id) {
        matchedPairs++;
        firstImg.classList.add("matched");
        secondImg.classList.add("matched");
        checkWin();
        resetGame();
      } else {
        setTimeout(function () {
          firstImg.src = "img/0.jpg";
          secondImg.src = "img/0.jpg";
          resetGame();
        }, 1400);
      }
    }
  });
});

function resetGame() {
  click = 0;
  firstImg = null;
  secondImg = null;
  isChecking = false;
}

let areas = document.querySelectorAll(".area");
let start = document.querySelector(".start");

areas.forEach((area) => {
  area.addEventListener("click", () => {
    start.style.display = "none";
    grid.style.display = "grid";
  });
});
