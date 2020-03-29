import {drawPoligon} from './utils.js';

import create from './creator.js';

const [A, B, C, D, M, L, R] = ['A', 'B', 'C', 'D', 'M', 'L', 'R']; // POINTS  

const POINTS = [A, B, C, D, M, L, R]

const CURTAINS = new Map()
.set('abc',     ['a', 'b', 'c', 'bottomRight'])
.set('corners', ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'])
.set('fikmik',  ['topLeft', 'topRight', 'fikmik'])
.set('test',    ['topLeft'])
.set('tocenter',['topCenter', 'bottomCenter', 'leftCenter', 'rightCenter']);


const FIGURES =  new Map()
  .set('topLeft',     [ ['StaticPoint', A], ['MovingDot', A, B, 20], ['MovingDot', A, C, 30] ])
  .set('bottomRight', [ ['StaticPoint', D], ['MovingPoint', D, B], ['MovingPoint', D, C] ]) 
  .set('topRight',    [ ['StaticPoint', B], ['MovingPoint', B, A], ['MovingPoint', B, D] ])
  .set('bottomLeft',  [ ['StaticPoint', C], ['MovingPoint', C, A], ['MovingPoint', C, D] ])
  .set('fikmik',      [ ['StaticPoint', M], ['MovingPoint', M, C], ['MovingPoint', M, D] ])
  .set('a',           [ ['StaticPoint', M], ['MovingPoint', M, A], ['MovingPoint', M, B] ])
  .set('b',           [ ['StaticPoint', M], ['MovingPoint', M, B], ['MovingPoint', M, D] ])
  .set('c',           [ ['StaticPoint', M], ['MovingPoint', M, D], ['MovingPoint', M, C] ])
  .set('d',           [ ['StaticPoint', M], ['MovingPoint', M, C], ['MovingPoint', M, A] ])
  .set('topCenter',   [ ['StaticPoint', A], ['StaticPoint', B],    ['MovingPoint', A, M] ])
  .set('bottomCenter',[ ['StaticPoint', C], ['StaticPoint', D],    ['MovingPoint', D, M] ])
  .set('rightCenter', [ ['StaticPoint', B], ['StaticPoint', D],    ['MovingPoint', D, M] ])
  .set('leftCenter',  [ ['StaticPoint', A], ['StaticPoint', C],    ['MovingPoint', A, M] ]);

class Points {
  constructor(div) {
    this.points = new Map()
      .set(A, { x: 0, y: 0, refresh: function() {this.x = 0; this.y = 0}})
      .set(B, { x: div.clientWidth, y: 0, 
        refresh: function({clientWidth}) {
          this.x = clientWidth;
          this.y = 0;
          } 
        })
      .set(C, { 
        x: 0, 
        y: div.clientHeight,
        refresh: function({clientHeight}) {
          this.x = 0;
          this.y = clientHeight;
        } 
      })
      .set(D, { 
        x: div.clientWidth, 
        y: div.clientHeight, 
        refresh: function ({clientWidth, clientHeight}) {
          this.x = clientWidth;
          this.y = clientHeight;
        }
      })
      .set(M, { 
        x: div.clientWidth / 2, 
        y: div.clientHeight / 2, 
        refresh: function ({clientWidth, clientHeight}) {
          this.x = clientWidth/2; 
          this.y = clientHeight / 2;
        }
      })
      .set(L, { 
        x: 0, 
        y: div.clientHeight / 2,
        refresh: function({clientHeight}) {
          this.x = 0;
          this.y = clientHeight / 2
        } 
      })
      .set(R, { 
        x: div.clientWidth, 
        y: div.clientHeight / 2, 
        refresh: function({clientHeight, clientWidth}) {
          this.x = clientWidth;
          this.y = clientHeight / 2
        } 
      });
  }

  getAll() {
    return this.points;
  }

  refreshPoints(div) {
    this.points.forEach(point => point.refresh(div))
  }

}

class Figure {
  constructor({points, name, draw = drawPoligon, color}) {
    this.name = name;
    this.color = color;
    this.drawFunc = draw;
    this.elements = FIGURES.get(name)
      .map(([constructor, ...letters]) => [constructor, ...letters.map(arg => points.has(arg) ? points.get(arg) : arg)])
      .map(([element, ...args]) => new create[element](...args))
  }

  go(t) {
    this.elements.forEach(point => point.go(t))
    return this;
  }

  draw(ctx) {
    this.drawFunc(ctx);
    return this;
  }
}



class Curtain {

  constructor(div, curtain, ctx) {
    this.points = new Points(div);
    this.ctx = ctx;
    this.figures = CURTAINS.get(curtain).map(name => new Figure({points: this.points.getAll(), name}));
    this.elements = this.figures.reduce((all,{elements}) => [...all, ...elements],[]);
  }

  draw(t) {
    this.elements.forEach(elem => elem.draw());
    this.figures.forEach(figure => figure.draw(this.ctx).go(t));
    return this
  }

  getSet () {
    return this.elements
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



export { Points, Curtain };

