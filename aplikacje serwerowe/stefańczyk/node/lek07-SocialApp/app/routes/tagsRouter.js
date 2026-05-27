import getRequestData from "../getRequestData.js";

import tagsController from "../controllers/tagsController.js";
const tagsRouter = async (request, response) => {
  const { method, url } = request;

  /* GET /api/tags/raw // pobranie wszystkich tagów
GET /api/tags/stats // pobranie statystyk tagów
GET /api/tags // pobranie wszystkich tagów wraz z konwersją na obiekty
GET /api/tags/1 // pobranie jednego taga
POST /api/tags // utworzenie nowego taga*/

  if (url == "/api/tags/raw" && method == "GET") {
    let tags = tagsController.getRaw();
    response.writeHead(200, {
      "Content-Type": "application/json;charset=utf-8",
    });
    response.end(JSON.stringify(tags));
  } else if (url == "/api/tags/stats" && method == "GET") {
    let tags = tagsController.getall();
    let totalTags = tags.length;

    if (totalTags == 0) {
      response.writeHead(200, {
        "Content-Type": "application/json;charset=utf-8",
      });
      response.end(
        JSON.stringify({
          totalTags: 0,
          averagePopularity: 0,
          avaragePopularity: 0,
          mostPopular: null,
          leastPopular: null,
        }),
      );
      return;
    }

    let sum = 0;
    let mostPopular = tags[0];
    let leastPopular = tags[0];
    tags.forEach((tag) => {
      if (tag.popularity > mostPopular.popularity) {
        mostPopular = tag;
      }

      if (tag.popularity < leastPopular.popularity) {
        leastPopular = tag;
      }

      sum = sum + tag.popularity;
    });
    let avaragePopularity = parseFloat((sum / totalTags).toFixed(2));

    let stats = {
      totalTags: totalTags,
      averagePopularity: avaragePopularity,
      avaragePopularity: avaragePopularity,
      mostPopular: mostPopular,
      leastPopular: leastPopular,
    };
    response.writeHead(200, {
      "Content-Type": "application/json;charset=utf-8",
    });
    response.end(JSON.stringify(stats));
  } else if (url == "/api/tags" && method == "GET") {
    let tags = tagsController.getall();
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
    try {
      let data = await getRequestData(request);
      let tag = tagsController.add(data);

      if (!tag) {
        response.writeHead(409, {
          "Content-Type": "application/json;charset=utf-8",
        });
        response.end(JSON.stringify({ status: "tag already exists" }));
        return;
      }

      response.writeHead(201, {
        "Content-Type": "application/json;charset=utf-8",
      });
      response.end(JSON.stringify(tag));
    } catch (error) {
      response.writeHead(400, {
        "Content-Type": "application/json;charset=utf-8",
      });
      response.end(JSON.stringify({ status: "error", message: error.message }));
    }
  } else {
    response.writeHead(404, {
      "Content-Type": "application/json;charset=utf-8",
    });
    response.end(JSON.stringify({ status: "path not found" }));
  }
};

export default tagsRouter;
