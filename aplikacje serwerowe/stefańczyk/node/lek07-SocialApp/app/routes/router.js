import getRequestData from "../getRequestData.js";
import path from "path";
import fs from "fs";
import formidable from "formidable";
import fileController from "../controllers/fileController.js";

const router = async (request, response) => {
  const { method, url } = request;
  console.log();
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
      const albumValue = Array.isArray(fields?.album)
        ? fields.album[0]
        : fields?.album;
      const normalizedAlbum = albumValue ? String(albumValue).trim() : "";
      const albumName = normalizedAlbum
        ? path.basename(normalizedAlbum)
        : "album";
      const albumDir = path.join(uploadDir, albumName);
      fs.mkdirSync(albumDir, { recursive: true });

      const uniqueName = `${Date.now()}-${originalName}`;
      const newPath = path.join(albumDir, uniqueName);

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
          album: albumName,
          status: "ok",
          filename: path.basename(newPath),
          url: `/uploads/${albumName}/${path.basename(newPath)}`,
          lastChange: "original",
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
  } else if (url == "/api/photos/tags" && method == "PATCH") {
  } else if (url == "/api/photos/tags/mass" && method == "PATCH") {
  } else if (url.match(/\/api\/photos\/tags\/([0-9]+)/) && method == "GET") {
    const id = url.split("/")[4];
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
  /* PATCH /api/photos/tags // aktualizacja danych zdjęcia o nowy tag
PATCH /api/photos/tags/mass // aktualizacja danych zdjęcia o tablicę nowych tag-ów
GET /api/photos/tags/12345 // pobranie tagów danego zdjęcia
*/
};

export default router;
