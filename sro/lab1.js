// Заголовок - размер текущего блока, размер предыдущего блока и признак занятости блока.

const random = (arr, indexFrom, quantity) => {
  for(let i = indexFrom; i < indexFrom + quantity; i++) {
    arr[i] = Math.floor(Math.random() * 100)
  }
  return arr
}

// console.log(random([1,2,3,4,5,6,7,8,9], 3,2))

const allocator = (size = 32) => {
  let buffer;
  const alloc = {
    create() {
      buffer = new Array(size)
      buffer[0] = 1;//state
      buffer[1] = 0;//current
      buffer[2] = 0;//previous

      buffer[3] = 0;
      buffer[4] = size - 6;
      buffer[5] = 3;

      buffer[buffer.length - 1] = size - 6
      buffer[buffer.length - 2] = 0
      buffer[buffer.length - 3] = 1

      //console.log(buffer)
      return this;
    }, 
    mem_alloc(size_t) {
      let flag = 0
      for(let i = 3; i < buffer.length; i++) {
        if (buffer[i] === 0 && !flag) { // not ender
          //console.log({size_t, current: buffer[i], next: buffer[i+1], nextBlock: buffer[i + buffer[i+1]], i, index: i + buffer[i+1], nextBlock2: buffer[26]})
          if (buffer[i + buffer[i+1]] === 0 || buffer[i + buffer[i+1]] === 1) {
            if (buffer[i+1] > size_t) {
              buffer[i] = 1;
              buffer[i+1] = size_t;
              buffer = random(buffer, i + 3, size_t)

              buffer[i+3+size_t] = 0;
              buffer[i + 3 + size_t + 1] = size - 6 - (i+3+size_t) + 3;
              buffer[i + 3 + size_t + 2] = size_t;
              // Коли неможливо в кінці створити новий блок памяті
              flag = 1
            }
          }
            
        }
      }

      if (flag) {
        console.log('New memory block allocated')
      } else {
      console.log('New memory block isn\'t allocated')
        
      }

      return this;
    },
    mem_realloc(addr, size) {

    },
    mem_free(addr) {

    },
    mem_dump() {
      console.log({buffer})
      return this
    }
  }

  return alloc
}

 console.log(allocator().create().mem_dump().mem_alloc(5).mem_dump().mem_alloc(7).mem_dump().mem_alloc(2).mem_dump())

