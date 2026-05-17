import getRequestData from "../getRequestData.js";
import path from "path";
import fs from "fs";

import formidable from "formidable";
import convertToObj from "../convertToObj.js";
import tagsController from "../controllers/tagsController.js";
const tagsRouter = async (request, response) => {
  const { method, url } = request;

  /* GET /api/tags/raw // pobranie wszystkich tagów
GET /api/tags/stats // pobranie statystyk tagów
GET /api/tags // pobranie wszystkich tagów wraz z konwersją na obiekty
GET /api/tags/1 // pobranie jednego taga
POST /api/tags // utworzenie nowego taga*/

  if (url == "/api/tags/raw" && method == "GET") {
    let tags = tagsController.getall();
    response.writeHead(200, {
      "Content-Type": "application/json;charset=utf-8",
    });
    response.end(JSON.stringify(tags));
  } else if (url == "/api/tags/stats" && method == "GET") {
  } else if (url == "/api/tags" && method == "GET") {
    let rawTags = tagsController.getall();
    let tags = convertToObj(rawTags);
    response.writeHead(200, {
      "Content-Type": "application/json;charset=utf-8",
    });
    response.end(JSON.stringify(tags));
  } else if (url.match(/\/api\/tags\/([0-9]+)/) && method == "GET") {
    const id = url.split("/")[3];
    let tag = tagsController.getOne(id);

    response.writeHead(200, {
      "Content-Type": "application/json;charset=utf-8",
    });
    response.end(JSON.stringify(tag));
  } else if (url == "/api/tags" && method == "POST") {
  }
};

export default tagsRouter;
