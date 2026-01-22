import { Item } from "./dependencies.js";
export class Lokacja {
  constructor(color, img, desc, dirs, gossip, items) {
    this.color = color;
    this.img = img;
    this.desc = desc;
    this.dirs = dirs.split(",");
    this.gossip = gossip || null;
    this.items = items || null;
  }
}

export const map = [
  [
    new Lokacja("#ebd340", "11.gif", "You are inside a brimstone mine", "E"),
    new Lokacja(
      "#595d57",
      "12.gif",
      "You are at the entrance to the mine",
      "W,E",
    ),
    new Lokacja("#75edf3", "13.gif", "A hill", "W,E,S", null, [
      new Item("a STONE", 1, "STONE"),
    ]),
    new Lokacja("#cae633", "14.gif", "Some bushes", "W,E"),
    new Lokacja("#dccc3d", "15.gif", "An old deserted hut", "W,E", null, [
      new Item("a BUCKET", 1, "BUCKET"),
    ]),
    new Lokacja("#a7f53f", "16.gif", "The edge of a forest", "W,E"),
    new Lokacja("#8cfd63", "17.gif", "A dark forest", "W,S", null, [
      new Item("MUSHROOMS", 1, "MUSHROOMS"),
    ]),
  ],
  [
    new Lokacja("#ffbe63", "21.gif", "A man nearby making tar", "E,S"),
    new Lokacja("#ffbe63", "22.gif", "A timber yard", "E,W,S"),
    new Lokacja(
      "#a7f53f",
      "23.gif",
      "You are by a roadside shrine",
      "N,E,W,S",
      null,
      [new Item("a KEY", 1, "KEY")],
    ),
    new Lokacja("#d4e524", "24.gif", "You are by a small chapel", "E,W"),
    new Lokacja(
      "#a7f53f",
      "25.gif",
      "You are on a road leading to a wood",
      "E,W,S",
    ),
    new Lokacja("#a7f53f", "26 i 65.gif", "You are in a forest", "E,W"),
    new Lokacja(
      "#8cfd63",
      "27 i 67.gif",
      "You are in a deep forest",
      "W,N",
      null,
      [new Item("BERRIES", 1, "BERRIES")],
    ),
  ],
  [
    new Lokacja("#7ae8fc", "31.gif", "You are by the Vistula River", "N,E"),
    new Lokacja(
      "#8cd6ff",
      "32.gif",
      "You are by the Vistula River",
      "N,W",
      null,
      [new Item("a FISH", 1, "FISH")],
    ),
    new Lokacja("#6cb5f2", "33.gif", "You are on a bridge over river", "N,S"),
    new Lokacja("#ffbd75", "34.gif", "You are by the old tavern", "E"),
    new Lokacja("#ffbe63", "35.gif", "You are at the town's end", "N,W,S"),
    new Lokacja("#ffbc66", "36.gif", "You are in a butcher's shop", "S"),
    new Lokacja("#ffbc66", "37.gif", "You are in a cooper's house", "S"),
  ],
  [
    new Lokacja("#ffb08d", "41.gif", "You are in the Wawel Castle", "E"),
    new Lokacja("#c6cdc1", "42.gif", "You are inside a dragon's cave", "E,W"),
    new Lokacja("#ffb08d", "43.gif", "A perfect place to set a trap", "N,W"),
    new Lokacja("#ffbe63", "44.gif", "You are by the water mill", "E", null, [
      new Item("a BAG", 1, "BAG"),
    ]),
    new Lokacja("#ffbe63", "45.gif", "You are at a main crossroad", "N,E,W,S"),
    new Lokacja("#ffbe63", "46.gif", "You are on a town street", "N,E,W"),
    new Lokacja(
      "#ffbe63",
      "47.gif",
      "You are in a frontyard of your house",
      "N,W,S",
    ),
  ],
  [
    0,
    0,
    0,
    new Lokacja("#6cb5f2", "54.gif", "You are by a swift stream", "E"),
    new Lokacja(
      "#ffbe63",
      "55.gif",
      "You are on a street leading forest",
      "N,W,S",
      null,
      [new Item("a KNIFE", 1, "KNIFE")],
    ),
    new Lokacja("#ffbe63", "56.gif", "You are in a woodcutter's backyard", "S"),
    new Lokacja("#fec261", "57.gif", "You are in a shoemaker's house", "N"),
  ],
  [
    0,
    0,
    0,
    new Lokacja(
      "#fec261",
      "64.gif",
      "You are in a bleak funeral house",
      "E",
      null,
      [new Item("a SPADE", 1, "SPADE")],
    ),
    new Lokacja("#a7f53f", "26 i 65.gif", "You are in a forest", "N,E,W"),
    new Lokacja(
      "#a7f53f",
      "66.gif",
      "You are at the edge of a forest",
      "N,E,W",
    ),
    new Lokacja("#8cfd63", "27 i 67.gif", "You are in a deep forest", "W"),
  ],
];
