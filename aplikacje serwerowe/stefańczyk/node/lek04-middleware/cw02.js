import { createServer } from "http";

const logger = (req, isError = false) => {
  const time = new Date().toLocaleTimeString();
  const msg = `[${time}] ${req.method} na ${req.url}`;

  if (isError) {
    console.error(msg, "- AWARIA!");
  } else {
    // console.log drukuje standardowy tekst
    console.log(msg);
  }
};

const server = createServer((req, res) => {
  try {
    const fullUrl = new URL(req.url, `http://${req.headers.host}`);
    const password = fullUrl.searchParams.get("password");
    console.log("Full URL:", fullUrl);

    if (fullUrl.pathname === "/admin") {
      if (password !== "1234") {
        throw new Error("Nieprawidłowe hasło do panelu admina!");
      }
    }

    logger(req);
    res.end("OK");
  } catch (err) {
    // wspólne miejsce dso logowania błwdów - logujemy każdy błąd jako error (true)
    logger(req, true);

    // Opcjonalnie: logujemy sam komunikat błędu z throw
    console.error("Szczegóły błędu:", err.message);

    res.statusCode = 500;
    res.end("Blad serwera");
  }
});

server.listen(3000, () => {
  console.log("Serwer działa na http://localhost:3000");
});
