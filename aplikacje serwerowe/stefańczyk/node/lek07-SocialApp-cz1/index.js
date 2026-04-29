import { createServer } from "http";
import router from "./app/router.js";
createServer(async (req, res) => await router(req, res)).listen(3000, () =>
  console.log("Server is running on port 3000"),
);
