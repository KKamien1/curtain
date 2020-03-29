
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


export {drawPoligon}