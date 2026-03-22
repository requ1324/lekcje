const waitForSignal = (maxSeconds) => {
  return new Promise((resolve, reject) => {
    let count = 0;
    const interval = setInterval(() => {
      console.log("Czekam... " + (count + 1));
      count++;
      if (count == 5) {
        clearInterval(interval);
        resolve("Sygnał odebrany!");
      } else if (count >= maxSeconds) {
        reject("Timeout");
        clearInterval(interval);
      }
    }, 1000);
  });
};

const run = async () => {
  console.log("Start procesu...");
  try {
    const message = await waitForSignal(13);
    console.log("Wynik:", message);
  } catch (error) {
    console.error("Błąd:", error);
  }

  // Ta linia wykona się dopiero po wywołaniu resolve()
};

run();
