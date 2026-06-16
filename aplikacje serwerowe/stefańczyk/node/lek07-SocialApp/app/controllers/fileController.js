import { photos, convertedTags } from "../model.js";
import fs from "fs";
import path from "path";

const saveModel = () => {
  fs.writeFileSync(
    "./app/model.js",
    `export let photos = ${JSON.stringify(photos, null, 2)};\n\n` +
      `export let tags = ${JSON.stringify(
        convertedTags.map((tag) => tag.name),
        null,
        2,
      )};\n\n` +
      `export let convertedTags = ${JSON.stringify(convertedTags, null, 2)};\n`,
  );
};

const makeTag = (tag) => {
  if (!tag) {
    return null;
  }

  if (typeof tag == "string") {
    return { name: tag };
  }

  if (tag.name) {
    return { name: tag.name };
  }

  return null;
};

const addTagsToPhoto = (id, tags) => {
  let index = photos.findIndex((t) => t.id == id);
  if (index == -1) {
    return null;
  }

  let photo = photos[index];
  if (!photo.tags) {
    photo.tags = [];
  }

  tags.forEach((tagData) => {
    let tag = makeTag(tagData);
    if (!tag) {
      return;
    }

    let exists = photo.tags.some((t) => t.name == tag.name);
    if (!exists) {
      photo.tags.push(tag);

      let globalTag = convertedTags.find((t) => t.name == tag.name);
      if (globalTag) {
        globalTag.popularity = globalTag.popularity + 1;
      }
    }
  });

  saveModel();
  return photo;
};

const controller = {
  add: (data) => {
    let photo = typeof data == "string" ? JSON.parse(data) : data;
    photos.push(photo);
    saveModel();
    return photo;
  },
  delete: (id) => {
    let index = photos.findIndex((t) => t.id == id);
    if (index == -1) {
      return false;
    }

    let photo = photos[index];
    if (photo.url) {
      let filePath = path.join(process.cwd(), photo.url.replace(/^\/+/, ""));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    photos.splice(index, 1);
    saveModel();
    return true;
  },
  update: (id, data) => {
    let index = photos.findIndex((t) => t.id == id);
    if (index == -1) {
      return null;
    }

    let body = typeof data == "string" ? JSON.parse(data) : data;
    let status = body.status || body.lastChange || "changed";
    let photo = photos[index];

    if (!photo.history) {
      photo.history = [
        {
          status: photo.lastChange || "original",
          timestamp: photo.id,
        },
      ];
    }

    photo.lastChange = status;
    photo.history.push({
      status: status,
      timestamp: Date.now(),
    });

    saveModel();
    return photo;
  },
  getall: () => {
    return photos;
  },
  getOne: (id) => {
    console.log(id);
    return photos.find((t) => t.id == id);
  },
  addFilterHistory: (id, filter, url) => {
    let photo = photos.find((t) => t.id == id);
    if (!photo) {
      return null;
    }

    if (!photo.history) {
      photo.history = [
        {
          status: photo.lastChange || "original",
          timestamp: photo.id,
        },
      ];
    }

    photo.lastChange = filter;
    photo.history.push({
      status: filter,
      timestamp: Date.now(),
      url: url,
    });

    saveModel();
    return photo;
  },
  addTag: (data) => {
    let body = typeof data == "string" ? JSON.parse(data) : data;
    let tag = body.tag || body.name || body;
    return addTagsToPhoto(body.id, [tag]);
  },
  addTags: (data) => {
    let body = typeof data == "string" ? JSON.parse(data) : data;
    let tags = body.tags || [];

    if (!Array.isArray(tags)) {
      tags = [tags];
    }

    return addTagsToPhoto(body.id, tags);
  },
  getTags: (id) => {
    let photo = photos.find((t) => t.id == id);
    if (!photo) {
      return null;
    }

    return photo.tags || [];
  },
};
export default controller;
