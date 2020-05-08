module.exports = x => {
  const N = x.length;
  const halfN = Math.floor(N / 2);
  let freal11 = new Array(halfN).fill(0);
  let freal12 = new Array(halfN).fill(0);
  let freal1 = new Array(N).fill(0);
  let fimage11 = new Array(halfN).fill(0);
  let fimage12 = new Array(halfN).fill(0);
  new Array(N / 2).fill(0);
  let fimage1 = new Array(N).fill(0);

  let f = new Array(N).fill(0);

  for (let p = 0; p < halfN; p++) {
    for (let m = 0; m < halfN; m++) {
      freal11[p] += x[2 * m + 1] * Math.cos(((4 * Math.PI) / N) * p * m);
      fimage11[p] += x[2 * m + 1] * Math.sin(((4 * Math.PI) / N) * p * m);
      freal12[p] += x[2 * m] * Math.cos(((4 * Math.PI) / N) * p * m);
      fimage12[p] += x[2 * m] * Math.sin(((4 * Math.PI) / N) * p * m);
      freal1[p] =
        freal12[p] +
        freal11[p] * Math.cos(((2 * Math.PI) / N) * p) -
        fimage11[p] * Math.sin(((2 * Math.PI) / N) * p);
      fimage1[p] =
        fimage12[p] +
        fimage11[p] * Math.cos(((2 * Math.PI) / N) * p) +
        freal11[p] * Math.sin(((2 * Math.PI) / N) * p);
      freal1[p + (N / 2)] =
        freal12[p] -
        (freal11[p] * Math.cos(((2 * Math.PI) / N) * p) -
          fimage11[p] * Math.sin(((2 * Math.PI) / N) * p));
      fimage1[p + (N / 2)] =
        fimage12[p] -
        (fimage11[p] * Math.cos(((2 * Math.PI) / N) * p) +
          freal11[p] * Math.sin(((2 * Math.PI) / N) * p));
      f[p] = (freal1[p] ** 2 + fimage1[p] ** 2) ** 0.5;
      f[p + (N / 2)] =
        (freal1[p + (N / 2)] ** 2 + fimage1[p + (N / 2)] ** 2) ** 0.5;
    }
  }

  return f;
};
