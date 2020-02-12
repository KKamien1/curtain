import {Factory} from './figures.js' 


const [START, FORWARD, PAUSE, BACK, END] = ['start', 'forward', 'pause', 'back', 'end'];

let sample = {
  notify() {
    console.log("sth");
  }
}

sample.hasOwnProperty("notify") //?  

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


class Frame {
  constructor(div) {

    const { id, clientHeight, clientWidth, clientLeft, clientTop } = div;

    this.id = id;    
    this.div = div;    
    this.duration = 500;
    this.fps = 60;
    this.t = 0;
    this.start = null;
    this.color = "rgba(179,255,232,.9)";
    this.phase = observable(START);
    this.div.style.position = "relative";    
    this.loop = this.loop.bind(this);
    this.requestId = undefined;
    this.createCanvas();
    this.setPoints();
    this.createElements();
    this.events();
  }
  
  events() {
    window.addEventListener('resize', (e) => this.handleResize(e));
    this.div.addEventListener("mouseleave", ()=> this.notify(BACK));
    this.div.addEventListener("mouseenter", ()=> this.notify(FORWARD));
  }
  
  notify (eventType) {
    console.log("Notification:", eventType)
    this.phase(eventType);
    switch(eventType) {

      case FORWARD: this.requestId = requestAnimationFrame(this.loop); break;
      case BACK:    this.requestId = requestAnimationFrame(this.loop); break;
      case PAUSE:   window.cancelAnimationFrame(this.requestId);       break;
      case END:     window.cancelAnimationFrame(this.requestId);       break;
      
      default: return;

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
    this.set.forEach(element => element.draw().go(this.t));
    this.figures.forEach(figure => drawPoligon( this.ctx, figure, this.color)); 


    if (this.t <= this.duration) {
      this.requestId = requestAnimationFrame(this.loop);
    } else {
      this.start = null;
      this.phase() === FORWARD ? this.notify(PAUSE) : this.notify(END) 
    }
  }

  setPoints() {
    const { clientWidth, clientHeight } = this.div;
    this.setPoint("A", { x: 0, y: 0 });
    this.setPoint("B", { x: clientWidth, y: 0 });
    this.setPoint("C", { x: 0, y: clientHeight });
    this.setPoint("D", { x: clientWidth, y: clientHeight });
    this.setPoint("M", { x: clientWidth / 2, y: clientHeight / 2 });
    this.setPoint("L", { x: 0, y: clientHeight / 2 });
    this.setPoint("R", { x: clientWidth, y: clientHeight / 2 });
  }
  
  createCanvas() {
    const { clientHeight, clientWidth } = this.div;
    this.canvas= document.createElement("canvas");
    this.canvas.width = clientWidth;
    this.canvas.height = clientHeight;
    this.canvas.style.position = "absolute";
    this.ctx = this.canvas.getContext("2d");
    this.ctx.fillStyle = this.color;
    this.ctx.strokeStyle = this.color;
    this.div.appendChild(this.canvas); 
  }
  
  createElements() {

    const context = {ctx:this.ctx, duration:this.duration};
    const create = new Factory(context);

    this.topLeft = [

      create.point('staticPoint' , this.point("A")),
      create.point('movingPoint' , this.point("A"), this.point("B")),
      create.point('movingPoint' , this.point("A"), this.point("C"))
    
    ];
    
    this.bottomRight = [

      create.point('staticPoint' , this.point("D")),
      create.point('movingPoint' , this.point("D"), this.point("B")),
      create.point('movingPoint' , this.point("D"), this.point("C"))
      
    ];

    this.topRight = [
      
      create.point('staticPoint' , this.point("B")),
      create.point('movingPoint' , this.point("B"), this.point("A")),
      create.point('movingPoint' , this.point("B"), this.point("D"))
      
    ];

    this.bottomLeft = [
      
      create.point('staticPoint' , this.point("C")),
      create.point('movingPoint' , this.point("C"), this.point("A")),
      create.point('movingPoint' , this.point("C"), this.point("D"))
      
    ];

    this.fikmik = [
      
      create.point('staticPoint' , this.point("M")),
      create.point('movingPoint' , this.point("M"), this.point("C")),
      create.point('movingPoint' , this.point("M"), this.point("D"))
      
    ];

    this.figures = new Set([this.topLeft, this.topRight, this.bottomLeft, this.bottomRight,  this.fikmik]);
    this.set = [...this.topLeft, ...this.bottomRight, ...this.topRight, ...this.bottomLeft, ...this.fikmik];
    this.set.forEach(el => this.phase.subscribe(el));

  }

  setPoint(name, point) {

    this.hasOwnProperty("points") ? this.points.set(name,point) :  this.points = new Map().set(name,point);
  
  }

  point(name) {
    
    return this.points.get(name);
  
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

function drawPoligon(ctx,points, color) {
  let defaultColor = ctx.fillStyle;
  ctx.fillStyle = color || ctx.fillStyle;
  ctx.beginPath();
  points.forEach((point, index) => {
    index === 0
      ? ctx.moveTo(point.x, point.y)
      : ctx.lineTo(point.x, point.y);
  });
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = defaultColor;
}

export {
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
