document.addEventListener("DOMContentLoaded", () => {
  const arrowUpLeft = document.getElementById("arrowUpLeft");
  const arrowUpRight = document.getElementById("arrowUpRight");
  const arrowBottomLeft = document.getElementById("arrowBottomLeft");
  const arrowBottomRight = document.getElementById("arrowBottomRight");

  const wolfTopRight = document.getElementById("wolfTopRight");
  const wolfBottomRight = document.getElementById("wolfBottomRight");
  const wolfTopLeft = document.getElementById("wolfTopLeft");
  const wolfBottomLeft = document.getElementById("wolfBottomLeft");

  const scoreElement = document.getElementById("score");
  const gameHearts = document.getElementById("gameHearts");

  const eggs = document.getElementById("eggs");

  let directions = { isLookingUp: true, isLookingRight: true };

  function moveWolf(lookingUp, lookingRight) {
    wolfTopRight.style.display = lookingUp && lookingRight ? "block" : "none";
    wolfBottomRight.style.display =
      lookingUp == false && lookingRight ? "block" : "none";
    wolfTopLeft.style.display =
      lookingUp && lookingRight == false ? "block" : "none";
    wolfBottomLeft.style.display =
      lookingUp == false && lookingRight == false ? "block" : "none";

    directions = { isLookingUp: lookingUp, isLookingRight: lookingRight };
  }

  moveWolf(true, false);

  const eggPositions = [
    //topLeft:
    [
      { x: "10px", y: "70px", rotation: "30deg" },
      { x: "60px", y: "80px", rotation: "50deg" },
      { x: "110px", y: "90px", rotation: "80deg" },
      { x: "160px", y: "100px", rotation: "110deg" },
      { x: "210px", y: "110px", rotation: "140deg" },
      { x: "260px", y: "120px", rotation: "170deg" },
    ],
    //bottomLeft:
    [
      { x: "10px", y: "190px", rotation: "30deg" },
      { x: "60px", y: "200px", rotation: "50deg" },
      { x: "110px", y: "210px", rotation: "80deg" },
      { x: "160px", y: "220px", rotation: "110deg" },
      { x: "210px", y: "230px", rotation: "140deg" },
      { x: "260px", y: "240px", rotation: "170deg" },
    ],
    //topRight:
    [
      { x: "calc(100% - 30px)", y: "65px", rotation: "-30deg" },
      { x: "calc(100% - 80px)", y: "75px", rotation: "-50deg" },
      { x: "calc(100% - 110px)", y: "85px", rotation: "-80deg" },
      { x: "calc(100% - 160px)", y: "95px", rotation: "-110deg" },
      { x: "calc(100% - 210px)", y: "105px", rotation: "-140deg" },
      { x: "calc(100% - 240px)", y: "115px", rotation: "-170deg" },
    ],
    //bottomRight:
    [
      { x: "calc(100% - 30px)", y: "185px", rotation: "-30deg" },
      { x: "calc(100% - 80px)", y: "195px", rotation: "-50deg" },
      { x: "calc(100% - 110px)", y: "205px", rotation: "-80deg" },
      { x: "calc(100% - 160px)", y: "215px", rotation: "-110deg" },
      { x: "calc(100% - 210px)", y: "225px", rotation: "-140deg" },
      { x: "calc(100% - 240px)", y: "235px", rotation: "-170deg" },
    ],
  ];

  let score = 0;

  function generateEggs() {
    let random = Math.floor(Math.random() * 4);
    let egg = document.createElement("img");
    egg.src = "./img/jajko.png";
    egg.classList.add("egg");
    egg.style.display = "block";
    eggs.appendChild(egg);

    let frame = 0;
    // Ustaw początkową pozycję od razu
    egg.style.left = eggPositions[random][frame].x;
    egg.style.top = eggPositions[random][frame].y;
    egg.style.rotate = eggPositions[random][frame].rotation;

    let fallingEgg = setInterval(() => {
      frame++;
      if (frame <= 5) {
        egg.style.left = eggPositions[random][frame].x;
        egg.style.top = eggPositions[random][frame].y;
        egg.style.rotate = eggPositions[random][frame].rotation;
      } else {
        clearInterval(fallingEgg);

        // Sprawdź złapanie jajka
        if (
          random == 0 &&
          directions.isLookingUp &&
          directions.isLookingRight == false
        ) {
          score++;
          scoreElement.textContent = score;
          egg.remove();
        } else if (
          random == 1 &&
          directions.isLookingUp == false &&
          directions.isLookingRight == false
        ) {
          score++;
          scoreElement.textContent = score;
          egg.remove();
        } else if (
          random == 2 &&
          directions.isLookingUp &&
          directions.isLookingRight
        ) {
          score++;
          scoreElement.textContent = score;
          egg.remove();
        } else if (
          random == 3 &&
          directions.isLookingUp == false &&
          directions.isLookingRight
        ) {
          score++;
          scoreElement.textContent = score;
          egg.remove();
        } else {
          alert("Pudło! Spróbuj ponownie.");
          egg.remove();
        }
      }
    }, 500);
  }

  setInterval(generateEggs, 500);

  arrowUpLeft.addEventListener("click", () => moveWolf(true, false));
  arrowUpRight.addEventListener("click", () => moveWolf(true, true));
  arrowBottomLeft.addEventListener("click", () => moveWolf(false, false));
  arrowBottomRight.addEventListener("click", () => moveWolf(false, true));
});
