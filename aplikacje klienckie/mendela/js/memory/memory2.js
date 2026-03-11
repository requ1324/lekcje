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
  let title = document.querySelector(".title");

  title.textContent = `Memory - tryb ${s}s`;
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
  let startTime;
  let timeInterval;

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

  function restartGame() {
    hasStarted = false;
    click = 0;
    firstImg = null;
    secondImg = null;
    matchedPairs = 0;
    isChecking = false;
    clearInterval(timeInterval);
    title.textContent = "";
    grid.innerHTML = "";

    const oldTimeSpan = document.querySelector(".timeSpan");
    if (oldTimeSpan) oldTimeSpan.remove();

    let filler = document.querySelector(".filler");
    filler.style.width = "100%";

    start.style.display = "block";
    grid.style.display = "none";
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const centiseconds = Math.floor((seconds % 1) * 1000);

    const mm = String(minutes).padStart(2, "0");
    const ss = String(secs).padStart(2, "0");
    const qq = String(centiseconds).padStart(3, "0");

    return `${mm}:${ss}.${qq}`;
  }

  function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie =
      name +
      "=" +
      encodeURIComponent(value) +
      ";expires=" +
      date.toUTCString() +
      ";path=/";
  }

  function getCookie(name) {
    const cname = name + "=";
    const decoded = decodeURIComponent(document.cookie);
    console.log("decoded cookies:", decoded);
    const array = decoded.split(";");
    console.log("ca:", array);
    for (let c of array) {
      c = c.trim();
      if (c.indexOf(cname) === 0) {
        return c.substring(cname.length);
      }
    }
    return "";
  }

  function getScores(mode) {
    const data = getCookie("memory_top10_" + mode);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  function saveScores(mode, scores) {
    setCookie("memory_top10_" + mode, JSON.stringify(scores), 365);
  }

  function addScore(mode, time, nick) {
    let scores = getScores(mode);
    scores.push({ nick: nick, time: time });

    scores.sort((a, b) => a.time - b.time);
    scores = scores.slice(0, 10);
    saveScores(mode, scores);
  }

  function initTop10() {
    if (document.querySelector(".top10")) return;

    const container = document.createElement("div");
    container.classList.add("top10");

    container.innerHTML = `
      <h2>TOP 10</h2>
      <div id="top10-30"><h3>Tryb 30s</h3><ol></ol></div>
      <div id="top10-60"><h3>Tryb 60s</h3><ol></ol></div>
      <div id="top10-90"><h3>Tryb 90s</h3><ol></ol></div>
    `;

    document.body.append(container);
  }

  function renderTop10() {
    [30, 60, 90].forEach((mode) => {
      const list = document.querySelector(`#top10-${mode} ol`);
      if (!list) return;

      const scores = getScores(mode);
      list.innerHTML = "";

      scores.forEach((score) => {
        const li = document.createElement("li");
        li.textContent = score.nick + ": " + formatTime(score.time);
        list.append(li);
      });
    });
  }

  function checkWin() {
    if (matchedPairs == 8) {
      clearInterval(timeInterval);
      let endTime = new Date().getTime();
      let timeTaken = ((endTime - startTime) / 1000).toFixed(2);

      addScore(s, parseFloat(timeTaken), user);
      renderTop10();

      setTimeout(() => {
        alert(
          `Brawo ${user}, wygrałeś w ${formatTime(parseFloat(timeTaken))}!`,
        );
        restartGame();
      }, 300);
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
          click = 0;
          isChecking = false;
          firstImg = null;
          secondImg = null;
          checkWin();
        } else {
          setTimeout(function () {
            firstImg.src = "img/0.jpg";
            secondImg.src = "img/0.jpg";
            isChecking = false;
            click = 0;
            firstImg = null;
            secondImg = null;
          }, 1000);
        }
      }
    });
  });

  let start = document.querySelector(".start");
  start.style.display = "none";
  grid.style.display = "grid";
  initTop10();
  renderTop10();

  function countTime() {
    let filler = document.querySelector(".filler");
    let timeBox = document.querySelector(".timeBox");
    let duration = s * 1000;
    startTime = new Date().getTime();
    let endTime = new Date().getTime() + duration;

    let timeSpan = document.createElement("span");
    timeSpan.classList.add("timeSpan");
    timeBox.append(timeSpan);

    timeInterval = setInterval(function () {
      let now = new Date().getTime();
      let remaining = endTime - now;

      if (remaining <= 0) {
        clearInterval(timeInterval);
        filler.style.width = "0%";
        timeSpan.textContent = "00:00.000";
        setTimeout(() => {
          alert("Przegrałeś! Czas się skończył.");
          restartGame();
        }, 100);
        return;
      }

      let secondsLeft = remaining / 1000;
      timeSpan.textContent = formatTime(secondsLeft);

      let percent = (remaining / duration) * 100;
      filler.style.width = percent + "%";
    }, 11);
  }
}
