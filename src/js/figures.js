import {Easing} from './easing.js';



const sampleFunct = (start, end, t, d, s) => Easing.get("easeInOutCirc", start, end, t, d, s)

const DIRECTIONS = new Set(["FORWARD", "BACK"]); 

const moving = {
  go(t) {
    switch(this.direction) {
      case 'forward' : {
        this.x = sampleFunct(this.from.x, this.to.x, t, this.duration, 0 );
        this.y = sampleFunct(this.from.y, this.to.y, t, this.duration, 0 );
      };
      break;
      case 'back' : {
        this.x = sampleFunct(this.to.x, this.from.x, t, this.duration, 0 );
        this.y = sampleFunct(this.to.y, this.from.y, t, this.duration, 0 );
      };
      break;
      default:
        return;
    }
  },
}

const notify = {
  notify(value) {
    this.direction = value;
    if(value === 'reset') {
        this.x = this.from.x;
        this.y = this.from.y;
    }
  }
}

class Point {
  constructor(point) {
    this.x = point.x;
    this.y = point.y;
    this.radius = 0;
  }
  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.fill();
    return this;
  }

  randomUpdate(max = 5, min = 0, t) {
    this.x += plusMinus(randomOf(max, min));
    this.y += plusMinus(randomOf(max, min));
    return this
  }
}


class StaticPoint extends Point{
  constructor(from) {
    super(from);
    this.from = from;
    this.to = from;
  }
  go() {
    this.x = this.from.x;
    this.y = this.from.y;
  }
}
class MovingPoint extends Point{
  constructor(from, to) {
    super(from);
    this.from = from;
    this.to = to;
    this.direction = null;
  }
}

Object.assign(MovingPoint.prototype, moving);
Object.assign(MovingPoint.prototype, notify);
Object.assign(StaticPoint.prototype, notify);



class Dot extends Point {
  constructor(radius, ...props) {
    super(...props);
    this.radius = radius;
  }
}

class MovingDot extends MovingPoint {
  constructor(radius, ...props) {
    super(...props);
    this.radius = radius;
  }
}

class RandomDot extends Dot {
  constructor({width, height}) {
    super();
    this.radius = randomOf(1,8);
    this.x = randomOf(width);
    this.y = randomOf(height);
  }
}



function randomOf(value, start = 0) {
  return Math.floor(Math.random() * (value - start + 1)) + start;
}

function randomUpdate(point, max = 5, min = 0) {
  point.x += plusMinus(randomOf(max, min));
  point.y += plusMinus(randomOf(max, min));
  return point;
}

function plusMinus(num) {
  return Math.round(Math.random()) ? num : -num;
}

function Factory(context) {
  // this.ctx = ctx;
  // this.time = time;
  // this.duration = duration;
  this.point = function(type, ...args) {
    switch(type) {
      case ('movingPoint') : return Object.assign(new MovingPoint(...args), context);   break;
      case ('staticPoint') : return Object.assign(new StaticPoint(...args), context);   break;
      case ('movingDot')   : return Object.assign(new MovingDot(...args), context);     break;
      default :
        return Object.assign(new StaticPoint(...args), context);
    }
  }
}

export { Point, MovingPoint, Dot, MovingDot, Factory, RandomDot };

