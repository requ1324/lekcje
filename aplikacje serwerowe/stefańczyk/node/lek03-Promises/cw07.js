import Datastore from "@seald-io/nedb";

const coll1 = new Datastore({
  filename: "kolekcja.db",
  autoload: true,
});

const wait = (time) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), time);
  });
};

const getAll = () => {
  return new Promise((resolve, reject) => {
    try {
      coll1.find({}, (err, docs) => {
        resolve(docs);
      });
    } catch (error) {
      reject(error.message);
    }
  });
};

const show = async () => {
  console.log("pobieram dane 1 raz");
  const x = await getAll();
  console.log(x);
  console.log("pobieram dane 2 raz");
  await wait(1000);
  const y = await getAll();
  console.log(y);
  console.log("pobieram dane 3 raz");
  await wait(2000);
  const z = await getAll();
  console.log(z);
};

show();
