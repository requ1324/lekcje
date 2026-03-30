const test01 = (successCallback, errCallback) => {
  setTimeout(() => {
    const succes = Math.random() > 0.5;
    if (succes) {
      successCallback("Udalo sie!");
    } else {
      errCallback("Nie udalo sie!");
    }
  }, 1000);
};

const log = (text) => {
  console.log("Kod mowi: " + text);
};

test01(log, log);
