
function drawPoligon(ctx) {
  let defaultColor = ctx.fillStyle;
  ctx.fillStyle = this.color || ctx.fillStyle;
  ctx.beginPath();
  this.elements.forEach((point, index) => {
    index === 0
    ? ctx.moveTo(point.x, point.y)
    : ctx.lineTo(point.x, point.y);
  });
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = defaultColor;
}

function debounce (callback,wait) {
  let timeout;
  return () => {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => callback.apply(context,arguments), wait);
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

function drawCircle(center, radius = 3, color = "rgba(100,100,100,.8)") {
  defaultColor = ctx.fillStyle;
  ctx.fillStyle = color || ctx.fillStyle;
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = defaultColor;
}

function drawLine(ctx, a, b) {
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
}

function findClosest(points) {
  const distances = points.map(point => {
    let distanceValues = [];
    points.forEach(pointB => distanceValues.push(distance(point, pointB)));
    return distanceValues;
  });
  
  const closest = distances.map(distanceArr =>
    distanceArr
      .map((distance, index) => {
        return {
          distance,
          index
        };
      })
      .sort((a, b) => a.distance - b.distance)
      );
      
      return points.reduce((aggregator, point, index) => {
        const updatedPoint = Object.assign(point, {
          distances: distances[index],
          closest: closest[index]
        });
        aggregator.push(updatedPoint);
        return aggregator;
      }, []);
}
    
function drawLineOfClosest(points) {
  points.forEach((point, index) => {
    ctx.beginPath();
    point.closest.forEach(closePoint => {
      let { x, y } = points[closePoint.index];
      !index ? ctx.moveTo(point.x, point.y) : ctx.lineTo(x, y);
    });
    ctx.stroke();
  });
}



function generate(n, fn, div) {
  const result = [];
  while (n--) {
    result.push(new fn(div));
  }
  return result;
}

function update(point) {
  point.x =
  point.destination.clientX > point.x
  ? point.x + point.speed * point.acceleration
  : point.x - point.speed * point.acceleration;
  point.y =
  point.destination.clientY > point.y
  ? point.y + point.speed * point.acceleration
  : point.y - point.speed * point.acceleration;
  return point;
}
function randomPoint(dimentions) {
  return {
    x: Math.floor(randomOf(dimentions.width)),
    y: Math.floor(randomOf(dimentions.height))
  };
}

function pointInDiv(div) {
  return {
    x: randomOf(div.width),
    y: randomOf(div.height)
  };
}

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

function semiCenter(total, precision) {
  let gap = ofTotal(total)(precision);
  return Math.floor(total / 2 + gap);
}



function ofTotal(total) {
  return function(value) {
    return plusMinus(Math.round((value / 100) * total));
  };
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


export {  debounce, update,
  pointInDiv,
  randomPoint,
  generate,
  drawLineOfClosest,
  findClosest,
  drawLine,
  drawCircle, drawPoligon, drawTriangle}