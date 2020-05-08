const fs = require("fs");
const linspace = require("./helpers/linspace");
const signalGeneration = require("./helpers/signalGeneration");
const dispersion = require("./helpers/dispersion");
const graph = require("./helpers/buildGraph");
const write = require("fs-writefile-promise");
const correlation = require('./helpers/corelation');
const uploadToDrive = require("./index");

const n = 10; // n - number of harmonics
const w = 1500; // w - max frequency
const N = 256; // N - number of countings

const date = new Date().toISOString();
const fileName = `lab1_2-${date}.txt`;

const y = linspace(0, N/2, 1);

const mathExp = arr => {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
};

const x = signalGeneration(n, w, 1000);
const x2 = signalGeneration(n, w, N);
const z = [0, 0, 0, 0, 0, 1, 2, 0, -2, -1, -0.3, -0.3, -0.3,-0.55, -0.77,  -1, -1, -1, -0.7, -0.3, 0, 0, 0 , 0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 1.5, 2, 1.75, 1.5, 1.25, 0, 0, 0, 1.25, 1.5, 0.75, 0, -0.75, 0, 0, 0, 0, 0];
const t = linspace(0, 50, 1)
console.log(z.length, t)

console.time("Mx");
const Mx = mathExp(x);
const Mx2 = mathExp(x2);
Mz = mathExp(z)
console.log({Mz})
const time2 = console.timeEnd("Mx");

console.time("Dx");
const Dx = dispersion(x, Mx);
const Dx2 = dispersion(x2, Mx2);
console.timeEnd("Dx");

const formating = (Mx, Dx) => {
  return `Mx: ${Mx}\nDx: ${Dx}\nMy: ${Mx2}\nDy: ${Dx2}`;
};
const Rxy = correlation(x, Mx, N, x2, Mx2);
const Rxx = correlation(x, Mx, N);

const Rxz = correlation(x, Mx, N, z, Mz, z.length);
const Rzx = correlation(z, Mz, z.length, x, Mx, N);
const Rzz = correlation(z, Mz, z.length);

console.log({Rxz, Rzx, Rzz})


write(fileName, formating(Mx, Dx), "utf-8")
  .then(filename => {
    console.log(`Data has been written to the file: ${filename}`);
     graph(Rxz, t, "xz");
     graph(Rzx, t, "zx");
     graph(Rzz, t, "zz");

    uploadToDrive(fileName);
  })
  .catch(err => console.log(err));
