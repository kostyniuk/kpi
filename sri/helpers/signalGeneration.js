const linspace = require('./linspace');

module.exports = (n, w, N) => {
  let A, fi;
  let x = new Array(N);
  x.fill(0, 0, x.length)
  const frequencies = linspace(0, w, n);
  for(let i = 0; i < n; i++) {
    A = Math.random(0, 1);
    fi = Math.random(0, 1);
    for(let j = 0; j < N; j++) {
      x[j] += A * Math.sin(frequencies[i]*j + fi)
    }
  }
  return x
};
