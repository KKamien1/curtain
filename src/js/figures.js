import {drawPoligon} from './utils.js';

import create from './creator.js';
import pointsFactory from './points.js';
import {A, B, C, D, M, L, R, RANDOM} from './points.js';

const CURTAINS = new Map()
.set('tocenter',['topCenter', 'bottomCenter', 'leftCenter', 'rightCenter'])
.set('corners', ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'])
.set('fikmik',  ['topLeft', 'topRight', 'fikmik'])
.set('abc',     ['a', 'b', 'c', 'bottomRight'])
.set('test2',   ['leftToRight'])
.set('test',    ['topLeft', 'randomLeft'])
.set('random',['randomLeft', 'randomTop', 'randomRight', 'randomBottom']);


const FIGURES =  new Map()
  .set('topLeft',     [ ['StaticPoint', A], ['MovingDot', A, B], ['MovingDot', A, C] ])
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
  .set('leftCenter',  [ ['StaticPoint', A], ['StaticPoint', C],    ['MovingPoint', A, M] ])
  .set('leftToRight', [ ['StaticPoint', M], ['MovingPoint', C, D], ['MovingPoint', A, B] ])
  .set('rightToLeft', [ ['StaticPoint', M], ['MovingPoint', D, C], ['MovingPoint', B, A] ])
  .set('randomLeft', [ ['StaticPoint', A], ['StaticPoint', C], ['MovingPoint', A, RANDOM] ])
  .set('randomTop', [ ['StaticPoint', RANDOM], ['MovingPoint', RANDOM, A], ['MovingPoint', RANDOM, B] ])
  .set('randomRight', [ ['StaticPoint', B], ['StaticPoint', D], ['MovingPoint', D, RANDOM] ])
  .set('randomBottom', [ ['StaticPoint', RANDOM], ['MovingPoint', RANDOM, C], ['MovingPoint', RANDOM, D] ]);




class Figure {
  constructor({points, name, draw = drawPoligon, color}) {
    this.name = name;
    this.color = color;
    this.drawFunc = draw;
    this.elements = FIGURES.get(name)
      .map(([constructor, ...letters]) => [constructor, ...letters.map(arg => points.has(arg) ? points.get(arg) : arg)])
      .map(([element, ...args]) => new create[element](...args))
  }

  draw(ctx, t) {
    this.drawFunc(ctx);
    this.elements.forEach(point => point.go(t).draw())
    return this;
  }
}


class Curtain {

  constructor(div, curtain, ctx) {
    this.ctx = ctx;
    pointsFactory.add(div);
    this.points = pointsFactory.get(div);
    this.figures = CURTAINS.get(curtain).map(name => new Figure({points: this.points.getAll(), name}));
    this.elements = this.figures.reduce((all,{elements}) => [...all, ...elements],[]);
  }

  draw(t) {
    this.figures.forEach(figure => figure.draw(this.ctx, t));
    return this
  }

  getSet () {
    return this.elements
  }
}


export { Curtain , CURTAINS };

