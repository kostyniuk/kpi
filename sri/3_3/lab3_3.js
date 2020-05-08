// не на андроїді, згоден на будь-яку кількість балів, оскільки лабораторна обов'язкова, а балів вже вистачає за рахунок пройденого курсу

module.exports = (params, y) => {
    const inizialization = (params, y) => {
        const {a, b, c, d} = params
        const paramsValues = Object.values(params)
        const max = Math.ceil(y/2)
        const numOfParams = Object.keys(params).length
        let population = generatePopulation(numOfParams, max)
        fitness(population, paramsValues, y)
    }
    
    
    const generatePopulation = (quantity, max) => {
        let res = new Array(quantity).fill(0)
        res = res.map(subArr => {
            let temp = new Array(4).fill(0)
            temp = temp.map(el => getRandomArbitrary(max))
            return temp
        })
        return res  
    }
    
    const getRandomArbitrary = (max) => {
        return Math.ceil((Math.random() * max/4) + 1);
    }
    
    const sum = arr => arr.reduce((a, b) => a + b, 0)
    
    const calcDelta = (compound, params, y) => {
        let temp = compound.map((el, i) => el * params[i]) 
        const reduced = sum(temp)
        return Math.abs(reduced - y)
    }
    
    const isResultFounded = (deltas) => {
        let found = false;
        deltas.map((num, i) => {
            if (num === 0) {
                found = i
            }
        })
        return  found || -1;
    }
    
    const swap = (arr1, arr2, separator = 1) => {
        let array1 = [...arr1]
        let array2 = [...arr2]
        let buffer = []
        for(let i = 0; i < array1.length; i++) {
            if (i >= separator) {
                buffer.push([...array1.splice(0, i), ...array2.splice(i, array2.length - 1)])
                array1 = [...arr1]
    
                array2 = [...arr2]
            }
        }
        return buffer
    }
    
    const deepCopy = arr => JSON.parse(JSON.stringify(arr))
    
    const mutate = (population, y) => {
        let mutated = deepCopy(population)
        mutated = mutated.map((arr, i) => {
            const index = Math.floor(Math.random() * arr.length)
            arr[index] = getRandomArbitrary(y)
            return arr
        })
        return mutated
    }
    
    const sortByProp = (itemsArr, prop = 'probability') => {
        return itemsArr.sort(function(a, b){
            return b[0][prop] - a[0][prop];
          });
    }
    
    const selectNfromTable = (n, table) => {
    
    }
    
    const selectTheBest = (data, params, y)  => {
        let table = [...data]
        table.map(selection => {
            selection.unshift(calcDelta(selection, params, y))
            return selection
        })
        table.sort((a, b) => a[0] - b[0])
        table = table.map(arr => {
            delete arr[0]
            return arr.filter(el => el)
        })
        return table.splice(0, 4)
    }
    
    //[][1] - specific possibility
    const crossover = (arr ) => {
        let table = [...arr]
        table = sortByProp(table)
        table.pop()
        table = table.map(arr => {
            delete arr[0]
            return arr.filter(el => el)
        })
    
        let result = []
        result.push(swap(table[0], table[1]))
        result.push(swap(table[0], table[2]))
        result.push(swap(table[1], table[2]))
        return result
    }
    
    
    const output = (results, params, y) => {
        let s = '';
        const len = results.length;
        results.forEach((el, i) => {
            s+= `${el} * ${params[i]}`
            if (i !== len - 1) s+= ' + '
            if (i === len-1) s+= `= ${y}`
        });
        return s;
    }
    let  i = 0;
    const fitness = (compound, params, y) => {
        const deltas = compound.map(arr => calcDelta(arr, params, y))
        const indexOfResult = isResultFounded(deltas)
        if (indexOfResult !== -1) {
            console.log('Solution has been found')
            console.log(output(compound[indexOfResult], params, y))
            console.log(compound[indexOfResult])
            console.log({iterations: i})
            return 1;

        }
        const reverseDeltas = deltas.map(num => 1/num)
        const sumReversed = sum(reverseDeltas)
        const probabilityToParenting = reverseDeltas.map( el => parseInt(el/sumReversed * 100))
    
        const dataForCrossover = deepCopy(compound)
    
        const pop = dataForCrossover.map((arr,i) => {
            arr.unshift({probability: probabilityToParenting[i]})
            return arr
        })
    
        const children = crossover(dataForCrossover).flat()
    
        i++;
        
        const childrenUpd = selectTheBest(children, params, y)
        const childrenUpdDeltas = childrenUpd.map(arr => calcDelta(arr, params, y))
    
        if (sum(childrenUpdDeltas) < sum(deltas)) {
            return fitness(childrenUpd, params, y)
        }
        const mutated = mutate(compound, y)
        return fitness(mutated, params, y)
    }
    console.time('Time of execution')
    inizialization(params, y)
    console.timeEnd('Time of execution')


}

