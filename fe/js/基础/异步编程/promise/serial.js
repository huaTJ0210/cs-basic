// 实现任务的串行，无论任务执行失败与否不影响后续任务的执行

async function serial(tasks) {
  const resultList = [];
  for (const task of tasks) {
    try {
      resultList.push(await task());
    } catch (e) {
      resultList.push(null);
    }
  }
}

function serial1(tasks) {
  return tasks.reduce((pre, cur) => {
    return new Promise((resolve) => {
      pre.then((resultList) => {
        cur()
          .then((result) => {
            resolve(resultList.concat(result));
          })
          .catch((e) => {
            resolve(resultList.concat(null));
          });
      });
    });
  }, Promise.resolve([]));
}
