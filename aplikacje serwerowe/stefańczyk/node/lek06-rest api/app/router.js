import controller from "./controller.js";
import getRequestData from "./utils.js";

const router = async (request, response) => {
  const { method, url } = request;

  // utworzenie nowego taska
  if (url == "/api/tasks" && method == "POST") {
    // odczytaj dane z body
    // użyj odpowiedniej funkcji z controllera
    // odpowiedz do klienta

    let data = await getRequestData(request);
    console.log(data);
    controller.add(data);
    response.writeHead(200, {
      "Content-Type": "application/json;charset=utf-8",
    });
    response.end(JSON.stringify({ status: "status", data: "some data" }));
  }

  // pobranie wszystkich tasków
  else if (url == "/api/tasks" && method == "GET") {
    let tasks = controller.getall();
    response.writeHead(200, {
      "Content-Type": "application/json;charset=utf-8",
    });
    response.end(JSON.stringify(tasks));
  }

  // pobranie jednego wg id
  else if (url.match(/\/api\/tasks\/([0-9]+)/) && method == "GET") {
    const id = url.split("/")[3];
    let task = controller.getOne(id);
    response.writeHead(200, {
      "Content-Type": "application/json;charset=utf-8",
    });
    response.end(JSON.stringify(task));
  }

  // usunięcie jednego taska wg id
  else if (url.match(/\/api\/tasks\/([0-9]+)/) && method == "DELETE") {
    const id = url.split("/")[3];
    controller.delete(id);
    response.writeHead(200, {
      "Content-Type": "application/json;charset=utf-8",
    });
    response.end(JSON.stringify({ status: "deleted" }));
  }

  // aktualizacja jednego taska wg id
  else if (url == "/api/tasks" && method == "PATCH") {
    let data = await getRequestData(request);
    const id = JSON.parse(data).id;
    const task = controller.getOne(id);
    if (!task) {
      response.writeHead(404, {
        "Content-Type": "application/json;charset=utf-8",
        status: "task not found",
      });
    }
    controller.update(id, data);
    response.writeHead(200, {
      "Content-Type": "application/json;charset=utf-8",
    });
    response.end(JSON.stringify({ status: "updated" }));
  } else {
    response.writeHead(404, {
      "Content-Type": "application/json;charset=utf-8",
    });
    response.end(JSON.stringify({ status: "path not found" }));
  }
};

export default router;
