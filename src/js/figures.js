import {Easing} from './easing.js';
import {drawPoligon} from './utils.js';

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
      console.log(!this instanceof StaticPoint);
        if(!this instanceof StaticPoint) {

          // this.x = this.from.x;
          // this.y = this.from.y;
        }
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
    // this.from = from;
    // this.to = from;
    this.type = 'StaticPoint';
  }
  go() {
    // this.x = this.x;
    // this.y = this.y;
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
      refresh: function ({clientWidth, clientHeight}) {
        this.x = clientWidth;
        this.y = clientHeight;
      }
    });
    this.set(M, { 
      x: div.clientWidth / 2, 
      y: div.clientHeight / 2, 
      refresh: function ({clientWidth, clientHeight}) {
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

class Figure {
  constructor(div, name, draw = drawPoligon) {
    this.name = name;
    this.drawFunc = draw;
    this.creator = new Creator(div);

    this.figures =  new Map()
      .set('topLeft', [
          this.creator.create('StaticPoint', A),
          this.creator.create('MovingPoint', A, B),
          this.creator.create('MovingPoint', A, C)
        ])  
    .set('bottomRight', [
      this.creator.create('StaticPoint', D),
      this.creator.create('MovingPoint', D, B),
      this.creator.create('MovingPoint', D, C)
    ])
    
    .set('topRight', [
      this.creator.create('StaticPoint', B),
      this.creator.create('MovingPoint', B, A),
      this.creator.create('MovingPoint', B, D)
    ])
    
    .set('bottomLeft', [
      this.creator.create('StaticPoint', C),
      this.creator.create('MovingPoint', C, A),
      this.creator.create('MovingPoint', C, D)
    ])
    
    .set('fikmik', [
      this.creator.create('StaticPoint', M),
      this.creator.create('MovingPoint', M, C),
      this.creator.create('MovingPoint', M, D)
    ])
    
    .set('a', [
        this.creator.create('StaticPoint', M),
        this.creator.create('MovingPoint', M, A),
        this.creator.create('MovingPoint', M, B),
    ])
    .set('b', [
        this.creator.create('StaticPoint', M),
        this.creator.create('MovingPoint', M, B),
        this.creator.create('MovingPoint', M, D),
    ])
    .set('c', [
        this.creator.create('StaticPoint', M),
        this.creator.create('MovingPoint', M, D),
        this.creator.create('MovingPoint', M, C),
    ])
    .set('d', [
        this.creator.create('StaticPoint', M),
        this.creator.create('MovingPoint', M, C),
        this.creator.create('MovingPoint', M, A),
    ])
    .set('topCenter', [
        this.creator.create('StaticPoint', A),
        this.creator.create('StaticPoint', B),
        this.creator.create('MovingPoint', A, M),
    ])
    .set('bottomCenter', [
        this.creator.create('StaticPoint', C),
        this.creator.create('StaticPoint', D),
        this.creator.create('MovingPoint', D, M),
    ])
    .set('rightCenter', [
        this.creator.create('StaticPoint', B),
        this.creator.create('StaticPoint', D),
        this.creator.create('MovingPoint', D, M),
    ])
    .set('leftCenter', [
        this.creator.create('StaticPoint', A),
        this.creator.create('StaticPoint', C),
        this.creator.create('MovingPoint', A, M),
    ]);
    this.points = this.figures.get(name);
  }
  get(name) {
    this.figures.get(name);
  }
  go(t) {
    this.points.forEach(point => point.go(t))
    return this;
  }
  
  draw(ctx, color) {
    this.drawFunc(ctx, color);
    return this;
  }
  getPoints() {
    this.creator.getPoints();
  }

}



class Curtain {

  constructor(div, curtain) {
    
    this.curtains = new Map()
    .set('abc', ['a', 'b', 'c', 'bottomRight'])
    .set('corners', ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'])
    .set('fikmik', ['topLeft', 'topRight', 'fikmik'])
    .set('tocenter', ['topCenter']);

    this.build(div, curtain)
  } 
  
  build(div, curtain) {
    this.figures = this.curtains.get(curtain).map(name => new Figure(div, name));
  } 

  refreshPoints(div) {
    console.log(div);
    this.curtain.getPoints().forEach(point => point.refresh(div))
  }
  draw(ctx, t, color) {
    this.figures.forEach(figure => figure.draw(ctx, color).go(t));
    return this
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



export { Point, Points, MovingPoint, Dot, MovingDot, Creator, Curtain, RandomDot };

