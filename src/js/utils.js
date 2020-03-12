
function drawPoligon(ctx, color) {
  let defaultColor = ctx.fillStyle;
  ctx.fillStyle = color || ctx.fillStyle;
  ctx.beginPath();
  this.points.forEach((point, index) => {
    index === 0
    ? ctx.moveTo(point.x, point.y)
    : ctx.lineTo(point.x, point.y);
  });
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = defaultColor;
}


export {drawPoligon}