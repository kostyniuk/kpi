const linspace = require('./helpers/linspace');
const signalGeneration = require('./helpers/signalGeneration');
const dispersion = require('./helpers/dispersion');
const graph = require('./helpers/buildGraph');
const generateSpectrum = require('./helpers/dft');
const fftGenerator = require('./helpers/fft');

const n = 10; // n - number of harmonics
const w = 1500; // w - max frequency
let N = 256; // N - number of countings

const x = signalGeneration(n, w, N);

const y = linspace(0, N, 1);

const dft = generateSpectrum(x);
const fft = fftGenerator(x);

console.log({fft, dft})

graph(dft, y, 'dft');
graph(fft, y, 'fft');
