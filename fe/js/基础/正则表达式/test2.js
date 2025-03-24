// 判断是合法的日期
const isValidDate = (date) => date instanceof Date && !isNaN(date.getTime());

// 判断 2020年10月10日是否为合法日期
const isValidDateNYR = (dateText) => {
  let date = "";
  if (dateText.indexOf("年") !== -1) {
    const tempDateText = dateText.replace(/[年月日]/g, "-");
    date = tempDateText.substring(0, tempDateText.length - 1);
  } else {
    date = dateText;
  }
  const validDate = new Date(date);
  return isValidDate(validDate);
};

console.log(isValidDateNYR("2022年12月10日"));
