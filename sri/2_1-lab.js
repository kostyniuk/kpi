const linspace = require("./helpers/linspace");
const signalGeneration = require("./helpers/signalGeneration");
const dispersion = require("./helpers/dispersion");
const graph = require("./helpers/buildGraph");
const generateSpectrum = require('./helpers/generateSpectrum');

const n = 10; // n - number of harmonics
const w = 1500; // w - max frequency
let N = 8; // N - number of countings

const x = signalGeneration(n, w, N);

const y = linspace(0, N, 1);

const spectrum = generateSpectrum(x, N)

graph(spectrum, y, "2_1");

console.log(spectrum)


console.table(spectrum[0])
console.table(spectrum[1])

