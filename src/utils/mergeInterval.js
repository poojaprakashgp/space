  const arr1 = [
    [1, 4],
    [8, 15],
    [3, 6],
    [8, 10],
  ]

  function mergeInterval(arr1) {
    let sorted = arr.sort((a, b) => a[0] - b[0]);
    console.log(sorted, 'sorted');
    let initalVal = sorted[0];
    let result = [];
    for (let i = 1; i < arr.length; i++) {
      if (initalVal[1] >= sorted[i][0]) {
        initalVal = [initalVal[0], Math.max(initalVal[1], sorted[i][1])];
      } else {
        result.push(initalVal);
        initalVal = sorted[i];
      }
    }
    result.push(initalVal);
    console.log(result);
  }
