const test02 = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve("Czekalem 3 sekundy"), 1000);
  });
};

const wait = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 2000);
  });
};

const check = async () => {
  console.log("Czekam");
  await wait();
  const info = await test02();
  console.log(info);
};

check();
