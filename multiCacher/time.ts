/**
 * 返回 min, max 之间的整数
 * @param min
 * @param max
 * @returns
 */
function random(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
}

/**
 * 计算缓存时间，单位：秒
 * @param expireSeconds 秒数值或秒数区间
 * @returns
 */
export function calcCacheExpires(
  expireSeconds: number | [number, number]
): number {
  let expires: number;

  if (typeof expireSeconds === "number") {
    expires = expireSeconds;
  } else {
    expires =
      expireSeconds[0] === expireSeconds[1]
        ? expireSeconds[0]
        : random(expireSeconds[0], expireSeconds[1]);
  }

  return expires;
}
