const container = document.querySelector(".container");
const ludzik = document.getElementById("ludzik");

let gameStarted = false;
let direction;

document.addEventListener("keydown", (event) => {
  gameStarted = true;
  const key = event.key;
  /* if (key === "ArrowRight") {
    direction = "right";
  } else if (key === "ArrowLeft") {
    direction = "left";
  } */ if (key === " ") {
    shoot();
  }
});

container.addEventListener("mousemove", (event) => {
  let x = event.clientX - container.offsetLeft;
  let half = ludzik.getBoundingClientRect().width / 2;

  let minX = half;
  let maxX = container.getBoundingClientRect().width - half;

  x = Math.max(minX, Math.min(x, maxX));

  ludzik.style.left = x + "px";
});

document.addEventListener("keyup", (event) => {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") direction = null;
});

function moveLudzik() {
  ludzik.style.left = ludzik.offsetLeft + "px";
  const containerRect = container.getBoundingClientRect();
  const currentLeft = parseInt(ludzik.style.left) || 0;
  if (direction === "right") {
    if (ludzik.getBoundingClientRect().right < containerRect.right) {
      ludzik.style.left = currentLeft + 10 + "px";
    }
  } else if (direction === "left") {
    if (ludzik.getBoundingClientRect().left > containerRect.left) {
      ludzik.style.left = currentLeft - 10 + "px";
    }
  }
}

function shoot() {
  const pocisk = document.createElement("div");
  pocisk.classList.add("pocisk");
  pocisk.style.position = "absolute";
  pocisk.style.left = ludzik.offsetLeft + ludzik.offsetWidth / 2 - 25 + "px";
  pocisk.style.top = ludzik.offsetTop - 10 + "px";
  container.appendChild(pocisk);

  setInterval(() => {
    let currentTop = parseInt(pocisk.style.top) || 0;
    pocisk.style.top = currentTop - 10 + "px";
    kill();
  }, 20);
}

function kill() {
  const pociski = document.querySelectorAll(".pocisk");
  const enemies = document.querySelectorAll(".enemy");

  if (pociski.length != 0) {
    pociski.forEach((pocisk) => {
      enemies.forEach((enemy) => {
        const pociskTop = pocisk.getBoundingClientRect().top;
        const pociskX = pocisk.getBoundingClientRect().x;
        const enemyBot = enemy.getBoundingClientRect().bottom;
        const enemyLeft = enemy.getBoundingClientRect().left;
        const enemyRight = enemy.getBoundingClientRect().right;

        if (
          pociskTop == enemyBot &&
          pociskX >= enemyLeft &&
          pociskX <= enemyRight
        ) {
          console.log("aas");
          pocisk.remove();
          enemy.remove();
        }
      });
    });
  }
}

generateEnemies();

function generateEnemies() {
  const enemiesContainer = document.getElementById("enemiesContainer");
  for (let i = 0; i <= 4; i++) {
    for (let j = 0; j <= 10; j++) {
      const enemy = document.createElement("div");
      enemy.classList.add("enemy");
      enemy.style.position = "absolute";
      enemy.style.left = j * 40 + "px";
      enemy.style.top = i * 40 + "px";
      enemiesContainer.appendChild(enemy);
    }
  }
}
let direction2 = "right";

let gameOver = false;

function moveEnemies() {
  const enemiesContainer = document.getElementById("enemiesContainer");

  let currentLeft = parseInt(enemiesContainer.style.left) || 0;
  if (direction2 === "right") {
    enemiesContainer.style.left = currentLeft + 10 + "px";
  } else if (direction2 === "left") {
    enemiesContainer.style.left = currentLeft - 10 + "px";
  }

  const containerWidth = container.offsetWidth;
  const newLeft = parseInt(enemiesContainer.style.left) || 0;

  // 11 enemy * 40px = 440px szerokości
  const enemyGridWidth = 11 * 40;

  if (newLeft + enemyGridWidth >= containerWidth) {
    let currentTop = parseInt(enemiesContainer.style.top) || 0;
    enemiesContainer.style.top = currentTop + 100 + "px";
    direction2 = "left";
  } else if (newLeft <= 0) {
    let currentTop = parseInt(enemiesContainer.style.top) || 0;
    enemiesContainer.style.top = currentTop + 100 + "px";
    direction2 = "right";
  }
  if (!gameOver) {
    checkLose();
  }
}

let enemiesInterval = setInterval(moveEnemies, 100);
let ludzikInterval = setInterval(moveLudzik, 20);

function checkLose() {
  const enemies = document.querySelectorAll(".enemy");

  const ludzikRect = ludzik.getBoundingClientRect();

  enemies.forEach((enemy) => {
    const enemyRect = enemy.getBoundingClientRect();
    if (
      enemyRect.bottom >= ludzikRect.top &&
      enemyRect.x >= ludzikRect.left &&
      enemyRect.x <= ludzikRect.right
    ) {
      gameOver = true;
      clearInterval(enemiesInterval);
      clearInterval(ludzikInterval);
      alert("game over");
    }
  });
}
