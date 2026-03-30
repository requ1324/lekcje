import { readFile } from "fs";

const readAsync = (path) => {
  return new Promise((resolve, reject) => {
    // readFile to asynchroniczna funkcja Node.js
    readFile(path, (err, data) => {
      if (err) {
        // Jeśli wystąpi błąd (np. brak pliku), "odrzucamy" obietnicę
        reject("Brak pliku!");
      } else {
        // Jeśli się uda, "rozwiązujemy" obietnicę, zwracając treść pliku
        resolve(data.toString());
      }
    });
  });
};

const main = async () => {
  try {
    const content = await readAsync("config.json");
    console.log("Zawartość pliku:", content);
  } catch (error) {
    console.log("Wystąpił błąd:", error);
  }
};

const loadConfig = async () => {
  try {
    const content = await readAsync("config.json");
    console.log("Surowe dane:", content);
    const config = JSON.parse(content);
    console.log(
      `Zparsowane dane: Nazwa serwera: ${config.serverName}, darkmode: ${config.features.darkMode}`,
    );
  } catch (error) {
    console.log(`Wystapil blad: ${error}`);
  }
};
loadConfig();
