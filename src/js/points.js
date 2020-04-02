// import { randomPoint } from "./utils.js";
import create from './Creator.js'
export const [A, B, C, D, M, L, R, RANDOM] = ['A', 'B', 'C', 'D', 'M', 'L', 'R', 'RANDOM'];
//export const POINTS = [A, B, C, D, M, L, R, RANDOM];


class Points {
  constructor(div) {

    this.points = new Map()
      .set(A, { x: 0, y: 0, refresh() {this.x = 0; this.y = 0}})
      .set(B, { x: div.clientWidth, y: 0, 
        refresh ({clientWidth}) {
          this.x = clientWidth;
          this.y = 0;
          } 
        })
      .set(C, { 
        x: 0, 
        y: div.clientHeight,
        refresh ({clientHeight}) {
          this.x = 0;
          this.y = clientHeight;
        } 
      })
      .set(D, { 
        x: div.clientWidth, 
        y: div.clientHeight, 
        refresh ({clientWidth, clientHeight}) {
          this.x = clientWidth;
          this.y = clientHeight;
        }
      })
      .set(M, { 
        x: div.clientWidth / 2, 
        y: div.clientHeight / 2, 
        refresh ({clientWidth, clientHeight}) {
          this.x = clientWidth/2; 
          this.y = clientHeight / 2;
        }
      })
      .set(L, { 
        x: 0, 
        y: div.clientHeight / 2,
        refresh({clientHeight}) {
          this.x = 0;
          this.y = clientHeight / 2
        } 
      })
      .set(R, { 
        x: div.clientWidth, 
        y: div.clientHeight / 2, 
        refresh({clientHeight, clientWidth}) {
          this.x = clientWidth;
          this.y = clientHeight / 2
        } 
      })
      .set(RANDOM, new create['RandomPoint'](div));
  }

  getAll() {
    return this.points;
  }

  refreshPoints(div) {
    this.points.forEach(point => point.refresh(div))
  }

}

const PointsFactory = (function () {

  let instance;
  const AllPoints = new WeakMap();

  const Constructor = function(div) {
    if(!instance) {
      instance = this;
    }
    if(div) {
      const points = new Points(div);
      AllPoints.set(div, points);
    }

    return instance;

  }

  Constructor.prototype.get = function(div) {
    return AllPoints.get(div)
  }
  Constructor.prototype.add = function(div) {
    return AllPoints.set(div, new Points(div));
  }

  return Constructor;

})()

export default new PointsFactory();