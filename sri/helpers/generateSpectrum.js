module.exports = (x, N) => {
  let fReal = new Array(N).fill(0);
  let fImaginary = new Array(N).fill(0);
  let fp = new Array(N).fill(0);

  for (let p = 0; p < N; p++) {
    fReal[p] = []
    fImaginary[p] = []
    for (let k = 0; k < N; k++) {
      
      fReal[p][k] = Math.cos(((2 * Math.PI) / N) * p * k).toFixed(2);
      fImaginary[p][k] = Math.sin(((2 * Math.PI) / N) * p * k).toFixed(2)
    }
    //fp[p] = Math.sqrt(Math.pow(fReal[p], 2) + Math.pow(fImaginary[p], 2));
  }

  return [fReal, fImaginary];
};
