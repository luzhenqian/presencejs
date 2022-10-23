// 获取指定范围内的随机数
function randomAccess(min: number, max: number) {
  return Math.floor(Math.random() * (min - max) + max);
}

// 解码
function decodeUnicode(str: string) {
  //Unicode显示方式是\u4e00
  str = '\\u' + str;
  str = str.replace(/\\/g, '%');
  //转换中文
  str = unescape(str);
  //将其他受影响的转换回原来
  str = str.replace(/%/g, '\\');
  return str;
}

/*
 *@param Number NameLength 要获取的名字长度
 */
export function getRandomName(NameLength: number) {
  let name = '';
  for (let i = 0; i < NameLength; i++) {
    let unicodeNum = '';
    unicodeNum = randomAccess(0x4e00, 0x9fa5).toString(16);
    name += decodeUnicode(unicodeNum);
  }
  return name;
}
