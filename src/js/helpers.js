import {Point, MovingPoint, Dot, MovingDot, Factory, RandomDot} from './figures.js' 


const [START, FORWARD, PAUSE, BACK, END, RESET] = ['start', 'forward', 'pause', 'back', 'end', 'reset'];

const factory = new Factory();

function generate(n, fn, div) {
  const result = [];
  while (n--) {
    result.push(new fn(div));
  }
  return result;
}
export const dim = ({ clientHeight, clientWidth }) => ({
  width: clientWidth,
  height: clientHeight
});

const makecanvas = div => {
  const size = dim(div);
  const ctx = canvas(div);
  ctx.strokeStyle = "rgba(200,69,200,.6)";
  const color = "rgba(216,69,11,.6)";
  const points = generate(20, dotInDiv, size, 5, 5, color);
  const cursor = new Cursor(div, points.slice(0, 10));
  ["click"].forEach(evt =>
    box2.addEventListener(evt, cursor.dispatchEvent, false)
  );
  findClosest(points);
  animation(points, ctx, size)();
};

class EventObserver {
  constructor(subscriber, eventType) {
    this.subscribers =[subscriber];
    subscriber.canvas.addEventListener(eventType, function(event) {
      subscriber.notify(FORWARD);
    });
  }
}

class Frame {
  constructor(div) {

    const { id, clientHeight, clientWidth, clientLeft, clientTop } = div;

    this.id = id;    
    this.color = "rgba(179,255,232,.9)";
    this.duration = 500;
    this.fps = 60;
    this.t = 0;
    this.start = null;
    this.phase = observable(START);
    this.div = div;
    
    this.div.style.position = "relative";    
    this.loop = this.loop.bind(this);
    this.requestId = undefined;
    this.createCanvas();
    this.createElements();
    this.events();
  }
  
  events() {
    window.addEventListener('resize', (e) => this.handleResize(e));
    this.div.addEventListener("mouseleave", ()=> {
      console.log(`Mouseout ${this.phase()}`, this.div)
      this.notify(BACK);
    });
    this.div.addEventListener("mouseenter", ()=> {
      console.log(`Mouseenter ${this.phase()}`)
      if(this.phase() === START) {
        if(!this.div.firstElementChild) {
          this.div.appendChild(this.canvas);
        }  
        this.notify(FORWARD)
      }
      if(this.phase() === RESET) {
        if(!this.div.firstElementChild) {
          this.div.appendChild(this.canvas);
        }  
        this.notify(FORWARD)
      }
      if(this.phase() === BACK) {
        if(!this.div.firstElementChild) {
          this.div.appendChild(this.canvas);
        }  
        this.notify(FORWARD)
      }
    });
  }
  
  notify (eventType) {
    console.log("Notification:", eventType)
    switch(eventType) {
      case FORWARD:
        this.t = 0;
        this.phase(FORWARD);
        this.requestId = requestAnimationFrame(this.loop);
        break;
      case BACK:
        this.t = 0;
        this.phase(BACK);
        this.requestId = requestAnimationFrame(this.loop);
      break;
      case PAUSE:
        this.t = 0;
        this.phase(PAUSE);
        window.cancelAnimationFrame(this.requestId);
        break;
      case END: 
        this.t = 0;
        this.phase(END);
        window.cancelAnimationFrame(this.requestId);
        this.requestId = undefined;
        //this.canvas.remove();
        this.phase(RESET);
      break;
      default:
        return;
    }
  }

  get info() {
    console.log(`frame ${this.canvas.width} x ${this.canvas.height} id:${this.id} ` );
  }
  get dimDiv () {
    return {
      width: this.canvas.width,
      height: this.canvas.height
    };
  }
  set setWidth(value) { 
    this.canvas.width = value;
  }
  set setHeight(value) { 
    this.canvas.height = value;
  }
  handleResize(e) {
    if(this.canvas) {
      let {clientHeight, clientWidth } = document.getElementById(this.id);
      this.setWidth = clientWidth;
      this.setHeight = clientHeight;
      this.info;
    }
  }

  loop(timestemp) {

    if (!this.start) this.start = timestemp;
    this.t = timestemp - this.start; 

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    [...this.topLeft, ...this.bottomRight].forEach(element => element.draw().go(this.t));

    drawPoligon.call( this, this.topLeft, this.color);
    drawPoligon.call( this, this.bottomRight, this.color);

    if (this.t <= this.duration) {
      this.requestId = requestAnimationFrame(this.loop);
    } else if (this.t > this.duration) {
      console.log(this.phase());
      this.start = null;
      this.phase() === FORWARD ? this.notify(PAUSE) : this.notify(END) 
    }
  }

  createCanvas() {
    const { clientHeight, clientWidth, clientLeft, clientTop } = this.div;
    this.canvas= document.createElement("canvas");
    this.canvas.width = clientWidth;
    this.canvas.height = clientHeight;
    this.tl = {x:0, y:0};
    this.tr = {x: this.canvas.width, y:0};
    this.bl = {x: 0, y:this.canvas.height};
    this.br = {x: this.canvas.width, y: this.canvas.height};
    this.canvas.style.top = `-${clientTop}px`;
    this.canvas.style.left = `-${clientLeft}px`;
    this.canvas.style.position = "absolute";
    this.ctx = this.canvas.getContext("2d");
    this.ctx.fillStyle = this.color;
    this.ctx.strokeStyle = this.color;
    this.div.appendChild(this.canvas); 
  }

  createElements() {
    this.elements = true;
    let context = {ctx:this.ctx, duration:this.duration};
    const factory = new Factory(context);

    let tl = factory.create('movingPoint' , this.tl, this.tl);
    let tr = factory.create('movingPoint' , this.tl, this.tr);
    let bl = factory.create('movingPoint' , this.tl, this.bl);
    
    let br = factory.create('movingPoint' , this.br, this.br);
    let tr2 = factory.create('movingPoint' , this.br, this.tr);
    let bl2 = factory.create('movingPoint' , this.br, this.bl);


    this.topLeft = [tl, tr, bl];
    this.bottomRight = [br, tr2, bl2];
    [...this.topLeft, ...this.bottomRight].forEach(el => this.phase.subscribe(el));
  }
}

function observable(value) {
  const subscribers = [];

  function notify(value, oldValue) {
    console.log(`Phase : ${value} after ${oldValue}`)
    for (let subscriber of subscribers) {
      subscriber.notify(value);
    }
  }
  
  function assesor(newValue) {
    if(newValue && newValue !== value) {
      let temp = value;
      value = newValue;
      notify(value, temp);
    }
    return value;
  }

  assesor.subscribe = function(subscriber) {
    subscribers.push(subscriber);
  }

  return assesor;

}

function update(point) {
  point.x =
    point.destination.clientX > point.x
      ? point.x + point.speed * point.acceleration
      : point.x - point.speed * point.acceleration;
  point.y =
    point.destination.clientY > point.y
      ? point.y + point.speed * point.acceleration
      : point.y - point.speed * point.acceleration;
  return point;
}
function randomPoint(dimentions) {
  return {
    x: Math.floor(randomOf(dimentions.width)),
    y: Math.floor(randomOf(dimentions.height))
  };
}

function drawCircle(center, radius = 3, color = "rgba(100,100,100,.8)") {
  defaultColor = ctx.fillStyle;
  ctx.fillStyle = color || ctx.fillStyle;
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = defaultColor;
}

function drawLine(ctx, a, b) {
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
}

function findClosest(points) {
  const distances = points.map(point => {
    let distanceValues = [];
    points.forEach(pointB => distanceValues.push(distance(point, pointB)));
    return distanceValues;
  });

  const closest = distances.map(distanceArr =>
    distanceArr
      .map((distance, index) => {
        return {
          distance,
          index
        };
      })
      .sort((a, b) => a.distance - b.distance)
  );

  return points.reduce((aggregator, point, index) => {
    const updatedPoint = Object.assign(point, {
      distances: distances[index],
      closest: closest[index]
    });
    aggregator.push(updatedPoint);
    return aggregator;
  }, []);
}

function drawLineOfClosest(points) {
  points.forEach((point, index) => {
    ctx.beginPath();
    point.closest.forEach(closePoint => {
      let { x, y } = points[closePoint.index];
      !index ? ctx.moveTo(point.x, point.y) : ctx.lineTo(x, y);
    });
    ctx.stroke();
  });
}

function drawPoligon(points, color) {
  let defaultColor = this.ctx.fillStyle;
  this.ctx.fillStyle = color || this.ctx.fillStyle;
  this.ctx.beginPath();
  points.forEach((point, index) => {
    index === 0
      ? this.ctx.moveTo(point.x, point.y)
      : this.ctx.lineTo(point.x, point.y);
  });
  this.ctx.closePath();
  this.ctx.fill();
  this.ctx.fillStyle = defaultColor;
}

export {
  makecanvas,
  update,
  randomPoint,
  generate,
  drawLineOfClosest,
  findClosest,
  drawLine,
  drawCircle,
  drawPoligon,
  Frame
};
