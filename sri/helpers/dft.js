module.exports = (x) => {
  const N = x.length;
  let fReal = new Array(N).fill(0);
  let fImaginary = new Array(N).fill(0);
  let fp = new Array(N).fill(0);

  for (let p = 0; p < N; p++) {
    for (let k = 0; k < N; k++) {
      fReal[p] += x[k] * Math.cos(((2 * Math.PI) / N) * p * k);
      fImaginary[p] += x[k] * Math.sin(((2 * Math.PI) / N) * p * k);
    }
    fp[p] = Math.sqrt(Math.pow(fReal[p], 2) + Math.pow(fImaginary[p], 2));
  }

  return fp;
};
