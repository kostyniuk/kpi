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

      return this;
    },
    mem_alloc(size_t) {
      let flag = 0;
      for (let i = 3; i < buffer.length; i++) {
        if (buffer[i] === 0 && !flag) {
          if (
            buffer[i + buffer[i + 1] + 3] === 0 ||
            buffer[i + buffer[i + 1] + 3] === 1
          ) {
            if (buffer[i + 1] >= size_t) {
              buffer[i] = 1;
              buffer[i + 1] = size_t;
              buffer = random(buffer, i + 3, size_t);

              // Creation of a new header and blocks for rest parts
              if (i + 3 + size_t > size - 3 - 3) {
                buffer[i + 1] = size - i - 3 - 3;
                buffer = random(
                  buffer,
                  i + 3 + size_t,
                  size - (i + 3 + size_t) - 3
                );
                // if not enough for a new header
              } else {
                buffer[i + 3 + size_t] = 0;
                let len;
                for (let k = i + 3 + size_t; k < size; k++) {
                  if (
                    (buffer[k] === 0 || buffer[k] === 1) &&
                    (buffer[k + buffer[k + 1] + 3] === 0 ||
                      buffer[k + buffer[k + 1] + 3] === 1)
                  ) {
                    len = k - i - 3 - size_t - 3;
                    buffer[k + 2] = len;
                    break;
                  } else {
                    len = size - (i + size_t + 4) - 5;
                  }
                }
                buffer[i + 3 + size_t + 1] = len;
                buffer[i + 3 + size_t + 2] = size_t;
              }

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
      // searching for a corresponding header
      for (let i = addr; i > 0; i--) {
        if (
          (buffer[i] === 0 || buffer[i] === 1) &&
          (buffer[i + buffer[i + 1] + 3] === 0 ||
            buffer[i + buffer[i + 1] + 3] === 1)
        ) {
          const headerStartIndex = i;
          // If we have enough space to relocate the block
          if (buffer[headerStartIndex + 1] > size + 2) {
            buffer[headerStartIndex + 1] = size;
            for (let j = i + 3; j < buffer.length; j++) {
              if (
                (buffer[j] === 0 || buffer[j] === 1) &&
                (buffer[j + buffer[j + 1] + 3] === 0 ||
                  buffer[j + buffer[j + 1] + 3] === 1)
              ) {
                const restStart = headerStartIndex + size + 3;
                // new part of memory
                if (j - restStart > 2) {
                  buffer[restStart] = 0;
                  buffer[restStart + 1] = j - restStart - 3;
                  buffer[restStart + 2] = size;
                  buffer[j + 2] = buffer[restStart + 1];
                  if (j - restStart > 3)
                    buffer = random(
                      buffer,
                      restStart + 3,
                      j - restStart - 3,
                      'empty'
                    );
                } else {
                }
                break;
              }
            }
          } else {
            console.log(
              'Not enough blocks to perform mem_realoc() in this part'
            );
            // go further to find out if we have any free block to locate the block
            const curBlocksHeaderIndex = headerStartIndex;

            for (let i = curBlocksHeaderIndex; i < buffer.length; i++) {
              if (
                buffer[i] === 0 &&
                (buffer[i + buffer[i + 1] + 3] === 0 ||
                  buffer[i + buffer[i + 1] + 3] === 1) &&
                buffer[i + 1] >= size
              ) {
                // moving our block to new destination
                const diff = buffer[i + 1] - size;

                buffer[i] = 1;
                buffer[i + 1] = size;

                buffer = random(buffer, i + 3, size);

                // either create a new header or just extend the part
                if (diff < 3) {
                  buffer = random(buffer, i + 3 + size, diff);
                  buffer[i + 1] += diff;
                } else {
                  buffer[i + 3 + size] = 0;
                  buffer[i + 3 + size + 1] = diff - 3;
                  buffer[i + 3 + size + 2] = size;
                  const endBlock = i + 3 + size + 2;

                  // updating header of the next block
                  let notLast = false;
                  for (let i = endBlock; i < buffer.length; i++) {
                    if (
                      (buffer[i] === 0 || buffer[i] === 1) &&
                      (buffer[i + buffer[i + 1] + 3] === 0 ||
                        buffer[i + buffer[i + 1] + 3] === 1) &&
                      buffer[i + 1] >= size
                    ) {
                      buffer[i + 2] = diff - 3;
                      notLast = true;
                      break;
                    }
                  }
                  // if the following block is the last one
                  if (!notLast) buffer[buffer.length - 1] = diff - 3;
                }
              }
            }
            buffer[curBlocksHeaderIndex] = 0;
            buffer = random(
              buffer,
              curBlocksHeaderIndex + 3,
              buffer[curBlocksHeaderIndex + 1],
              'empty'
            );
          }

          break;
        }
      }

      return this;
    },
    mem_free(addr) {
      for (let i = addr; i > 0; i--) {
        if (
          buffer[i] === 1 &&
          (buffer[i + buffer[i + 1] + 3] === 0 ||
            buffer[i + buffer[i + 1] + 3] === 1)
        ) {
          buffer[i] = 0;
          buffer = random(buffer, i + 3, buffer[i + 1], 'empty');
          console.log('Memory has been successfully freed up');
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
    .mem_realloc(10, 9)
    .mem_dump()
    .mem_free(16)
    .mem_dump()
    .mem_alloc(1)
    .mem_dump()
);
