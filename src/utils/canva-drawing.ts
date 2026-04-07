import {Point, DemoData, TransformUtils, Line} from './transform-utils.ts';

export namespace CanvaDrawing{
    export function drawGrid(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, range: number) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const cellSize = canvas.width / (range * 2)
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2

        ctx.strokeStyle = '#e0e0e0'
        ctx.lineWidth = 1

        for (let i = -range; i <= range; i++) {
            const x = centerX + i * cellSize
            const y = centerY + i * cellSize

            ctx.beginPath()
            ctx.moveTo(x, 0)
            ctx.lineTo(x, canvas.height)
            ctx.stroke()

            ctx.beginPath()
            ctx.moveTo(0, y)
            ctx.lineTo(canvas.width, y)
            ctx.stroke()
        }

        ctx.strokeStyle = '#667eea'
        ctx.lineWidth = 2

        ctx.beginPath()
        ctx.moveTo(centerX, 0)
        ctx.lineTo(centerX, canvas.height)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(0, centerY)
        ctx.lineTo(canvas.width, centerY)
        ctx.stroke()

        ctx.fillStyle = '#333'
        ctx.font = '12px Arial'
        ctx.fillText('0', centerX - 10, centerY + 15)
    }

    export namespace detail {
        export function drawPoint(
            ctx: CanvasRenderingContext2D,
            canvas: HTMLCanvasElement,
            x: number,
            y: number,
            color: string,
            label: string,
            range: number,
            textYOffset: number = 10
        ) {
            const cellSize = canvas.width / (range * 2)
            const centerX = canvas.width / 2
            const centerY = canvas.height / 2

            const screenX = centerX + x * cellSize
            const screenY = centerY - y * cellSize

            ctx.beginPath()
            ctx.arc(screenX, screenY, 6, 0, Math.PI * 2)
            ctx.fillStyle = color
            ctx.fill()
            ctx.strokeStyle = 'white'
            ctx.lineWidth = 2
            ctx.stroke()

            ctx.fillStyle = '#333'
            ctx.font = 'bold 12px Arial'
            ctx.fillText(label, screenX + 10, screenY - textYOffset)
        }

        export function drawArrow(
            ctx: CanvasRenderingContext2D,
            fromX: number,
            fromY: number,
            toX: number,
            toY: number,
            color: string,
            reverse: boolean = false
        ) {
            const headlen = 15
            const angle = Math.atan2(toY - fromY, toX - fromX) + (reverse ? Math.PI : 0)

            ctx.strokeStyle = color
            ctx.lineWidth = 3
            ctx.fillStyle = color

            ctx.beginPath()
            ctx.moveTo(fromX, fromY)
            ctx.lineTo(toX, toY)
            ctx.stroke()

            ctx.beginPath()
            ctx.moveTo(toX, toY)
            ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6))
            ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6))
            ctx.closePath()
            ctx.fill()
        }

        export function drawRotationArc(
            ctx: CanvasRenderingContext2D,
            centerX: number,
            centerY: number,
            radius: number,
            startAngle: number,
            endAngle: number,
            color: string
        ) {
            const arcRadius = radius

            ctx.strokeStyle = color
            ctx.lineWidth = 3
            ctx.setLineDash([5, 3])

            ctx.beginPath()
            ctx.arc(centerX, centerY, arcRadius, startAngle, endAngle, startAngle > endAngle)
            ctx.stroke()

            ctx.setLineDash([])

            const arrowAngle = endAngle
            const arrowX = centerX + arcRadius * Math.cos(arrowAngle)
            const arrowY = centerY + arcRadius * Math.sin(arrowAngle)

            const tangentAngle = arrowAngle + Math.PI / 2
            const arrowTipX = arrowX + 8 * Math.cos(tangentAngle)
            const arrowTipY = arrowY + 8 * Math.sin(tangentAngle)

            drawArrow(ctx, arrowX, arrowY, arrowTipX, arrowTipY, color, true)
        }

        export function drawLine(
            ctx: CanvasRenderingContext2D,
            canvas: HTMLCanvasElement,
            line: Line,
            range: number
        ) {
            const cellSize = canvas.width / (range * 2)
            const centerX = canvas.width / 2
            const centerY = canvas.height / 2

            ctx.strokeStyle = '#e74c3c'
            ctx.lineWidth = 3
            ctx.setLineDash([5, 5])

            if (Math.abs(line.B) < 0.001) {
                const x = -line.C / line.A
                const screenX = centerX + x * cellSize
                ctx.beginPath()
                ctx.moveTo(screenX, 0)
                ctx.lineTo(screenX, canvas.height)
                ctx.stroke()
            } else {
                const x1 = -range
                const y1 = -(line.A * x1 + line.C) / line.B
                const x2 = range
                const y2 = -(line.A * x2 + line.C) / line.B

                const screenX1 = centerX + x1 * cellSize
                const screenY1 = centerY - y1 * cellSize
                const screenX2 = centerX + x2 * cellSize
                const screenY2 = centerY - y2 * cellSize

                ctx.beginPath()
                ctx.moveTo(screenX1, screenY1)
                ctx.lineTo(screenX2, screenY2)
                ctx.stroke()
            }

            ctx.setLineDash([])
        }

        export function arrow(ctx: CanvasRenderingContext2D, canvasRef: HTMLCanvasElement, start: Point, current: Point, cellSize: number, color: string){
            const screenStartX = canvasRef.width / 2 + start.x * cellSize
            const screenStartY = canvasRef.height / 2 - start.y * cellSize
            const screenCurrX = canvasRef.width / 2 + current.x * cellSize
            const screenCurrY = canvasRef.height / 2 - current.y * cellSize
            drawArrow(ctx, screenStartX, screenStartY, screenCurrX, screenCurrY, color)
        }
    }

    export function handleMove(
        ctx: CanvasRenderingContext2D,
        canvasRef: HTMLCanvasElement,
        start: Point,
        frame: number,
        demoData: DemoData,
        cellSize: number,
    ): Point{
        const [dx, dy] = demoData.params

        const current = {
            x: start.x + dx * frame,
            y: start.y + dy * frame
        }

        if (frame > 0) {
            detail.arrow(ctx, canvasRef, start, current, cellSize, '#f39c12')
        }

        return current
    }

    export function handleScale(
        ctx: CanvasRenderingContext2D,
        canvasRef: HTMLCanvasElement,
        start: Point,
        frame: number,
        demoData: DemoData,
        cellSize: number,
    ): Point{
        const [k] = demoData.params
        const t = frame
        const current = {
            x: start.x * (1 + (k - 1) * t),
            y: start.y * (1 + (k - 1) * t)
        }

        if (frame > 0) {
            detail.arrow(ctx, canvasRef, start, current, cellSize, '#f39c12');
        }

        return current
    }

    export function handleRotate(
        ctx: CanvasRenderingContext2D,
        canvasRef: HTMLCanvasElement,
        start: Point,
        frame: number,
        range: number,
        angle: number,
        cellSize: number,
        center: Point = {x: 0, y: 0}
    ): Point{
        const currentAngle = angle * frame
        const current = TransformUtils.rotateCoordByPoint(start.x, start.y, center.x, center.y, currentAngle)
        console.log('angle is ', currentAngle)

        const originScreenX = canvasRef.width / 2 + center.x * cellSize
        const originScreenY = canvasRef.height / 2 - center.y * cellSize

        detail.drawPoint(ctx, canvasRef, center.x, center.y, '#e74c3c', 'Center', range)

        const radius = Math.hypot(start.x - center.x, start.y - center.y) * cellSize

        if (frame > 0) {
            const startAngle = -Math.atan2(start.y, start.x)
            detail.drawRotationArc(ctx, originScreenX, originScreenY, radius, startAngle, startAngle-TransformUtils.toRad(currentAngle)+0.05, '#f39c12')
        }

        return {x: current.x, y: current.y}
    }

    export function handleReflect(
        ctx: CanvasRenderingContext2D,
        canvasRef: HTMLCanvasElement,
        start: Point,
        line: Line,
        frame: number,
        range: number,
        cellSize: number,
    ): Point{
        const t = frame

        // Calculate the reflected point
        const sqHypot = line.A ** 2 + line.B ** 2
        const coordSubs = line.A * start.x + line.B * start.y + line.C
        const finalX = start.x - 2 * line.A * coordSubs / sqHypot
        const finalY = start.y - 2 * line.B * coordSubs / sqHypot

        const current = {
            x: start.x + (finalX - start.x) * t,
            y: start.y + (finalY - start.y) * t
        }

        // Draw the reflection line
        detail.drawLine(ctx, canvasRef, line, range)

        // Draw arrow if animation has started
        if (frame > 0) {
            detail.arrow(ctx, canvasRef, start, current, cellSize, '#f39c12')
        }

        return current
    }
}