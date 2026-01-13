const platform = document.getElementById("platform");
const container = document.getElementsByClassName("container")[0];
platform.style.left = (platform.offsetLeft || 0) + "px";

let containerBound = container.getBoundingClientRect();
let direction;
let gameStarted = false;

let ballDx = 6;
let ballDy = 10;

let chance = 0.5;

console.log(containerBound);

document.addEventListener("keydown", (event) => {
  gameStarted = true;
  if (event.key === "ArrowLeft") direction = "left";
  if (event.key === "ArrowRight") direction = "right";
});

document.addEventListener("keyup", (event) => {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") direction = null;
});

function movePlatform() {
  let platformBound = platform.getBoundingClientRect();
  if (
    (direction === "left" && platformBound.left - 10 <= containerBound.left) ||
    (direction === "right" && platformBound.right + 10 >= containerBound.right)
  ) {
    return;
  }

  let currentLeft = parseInt(platform.style.left) || 0;
  if (direction === "left") {
    platform.style.left = currentLeft - 10 + "px";
  } else if (direction === "right") {
    platform.style.left = currentLeft + 10 + "px";
  }
}

function generateBoxes() {
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 12; j++) {
      let color =
        i == 0
          ? "grey"
          : i == 1
          ? "orange"
          : i == 2
          ? "yellow"
          : i == 3
          ? "green"
          : i == 4
          ? "blue"
          : "red";
      const box = document.createElement("div");
      box.classList.add("box");
      box.style.backgroundColor = color;
      document.getElementById("boxContainer").appendChild(box);
    }
  }
}

function moveBalls() {
  if (!gameStarted) return;
  let balls = document.getElementsByClassName("ball");
  for (let ball of balls) {
    if (!ball.style.bottom) {
      ball.style.bottom =
        (parseInt(getComputedStyle(ball).bottom) || 60) + "px";
      ball.style.left = (ball.offsetLeft || 0) + "px";
    }

    let currentBottom = parseInt(ball.style.bottom) || 0;
    let currentLeft = parseInt(ball.style.left) || 0;

    let dx = parseInt(ball.dataset.dx) || 6;
    let dy = parseInt(ball.dataset.dy) || 10;

    ball.style.bottom = currentBottom + dy + "px";
    ball.style.left = currentLeft + dx + "px";

    let ballBound = ball.getBoundingClientRect();

    if (
      ballBound.left <= containerBound.left ||
      ballBound.right >= containerBound.right
    ) {
      ball.dataset.dx = -dx;
    }
    if (ballBound.top <= containerBound.top) {
      ball.dataset.dy = -dy;
    }

    let platformBound = platform.getBoundingClientRect();
    if (
      ballBound.bottom >= platformBound.top &&
      ballBound.bottom <= platformBound.bottom &&
      ballBound.right >= platformBound.left &&
      ballBound.left <= platformBound.right
    ) {
      ball.dataset.dy = Math.abs(dy);
    }
  }
  checkCollision();
}

function checkCollision() {
  const boxes = document.getElementsByClassName("box");
  let balls = document.getElementsByClassName("ball");

  for (let ball of balls) {
    let ballBound = ball.getBoundingClientRect();
    let collisionDetected = false;

    for (let box of boxes) {
      if (box.style.visibility === "hidden") continue;

      let boxBound = box.getBoundingClientRect();
      if (
        boxBound.left < ballBound.right &&
        boxBound.right > ballBound.left &&
        boxBound.top < ballBound.bottom &&
        boxBound.bottom > ballBound.top
      ) {
        box.style.visibility = "hidden";
        if (!collisionDetected) {
          if (Math.random() < chance) {
            let gift = document.createElement("div");
            gift.classList.add("gift");
            gift.style.left = boxBound.left - containerBound.left + "px";
            gift.style.top = boxBound.top - containerBound.top + "px";
            moveGift(gift);
            container.appendChild(gift);
          }
          let dy = parseInt(ball.dataset.dy) || 10;
          ball.dataset.dy = -dy;

          let currentBottom = parseInt(ball.style.bottom) || 0;
          ball.style.bottom = currentBottom - dy * 2 + "px";

          collisionDetected = true;
        }
      }
    }

    let platformBound = platform.getBoundingClientRect();
    const gifts = document.getElementsByClassName("gift");
    for (let gift of gifts) {
      let giftBound = gift.getBoundingClientRect();
      if (
        giftBound.left < platformBound.right &&
        giftBound.right > platformBound.left &&
        giftBound.top < platformBound.bottom &&
        giftBound.bottom > platformBound.top
      ) {
        container.removeChild(gift);
        let newBall = document.createElement("div");
        let newBallDx = 6;
        let newBallDy = 10;
        newBall.setAttribute("data-dx", newBallDx);
        newBall.setAttribute("data-dy", newBallDy);
        newBall.classList.add("ball");
        newBall.style.left = ball.style.left;
        newBall.style.bottom = ball.style.bottom;
        container.appendChild(newBall);
      }
    }
  }
}

function moveGift(gift) {
  setInterval(() => {
    let currentTop = parseInt(gift.style.top) || 0;
    gift.style.top = currentTop + 2 + "px";
  }, 20);
}

generateBoxes();
setInterval(movePlatform, 20);
setInterval(moveBalls, 20);
