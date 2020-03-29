let tasks = [];
const quant = 100;
let timeStart = 0;
let timeCurrent = timeStart;
let timeEnd = 10;

const weight = 10;
const execRange = 20;

class Queue {
  constructor(priority) {
    this.priority = priority;
  }
  queue = [];
  done = [];

  addToQueue(request) {
    this.queue.push(request);
  }

  showQueue() {
    return this.queue;
  }

  showDone() {
    return this.done;
  }

  deleteTask(id) {
    this.done.push(this.queue.filter(task => task.id === id));
    this.queue = this.queue.filter(task => task.id !== id);
  }

  updateWaitTime() {
    this.queue = incrementFieldOfEveryEl(this.queue);
  }
}

// let lowPriorityQueue = new Queue(1);
// let highPriorityQueue = new Queue(2);

let Id = 0;
const getRandomInt = range => Math.floor(Math.random() * Math.floor(range) + 1);
const generateId = curId => {
  Id++;
  return Id;
};
class Task {
  id = generateId(Id);
  priority = getRandomInt(weight);
  timeOfExec = getRandomInt(execRange);
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

// const arr2 = [{priority: 3}, {priority: 7}, {priority: 1}]
// console.log(sjf(arr2))
// process.exit(0)

// const executingOfTask = (task, startTime, )

const interval = 5;
let busy = false;
let currentTask;
let executed = 0;

let uselessTime = 0;
const mqs = (interval, quantity) => {
  let key = true;
  const planner = new Planner();

  while (key) {
    console.log({ timeCurrent, executed, uselessTime });
    console.log(planner);
    console;

    if (executed === quantity) {
      key = false;
      executed = 0;
      console.log({ busy });
      //console.log(planner.queues.highPriority.showDone(),
      //planner.queues.lowPriority.showDone())
      console.log('-------------NOT DONE YET-------------');
      console.log(
        planner.queues.highPriority.showQueue(),
        planner.queues.lowPriority.showQueue()
      );

      return {
        highPriority: planner.queues.highPriority.showDone(),
        lowPriority: planner.queues.lowPriority.showDone()
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
      //console.log(planner.logQueues());
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
      currentTask.timeStart = timeCurrent;
      busy = true;
      //console.log('------AFTER--------------');
      //console.log(planner.logQueues());
    }

    console.log({ currentTask });

    if (currentTask) {
      if (currentTask.timeLeft === 0) {
        //console.log({ timeCurrent });
        busy = false;
        executed++;
        currentTask = null;
      } else {
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

const quantity = 5;

//const { highPriority, lowPriority } = mqs(interval, quantity);

const avgTimeOfWait = new Map();

const getAvgWaitingTime = (high, low) => {
  let n = 0;
  high.map(task => {
    n += task[0].waitingTime;
  });
  low.map(task => {
    n += task[0].waitingTime;
  });
  return n / quantity;
};

const testingAvgTime = (minInterval, maxInterval) => {
  for (let i = minInterval; i < maxInterval; i++) {
    //console.log({def: mqs(interval, quantity)})
    console.log({ i, interval });
    const { highPriority, lowPriority } = mqs(interval, quantity);
    const avgWaitTime = getAvgWaitingTime(highPriority, lowPriority);
    avgTimeOfWait.set(`${i}`, avgWaitTime);
    console.log(avgTimeOfWait);
  }

  return avgTimeOfWait;
};

console.log(testingAvgTime(10, 50));
console.log(getAvgWaitingTime(highPriority, lowPriority));
//console.log({ highPriority, lowPriority });
console.log(executed);
