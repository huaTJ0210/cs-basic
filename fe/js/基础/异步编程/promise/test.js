const p0 = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 300);
  });

const p1 = () =>
  new Promise(async (resolve) => {
    await p0();
    resolve(true);
  });

const p2 = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });

Promise.all([p1(), p2()]).then((data) => {
  console.log(data);
});
