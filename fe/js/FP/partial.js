/**
 *  一个可以先预设一些默认参数工具
 *
 */

const partial =
  (fn, ...presetArgs) =>
  (...laterArgs) =>
    fn(...presetArgs, ...laterArgs)
