import { Point, Dot } from "./figures.js";
import {
  update,
  randomPoint,
  generate,
  drawLineOfClosest,
  findClosest,
  drawLine,
  drawCircle,
  Frame
} from "./frame.js";


let frame = new Frame(document.getElementById('frame'));
let frame2 = new Frame(document.getElementById('frame2'));




const parameters = {
  ease: "easeInQuart",
  effect: Corners,
  stop: 0,
  time: 0,
  duration: 100000,
  fps: 60,
  color: "rgba(216,69,11,.9)"
};

function showOverlay(div) {
  div.querySelector(".overlay").classList.add("fadeIn");
  div.querySelector(".overlay").style.display = "block";
}


function removecanvas(e) {
  console.log("div outside", parameters);
  e.target.querySelector(".overlay").style.display = "none";

  Array.from(e.target.querySelectorAll("canvas")).forEach(el => el.remove());
}

function dim(el) {
  return {
    width: el.getBoundingClientRect().width,
    height: el.getBoundingClientRect().height
  };
}


function drawPoligon(points, color) {
  defaultColor = ctx.fillStyle;
  ctx.fillStyle = color || ctx.fillStyle;
  ctx.beginPath();
  points.forEach((point, index) => {
    index === 0
      ? ctx.moveTo(point[0], point[1])
      : ctx.lineTo(point[0], point[1]);
  });
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = defaultColor;
}


function setColor(parameters) {
  let arr = parameters.color
    .trim()
    .substring(4)
    .slice(1, this.length - 1)
    .split(",");
  let finalOpacity = arr[3];

  return function(time) {
    let opacity = Easing.get(
      parameters.ease,
      0,
      finalOpacity,
      time,
      parameters.duration
    );
    let color = arr
      .slice(0, 3)
      .concat(opacity)
      .join(",");
    return `rgba(${arr
      .slice(0, 3)
      .concat(opacity)
      .join(",")})`;
  };
}

function Corners(div) {
  function top_left(size) {
    return [[0, 0], [size.x, 0], [0, size.y]];
  }

  function top_right(size) {
    return [[div.width, 0], [div.width - size.x, 0], [div.width, size.y]];
  }

  function bottom_right(size) {
    return [
      [div.width, div.height],
      [div.width - size.x, div.height],
      [div.width, div.height - size.y]
    ];
  }

  function bottom_left(size) {
    return [[0, div.height], [size.x, div.height], [0, div.height - size.y]];
  }

  return [top_left, top_right, bottom_left, bottom_right];
}

function Rects(div) {
  function top_left(size) {
    return [[0, 0], [size.x, 0], [size.x, div.height], [0, div.height]];
  }

  function top_right(size) {
    return [
      [div.width, 0],
      [div.width, div.height],
      [div.width - size.x, div.height],
      [div.width - size.x, 0]
    ];
  }

  function bottom_right(size) {
    return [
      [0, div.height],
      [div.width, div.height],
      [div.width, div.height - size.y],
      [0, div.height - size.y]
    ];
  }

  function bottom_left(size) {
    return [[0, 0], [div.width, 0], [div.width, size.y], [0, size.y]];
  }

  return [top_left, top_right, bottom_left, bottom_right];
}

function Debris(div) {
  const x_top = semiCenter(div.width, 20);
  const x_bottom = semiCenter(div.width, 3);

  function left_debris(size) {
    return [
      [0, 0],
      [x_top - size.x, 0],
      [x_bottom - size.x, div.height],
      [0, div.height]
    ];
  }

  function right_debris(size) {
    return [
      [div.width, 0],
      [x_top + size.x, 0],
      [x_bottom + size.x, div.height],
      [div.width, div.height]
    ];
  }

  return [left_debris, right_debris];
}

function semiCenter(total, precision) {
  let gap = ofTotal(total)(precision);
  return Math.floor(total / 2 + gap);
}



function ofTotal(total) {
  return function(value) {
    return plusMinus(Math.round((value / 100) * total));
  };
}

function randomOf(value, start = 0) {
  return Math.floor(Math.random() * (value - start + 1)) + start;
}

function pointInDiv(div) {
  return {
    x: randomOf(div.width),
    y: randomOf(div.height)
  };
}

function Kropa(div, speed, size) {
  this.width = div.width;
  this.height = div.height;
  this.speed = randomOf(5, 1) / 10 || speed;
  this.size = randomOf(3, 1) || size;
  this.duration = randomOf(5000, 1000);
  this.time = 0;
  this.x = randomOf(div.width);
  this.y = randomOf(div.height);
}

Kropa.prototype.update = function(fn, t) {
  //this.x = this.x + t * .1
  this.y = this.y + 0.5;
};
Kropa.prototype.isIn = function() {
  this.x = this.x > this.width ? 0 : this.x;
  this.y = this.y > this.height ? 0 : this.y;
};

function slightVertical() {
  return (this.y = this.y + 0.5);
}

Kropa.prototype.slightVerticalRandom = function() {
  return (this.y = this.y + this.speed);
};
Kropa.prototype.slightHorizontalRandom = function() {
  return (this.x = this.x + this.speed);
};


function drawTriangle(center, radius, color) {
  defaultColor = ctx.fillStyle;
  ctx.fillStyle = color || ctx.fillStyle;
  ctx.beginPath();
  ctx.moveTo(center.x, center.y - radius * 2);
  ctx.lineTo(center.x + radius * Math.sqrt(3), center.y + radius);
  ctx.lineTo(center.x - radius * Math.sqrt(3), center.y + radius);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = defaultColor;
}

function randomUpdate(point, max = 5, min = 0) {
  point.x += plusMinus(randomOf(max, min));
  point.y += plusMinus(randomOf(max, min));
  return point;
}

function updateFunction(point, fn) {
  return fn(point);
}

function d(pointA, pointB) {
  return Math.sqrt(
    Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2)
  );
}

function rotate(point, center, ankle) {
  point.x = point.x + d(point, center) * Math.sin((ankle * Math.PI) / 180);
  point.y = point.y + d(point, center) * Math.cos((ankle * Math.PI) / 180);
  return point;
}

function getTriPoints(point, radius) {
  return [
    {
      x: point.x,
      y: point.y - radius * 2
    },
    {
      x: point.x + radius * Math.sqrt(3),
      y: point.y + radius
    },
    {
      x: point.x - radius * Math.sqrt(3),
      y: point.y + radius
    }
  ];
}

function middle(div) {
  return {
    x: Math.round(div.width / 2),
    y: Math.round(div.height / 2)
  };
}

function randomAnkle() {
  return randomOf(360);
}

function sin(radius) {
  return Math.sin((Math.PI / 180) * radius);
}

function cos(radius) {
  return Math.cos((Math.PI / 180) * radius);
}

function getstep(t) {
  return Easing.get(parameters.ease, 0, dimDiv.width, t, parameters.duration);
}
