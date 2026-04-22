export class Point{
    constructor(public x: number, public y: number){}

    /**
     * Returns a string representation of the point.
     * @returns String in format "(x, y)"
     */
    toString(): string {
        return `(${this.x}, ${this.y})`;
    }

    /**
     * Checks if this point is equal to another point.
     * @param other - The point to compare with
     * @returns True if both x and y coordinates are equal
     */
    equals(other: Point): boolean {
        return this.x === other.x && this.y === other.y;
    }

    /**
     * Adds another point to this point component-wise.
     * @param other - The point to add
     * @returns A new Point with summed coordinates
     */
    add(other: Point): Point{
        return new Point(this.x + other.x, this.y + other.y);
    }

    subtract(other: Point): Point{
        return new Point(this.x - other.x, this.y - other.y);
    }

    /**
     * Scales this point by a given factor.
     * @param factor - The scaling factor
     * @returns A new Point with scaled coordinates
     */
    scale(factor: number): Point{
        return new Point(this.x * factor, this.y * factor);
    }

    /**
     * Rotates this point around an origin by a given angle in radians.
     * @param angleRadians - The rotation angle in radians
     * @param origin - The center of rotation (default: origin at (0, 0))
     * @returns A new rotated Point
     */
    rotate(angleRadians: number, origin: Point = new Point(0, 0)){
        return new Point(
            (this.x - origin.x) * Math.cos(angleRadians) - (this.y - origin.y) * Math.sin(angleRadians) + origin.x,
            (this.x - origin.x) * Math.sin(angleRadians) + (this.y - origin.y) * Math.cos(angleRadians) + origin.y
        );
    }

    /**
     * Rotates this point around an origin by a given angle in degrees.
     * @param angle - The rotation angle in degrees
     * @param origin - The center of rotation (default: origin at (0, 0))
     * @returns A new rotated Point
     */
    rotateByDegrees(angle: number, origin: Point = Point.GLOBAL_ORIGIN){
        return this.rotate(angle * Math.PI / 180, origin);
    }

    /**
     * Reflects this point across a given line.
     * @param line - The line to reflect across
     * @returns A new reflected Point, or the original point if the line is invalid
     */
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

    toFixedString(digits: number): string{
        return `(${this.x.toFixed(digits)}, ${this.y.toFixed(digits)})`;
    }

    /**
     * Generates a random point within specified bounds.
     * @param xMax - Maximum x coordinate
     * @param yMax - Maximum y coordinate
     * @param xMin - Minimum x coordinate (default: 0)
     * @param yMin - Minimum y coordinate (default: 0)
     * @returns A new random Point with integer coordinates
     */
    static random(xMax: number, yMax: number, xMin: number = 0, yMin: number = 0){
        const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

        return new Point(
            randInt(xMin, xMax),
            randInt(yMin, yMax)
        )
    }

    /**
     * Generates a random point within a square range.
     * @param max - Maximum coordinate value for both x and y
     * @param min - Minimum coordinate value for both x and y (default: 0)
     * @returns A new random Point with integer coordinates
     */
    static randomRange(max: number, min: number = 0) {
        return Point.random(max, max, min, min);
    }

    static fromAngle(angleRadians: number, radius: number = 1){
        return new Point(radius * Math.cos(angleRadians), radius * Math.sin(angleRadians))
    }

    static readonly GLOBAL_ORIGIN = new Point(0, 0)
}

export class Line{
    public A: number
    public B: number
    public C: number

    constructor(A: number, B: number, C: number) {
        let gcdAll = A < 0? -1: 1

        const gcd = (a: number, b: number): number => {
            return b === 0? a : gcd(b, a%b);
        }

        gcdAll *= gcd(Math.abs(A), gcd(Math.abs(B), Math.abs(C)))

        this.A = A / gcdAll
        this.B = B / gcdAll
        this.C = C / gcdAll
    }

    /**
     * Returns a string representation of the line equation.
     * @returns String in format "Ax+By+C=0"
     */
    toString(): string {
        let result: string = ""
        if (this.A == 1) result = "x";
        else if (this.A != 0) result = `${this.A}x`;

        if (this.A != 0 && this.B != 0){
            result += this.B < 0? " - " : " + "
        }

        if (this.B != 0){
            const abs_val = Math.abs(this.B)
            if (abs_val == 1)
                result += 'y'
            else
                result += `${abs_val}y`
        }

        if (this.C != 0) {
            result += (this.C < 0? " - " : " + ") + `${Math.abs(this.C)}`;
        }

        return `${result} = 0`
    }

    /**
     * Checks if this line is equal to another line.
     * @param other - The line to compare with
     * @returns True if all coefficients (A, B, C) are equal
     */
    equals(other: Line): boolean {
        return this.A === other.A && this.B === other.B && this.C === other.C;
    }

    /**
     * Calculates the perpendicular distance from a point to this line.
     * @param point - The point to calculate distance from
     * @returns The distance as a non-negative number
     */
    distance(point: Point): number {
        return Math.abs(this.A * point.x + this.B * point.y + this.C) / Math.sqrt(this.A ** 2 + this.B ** 2);
    }

    /**
     * Gets the sum of squares of coefficients A and B (A² + B²).
     * Used in distance and reflection calculations.
     * @returns The squared hypotenuse value
     */
    get sqHypot(): number {
        return this.A ** 2 + this.B ** 2;
    }

    /**
     * Checks if this line is valid (not degenerate).
     * A line is valid if at least one of A or B is non-zero.
     * @returns True if the line represents a valid geometric line
     */
    get isValid(): boolean {
        return this.A !== 0 || this.B !== 0;
    }

    onLine(point: Point): boolean {
        return this.A * point.x + this.B * point.y + this.C === 0;
    }

    /**
     * Generates a random line with coefficients within specified bounds.
     * @param aMax - Maximum value for coefficient A
     * @param bMax - Maximum value for coefficient B
     * @param cMax - Maximum value for coefficient C
     * @param aMin - Minimum value for coefficient A (default: 0)
     * @param bMin - Minimum value for coefficient B (default: 0)
     * @param cMin - Minimum value for coefficient C (default: 0)
     * @returns A new random Line with integer coefficients
     */
    static random(aMax: number, bMax: number, cMax: number, aMin: number = 0, bMin: number = 0, cMin: number = 0){
        const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
        return new Line(
            randInt(aMin, aMax),
            randInt(bMin, bMax),
            randInt(cMin, cMax)
        )
    }

    /**
     * Generates a random line with coefficients within a uniform range.
     * @param max - Maximum value for all coefficients
     * @param min - Minimum value for all coefficients (default: 0)
     * @returns A new random Line with integer coefficients
     */
    static randomRange(max: number, min: number = 0){
        return Line.random(max, max, max, min, min, min);
    }
}

export function atan2(point1: Point, point2: Point): number{
    const diff = point1.subtract(point2);
    return Math.atan2(diff.y, diff.x);
}