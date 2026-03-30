import { createServer } from "http";

const prepareMetadata = (req) => {
  const userAgent = req.headers["user-agent"];
  req.meta = {
    timestamp: Date.now(),
    ip: req.socket.remoteAddress,
    isAdmin: req.url.includes("admin=true"),
    userAgent: userAgent,
  };
};

const logger = (req, err = null) => {
  const { timestamp, ip, isAdmin, userAgent } = req.meta;
  const time = new Date(timestamp).toLocaleTimeString();

  if (err) {
    console.error(`[${time}] ALERT! IP: ${ip} próbował wejść bez uprawnień!`);
  } else {
    console.log(
      `[${time}] Log: IP ${ip}, Admin: ${isAdmin}, User-Agent: ${userAgent}`,
    );
  }
};

const server = createServer((req, res) => {
  prepareMetadata(req);
  logger(req);

  res.setHeader("Content-Type", "application/json; charset=utf-8");

  try {
    if (req.url.includes("/secret")) {
      if (!req.meta.isAdmin) {
        throw new Error("Brak flagi admina w metadanych!");
      }
      res.end(
        JSON.stringify({
          message: "Witaj w tajnym miejscu",
          metadata: req.meta,
        }),
      );
    } else {
      logger(req);
      res.end(
        JSON.stringify({ message: "Strona publiczna", Twój_IP: req.meta.ip }),
      );
    }
  } catch (err) {
    logger(req, err);
    res.statusCode = 403;
    res.end(JSON.stringify({ error: err.message, meta: req.meta }));
  }
});

server.listen(3000, () => {
  console.log("Serwer działa na http://localhost:3000");
});
