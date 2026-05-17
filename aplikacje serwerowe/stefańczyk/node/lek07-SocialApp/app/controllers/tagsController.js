import { tags } from "../model.js";
import convertToObj from "../convertToObj.js";
import fs from "fs";
const controller = {
  add: (data) => {
    photos.push(JSON.parse(data));
    fs.writeFileSync(
      "./app/model.js",
      "export let photos = " + JSON.stringify(photos),
    );
  },
  delete: (id) => {
    let index = photos.findIndex((t) => t.id == id);
    photos.splice(index, 1);
    fs.writeFileSync(
      "./app/model.js",
      "export let photos = " + JSON.stringify(photos),
    );
  },
  update: (id, data) => {
    let index = photos.findIndex((t) => t.id == id);
    photos[index] = JSON.parse(data);
    fs.writeFileSync(
      "./app/model.js",
      "export let photos = " + JSON.stringify(photos),
    );
  },
  getall: () => {
    return tags;
  },
  getOne: (id) => {
    console.log(id);
    let convertedTags = convertToObj(tags);
    return convertedTags.find((t) => t.id == id);
  },
};
export default controller;
