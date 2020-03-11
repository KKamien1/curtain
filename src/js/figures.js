import {Easing} from './easing.js';

const sampleFunct = (start, end, t, d, s) => Easing.get("easeInOutCirc", start, end, t, d, s)

const [A, B, C, D, M, L, R] = ['A', 'B', 'C', 'D', 'M', 'L', 'R']; // POINTS  
const POINTS = [A, B, C, D, M, L, R]

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
    this.to = from;
    this.type = 'StaticPoint';
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
    this.type = 'MovingPoint';
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





class Creator {
  constructor(div) {
    this.points = new Points(div);
    this.register([StaticPoint, MovingPoint]);
  }

  register(types) {
    types.forEach(constructor => this[constructor.name] = constructor);
  }
  
  create(type, ...props) {
    props = props.map(arg => POINTS.includes(arg) ? this.points.get(arg) : arg);
    return new this[type](...props);
  }

  getPoints() {
    return this.points.getAll();
  }
}

class Points {
  constructor(div) {
    this.points = new Map();

    this.set(A, { x: 0, y: 0, refresh: function() {this.x = 0; this.y = 0}});
    this.set(B, { x: div.clientWidth, y: 0, 
      refresh: function({clientWidth}) {
        this.x = clientWidth;
        this.y = 0;
      } 
    });
    this.set(C, { 
      x: 0, 
      y: div.clientHeight,
      refresh: function({clientHeight}) {
        this.x = 0;
        this.y = clientHeight;
      } 
    });
    this.set(D, { 
      x: div.clientWidth, 
      y: div.clientHeight, 
      refresh: function ({clientHeight, clientWidth}) {
        this.x = clientWidth;
        this.y = clientHeight;
      }
    });
    this.set(M, { 
      x: div.clientWidth / 2, 
      y: div.clientHeight / 2, 
      refresh: function ({clientHeight, clientWidth}) {
        this.x = clientWidth/2; 
        this.y = clientHeight / 2;
      }
    });
    this.set(L, { 
      x: 0, 
      y: div.clientHeight / 2,
      refresh: function({clientHeight}) {
        this.x = 0;
        this.y = clientHeight / 2
      } 
    });
    this.set(R, { 
      x: div.clientWidth, 
      y: div.clientHeight / 2, 
      refresh: function({clientHeight, clientWidth}) {
        this.x = clientWidth;
        this.y = clientHeight / 2
      } 
    });
  }

  set(symbol, point) {
    this.points.set(symbol,point);
  }

  get(name) {
    return this.points.get(name);
  }

  getAll() {
    return this.points;
  }

}



class Figures {

  constructor(div) {

    this.creator = new Creator(div);
   
    this.topLeft = [
      this.creator.create('StaticPoint', A),
      this.creator.create('MovingPoint', A, B),
      this.creator.create('MovingPoint', A, C)
    ];
    
    this.bottomRight = [
      this.creator.create('StaticPoint', D),
      this.creator.create('MovingPoint', D, B),
      this.creator.create('MovingPoint', D, C)
    ];

    this.topRight = [
      this.creator.create('StaticPoint', B),
      this.creator.create('MovingPoint', B, A),
      this.creator.create('MovingPoint', B, D)
    ];
    
    this.bottomLeft = [
      this.creator.create('StaticPoint', C),
      this.creator.create('MovingPoint', C, A),
      this.creator.create('MovingPoint', C, D)
    ];

    this.fikmik = [
      this.creator.create('StaticPoint', M),
      this.creator.create('MovingPoint', M, C),
      this.creator.create('MovingPoint', M, D)
    ];
    
    this.a = [
        this.creator.create('StaticPoint', M),
        this.creator.create('MovingPoint', M, A),
        this.creator.create('MovingPoint', M, B),
    ];
    this.b = [
        this.creator.create('StaticPoint', M),
        this.creator.create('MovingPoint', M, B),
        this.creator.create('MovingPoint', M, D),
    ];
    this.c = [
        this.creator.create('StaticPoint', M),
        this.creator.create('MovingPoint', M, D),
        this.creator.create('MovingPoint', M, C),
    ];
    this.d = [
        this.creator.create('StaticPoint', M),
        this.creator.create('MovingPoint', M, C),
        this.creator.create('MovingPoint', M, A),
    ];

  } 
  
  get() {
    return new Set([
      this.topLeft,
      this.topRight,
      this.bottomLeft,
      this.bottomRight,
      this.fikmik
    ]);
  }
  getFromCenter() {
    return new Set([
      this.a,
      this.b,
      this.c,
      this.d,
    ]);
  }
  updatePoints(div) {
    this.creator.getPoints().forEach(point => point.refresh(div));
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



export { Point, Points, MovingPoint, Dot, MovingDot, Creator, Figures as CreateCorners, RandomDot };

