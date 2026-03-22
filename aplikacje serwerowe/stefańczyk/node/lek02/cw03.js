const dice = () => {
  return new Promise((resolve, reject) => {
    const num = Math.floor(Math.random() * 5) + 1;
    num > 2 ? resolve("Sukces: " + num) : reject("Błąd: " + num);
  });
};

const playOnce = async () => {
  try {
    const result = await dice();
    console.log("Wynik rzutu:", result);
  } catch (error) {
    console.error("Niestety wystąpił:", error);
  }
};

const multiThrow = async () => {
  for (let i = 1; i <= 3; i++) {
    try {
      const result = await dice();
      console.log(`Rzut ${i}:`, result);
    } catch (error) {
      console.log(`Rzut ${i} Wystąpił błąd: `, error);
      console.log("Mimo to petla leci dalej");
      continue;
    }
  }
};

multiThrow();
