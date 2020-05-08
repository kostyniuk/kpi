"use strict";

const readline = require("readline");
const genetic = require('./lab3_3');
//sconsole.log({genetic})
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

rl.prompt();

const commands = {
  help() {
    console.log("Commands:", Object.keys(commands).join(", "));
    rl.prompt();

  },
  hello() {
    console.log("Hello there!. This is a CLI for genetic alghorithm");
    rl.prompt();

  },
  exec() {
    rl.question("Enter a: ", (a) => {
        console.log(`a = ${a}`);
        rl.question("Enter b: ", (b) => {
          console.log(`b = ${b}`);
          rl.question("Enter c: ", (c) => {
            console.log(`c = ${c}`);
            rl.question("Enter d: ", (d) => {
              console.log(`d = ${d}`);
              rl.question("Enter d: ", (y) => {
                console.log(`y = ${y}`);
                genetic({a, b, c, d}, y)
                rl.prompt();
              });
            });
          });
        });
      });
  },
  exit() {
    rl.close();
  }
};


rl.on("line", (line) => {
  line = line.trim();
  const command = commands[line];
  if (command) command();
  else {
    
  }
}).on("close", () => {
  console.log("Bye!");
  process.exit(0);
});
