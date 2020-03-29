let tasks = [];
const quant = 100;
let key = true;
let timeStart = 0;
let timeCurrent = timeStart;
let timeEnd = 10;

const weight = 10;

class Queue {
  constructor(priority) {
    this.priority = priority;
  }
  queue = [];

  addToQueue(request) {
    this.queue.push(request);
  }

  showQueue() {
    return this.queue;
  }
}

// let lowPriorityQueue = new Queue(1);
// let highPriorityQueue = new Queue(2);

const getRandomInt = range => Math.floor(Math.random() * Math.floor(range) + 1);

class Task {
  priority = getRandomInt(weight);
  timeOfExec = getRandomInt(20);
  timeStart;
  timeEnd;
}

const generateTask = () => new Task();

class Planner {
  queues = {
    highPriority: new Queue(1),
    lowPriority: new Queue(2)
  }

  logQueues() {
    return [this.queues.highPriority.showQueue(), this.queues.lowPriority.showQueue()]
  }
}

const planner = new Planner();

const plannerArranging = (task, highPriorityQueue, lowPriorityQueue) => {
  if (task.priority > weight / 2) {
    planner.queues.highPriority.addToQueue(task);
  } else {
    planner.queues.lowPriority.addToQueue(task);
  }
  return;
};

const interval = 5;
let busy = false;

while (key) {
  console.log({ timeCurrent });

  if (timeCurrent % interval === 0) {
    plannerArranging(generateTask(), planner.queues.highPriority, planner.queues.lowPriority);
    console.log(planner.logQueues())
  }

  if (timeEnd === timeCurrent) {
    key = false;
  } else {
    timeCurrent++;
  }
}
