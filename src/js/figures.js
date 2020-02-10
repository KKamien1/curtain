import {Easing} from './easing.js';



const sampleFunct = (start, end, t, d, s) => Easing.get("easeInOutCirc", start, end, t, d, s)

const DIRECTIONS = new Set(["FORWARD", "BACK"]); 

const moving = {
  go(t) {
    this.x = sampleFunct(this.from.x, this.to.x, t, this.duration, 0 );
    this.y = sampleFunct(this.from.y, this.to.y, t, this.duration, 0 );
  },
  goBack(t) {
    this.x = sampleFunct(this.to.x, this.from.x, t, this.duration, 0 );
    this.y = sampleFunct(this.to.y, this.from.y, t, this.duration, 0 );
  }
}


class Point {
  constructor(point) {
    this.x = point.x;
    this.y = point.y;
    this.radius = 1;
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


class MovingPoint extends Point{
  constructor(from, to) {
    super(from);
    this.from = from;
    this.to = to;
  }
}

Object.assign(MovingPoint.prototype, moving)



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
  this.create = function(type, ...args) {
    let figure;
    switch(type) {
      case ('movingPoint') : figure = Object.assign(new MovingPoint(...args), context); break;
      case ('movingDot') : figure = new MovingDot(...args); break;
      default :
        return "Factory can't produce";
    }
    return figure;
  }
}

export { Point, MovingPoint, Dot, MovingDot, Factory, RandomDot };

