export function ctxDrawCoordinatesLines(ctx, x, y, px, py){
    ctx.save();

    ctx.beginPath()
    ctx.lineWidth = 0.5
    ctx.strokeStyle = "gray"
    ctx.setLineDash([5, 5])
    ctx.moveTo(x.getPixelForValue(0), y.getPixelForValue(py))
    ctx.lineTo(x.getPixelForValue(px), y.getPixelForValue(py))
    ctx.lineTo(x.getPixelForValue(px), y.getPixelForValue(0))
    ctx.stroke()

    ctx.restore();
}