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

tab.map((t) => {
  img = document.createElement("img");
  img.src = "img/0.jpg";
  img.classList.add("img");
  img.dataset.id = t.id;

  grid.append(img);
});

let imgs = document.querySelectorAll(".img");
let click = 0;
if (click < 3) {
  imgs.forEach((img) => {
    img.addEventListener("click", () => {
      img.src = `img/${img.dataset.id}.jpg`;
      console.log(img.dataset.id);
      click++;
      console.log(click);
    });
  });
}
let areas = document.querySelectorAll(".area");
let start = document.querySelector(".start");

areas.forEach((area) => {
  area.addEventListener("click", () => {
    start.style.display = "none";
    grid.style.display = "grid";
  });
});
