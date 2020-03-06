module.exports = (start, stop, num) => {
  let result = [];
  if (num === 1) {
    for(let i = start; i < stop; i++) {
      result.push(i)
    }
  } else {
    const step = stop/num;
    for(let i = start; i < stop; i=i+step) {
      result.push(i)
  }
  }
  return result
}