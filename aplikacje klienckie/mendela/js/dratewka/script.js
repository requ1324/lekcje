import { Lokacja, map } from "./modules/map.js";
let bag = [];

let row = 3,
  col = 6;
const $ = (s) => document.querySelector(s);
const take = (item) => {
  console.log(item);
  if (!item) return;
  if (bag.length == 0) {
    bag.push(item);
    $("#info").textContent = `You have taken ${item}`;
  } else {
    $("#info").textContent = `You can't carry more than one item!`;
  }
  update();
};

const update = (value, oldLoc) => {
  const loc = map[row][col];

  setTimeout(() => {
    $("#img").src = `Dratewka/img/${loc.img}`;
    $("#img").style.background = loc.color;
    if (loc.items) {
      let itemsText = loc.items.map((item) => item.name).join(", ");
      $("#item").textContent = `You can see: ${itemsText}`;
      $("#take").textContent = `TAKE ${itemsText} or T ${itemsText}`;
    } else {
      $("#item").textContent = "You can see: NOTHING";
    }

    $(".N").style.opacity = loc.dirs.includes("N") ? 1 : 0.2;
    $(".S").style.opacity = loc.dirs.includes("S") ? 1 : 0.2;
    $(".E").style.opacity = loc.dirs.includes("E") ? 1 : 0.2;
    $(".W").style.opacity = loc.dirs.includes("W") ? 1 : 0.2;
  }, 900);
  setTimeout(() => {
    $("#desc").textContent = loc.desc;
  }, 700);

  setTimeout(() => {
    $("#dir").textContent = `You can go: ${loc.dirs.join(", ")}`;
  }, 1100);

  if (oldLoc) {
    let text =
      value == "N"
        ? "NORTH"
        : value == "S"
          ? "SOUTH"
          : value == "E"
            ? "EAST"
            : "WEST";
    if (!oldLoc.dirs.includes(value)) {
      $("#going").textContent = `You can't go that way!`;
    } else {
      $("#going").textContent = `You are going ${text} ...`;
    }
  }

  setTimeout(() => {
    $("#going").textContent = "";
  }, 700);
};

update();
$("#inp").onkeydown = (e) => {
  if (e.key !== "Enter") return;
  const value = e.target.value.toUpperCase().trim();
  let currentLoc = map[row][col];

  if (value[0] == "T") {
    console.log(value);
    console.log(value[0]);
    let itemName = value.slice(2).trim();
    let itemIndex = currentLoc.items
      ? currentLoc.items.findIndex(
          (item) => item.name.toUpperCase() === itemName,
        )
      : -1;
    let item = currentLoc.items[itemIndex];
    console.log(item);
    take(item ? item.name : null);

    currentLoc.items.splice(itemIndex, 1);

    return (e.target.value = "");
  }

  if (!currentLoc.dirs.includes(value)) {
    update(value, currentLoc);
    return (e.target.value = "");
  }

  const [newR, newC] =
    value === "N"
      ? [row - 1, col]
      : value === "S"
        ? [row + 1, col]
        : value === "E"
          ? [row, col + 1]
          : [row, col - 1];
  if (newR < 0 || newR > 5 || newC < 0 || newC > 6 || !map[newR][newC])
    return (e.target.value = "");
  row = newR;
  col = newC;
  update(value, currentLoc);
  e.target.value = "";
};
