/**
 * 變換結果介面
 * Transform result interface
 */
export interface TransformResult {
    x: number;
    y: number;
    description: string;
}

export interface Point{
    x: number;
    y: number;
}

export interface DemoData {
    type: string;
    text: string;
    start: Point;
    params: any[];
    gridRange: number;
}

export interface Line {
    A: number;
    B: number;
    C: number;
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
    // 數學常數
    export const VALID_ROTATE_ANGLES = [-90, 90, 180];
    export const VALID_ROTATE_ANGLES_HARD = [
        -150, -135, -120, -90, -60, -45, -30,
        30, 45, 60, 90, 120, 135, 150, 180
    ];

    // 難度選項
    export const OPTIONS_DIFFICULTY: Record<number, TransformOption[]> = {
        1: [
            { func: moveCoord, argGen: () => [randInt(-10, 10), randInt(-10, 10)] },
            { func: scaleCoord, argGen: () => [randInt(2, 5)] },
            { func: rotateCoord, argGen: () => [choice(getValidRotateAngles(1))] },
            { func: reflectByXAxis, argGen: null },
            { func: reflectByYAxis, argGen: null }
        ],
        2: [
            { func: moveCoord, argGen: () => [randInt(-30, 30), randInt(-30, 30)] },
            { func: scaleCoord, argGen: () => [randInt(2, 10)] },
            { func: rotateCoord, argGen: () => [choice(getValidRotateAngles(2))] },
            { func: reflectByXAxis, argGen: null },
            { func: reflectByYAxis, argGen: null }
        ],
        3: [
            { func: moveCoord, argGen: () => [randInt(-50, 50), randInt(-50, 50)] },
            { func: scaleCoord, argGen: () => [randInt(2, 20)] },
            { func: rotateCoord, argGen: () => [choice(getValidRotateAngles(2))] },
            { func: reflectByXAxis, argGen: null },
            { func: reflectByYAxis, argGen: null },
            { func: rotateCoordByPoint, argGen: () => [randInt(-10, 10), randInt(-10, 10), choice(getValidRotateAngles(1))] },
            { func: reflectBy45DegLine, argGen: null },
            { func: reflectBy135DegLine, argGen: null }
        ],
        4: [
            { func: moveCoord, argGen: () => [randInt(-60, 60), randInt(-60, 60)] },
            { func: scaleCoord, argGen: () => [randInt(-20, 20)] },
            { func: rotateCoord, argGen: () => [choice(getValidRotateAngles(2))] },
            { func: reflectByXAxis, argGen: null },
            { func: reflectByYAxis, argGen: null },
            { func: rotateCoordByPoint, argGen: () => [randInt(-10, 10), randInt(-10, 10), choice(getValidRotateAngles(2))] },
            { func: reflectBy45DegLine, argGen: null },
            { func: reflectBy135DegLine, argGen: null },
            { func: reflectByLine, argGen: () => [randInt(-10, 10), randInt(-10, 10), randInt(-10, 10)] }
        ]
    };

    /**
     * 角度轉弧度
     */
    export function toRad(angle: number): number {
        return angle * Math.PI / 180;
    }

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
    export function moveCoord(x: number, y: number, dx: number, dy: number): TransformResult {
        return {
            x: x + dx,
            y: y + dy,
            description: `平移 (${dx}, ${dy})`
        };
    }

    /**
     * 縮放變換
     */
    export function scaleCoord(x: number, y: number, scale: number): TransformResult {
        return {
            x: x * scale,
            y: y * scale,
            description: `縮放 ${scale}x`
        };
    }

    /**
     * 旋轉變換（繞原點）
     */
    export function rotateCoord(x: number, y: number, angle: number): TransformResult {
        const rad = toRad(angle);
        const newX = Math.cos(rad) * x - Math.sin(rad) * y;
        const newY = Math.sin(rad) * x + Math.cos(rad) * y;
        return {
            x: newX,
            y: newY,
            description: `旋轉 ${angle}°`
        };
    }

    /**
     * X 軸反射
     */
    export function reflectByXAxis(x: number, y: number): TransformResult {
        return {
            x: x,
            y: -y,
            description: `X 軸反射`
        };
    }

    /**
     * Y 軸反射
     */
    export function reflectByYAxis(x: number, y: number): TransformResult {
        return {
            x: -x,
            y: y,
            description: `Y 軸反射`
        };
    }

    /**
     * 繞點旋轉
     */
    export function rotateCoordByPoint(
        x: number,
        y: number,
        pointX: number,
        pointY: number,
        angle: number
    ): TransformResult {
        const rad = toRad(angle);
        const newX = (x - pointX) * Math.cos(rad) - (y - pointY) * Math.sin(rad) + pointX;
        const newY = (x - pointX) * Math.sin(rad) + (y - pointY) * Math.cos(rad) + pointY;
        return {
            x: newX,
            y: newY,
            description: `繞 (${pointX}, ${pointY}) 旋轉 ${angle}°`
        };
    }

    /**
     * y=x 直線反射
     */
    export function reflectBy45DegLine(x: number, y: number): TransformResult {
        return {
            x: y,
            y: x,
            description: `y=x 直線反射`
        };
    }

    /**
     * y=-x 直線反射
     */
    export function reflectBy135DegLine(x: number, y: number): TransformResult {
        return {
            x: -y,
            y: -x,
            description: `y=-x 直線反射`
        };
    }

    /**
     * 一般直線反射
     */
    export function reflectByLine(
        x: number,
        y: number,
        A: number,
        B: number,
        C: number
    ): TransformResult {
        if (A === 0 && B === 0) {
            return {
                x: x,
                y: y,
                description: `無效直線（无反射）`
            };
        }

        const sqHypot = A ** 2 + B ** 2;
        const coordSubs = A * x + B * y + C;
        const newX = x - 2 * A * coordSubs / sqHypot;
        const newY = y - 2 * B * coordSubs / sqHypot;

        return {
            x: newX,
            y: newY,
            description: `${A}x+${B}y+${C}=0 反射`
        };
    }

    /**
     * 獲取有效旋轉角度列表
     */
    function getValidRotateAngles(difficulty: number = 1): number[] {
        return difficulty >= 2 ? VALID_ROTATE_ANGLES_HARD : VALID_ROTATE_ANGLES;
    }
}
