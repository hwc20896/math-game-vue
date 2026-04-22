import {Point, Line} from '@/utils/point.ts';
import type {TutorialPracticeGeneratorType} from '@/utils/tutorial-generator.ts';

export const VALID_ROTATE_ANGLES = [-90, 90, 180];
export const VALID_ROTATE_ANGLES_HARD = [
    -150, -135, -120, -60, -45, -30,
    30, 45, 60, 120, 135, 150
];
export const VALID_ROTATE_ANGLES_ALL = [
    -150, -135, -120, -90, -60, -45, -30,
    30, 45, 60, 90, 120, 135, 150, 180
];

export interface TransformResult {
    point: Point;
    description: string;
}

export interface DemoData {
    type: string;
    text: string;
    start: Point;
    params: any[];
    gridRange: number;
}

/**
 * 變換選項配置
 * Transform option config
 */
export interface TransformOption {
    func: (...args: any[]) => TransformResult;
    argGen: (() => any[]) | null;
}

/**
 * 教學資料結構
 * Tutorial data structure
 */
export interface TutorialData {
    title: string;
    explanation: string;
    formula: string;
    example: string;
    practice: TutorialPracticeGeneratorType;
    demo: DemoData;
}

/**
 * 坐標變換工具類
 * Coordinate Transform Utilities
 */
export namespace TransformUtils {

    /**
     * Rounds a number to a specified number of decimal places.
     * @param num - The number to round
     * @param decimals - Number of decimal places (default: 2)
     * @returns The rounded number
     */
    export function roundToDecimal(num: number, decimals: number = 2): number {
        const factor = Math.pow(10, decimals);
        return Math.round(num * factor) / factor;
    }

    /**
     * Generates a random integer between min and max (inclusive).
     * @param min - Minimum value (inclusive)
     * @param max - Maximum value (inclusive)
     * @returns A random integer in the range [min, max]
     */
    export function randInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Randomly selects an element from an array.
     * @param array - The array to choose from
     * @returns A randomly selected element
     * @throws Error if array is empty
     */
    export function choice<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * Performs a translation transformation on a point.
     * @param current - The current point position
     * @param other - The translation vector
     * @returns TransformResult with new position and description
     */
    export function moveCoord(current: Point, other: Point): TransformResult {
        return {
            point: current.add(other),
            description: `平移 ${other.toString()}`
        };
    }

    /**
     * Performs a scaling transformation on a point from the origin.
     * @param current - The current point position
     * @param factor - The scaling factor
     * @returns TransformResult with scaled position and description
     */
    export function scaleCoord(current: Point, factor: number): TransformResult {
        return {
            point: current.scale(factor),
            description: `縮放 ${factor}x`
        };
    }

    /**
     * Performs a rotation transformation around the origin (0, 0).
     * @param current - The current point position
     * @param angleDegrees - The rotation angle in degrees
     * @returns TransformResult with rotated position and description
     */
    export function rotateCoord(current: Point, angleDegrees: number): TransformResult {
        return {
            point: current.rotateByDegrees(angleDegrees),
            description: `繞原點旋轉 ${angleDegrees}°`
        }
    }

    /**
     * Reflects a point across the X-axis.
     * @param current - The current point position
     * @returns TransformResult with reflected position and description
     */
    export function reflectByXAxis(current: Point): TransformResult {
        const xAxis: Line = new Line(0, 1, 0);  //  y=0
        return {
            point: current.reflect(xAxis),
            description: `X 軸反射`
        };
    }

    /**
     * Reflects a point across the Y-axis.
     * @param current - The current point position
     * @returns TransformResult with reflected position and description
     */
    export function reflectByYAxis(current: Point): TransformResult {
        const yAxis: Line = new Line(1, 0, 0);   // x=0
        return {
            point: current.reflect(yAxis),
            description: `Y 軸反射`
        };
    }

    /**
     * Rotates a point around a specified origin point.
     * @param current - The current point position
     * @param origin - The center of rotation
     * @param angle - The rotation angle in degrees
     * @returns TransformResult with rotated position and description
     */
    export function rotateCoordByPoint(
        current: Point,
        origin: Point,
        angle: number
    ): TransformResult {
        return {
            point: current.rotateByDegrees(angle, origin),
            description: `繞 ${origin.toString()} 旋轉 ${angle}°`
        };
    }

    /**
     * Reflects a point across the line y=x (45-degree line).
     * @param current - The current point position
     * @returns TransformResult with reflected position and description
     */
    export function reflectBy45DegLine(current: Point): TransformResult {
        //  y=x ==> x-y=0
        const line: Line = new Line(1, -1, 0);
        return {
            point: current.reflect(line),
            description: `y=x 直線反射`
        };
    }

    /**
     * Reflects a point across the line y=-x (135-degree line).
     * @param current - The current point position
     * @returns TransformResult with reflected position and description
     */
    export function reflectBy135DegLine(current: Point): TransformResult {
        //  y=-x ==> x+y=0
        const line: Line = new Line(1, 1, 0);
        return {
            point: current.reflect(line),
            description: `y=-x 直線反射`
        };
    }

    /**
     * Reflects a point across an arbitrary line.
     * @param current - The current point position
     * @param line - The line to reflect across
     * @returns TransformResult with reflected position and description,
     *          or unchanged point if the line is invalid
     */
    export function reflectByLine(
        current: Point,
        line: Line
    ): TransformResult {
        if (!line.isValid) {
            return {
                point: current,
                description: `無效直線（無反射）`
            };
        }

        return {
            point: current.reflect(line),
            description: `${line.toString()} 反射`
        };
    }

    export function toRad(degree: number): number{
        return degree * Math.PI / 180
    }

    export function isCorrect(input: Point, answer: Point): boolean{
        const difference = input.subtract(answer)
        return Math.abs(difference.x) < 0.1 && Math.abs(difference.y) < 0.1
    }
}