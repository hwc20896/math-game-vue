import {Point, Line} from '@/utils/point.ts';

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
    practice: {
        question: string;
        answer: [number, number];
    };
    demo: {
        type: string;
        text: string;
        start: { x: number; y: number };
        params: any[];
        gridRange: number;
    };
}

/**
 * 坐標變換工具類
 * Coordinate Transform Utilities
 */
export namespace TransformUtils {

    /**
     * 四捨五入到指定小數位數
     */
    export function roundToDecimal(num: number, decimals: number = 2): number {
        const factor = Math.pow(10, decimals);
        return Math.round(num * factor) / factor;
    }

    /**
     * 隨機整數
     */
    export function randInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * 從陣列中隨機選擇
     */
    export function choice<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * 平移變換
     */
    export function moveCoord(current: Point, other: Point): TransformResult {
        return {
            point: current.add(other),
            description: `平移 ${other.toString()}`
        };
    }

    /**
     * 縮放變換
     */
    export function scaleCoord(current: Point, factor: number): TransformResult {
        return {
            point: current.scale(factor),
            description: `縮放 ${factor}x`
        };
    }

    /**
     * 旋轉變換（繞原點）
     */
    export function rotateCoord(current: Point, angleDegrees: number): TransformResult {
        return {
            point: current.rotateByDegrees(angleDegrees),
            description: `旋轉 ${angleDegrees}°`
        }
    }

    /**
     * X 軸反射
     */
    export function reflectByXAxis(current: Point): TransformResult {
        const xAxis: Line = new Line(1, 0, 0);
        return {
            point: current.reflect(xAxis),
            description: `X 軸反射`
        };
    }

    /**
     * Y 軸反射
     */
    export function reflectByYAxis(current: Point): TransformResult {
        const yAxis: Line = new Line(0, 1, 0);
        return {
            point: current.reflect(yAxis),
            description: `Y 軸反射`
        };
    }

    /**
     * 繞點旋轉
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
     * y=x 直線反射
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
     * y=-x 直線反射
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
     * 一般直線反射
     */
    export function reflectByLine(
        current: Point,
        line: Line
    ): TransformResult {
        if (!line.isValid) {
            return {
                point: current,
                description: `無效直線（无反射）`
            };
        }

        return {
            point: current.reflect(line),
            description: `${line.toString()} 反射`
        };
    }
}
