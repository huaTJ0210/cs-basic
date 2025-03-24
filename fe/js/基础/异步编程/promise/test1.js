// const p1 = Promise.resolve();

// p1.then(() => {}).then(() => {
//   console.log("p1");
// });

// 一个串行执行，可以遇到指定条件即中断执行

const filed = {
  validate: () => {
    const t = Math.floor(Math.random() * (5000 - 3000) + 3000);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("----", t);
        if (t > 3000 && t < 4000) {
          resolve({ err: t });
        } else {
          resolve();
        }
      }, t);
    });
  },
};

const fields = [filed, filed, filed];

const errors = [];
fields
  .reduce((promise, filed) => {
    return promise.then(() => {
      if (errors.length === 0) {
        return filed.validate().then((err) => {
          if (err) {
            errors.push(err);
          }
        });
      }
    });
  }, Promise.resolve())
  .then(() => {
    if (errors.length) {
      console.log(errors);
    } else {
      console.log("success");
    }
  });

/*
    validateSeq: function validateSeq(names) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var errors = [];

        var fields = _this.getFieldsByNames(names);

        fields.reduce(function (promise, field) {
          return promise.then(function () {
            if (!errors.length) {
              return field.validate().then(function (error) {
                if (error) {
                  errors.push(error);
                }
              });
            }
          });
        }, Promise.resolve()).then(function () {
          if (errors.length) {
            reject(errors);
          } else {
            resolve();
          }
        });
      });
    },
  */
