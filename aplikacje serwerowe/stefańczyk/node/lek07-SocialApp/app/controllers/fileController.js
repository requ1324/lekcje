import { photos, convertedTags } from "../model.js";
import fs from "fs";

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

const controller = {
  add: (data) => {
    photos.push(JSON.parse(data));
    saveModel();
  },
  delete: (id) => {
    let index = photos.findIndex((t) => t.id == id);
    photos.splice(index, 1);
    saveModel();
  },
  update: (id, data) => {
    let index = photos.findIndex((t) => t.id == id);
    photos[index] = JSON.parse(data);
    saveModel();
  },
  getall: () => {
    return photos;
  },
  getOne: (id) => {
    console.log(id);
    return photos.find((t) => t.id == id);
  },
};
export default controller;
