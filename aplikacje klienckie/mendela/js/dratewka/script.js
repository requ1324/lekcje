import { Lokacja, map } from "./modules/map.js";
import { dependencies } from "./modules/dependencies.js";
let bag = [];
let ok = 0;
let row = 3,
  col = 6;
const $ = (s) => document.querySelector(s);

const updateUI = (value, oldLoc) => {
  const loc = map[row][col];

  $("#item").textContent = "";
  $("#take").textContent = "";
  $("#info").textContent = "";
  $("#carrying").textContent = "";

  setTimeout(() => {
    $("#img").src = `Dratewka/img/${loc.img}`;
    $("#img").style.background = loc.color;

    if (loc.items && loc.items.length > 0) {
      let itemsText = loc.items.map((item) => item.name).join(", ");
      $("#item").textContent = `You can see: ${itemsText}`;
      $("#take").textContent = `TAKE ${itemsText} or T ${itemsText}`;
    } else {
      $("#item").textContent = "You can see: NOTHING";
    }

    if (bag.length > 0) {
      $("#carrying").textContent = `You are carrying: ${bag[0].name}`;
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

const take = (item) => {
  if (!item) return false;

  if (item.flag == 0) {
    $("#info").textContent = "You can't carry it";
    return false;
  }

  if (bag.length !== 0) {
    $("#info").textContent = "You can't carry more than one item!";
    return false;
  }

  bag.push(item);
  $("#info").textContent = `You have taken ${item.name}`;
  updateUI();
  return true;
};

const handleUse = (itemName) => {
  const item = bag.find((i) => i.name === itemName);

  if (!item) {
    $("#info").textContent = "You don't have anything like that";
    setTimeout(() => {
      $("#info").textContent = "";
    }, 1300);
    return;
  }

  const locationId = `${row + 1}${col + 1}`;

  const dep = dependencies.find(
    (d) => d.use === itemName && d.location === locationId,
  );

  if (!dep) {
    $("#info").textContent = "Nothing happened";
    setTimeout(() => {
      $("#info").textContent = "";
    }, 1300);
    return;
  }

  $("#info").textContent = dep.message;
  setTimeout(() => {
    $("#info").textContent = "";
  }, 1300);

  if (dep.removeItem) {
    bag = bag.filter((i) => i !== item);
  }

  if (dep.giveItem && !dep.L) {
    bag.push(dep.giveItem);
    $("#info").textContent =
      `${dep.message} You have received a ${dep.giveItem.name}`;
  } else {
    ok++;
    map[row][col].items.push(dep.giveItem);
    $("#info").textContent =
      `${dep.message} You have received a ${dep.giveItem.name}`;
  }

  if (dep.gameEnd) {
    alert("You won the game!");
  }

  updateUI();
};

if (ok == 6) {
  $("#info").textContent =
    "Your fake sheep is full of poison and ready to be eaten by the dragon";
  map[row][col].items.push(new Item("a SHEEP", 0, "SHEEP"));
}

const drop = (currentLoc) => {
  console.log("drop");
  if (!currentLoc.items) {
    currentLoc.items = [];
  }

  if (bag.length == 0) {
    $("#info").textContent = "You are not carrying anything";
    return;
  }

  if (currentLoc.items.length >= 3) {
    $("#info").textContent = "You can't store more items here!";
    return;
  }

  currentLoc.items.push(bag[0]);
  $("#info").textContent = `You dropped ${bag[0].name}`;
  bag.pop();
  updateUI();
};

let vocMode = false;

const inp = $("#inp");

updateUI();
inp.focus();
const forceFocus = (event) => {
  if (event && event.target !== inp) {
    event.preventDefault();
  }
  inp.focus();
};

document.addEventListener("mousedown", forceFocus, true);
document.addEventListener("touchstart", forceFocus, true);
document.addEventListener("click", forceFocus, true);
document.addEventListener("keydown", (event) => {
  if (event.key === "Tab") {
    event.preventDefault();
    inp.focus();
  }
});
inp.addEventListener("blur", forceFocus);

inp.onkeydown = (e) => {
  if (vocMode) {
    console.log(vocMode);
    $("#voc").textContent = "";
    vocMode = false;
    e.target.value = "";
    return;
  } else {
    if (e.key !== "Enter") return;
    const value = e.target.value.toUpperCase().trim();
    e.target.value = "";
    let currentLoc = map[row][col];
    if (value[0] == "T") {
      let itemName = value.startsWith("TAKE ")
        ? value.slice(5).trim()
        : value.slice(2).trim();

      let itemIndex = currentLoc.items
        ? currentLoc.items.findIndex(
            (item) => item.name.toUpperCase() === itemName,
          )
        : -1;

      if (itemIndex === -1) {
        $("#info").textContent = "There is no such item here";
        return;
      }

      let item = currentLoc.items[itemIndex];

      const taken = take(item);

      if (taken) {
        currentLoc.items.splice(itemIndex, 1);
        updateUI();
      }

      return;
    }
    if (value.startsWith("U")) {
      const itemName = value.startsWith("USE ")
        ? value.slice(4).trim()
        : bag[0]?.name;

      handleUse(itemName);
      return;
    }

    if (value[0] == "D") {
      drop(currentLoc);
      return;
    }

    if (value[0] == "V") {
      vocMode = true;
      console.log(vocMode);
      $("#voc").textContent = `NORTH or N, SOUTH or S \n 
      WEST or W, EAST or E 
      \n TAKE (object) or T (object) 
      \n DROP (object) or D (object) 
      \n USE (object) or U (object) 
      \n GOSSIPS or G, VOCABULARY or V 
      \n Press any key`;
      return;
    }
    if (value[0] == "G") {
      vocMode = true;
      console.log(vocMode);
      $("#voc").textContent = `"The  woodcutter lost  his home key...\n
		The butcher likes fruit... The cooper\n
		is greedy... Dratewka plans to make a\n
		poisoned  bait for the dragon...  The\n
		tavern owner is buying food  from the\n
		pickers... Making a rag from a bag..."
		Press any key`;
      return;
    }

    if (!currentLoc.dirs.includes(value)) {
      updateUI(value, currentLoc);
      return;
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
      return;
    row = newR;
    col = newC;
    updateUI(value, currentLoc);
  }
};
