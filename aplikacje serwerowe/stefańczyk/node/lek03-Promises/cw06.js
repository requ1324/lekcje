const wait = (val) => {
  const random = Math.floor(Math.random() * 4);
  return new Promise((resolve) =>
    setTimeout(() => resolve(val), random * 1000),
  );
};

const processData = async (list) => {
  const progress = setInterval(() => {
    process.stdout.write("-");
  }, 500);

  for (const item of list) {
    // foreach nie zadziala bo nie obsluguje async/await
    const res = await wait(item);
    console.log("Przetworzono:", res);
  }
  clearInterval(progress);
  console.log("Koniec pętli");
};

processData([10, 20, 30, 40]);
