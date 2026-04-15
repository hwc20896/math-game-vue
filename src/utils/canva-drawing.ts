import {DemoData, TransformUtils} from '@/utils/transform-utils.ts';
import {Point, Line, atan2} from '@/utils/point.ts';

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
            point: Point,
            color: string,
            label: string,
            range: number,
            textOffset: Point = new Point(10, 10)
        ) {
            const cellSize = canvas.width / (range * 2)
            const centerX = canvas.width / 2
            const centerY = canvas.height / 2

            const screenX = centerX + point.x * cellSize
            const screenY = centerY - point.y * cellSize

            ctx.beginPath()
            ctx.arc(screenX, screenY, 6, 0, Math.PI * 2)
            ctx.fillStyle = color
            ctx.fill()
            ctx.strokeStyle = 'white'
            ctx.lineWidth = 2
            ctx.stroke()

            ctx.fillStyle = '#333'
            ctx.font = 'bold 12px Arial'
            ctx.fillText(label, screenX - textOffset.x, screenY - textOffset.y)
        }

        export function drawArrow(
            ctx: CanvasRenderingContext2D,
            fromPoint: Point,
            toPoint: Point,
            color: string,
            reverse: boolean = false
        ) {
            const headlen = 15
            const angle = atan2(toPoint, fromPoint) + (reverse ? Math.PI : 0)

            ctx.strokeStyle = color
            ctx.lineWidth = 3
            ctx.fillStyle = color

            ctx.beginPath()
            ctx.moveTo(fromPoint.x, fromPoint.y)
            ctx.lineTo(toPoint.x, toPoint.y)
            ctx.stroke()

            ctx.beginPath()
            ctx.moveTo(toPoint.x, toPoint.y)
            ctx.lineTo(toPoint.x - headlen * Math.cos(angle - Math.PI / 6), toPoint.y - headlen * Math.sin(angle - Math.PI / 6))
            ctx.lineTo(toPoint.x - headlen * Math.cos(angle + Math.PI / 6), toPoint.y - headlen * Math.sin(angle + Math.PI / 6))
            ctx.closePath()
            ctx.fill()
        }

        export function drawRotationArc(
            ctx: CanvasRenderingContext2D,
            centerPoint: Point,
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
            ctx.arc(centerPoint.x, centerPoint.y, arcRadius, startAngle, endAngle, startAngle > endAngle)
            ctx.stroke()

            ctx.setLineDash([])

            const arrowAngle = endAngle
            const arrowMultiplier = Point.fromAngle(arrowAngle, arcRadius)
            const arrow = centerPoint.add(arrowMultiplier)

            const tangentAngle = arrowAngle + Math.PI / 2
            const arrowTip = arrow.add(Point.fromAngle(tangentAngle, 8))

            drawArrow(ctx, arrow, arrowTip, color, true)
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

        export function arrow(
            ctx: CanvasRenderingContext2D,
            canvasRef: HTMLCanvasElement,
            start: Point,
            current: Point,
            cellSize: number,
            color: string
        ){
            const screenStartX = canvasRef.width / 2 + start.x * cellSize
            const screenStartY = canvasRef.height / 2 - start.y * cellSize
            const screenCurrX = canvasRef.width / 2 + current.x * cellSize
            const screenCurrY = canvasRef.height / 2 - current.y * cellSize
            drawArrow(ctx, new Point(screenStartX, screenStartY), new Point(screenCurrX, screenCurrY), color)
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
        const [point] = demoData.params

        const current = start.add(point.scale(frame))

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
        const current = start.scale(1 + (k - 1) * frame)

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
        center: Point = new Point(0, 0)
    ): Point{
        const currentAngle = angle * frame
        const current = TransformUtils.rotateCoordByPoint(start, center, currentAngle)
        console.log('angle is ', currentAngle)

        const originScreen = new Point(
            canvasRef.width / 2 + center.x * cellSize,
            canvasRef.height / 2 - center.y * cellSize
        )

        detail.drawPoint(ctx, canvasRef, center, '#e74c3c', 'Center', range)

        const radius = Math.hypot(start.x - center.x, start.y - center.y) * cellSize

        if (frame > 0) {
            const startAngle = -Math.atan2(start.y, start.x)
            detail.drawRotationArc(ctx, originScreen, radius, startAngle, startAngle-TransformUtils.toRad(currentAngle)+0.05, '#f39c12')
        }

        return current.point
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
        const final = start.reflect(line)

        const current = start.add(final.subtract(start).scale(frame))

        // Draw the reflection line
        detail.drawLine(ctx, canvasRef, line, range)

        // Draw arrow if animation has started
        if (frame > 0) {
            detail.arrow(ctx, canvasRef, start, current, cellSize, '#f39c12')
        }

        return current
    }
}