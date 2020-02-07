import {Point, MovingPoint, Dot, MovingDot, RandomDot} from './figures.js' 


const [FORWARD, PAUSE, BACK, END] = ['forward', 'pause', 'back', 'end'];



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
    this.ctx.fillStyle = "rgba(216,69,11,.9)";
    this.color = "rgba(216,69,11,.9)";
    this.duration = 5000;
    this.fps = 60;
    this.t = 0;
    this.start = null;
    div.style.position = "relative";
    div.appendChild(this.canvas);    
    window.addEventListener('resize', (e) => this.handleResize(e));


    this.topLetf = [new MovingPoint(this.tl, this.tl), new MovingPoint(this.tl, this.tr), new MovingPoint(this.tl, this.bl)];
    this.bottomRight = [new MovingPoint(this.br,this.br), new MovingPoint(this.br, this.tr), new MovingPoint(this.br, this.bl)];
    this.loop = this.loop.bind(this);
    this.requestId = undefined;
    this.events();
  }

  events() {
    //this.canvas.addEventListener("mouseover", ()=> this.notify(FORWARD));
    this.canvas.addEventListener("mouseout", ()=> this.notify(PAUSE));
    this.canvas.addEventListener("mouseenter", ()=> this.notify(FORWARD));
  }
  
  notify (eventType) {
    console.log("Notification:", eventType)
    switch(eventType) {
      case FORWARD:
        this.phase = FORWARD;
        this.requestId = requestAnimationFrame(this.loop);
        console.log('FORWARD');
        break;
        case PAUSE: 
        this.phase = PAUSE;
        console.log('PAUSE');
        case END: 
        this.phase = END;
        console.log('END');
        window.cancelAnimationFrame(this.requestId);
        this.t = 0;
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
    let {clientHeight, clientWidth } = document.getElementById(this.id);
    this.setWidth = clientWidth;
    this.setHeight = clientHeight;
    this.info;
  }
  draw(dot) {
    this.ctx.beginPath();
    this.ctx.arc(dot.x, dot.y, dot.radius, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.fill();
  }

  loop(timestemp) {

    if (!this.start) this.start = timestemp;
    this.t = timestemp - this.start; 

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    [...this.topLetf, ...this.bottomRight].forEach(element => element.draw(this.ctx).go(this.t, this.duration ));

    drawPoligon.call( this, this.topLetf, this.color);
    drawPoligon.call( this, this.bottomRight, this.color);

    if (this.t <= this.duration) {
      this.requestId = requestAnimationFrame(this.loop);
    } else if (this.t > this.duration) {
      this.t = 0;
      this.start = null;
      window.cancelAnimationFrame(this.requestId);
      this.requestId = undefined;
      this.notify(END)
    }

  }
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
