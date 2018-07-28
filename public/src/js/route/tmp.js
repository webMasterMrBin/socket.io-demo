// 找出一个数组中重复的元素及其次数

function find(arr = [1, "a", "a", "b", "b", "b"]) {
  const result = {};
  // result {
  //   1: 1,
  //   "a": 2,
  //   "b": 3
  // }
  arr.forEach(o => {
    // result key为arr的值 value为出现次数
    // 若该值不存在, 则设为key:1, 存在则++
    if (!result[o]) {
      result[o] = 1;
    } else {
      result[o]++;
    }
  });

  const allKeys = Object.keys(result);
  var maxNum = 0;
  var maxEle;
  allKeys.forEach(o => {
    if (result[o] > maxNum) {
      maxNum = result[o];
      maxEle = o;
    }
  });

  console.log("result", result);

  return {
    [maxEle]: maxNum
  };
}

export default find();
