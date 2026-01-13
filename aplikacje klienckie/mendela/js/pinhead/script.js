const ballContainer = document.getElementById("ballContainer");
const ludzik = document.getElementById("ludzik");
const ball = document.getElementById("ball");
const container = document.querySelector(".container");

function generateBalls() {
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j <= 15; j++) {
      const ball = document.createElement("div");
      ball.id = `${i}-${j}`;
      ball.classList.add("ball");
      ball.style.position = "absolute";
      ball.style.left = j * 40 + "px";
      ball.style.top = i * 40 + "px";
      ballContainer.appendChild(ball);
    }
  }
}

generateBalls();

let direction;
let gameStarted = false;

document.addEventListener("keydown", (event) => {
  gameStarted = true;
  const key = event.key;
  if (key === "ArrowRight") {
    direction = "right";
  } else if (key === "ArrowLeft") {
    direction = "left";
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") direction = null;
});

function moveLudzik() {
  const containerRect = container.getBoundingClientRect();
  const ludzikRect = ludzik.getBoundingClientRect();

  if (ludzikRect.left <= containerRect.left && direction === "left") {
    return;
  }
  if (ludzikRect.right >= containerRect.right && direction === "right") {
    return;
  }
  if (!gameStarted) return;
  ludzik.style.left = ludzik.offsetLeft + "px";
  let currentLeft = parseInt(ludzik.style.left) || 0;
  if (direction === "right") {
    ludzik.style.left = currentLeft + 10 + "px";
  } else if (direction === "left") {
    ludzik.style.left = currentLeft - 10 + "px";
  }
}

let currentRow = 4;
let randomBall = null;
let toBeDrop = [];

function initializeRowBalls() {
  const balls = document.getElementsByClassName("ball");
  toBeDrop = [];
  for (let j = 0; j < balls.length; j++) {
    if (parseInt(balls[j].id.split("-")[0]) === currentRow) {
      toBeDrop.push(balls[j]);
    }
  }
}

function dropBalls() {
  if (toBeDrop.length === 0) {
    initializeRowBalls();
    currentRow--;
    if (currentRow < -1) return;

    randomBall = null;
    return;
  }

  if (currentRow < -1 || toBeDrop.length === 0) {
    return;
  }

  if (randomBall == null) {
    randomBall = toBeDrop[Math.floor(Math.random() * toBeDrop.length)];
  }

  let currentTop = parseInt(randomBall.style.top) || 0;
  randomBall.style.top = currentTop + 5 + "px";

  let containerRect = container.getBoundingClientRect();
  let ballRect = randomBall.getBoundingClientRect();
  checkCollision();
  if (ballRect.top + 5 >= containerRect.bottom) {
    toBeDrop.splice(toBeDrop.indexOf(randomBall), 1);
    randomBall = null;
  }
}

let score = 0;

function checkCollision() {
  const ludzikRect = ludzik.getBoundingClientRect();
  const balls = document.getElementsByClassName("ball");
  for (let i = 0; i < balls.length; i++) {
    const ballRect = balls[i].getBoundingClientRect();
    if (
      ballRect.bottom >= ludzikRect.top &&
      ballRect.top <= ludzikRect.bottom &&
      ballRect.right >= ludzikRect.left &&
      ballRect.left <= ludzikRect.right
    ) {
      score++;
      console.log("Score: " + score);
      toBeDrop.splice(toBeDrop.indexOf(balls[i]), 1);
      randomBall = null;

      balls[i].remove();
    }
  }
}

setInterval(moveLudzik, 20);
setInterval(dropBalls, 15);
