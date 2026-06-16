import getRequestData from "../getRequestData.js";
import path from "path";
import fs from "fs";
import formidable from "formidable";
import fileController from "../controllers/fileController.js";

const sendJson = (response, status, data) => {
  response.writeHead(status, {
    "Content-Type": "application/json;charset=utf-8",
  });
  response.end(JSON.stringify(data));
};

const router = async (request, response) => {
  const { method, url } = request;

  if (url == "/api/photos" && method == "POST") {
    const form = formidable();
    form.parse(request, function (err, fields, files) {
      if (err) {
        sendJson(response, 400, { status: "error", message: err.message });
        return;
      }

      const firstFileEntry = Object.values(files)[0];
      const uploadedFile = Array.isArray(firstFileEntry)
        ? firstFileEntry[0]
        : firstFileEntry;

      if (!uploadedFile) {
        sendJson(response, 400, { status: "file not found" });
        return;
      }

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

      const id = Date.now();
      const uniqueName = `${id}-${originalName}`;
      const newPath = path.join(albumDir, uniqueName);

      fs.copyFile(oldPath, newPath, function (copyError) {
        if (copyError) {
          sendJson(response, 500, {
            status: "error",
            message: copyError.message,
          });
          return;
        }

        const photo = {
          id: id,
          album: albumName,
          originalName: originalName,
          url: `uploads/${albumName}/${path.basename(newPath)}`,
          lastChange: "original",
          history: [
            {
              status: "original",
              timestamp: id,
            },
          ],
        };

        fileController.add(photo);
        sendJson(response, 201, photo);
      });
    });
    return;
  }

  // pobranie wszystkich zdjęć
  else if (url == "/api/photos" && method == "GET") {
    let photos = fileController.getall();
    sendJson(response, 200, photos);
  }

  // pobranie jednego wg id
  else if (url.match(/\/api\/photos\/([0-9]+)/) && method == "GET") {
    const id = url.split("/")[3];
    let photo = fileController.getOne(id);
    if (!photo) {
      sendJson(response, 404, { message: `photo with id ${id} not found` });
      return;
    }
    sendJson(response, 200, photo);
  }

  // usunięcie jednego zdjęcia wg id
  else if (url.match(/\/api\/photos\/([0-9]+)/) && method == "DELETE") {
    const id = url.split("/")[3];
    let deleted = fileController.delete(id);
    if (deleted) {
      sendJson(response, 200, { message: `photo with id ${id} deleted` });
    } else {
      sendJson(response, 404, { message: `photo with id ${id} not found` });
    }
  } else if (url == "/api/photos/tags" && method == "PATCH") {
    try {
      let data = await getRequestData(request);
      let photo = fileController.addTag(data);
      if (!photo) {
        let id = JSON.parse(data).id;
        sendJson(response, 404, { message: `photo with id ${id} not found` });
        return;
      }
      sendJson(response, 200, photo);
    } catch (error) {
      sendJson(response, 400, { status: "error", message: error.message });
    }
  } else if (url == "/api/photos/tags/mass" && method == "PATCH") {
    try {
      let data = await getRequestData(request);
      let photo = fileController.addTags(data);
      if (!photo) {
        let id = JSON.parse(data).id;
        sendJson(response, 404, { message: `photo with id ${id} not found` });
        return;
      }
      sendJson(response, 200, photo);
    } catch (error) {
      sendJson(response, 400, { status: "error", message: error.message });
    }
  } else if (url.match(/\/api\/photos\/tags\/([0-9]+)/) && method == "GET") {
    const id = url.split("/")[4];
    let tags = fileController.getTags(id);
    if (!tags) {
      sendJson(response, 404, { message: `photo with id ${id} not found` });
      return;
    }
    sendJson(response, 200, tags);
  }
  // aktualizacja jednego zdjęcia wg id
  else if (url.match(/\/api\/photos\/([0-9]+)/) && method == "PATCH") {
    const id = url.split("/")[3];
    try {
      let data = await getRequestData(request);
      let photo = fileController.update(id, data);
      if (!photo) {
        sendJson(response, 404, { message: `photo with id ${id} not found` });
        return;
      }
      sendJson(response, 200, photo);
    } catch (error) {
      sendJson(response, 400, { status: "error", message: error.message });
    }
  } else if (url == "/api/photos" && method == "PATCH") {
    try {
      let data = await getRequestData(request);
      const id = JSON.parse(data).id;
      let photo = fileController.update(id, data);
      if (!photo) {
        sendJson(response, 404, { message: `photo with id ${id} not found` });
        return;
      }
      sendJson(response, 200, photo);
    } catch (error) {
      sendJson(response, 400, { status: "error", message: error.message });
    }
  } else {
    sendJson(response, 404, { status: "path not found" });
  }
  /* PATCH /api/photos/tags // aktualizacja danych zdjęcia o nowy tag
PATCH /api/photos/tags/mass // aktualizacja danych zdjęcia o tablicę nowych tag-ów
GET /api/photos/tags/12345 // pobranie tagów danego zdjęcia
*/
};

export default router;
