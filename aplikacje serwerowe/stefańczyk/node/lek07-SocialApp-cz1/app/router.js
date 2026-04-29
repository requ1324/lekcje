import getRequestData from "./getRequestData.js";
import path from "path";
import fs from "fs";
import formidable from "formidable";
import fileController from "./fileController.js";
import jsonController from "./jsonController.js";
const router = async (request, response) => {
  const { method, url } = request;

  // utworzenie nowego taska
  if (url == "/api/photos" && method == "POST") {
    const form = formidable();
    form.parse(request, function (err, fields, files) {
      if (err) {
        response.writeHead(400, {
          "Content-Type": "application/json;charset=utf-8",
        });
        response.end(JSON.stringify({ status: "error", message: err.message }));
        return;
      }
      console.log("Received fields:", fields);
      console.log("Received files:", files);
      const firstFileEntry = Object.values(files)[0];
      const uploadedFile = Array.isArray(firstFileEntry)
        ? firstFileEntry[0]
        : firstFileEntry;

      const oldPath = uploadedFile.filepath;
      const originalName =
        uploadedFile.originalFilename || uploadedFile.newFilename;
      const uploadDir = path.join(process.cwd(), "uploads");
      fs.mkdirSync(uploadDir, { recursive: true });
      const newPath = path.join(uploadDir, originalName);

      fs.copyFile(oldPath, newPath, function (copyError) {
        if (copyError) {
          response.writeHead(500, {
            "Content-Type": "application/json;charset=utf-8",
          });
          response.end(
            JSON.stringify({ status: "error", message: copyError.message }),
          );
          return;
        }

        response.writeHead(201, {
          "Content-Type": "application/json;charset=utf-8",
        });
        const data = JSON.stringify({
          id: Date.now(),
          status: "ok",
          filename: path.basename(newPath),
          url: `/uploads/${path.basename(newPath)}`,
        });
        fileController.add(data);
        response.end(data);
      });
    });
    return;
  }

  // pobranie wszystkich tasków
  else if (url == "/api/photos" && method == "GET") {
    let photos = fileController.getall();
    response.writeHead(200, {
      "Content-Type": "application/json;charset=utf-8",
    });
    response.end(JSON.stringify(photos));
  }

  // pobranie jednego wg id
  else if (url.match(/\/api\/photos\/([0-9]+)/) && method == "GET") {
    const id = url.split("/")[3];
    let photo = fileController.getOne(id);
    response.writeHead(200, {
      "Content-Type": "application/json;charset=utf-8",
    });
    response.end(JSON.stringify(photo));
  }

  // usunięcie jednego taska wg id
  else if (url.match(/\/api\/photos\/([0-9]+)/) && method == "DELETE") {
    const id = url.split("/")[3];
    fileController.delete(id);
    response.writeHead(200, {
      "Content-Type": "application/json;charset=utf-8",
    });
    response.end(JSON.stringify({ status: "deleted" }));
  }

  // aktualizacja jednego taska wg id
  else if (url == "/api/photos" && method == "PATCH") {
    let data = await getRequestData(request);
    const id = JSON.parse(data).id;
    const photo = fileController.getOne(id);
    if (!photo) {
      response.writeHead(404, {
        "Content-Type": "application/json;charset=utf-8",
        status: "photo not found",
      });
    }
    fileController.update(id, data);
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
