export class Item {
  constructor(id, flag, name) {
    this.id = id;
    this.flag = flag;
    this.name = name;
  }
}

export const dependencies = [
  {
    use: "KEY",
    location: "56",
    message: "You opened a tool shed and took an axe",
    removeItem: true,
    giveItem: new Item("An AXE", 1, "AXE"),
  },
  {
    use: "AXE",
    location: "67",
    message: "You cut sticks for sheeplegs",
    removeItem: true,
    giveItem: new Item("STICKS", 1, "STICKS"),
  },
  {
    use: "STICKS",
    location: "43",
    message: "You prepared legs for your fake sheep",
    removeItem: false,
    giveItem: new Item("sheeplegs", 0, "sheeplegs"),
    ok: true,
  },
  {
    use: "MUSHROOMS",
    location: "34",
    message: "The tavern owner paid you money",
    removeItem: true,
    giveItem: new Item("MONEY", 1, "MONEY"),
  },
  {
    use: "MONEY",
    location: "37",
    message: "The cooper sold you a new barrel",
    removeItem: true,
    giveItem: new Item("a BARREL", 1, "BARREL"),
  },
  {
    use: "BARREL",
    location: "43",
    message: "You made a nice sheeptrunnk",
    removeItem: false,
    giveItem: new Item("a sheeptrunk", 0, "sheeptrunk"),
    ok: true,
  },
  {
    use: "BERRIES",
    location: "36",
    message: "The butcher gave you wool",
    removeItem: true,
    giveItem: new Item("WOOL", 1, "WOOL"),
  },
  {
    use: "WOOL",
    location: "43",
    message: "You prepared skin for your fake sheep",
    removeItem: false,
    giveItem: new Item("a sheepskin", 0, "sheepskin"),
    ok: true,
  },
  {
    use: "BAG",
    location: "57",
    message: "You used your tools to make a rag",
    removeItem: true,
    giveItem: new Item("a RAG", 1, "RAG"),
  },
  {
    use: "RAG",
    location: "43",
    message: "You made a fake sheephead",
    removeItem: false,
    giveItem: new Item("a sheephead", 0, "sheephead"),
    ok: true,
  },
  {
    use: "SPADE",
    location: "11",
    message: "You are digging... and digging... That's enough sulphur for you",
    removeItem: true,
    giveItem: new Item("SULPHUR", 1, "SULPHUR"),
  },
  {
    use: "SULPHUR",
    location: "43",
    message: "You prepared a solid poison",
    removeItem: false,
    giveItem: new Item("a solid poison", 0, "solid poison"),
    ok: true,
  },
  {
    use: "BUCKET",
    location: "21",
    message: "You got a bucket full of tar",
    removeItem: true,
    giveItem: new Item("TAR", 1, "TAR"),
  },
  {
    use: "TAR",
    location: "43",
    message: "You prepared a liquid poison",
    removeItem: false,
    giveItem: new Item("a liquid poison", 0, "liquid poison"),
    ok: true,
  },
  {
    use: "SHEEP",
    location: "43",
    message:
      "The dragon noticed your gift...  The dragon ate your sheep and died!",
    removeItem: false,
    giveItem: new Item("a dead dragon", 0, "dead dragon"),
  },
  {
    use: "KNIFE",
    location: "43",
    dragonDied: false,
    message: "You cut a piece of dragon's skin",
    removeItem: true,
    giveItem: new Item("a DRAGONSKIN", 1, "DRAGONSKIN"),
  },
  {
    use: "DRAGONSKIN",
    location: "57",
    message: "You used your tools to make a shoes",
    removeItem: true,
    giveItem: new Item("a dragonskin SHOES", 1, "SHOES"),
  },
  {
    use: "SHOES",
    location: "41",
    message: "The king is impressed by your shoes",
    removeItem: true,
    giveItem: new Item("a PRIZE", 1, "PRIZE"),
  },
  {
    use: "PRIZE",
    gameEnd: true,
  },
];
