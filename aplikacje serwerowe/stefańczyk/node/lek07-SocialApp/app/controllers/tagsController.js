import { tags, convertedTags, photos } from "../model.js";
import fs from "fs";

const getRawTags = () => convertedTags.map((tag) => tag.name);

const syncRawTags = () => {
  tags.splice(0, tags.length, ...getRawTags());
};

const getRandomPopularity = () => Math.floor(Math.random() * 501);

const saveModel = () => {
  fs.writeFileSync(
    "./app/model.js",
    `export let photos = ${JSON.stringify(photos, null, 2)};\n\n` +
      `export let tags = ${JSON.stringify(getRawTags(), null, 2)};\n\n` +
      `export let convertedTags = ${JSON.stringify(convertedTags, null, 2)};\n`,
  );
};

const normalizeTag = (data) => {
  const parsed = typeof data == "string" ? JSON.parse(data) : data;

  if (!parsed || typeof parsed != "object" || Array.isArray(parsed)) {
    throw new Error("Tag must be an object");
  }

  if (!parsed.name || typeof parsed.name != "string") {
    throw new Error("Tag must have a name");
  }

  return {
    id:
      parsed.id ??
      (convertedTags.length > 0
        ? Math.max(...convertedTags.map((tag) => Number(tag.id))) + 1
        : 0),
    name: parsed.name,
    popularity: getRandomPopularity(),
  };
};

const controller = {
  add: (data) => {
    const tag = normalizeTag(data);

    if (
      convertedTags.some(
        (existingTag) =>
          existingTag.id == tag.id || existingTag.name == tag.name,
      )
    ) {
      return null;
    }

    convertedTags.push(tag);
    syncRawTags();
    saveModel();

    return tag;
  },
  delete: (id) => {
    let index = convertedTags.findIndex((t) => t.id == id);
    if (index == -1) {
      return false;
    }

    convertedTags.splice(index, 1);
    syncRawTags();
    saveModel();

    return true;
  },
  update: (id, data) => {
    let index = convertedTags.findIndex((t) => t.id == id);
    if (index == -1) {
      return null;
    }

    convertedTags[index] = normalizeTag(data);
    syncRawTags();
    saveModel();

    return convertedTags[index];
  },
  getall: () => {
    return convertedTags;
  },
  getRaw: () => {
    return getRawTags();
  },
  getOne: (id) => {
    return convertedTags.find((t) => t.id == id);
  },
};

export default controller;
