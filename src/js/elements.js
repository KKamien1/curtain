
import {Easing} from './easing.js';
import {randomOf} from './utils.js';
const sampleFunct = (start, end, t, d, s) => Easing.get("easeInOutCirc", start, end, t, d, s)

const moving = {
  go(t) {
    switch(this.direction) {
      case 'forward' : {
        this.x = sampleFunct(this.from.x, this.to.x, t, this.duration, 0 );
        this.y = sampleFunct(this.from.y, this.to.y, t, this.duration, 0 );
      }
      break;
      case 'back' : {
        this.x = sampleFunct(this.to.x, this.from.x, t, this.duration, 0 );
        this.y = sampleFunct(this.to.y, this.from.y, t, this.duration, 0 );
      }
      break;
      default:
        return this;
    }
    return this;
  },
}

const notify = {
  notify(value) {
    this.direction = value;
  }
}

class Point {
  constructor(point, radius) {
    this.x = point.x;
    this.y = point.y;
    this.radius = radius || 0;
    this.refresh = point.refresh;
  }
  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.fill();
    return this;
  }
}


class StaticPoint extends Point{
  constructor(from, radius) {
    super(from, radius);
    this.from = from;
  }
  go() {
    this.x = this.from.x;
    this.y = this.from.y;
    return this;
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
Object.assign(Point.prototype, notify);

class Dot extends Point {
  constructor(point, radius) {
    super(point);
    this.from = point;
    this.to = point;
    this.radius = radius;
  }
  go() {
  }
}

class MovingDot extends MovingPoint {
  constructor(from, to, radius) {
    super(from, to);
    this.radius = radius;
  }
}

class RandomPoint {
  constructor({clientWidth, clientHeight}) {
    this.xProportion = Math.random();
    this.yProportion = Math.random();
    this.x = this.xProportion * clientWidth;
    this.y = this.yProportion * clientHeight;
  }
  refresh({clientWidth, clientHeight}) {
    this.x = 50;
    this.y = 50;

    // this.x = this.xProportion * clientWidth;
    // this.y = this.yProportion * clientHeight;
    console.log('refresh', this);
  }
}


export default [Point, StaticPoint, MovingPoint, Dot, MovingDot, RandomPoint];