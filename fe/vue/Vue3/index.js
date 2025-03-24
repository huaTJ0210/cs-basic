const bucket = new Set();

const data = { text: 'hello world' };

let effect = () => {
  console.log(data.text);
};

const obj = new Proxy(data, {
  get(target, key) {
    bucket.add(effect);
    return target[key];
  },
  set(target, key, newVal) {
    target[key] = newVal;
    bucket.forEach((fn) => fn());
  }
});

// ---- 任务队列 ---
const jobQueue = new Set();
// 任务队列是否正在刷新
let isFlushing = false;
const p = Promise.resolve();
function flushJob() {
  if (isFlushing) return;
  isFlushing = true;
  p.then(() => {
    // 任务放到微任务队列中执行
    jobQueue.forEach((job) => job());
  }).finally(() => {
    isFlushing = false;
  });
}
