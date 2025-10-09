function startGame(s) {
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
  let hasStarted = false;
  let img;
  let user = prompt("Podaj nick gracza: ");
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
    img.setAttribute("draggable", false);
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
      clearInterval(timeInterval);
      let endTime = new Date().getTime();
      let timeTaken = ((endTime - startTime) / 1000).toFixed(2);

      alert(`Brawo ${user}, wygrałeś w ${timeTaken} sekund!`);

      document.cookie = `nick=${user}; path=/`;
      document.cookie = `wynik=${timeTaken}; path=/`;
    }
  }

  imgs.forEach((img) => {
    img.addEventListener("click", () => {
      if (!hasStarted) {
        hasStarted = true;
        countTime();
      }
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
          }, 1000);
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

  let start = document.querySelector(".start");
  start.style.display = "none";
  grid.style.display = "grid";

  function countTime() {
    let filler = document.querySelector(".filler");
    let timeBox = document.querySelector(".timeBox");
    let duration = s * 1000;
    let startTime = new Date().getTime();
    let endTime = new Date().getTime() + duration;

    let timeSpan = document.createElement("span");
    timeSpan.classList.add("timeSpan");
    timeBox.append(timeSpan);

    let timeInterval = setInterval(function () {
      let now = new Date().getTime();
      let remaining = endTime - now;

      if (remaining <= 0) {
        clearInterval(timeInterval);
        filler.style.width = "0%";
        timeSpan.textContent = `0.00 sekund`;
        alert("Przegrałeś!");
        return;
      }

      let secondsLeft = (remaining / 1000).toFixed(2);
      timeSpan.textContent = `${secondsLeft} sekund`;

      let percent = (remaining / duration) * 100;
      filler.style.width = percent + "%";
    }, 11);
  }

  /* areas.forEach((area) => {
    area.addEventListener("click", () => {
      start.style.display = "none";
      grid.style.display = "grid";
    });
  });
}
*/
}
