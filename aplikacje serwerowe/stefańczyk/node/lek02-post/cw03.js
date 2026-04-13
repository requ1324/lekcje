import { createServer } from "http";
const PORT = 3000;
const server = createServer((req, res) => {
  switch (req.method) {
    case "GET":
      res.end("Metoda GET sluzy do pobierania");
      break;
    case "POST":
      let body = "";

      // zbieranie danych w całość

      req.on("data", (chunk) => {
        body += chunk;
      });

      //tu dane już są w całości
      // zamiana tekstu na obiekt JS
      // i odpowiedź do klienta
      req.on("end", () => {
        const data = body;
        res.end(JSON.parse({ message: "Sukces", received: data }));
      });
      break;
  }
});

server.listen(PORT, () => {
  console.log(`serwer startuje na porcie ${PORT}`);
});
