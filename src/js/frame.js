import {CreateCorners as Figures} from './figures.js' 


const [START, FORWARD, PAUSE, BACK, END] = ['start', 'forward', 'pause', 'back', 'end'];


class Frame {
  constructor({div, duration, color}) {
    this.div = div;
    this.id = div.id;
    this.duration = duration || 500;
    this.fps = 60;
    this.t = 0;
    this.start = null;
    this.color = color || 'rgba(179,255,232,.9)';
    this.phase = observable(START);
    this.div.style.position = 'relative';
    this.loop = this.loop.bind(this);
    this.requestId = undefined;
    this.createCanvas();
    this.creator = new Figures(div);
    //this.figures = this.creator.get();
    this.figures = this.creator.getFromCenter();
    this.set = [...Array.from(this.figures)].flat();
    this.set.forEach(el => {this.phase.subscribe(el);Object.assign(el, {ctx:this.ctx,  duration:this.duration}) });
    this.events();
  }
  
  events() {
    this.div.addEventListener('mouseenter', () => {this.notify(FORWARD)});
    this.div.addEventListener('mouseleave', () => this.notify(BACK));
    window.addEventListener('resize', e => this.handleResize(e));
  }
  
  notify(eventType) {
    console.log('Notification:', eventType);
    this.phase(eventType);
    switch (eventType) {
      case FORWARD: this.requestId = requestAnimationFrame(this.loop); break;
      case BACK:    this.requestId = requestAnimationFrame(this.loop); break;
      case PAUSE:   window.cancelAnimationFrame(this.requestId);       break;
      case END:     window.cancelAnimationFrame(this.requestId);       break;
      default: return;
    }
  }
  
  loop(timestemp) {
    if (!this.start) this.start = timestemp;
    this.t = timestemp - this.start;
    
    this.draw();
    
    if (this.t <= this.duration) {
      this.requestId = requestAnimationFrame(this.loop);
    } else {
      this.start = null;
      this.phase() === FORWARD ? this.notify(PAUSE) : this.notify(END);
    }
  }
  
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.set.forEach(element => element.go(this.t));
    this.figures.forEach(figure => drawPoligon(this.ctx, figure, this.color));
  }
  
  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.setSize = this.div;
    this.canvas.style.position = 'absolute';
    this.ctx = this.canvas.getContext('2d');
    this.ctx.fillStyle = this.color;
    this.ctx.strokeStyle = this.color;
    this.ctx.save();
    this.div.appendChild(this.canvas);
  }

  handleResize() {
    if (this.canvas) {
      this.setSize = this.div;
      this.ctx.fillStyle = this.color;
      this.creator.updatePoints(this.div);
      // this.set.forEach(point => {
      //   point.position(this.div);
      //   point.go(this.duration);
      //   point.ctx = this.ctx;
      // });
      this.draw();
      this.info;
    }
  }

  get info() {
    const info = `
    id:${this.id} ${this.div.clientWidth} x ${this.div.clientHeight}
    canvas: ${this.canvas.width} x ${this.canvas.height}
    `;
    console.log(info);
    return info;
  }
  
  set setSize({clientWidth, clientHeight}) {
    this.canvas.width = clientWidth;
    this.canvas.height = clientHeight;
  }

}

function observable(value) {
  const subscribers = [];
  
  function notify(value, oldValue) {
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

function generate(n, fn, div) {
  const result = [];
  while (n--) {
    result.push(new fn(div));
  }
  return result;
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
    