const linspace = require("./helpers/linspace");
const signalGeneration = require("./helpers/signalGeneration");
const dispersion = require("./helpers/dispersion");
const graph = require("./helpers/buildGraph");

const n = 10; // n - number of harmonics
const w = 1500; // w - max frequency
let N = 256; // N - number of countings

const x = signalGeneration(n, w, N);

console.log(x)

const generateSpectrum = (x, N) => {

  let fReal = new Array(N).fill(0);
  let fImaginary = new Array(N).fill(0);

  console.log({fReal, fImaginary})

  for(let p = 0; p < N - 1; p++) {
    for(let k = 0; k < N - 1; k++) {
      fReal[p] += x[k] * Math.cos((2 * Math.PI / N) * p * k)
      fImaginary[p] += x[k] * Math.sin((2 * Math.PI / N) * p * k)
    }
  }

  return [fReal, fImaginary]
} 

const spectrum = generateSpectrum(x, N)
console.log({spectrum});
