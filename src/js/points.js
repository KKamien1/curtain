const [A, B, C, D, M, L, R] = ['A', 'B', 'C', 'D', 'M', 'L', 'R']; // POINTS


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