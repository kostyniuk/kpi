/*
-----Multilevel queue scheduling - MQS------
-
- 10 пріоритетів виконання (1, 2, ..., 9, 10) (weight)
- Задачі ділю по чергам  по пріоритету (<= 5, > 5)
- 1000 задач (quantity)
- Час виконання задачі - random(1, 20) (minExecTime, maxExecTime)
- Для інтерактивних задач використовую  cтратегію SJF 
- для пакетних - FIFO
- Для побудови графіка залежності середнього часу очікування 
- від  пріоритету при фіксованій інтенсивності вхідного потоку 
- заявок використовую інтенсивність 1, так як вона найнаочніша
- (Можна змінити в testingAvgTime)
- 
*/

const plotly = require('plotly')('alexandrkostyniuk', 'KmNYDnbtNicNFN9Zz5h3');

let timeStart = 0;
let timeCurrent = timeStart;
let Id = 0;
const weight = 10;
const minExecTime = 1;
const maxExecTime = 20;
const quantity = 1000;

class Queue {
  constructor(priority) {
    this.priority = priority;
  }
  queue = [];
  done = [];

  addToQueue(request) {
    this.queue.push(request);
  }

  addToBeginning(task) {
    this.queue.unshift(task);
  }

  showQueue() {
    return this.queue;
  }

  showDone() {
    return this.done;
  }

  updateDone(task) {
    this.done.push(task);
  }

  deleteTask(id) {
    this.queue = this.queue.filter(task => task.id !== id);
  }

  updateWaitTime() {
    this.queue = incrementFieldOfEveryEl(this.queue);
  }
}

const getRandomIntRange = (min, max) =>
  Math.floor(Math.random() * (max - min) + min);

const getRandomInt = range => Math.floor(Math.random() * Math.floor(range) + 1);

const generateId = curId => {
  Id++;
  return Id;
};

class Task {
  id = generateId(Id);
  priority = getRandomInt(weight);
  timeOfExec = getRandomIntRange(minExecTime, maxExecTime);
  timeStart;
  timeLeft = this.timeOfExec;
  waitingTime = 0;

  getWaitingTime() {
    return this.waitingTime;
  }
}

const generateTask = () => new Task();

class Planner {
  queues = {
    highPriority: new Queue(1),
    lowPriority: new Queue(2)
  };

  logQueues() {
    return [
      this.queues.highPriority.showQueue(),
      this.queues.lowPriority.showQueue()
    ];
  }

  sendTask(task) {
    this.queues.highPriority;
  }
}

const plannerArranging = (
  task,
  highPriorityQueue,
  lowPriorityQueue,
  planner
) => {
  if (task.priority > weight / 2) {
    planner.queues.highPriority.addToQueue(task);
  } else {
    planner.queues.lowPriority.addToQueue(task);
  }
  return;
};

const choosingTask = (highQueue, lowQueue) => {
  if (highQueue.length) {
    return highQueue[0];
  }
  if (lowQueue.length) {
    return lowQueue[0];
  }
  return null;
};

const isHighPrQueueEmpty = planner => {
  const highQueue = planner.queues.highPriority.showQueue();
  return highQueue.length;
};

const suspendLowIfHighExists = () => {};

const incrementFieldOfEveryEl = arr => {
  return arr.map(obj => {
    obj.waitingTime++;
    return obj;
  });
};

const byPriority = (task1, task2) => {
  if (task1.priority < task2.priority) return 1;
  return -1;
};

const sjf = arrOfTasks => {
  return arrOfTasks.sort(byPriority);
};

const fifo = arrOfTasks => {
  return arrOfTasks;
};

const interval = 5;
let busy = false;
let currentTask;
let executed = 0;

const mqs = (interval, quantity) => {
  let uselessTime = 0;
  let key = true;
  const planner = new Planner();
  let s = '';
  while (key) {
    if (executed === quantity) {
      key = false;
      executed = 0;
      timeCurrent = 0;

      return {
        highPriority: planner.queues.highPriority.showDone(),
        lowPriority: planner.queues.lowPriority.showDone(),
        uselessTime,
        s
      };
    }
    if (timeCurrent % interval === 0 && timeCurrent < interval * quantity) {
      const task = generateTask();
      plannerArranging(
        task,
        planner.queues.highPriority,
        planner.queues.lowPriority,
        planner
      );
      if (task.priority > weight / 2) {
        planner.queues.highPriority.queue = sjf(
          planner.queues.highPriority.queue
        );
      } else {
        planner.queues.lowPriority.queue = fifo(
          planner.queues.lowPriority.queue
        );
      }
    }

    if (
      !busy &&
      (planner.logQueues()[0].length || planner.logQueues()[1].length)
    ) {
      currentTask = choosingTask(
        planner.logQueues()[0],
        planner.logQueues()[1]
      );
      const priority = currentTask.priority;
      if (priority > weight / 2) {
        planner.queues.highPriority.deleteTask(currentTask.id);
      } else {
        planner.queues.lowPriority.deleteTask(currentTask.id);
      }
      currentTask.timeStart = currentTask.timeStart || timeCurrent;
      busy = true;
      s += ` ${currentTask.id} ->`;
    }

    if (currentTask) {
      if (currentTask.timeLeft === 0) {
        if (currentTask.priority > weight / 2) {
          planner.queues.highPriority.updateDone(currentTask);
        } else {
          planner.queues.lowPriority.updateDone(currentTask);
        }
        busy = false;
        executed++;
        currentTask = null;
      } else {
        if (currentTask.priority < weight / 2) {
          if (isHighPrQueueEmpty(planner)) {
            planner.queues.lowPriority.addToBeginning(currentTask);
            currentTask = planner.logQueues()[0][0];
            planner.queues.highPriority.deleteTask(currentTask.id);
            currentTask.timeStart = currentTask.timeStart || timeCurrent;

            s += ` ${currentTask.id} ->`;
          }
        }
        currentTask.timeLeft--;
      }
    } else {
      uselessTime++;
    }

    timeCurrent++;
    planner.queues.highPriority.updateWaitTime();
    planner.queues.lowPriority.updateWaitTime();
  }
};

const avgTimeOfWait = new Map();
const uselessTimeMap = new Map();
const avgWaitTimeByMap = new Map();

const getAvgWaitingTime = (high, low) => {
  let n = 0;
  high.map(task => {
    n += task.waitingTime;
  });
  low.map(task => {
    n += task.waitingTime;
  });
  return n / quantity;
};

const getAvgTimeByPriority = (tasks, maxPriority) => {
  let result = new Map();
  const priorities = [];
  for (let i = 1; i <= maxPriority; i++) {
    priorities.push(i);
  }

  for (let i = 1; i <= maxPriority; i++) {
    result.set(`${i}`, []);
  }

  tasks.map(task => {
    priorities.map(priority => {
      if (priority === task.priority) {
        let arr = result.get(`${priority}`);
        arr.push(task.waitingTime);
        result.set(`${priority}`, arr);
      }
    });
  });

  return Array.from(result.entries()).map(entry => {
    const priority = entry[0];
    let sum = entry[1].reduce((previous, current) => (current += previous));
    const avgTime = sum / entry[1].length;

    return [priority, avgTime];
  });
};

let timeByPriority = [];
const testingAvgTime = (minInterval, maxInterval) => {
  for (let i = minInterval; i < maxInterval + 1; i++) {
    const { highPriority, lowPriority, uselessTime } = mqs(i, quantity);
    const avgWaitTime = getAvgWaitingTime(highPriority, lowPriority);
    avgTimeOfWait.set(`${i}`, avgWaitTime);
    uselessTimeMap.set(`${i}`, uselessTime);
    if (i === 1)
      timeByPriority = getAvgTimeByPriority(
        [...highPriority, ...lowPriority],
        weight
      );
  }

  return [avgTimeOfWait, uselessTimeMap, timeByPriority];
};

console.log(testingAvgTime(1, 100));

const graph1x = Array.from(avgTimeOfWait.keys());
const graph1y = Array.from(avgTimeOfWait.values());
const graph2x = Array.from(uselessTimeMap.keys());
const graph2y = Array.from(uselessTimeMap.values());
const graph3x = timeByPriority.map(arr => arr[0]);
const graph3y = timeByPriority.map(arr => arr[1]);

const graph12 = () => {
  var trace1 = {
    x: graph1x,
    y: graph1y,
    name:
      'Залежність середнього часу очікування від інтенсивності вхідного потоку заявок',
    type: 'scatter'
  };
  var trace2 = {
    x: graph2x,
    y: graph2y,
    name:
      'Залежність проценту простою ресурсу від інтенсивності вхідного потоку заявок',
    type: 'scatter'
  };
  var data = [trace1, trace2];
  var layout = {
    title: 'Plot Title',
    xaxis: {
      title: 'інтенсивность вхідного потоку заявок',
      titlefont: {
        family: 'Courier New, monospace',
        size: 18,
        color: '#7f7f7f'
      }
    },
    yaxis: {
      title: 'Середній час очікування/ процент простою',
      titlefont: {
        family: 'Courier New, monospace',
        size: 18,
        color: '#7f7f7f'
      }
    }
  };
  var graphOptions = {
    layout: layout,
    filename: 'styling-names',
    fileopt: 'overwrite'
  };
  plotly.plot(data, graphOptions, function(err, msg) {
    console.log(msg);
  });
};

const graph3 = () => {
  var data = [
    {
      x: graph3x,
      y: graph3y,
      type: "bar"
    }
  ];

  var layout = {
    title: 'Графік залежності середнього часу очікування від  пріоритету при фіксованій інтенсивності вхідного потоку заявок = 1',
    xaxis: {
      title: 'Пріоритети',
      titlefont: {
        family: 'Courier New, monospace',
        size: 18,
        color: '#7f7f7f'
      }
    },
    yaxis: {
      title: 'Середній час очікування',
      titlefont: {
        family: 'Courier New, monospace',
        size: 18,
        color: '#7f7f7f'
      }
    }
  };

  var graphOptions = {layout: layout, filename: "basic-bar", fileopt: "overwrite"};
  plotly.plot(data, graphOptions, function (err, msg) {
      console.log(msg);
  });
}

graph12()
graph3()
