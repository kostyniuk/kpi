// Заголовок - размер текущего блока, размер предыдущего блока и признак занятости блока.

/*
console.log({
            size_t,
            current: buffer[i],
            next: buffer[i + 1],
            nextBlock: buffer[i + buffer[i + 1]],
            i,
            index2: i + buffer[i + 1] + 3,
            nextBlock2: buffer[i + buffer[i + 1] + 3]
          });
*/

const random = (arr, indexFrom, quantity, fillWith) => {
  for (let i = indexFrom; i < indexFrom + quantity; i++) {
    if (fillWith) {
      arr[i] = null;
    } else {
      arr[i] = Math.floor(Math.random() * 100);
    }
  }
  return arr;
};

// console.log(random([1,2,3,4,5,6,7,8,9], 3,2))

const allocator = (size = 32) => {
  let buffer;
  const alloc = {
    create() {
      buffer = new Array(size);
      buffer[0] = 1; //state
      buffer[1] = 0; //current
      buffer[2] = 0; //previous

      buffer[3] = 0;
      buffer[4] = size - 9;
      buffer[5] = 0;

      buffer[buffer.length - 1] = size - 9;
      buffer[buffer.length - 2] = 0;
      buffer[buffer.length - 3] = 1;

      //console.log(buffer)
      return this;
    },
    mem_alloc(size_t) {
      let flag = 0;
      for (let i = 3; i < buffer.length; i++) {
        if (buffer[i] === 0 && !flag) {
          //console.log({i, next: i + buffer[i + 1] + 3})
          if (
            buffer[i + buffer[i + 1] + 3] === 0 ||
            buffer[i + buffer[i + 1] + 3] === 1
          ) {
            console.log({i, size_t})
            if (buffer[i + 1] >= size_t) {
              buffer[i] = 1;
              buffer[i + 1] = size_t;
              buffer = random(buffer, i + 3, size_t);
              console.log({i})

              // Creation of a new header and blocks for rest parts
              if (i + 3 + size_t > size - 3 - 3) {
                console.log('here');
                console.log({ i, size_t });

                buffer[i + 1] = size - i - 3 - 3;
                buffer = random(
                  buffer,
                  i + 3 + size_t,
                  size - (i + 3 + size_t) - 3
                );
              } else {
                // for(let j = i + 3 + size_t; j < size; j++) {
                //   if (buffer[j]===0) {
                //     console.log({j, val: buffer[j], diff: j - (i + 3 + size_t)})
                //     //buffer[i + 3 + size_t + 1] = j - (i + 3 +4+ size_t)
                //     break;
                //   }
                // }

                buffer[i + 3 + size_t] = 0;
                buffer[i + 3 + size_t + 1] = size - (i + size_t + 4) - 5;
                buffer[i + 3 + size_t + 2] = size_t;
              }

              console.log(buffer[i + 3 + size_t + 1]);

              buffer[size - 1] = buffer[i + 3 + size_t + 1];
              flag = 1;
              break;
            }
          }
        }
      }

      if (flag) {
        console.log('New memory block allocated');
      } else {
        console.log("New memory block isn't allocated");
      }

      return this;
    },
    mem_realloc(addr, size) {

      console.log({addr, size, el: buffer[addr]})

      for(let i = addr; i > 0; i--) {
        if ((buffer[i] === 0 || buffer[i] === 1) && (buffer[i + buffer[i + 1] + 3] === 0 ||
          buffer[i + buffer[i + 1] + 3] === 1)) {
          const headerStartIndex = i;
          console.log(buffer[i + buffer[i + 1] + 3])
          if (buffer[headerStartIndex+1] > size + 2) {
            console.log({size, sizeOfBlock: buffer[headerStartIndex+1], i})
            buffer[headerStartIndex+1] = size;
            for (let j = i+3; j < buffer.length; j++) {
              // console.log(j)
              if ((buffer[j] === 0 || buffer[j] === 1) && (buffer[j + buffer[j + 1] + 3] === 0 ||
                buffer[j + buffer[j + 1] + 3] === 1)) {
                console.log(j);
                const restStart = headerStartIndex + size + 3
                console.log(restStart)
                if (j - restStart > 2) {
                  buffer[restStart] = 0;
                  buffer[restStart+1] = j - restStart - 3;
                  buffer[restStart+2] = size;

                  buffer[j+2] = buffer[restStart+1]

                }
                break;
              }
            }
          }
          break;
        }
      }

      return this;
    },
    mem_free(addr) {
      console.log({ addr, block: buffer[addr] });

      for (let i = addr; i > 0; i--) {
        if (
          buffer[i] === 1 &&
          (buffer[i + buffer[i + 1] + 3] === 0 ||
            buffer[i + buffer[i + 1] + 3] === 1)
        ) {
          console.log({
            i,
            el: buffer[i],
            next: buffer[i + buffer[i + 1] + 3]
          });
          buffer[i] = 0;
          buffer = random(buffer, i + 3, buffer[i + 1], 'empty');
          break;
        }
        
      }

      return this;
    },
    mem_dump() {
      console.log({ buffer });
      return this;
    }
  };

  return alloc;
};

console.log(
  allocator()
    .create()
    .mem_dump()
    .mem_alloc(5)
    .mem_dump()
    .mem_alloc(7)
    .mem_dump().mem_realloc(10, 2)
    // .mem_free(8)
    // .mem_dump()
    // .mem_alloc(1)
    // .mem_free(24)
    // .mem_alloc(1)
    .mem_dump()
);
