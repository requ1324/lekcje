import { createServer } from "http";
import router from "./app/routes/router.js";
import tagsRouter from "./app/routes/tagsRouter.js";
const server = createServer(async (req, res) => {
  if (req.url.startsWith("/api/photos")) {
    await router(req, res);
  } else if (req.url.startsWith("/api/tags")) {
    await tagsRouter(req, res);
  } else if (req.url.startsWith("/api/filters")) {
    await filtersRouter(req, res);
  } else if (req.url.startsWith("/api/getimage")) {
    await getImageRouter(req, res);
  }
});

server.listen(3000, () => console.log("Server started at port 3000"));
