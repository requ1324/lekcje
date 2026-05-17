const convertToObj = (data) => {
  let objArr = [];

  for (let i = 0; i < data.length; i++) {
    let random = Math.floor(Math.random() * 500);
    objArr.push({
      id: i,
      name: data[i],
      popularity: random,
    });
  }

  return objArr;
};

export default convertToObj;
