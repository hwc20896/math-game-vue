export class Point{
    constructor(public x: number, public y: number){}

    toString(): string {
        return `(${this.x}, ${this.y})`;
    }

    equals(other: Point): boolean {
        return this.x === other.x && this.y === other.y;
    }

    add(other: Point): Point{
        return new Point(this.x + other.x, this.y + other.y);
    }

    scale(factor: number): Point{
        return new Point(this.x * factor, this.y * factor);
    }

    rotate(angleRadians: number, origin: Point = new Point(0, 0)){
        return new Point(
            (this.x - origin.x) * Math.cos(angleRadians) - (this.y - origin.y) * Math.sin(angleRadians) + origin.x,
            (this.x - origin.x) * Math.sin(angleRadians) + (this.y - origin.y) * Math.cos(angleRadians) + origin.y
        );
    }

    rotateByDegrees(angle: number, origin: Point = new Point(0, 0)){
        return this.rotate(angle * Math.PI / 180, origin);
    }

    reflect(line: Line): Point{
        if (!line.isValid) {
            //  Return type is Point&
            return new Point(this.x, this.y);
        }

        const coordSubs = line.A * this.x + line.B * this.y + line.C;
        return new Point(
            this.x - 2 * line.A * coordSubs / line.sqHypot,
            this.y - 2 * line.B * coordSubs / line.sqHypot
        )
    }

    static random(xMax: number, yMax: number, xMin: number = 0, yMin: number = 0){
        const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

        return new Point(
            randInt(xMin, xMax),
            randInt(yMin, yMax)
        )
    }

    static randomRange(max: number, min: number = 0){
        return Point.random(max, max, min, min);
    }
}

export class Line{
    constructor(public A: number, public B: number, public C: number){}

    toString(): string {
        return `${this.A}x+${this.B}y+${this.C}=0`;
    }

    equals(other: Line): boolean {
        return this.A === other.A && this.B === other.B && this.C === other.C;
    }

    distance(point: Point): number {
        return Math.abs(this.A * point.x + this.B * point.y + this.C) / Math.sqrt(this.A ** 2 + this.B ** 2);
    }

    //  A^2+B^2
    get sqHypot(): number {
        return this.A ** 2 + this.B ** 2;
    }

    get isValid(): boolean {
        return this.A !== 0 || this.B !== 0;
    }

    static random(aMax: number, bMax: number, cMax: number, aMin: number = 0, bMin: number = 0, cMin: number = 0){
        const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
        return new Line(
            randInt(aMin, aMax),
            randInt(bMin, bMax),
            randInt(cMin, cMax)
        )
    }

    static randomRange(max: number, min: number = 0){
        return Line.random(max, max, max, min, min, min);
    }
}