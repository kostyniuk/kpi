const fs = require("fs");
const linspace = require("./helpers/linspace");
const signalGeneration = require("./helpers/signalGeneration");
const dispersion = require("./helpers/dispersion");
const graph = require("./helpers/buildGraph");
const write = require("fs-writefile-promise");
const uploadToDrive = require("./index");
const {performance} = require('perf_hooks');

const n = 10; // n - number of harmonics
const w = 1500; // w - max frequency
let N = 256; // N - number of countings

const date = new Date().toISOString();
const fileName = `lab1_1-${date}.txt`;

const y = linspace(0, N, 1);

const mathExp = arr => {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
};

const x = signalGeneration(n, w, N);

let times = [];



for(let i = 256; i < 2560; i++) {
  // const start = Date.now()
  const t0 = performance.now();
  signalGeneration(n, w, N);
  const t1 = performance.now();
  N++;
  //times.push(Date.now() - start)
  times.push(t1- t0)
}

console.log(times)
console.log(times.length)

const t = linspace(256, 2560, 1)
console.log(t)

console.time("Mx");
const Mx = mathExp(x);
const time2 = console.timeEnd("Mx");

console.time("Dx");
const Dx = dispersion(x, Mx);
console.timeEnd("Dx");

const formating = (Mx, Dx) => {
  return `Mx: ${Mx}\nDx: ${Dx}`;
};

write(fileName, formating(Mx, Dx), "utf-8")
  .then(filename => {
    console.log(`Data has been written to the file: ${filename}`);
    //graph(x, y, "1.1");
    graph(times, t, "addiotional");
    uploadToDrive(fileName);
    console.log('File has been send to my drive')
  })
  .catch(err => console.log(err));