import { createServer } from "http";
const PORT = 3000;

const logger = (req) => {
  if (req.url === "/error") {
    console.error("Błąd! Nie można znaleźć tej strony.");
  } else if (req.url === "/") {
    console.log("Brak bledu -  powodzenie");
  }
};

const server = createServer((req, res) => {
  logger(req);
  res.end("Logger zadzialal");
});

server.listen(PORT, () => {
  console.log("server working on port " + PORT);
});
