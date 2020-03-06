module.exports = (x, Mx, N, y, My, N2) => {

  let Rxx = new Array(x.length/2);
  Rxx.fill(0, 0, Rxx.length)

  if (y) {
    //console.log('Two processes')
    for (let i = 0; i < N / 2; i++) {
      for(let j = 0; j < N2 / 2; j++) {
        Rxx[i] += ((x[i] - Mx) * (y[i + j] - My))/(N-1)
      }
    }
  } else {
    //console.log('One process')
    for (let i = 0; i < N / 2; i++) {
      for(let j = 0; j < N / 2; j++) {
        Rxx[i] += ((x[i] - Mx) * (x[i + j] - Mx))/(N-1)
      }
    }
  }

  return Rxx.filter(el => !!el)
};