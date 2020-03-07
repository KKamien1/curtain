import {Easing} from './easing.js';

const sampleFunct = (start, end, t, d, s) => Easing.get("easeInOutCirc", start, end, t, d, s)

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
    if(value === 'end') {
        this.x = this.from.x;
        this.y = this.from.y;
    }
  }
}

class Point {
  constructor(point, radius) {
    this.x = point.x;
    this.y = point.y;
    this.radius = radius || 0;
    this.position = point.position;
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

class Creator {
  constructor(context) {
    this.factories = {}
    this.context = context;
    this.add('staticPoint', StaticPoint);
    this.add('Dot', Dot);
    this.add('movingPoint', MovingPoint );
    this.add('movingDot', MovingDot);
  }

  add(type, constructor) {
    this.factories[type] = constructor;
  }
  
  create(type, ...props) {
    return Object.assign(new this.factories[type](...props), this.context);
  }
}

class Points {
  constructor(div) {
    this.div = div;
    this.clientWidth = this.div.clientWidth;
    this.clientHeight = this.div.clientHeight;
    this.points = new Map();
    this.set("A", { x: 0, y: 0, position: function() {this.from.x = 0; this.from.y = 0}});
    this.set("B", { x: this.clientWidth, y: 0, 
      position: function({clientWidth}) {
        this.from.x = clientWidth;
        this.from.y = 0;
      } 
    });
    this.set("C", { 
      x: 0, 
      y: this.clientHeight,
      position: function({clientHeight}) {
        this.from.x = 0;
        this.from.y = clientHeight;
      } 
    });
    this.set("D", { 
      x: this.clientWidth, 
      y: this.clientHeight, 
      position: function ({clientHeight, clientWidth}) {
        this.from.x = clientWidth;
        this.from.y = clientHeight;
      }
    });
    this.set("M", { 
      x: this.clientWidth / 2, 
      y: this.clientHeight / 2, 
      position: function ({clientHeight, clientWidth}) {
        this.from.x = clientWidth/2; 
        this.from.y = clientHeight / 2;
      }
    });
    this.set("L", { 
      x: 0, 
      y: this.clientHeight / 2,
      position: function({clientHeight}) {
        this.from.x = 0;
        this.from.y = clientHeight / 2
      } 
    });
    this.set("R", { 
      x: this.clientWidth, 
      y: this.clientHeight / 2, 
      position: function({clientHeight, clientWidth}) {
        this.from.x = clientWidth;
        this.from.y = clientHeight / 2
      } 
    });
  }

  set(symbol, point) {
    this.points.set(symbol,point);
  }

  get(name) {
    return this.points.get(name);
  }

}






export { Point, Points, MovingPoint, Dot, MovingDot, Creator, RandomDot };

