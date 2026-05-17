import { photos } from "../model.js";
import fs from "fs";
const controller = {
  add: (data) => {
    tasks.push(JSON.parse(data));
    fs.writeFileSync(
      "./app/model.js",
      "export let tasks = " + JSON.stringify(tasks),
    );
  },
  delete: (id) => {
    let index = tasks.findIndex((t) => t.id == id);
    tasks.splice(index, 1);
    fs.writeFileSync(
      "./app/model.js",
      "export let tasks = " + JSON.stringify(tasks),
    );
  },
  update: (id, data) => {
    let index = tasks.findIndex((t) => t.id == id);
    tasks[index] = JSON.parse(data);
    fs.writeFileSync(
      "./app/model.js",
      "export let tasks = " + JSON.stringify(tasks),
    );
  },
  getall: () => {
    return tasks;
  },
  getOne: (id) => {
    console.log(id);
    return tasks.find((t) => t.id == id);
  },
};
export default controller;
