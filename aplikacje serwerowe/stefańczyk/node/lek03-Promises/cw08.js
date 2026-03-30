const task = (id, time) => {
  return new Promise((resolve, reject) => {
    // Symulujemy, że zadanie nr 2 czasem zawodzi
    if (time < 500) return reject(`Błąd zadania ${id}: po ${time} czasie`);
    setTimeout(() => resolve(`Zadanie ${id} gotowe po ${time} ms`), time);
  });
};

const getRandom = () => Math.floor(Math.random() * 1000) + 200;

const runAllSafe = async () => {
  try {
    console.time("Czas");
    // Wszystkie startują w tym samym momencie
    const results = await Promise.all([
      task(1, getRandom()),
      task(2, getRandom()),
      task(3, getRandom()),
    ]);
    console.log(results);
    console.timeEnd("Czas");
  } catch (err) {
    console.error("Jedno z zadań zawiodło i przerwało całość:", err);
  }
};
runAllSafe();
