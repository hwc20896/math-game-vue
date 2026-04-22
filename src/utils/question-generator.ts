import {Point, Line} from '@/utils/point.ts'
import {
    TransformResult,
    TransformUtils,
    VALID_ROTATE_ANGLES,
    VALID_ROTATE_ANGLES_ALL
} from "@/utils/transform-utils.ts";

namespace detail_constant{
    export const MoveCoordinateParam: Record<number, number> = {  /* |range| < clamp */
        1: 10,
        2: 20,
        3: 40,
        4: 60
    }

    export const ScaleCoordinateParam: Record<number, {min: number, max: number}> = {
        1: {min: 2, max: 3},
        2: {min: 2, max: 5},
        3: {min: 2, max: 10},
        4: {min: -15, max: 15}
    }

    export const RotateCoordinateParam: Record<number, number[]> = {
        1: VALID_ROTATE_ANGLES,
        2: VALID_ROTATE_ANGLES_ALL,
        3: VALID_ROTATE_ANGLES_ALL,
        4: VALID_ROTATE_ANGLES_ALL
    }

    //  ONLY APPEARS IN DIFFICULTY 3 AND 4
    export const RotateCoordinateByPointParam: Record<number, {origin_range: number, angle_list: number[]}> = {
        3: {origin_range: 5, angle_list: VALID_ROTATE_ANGLES},
        4: {origin_range: 10, angle_list: VALID_ROTATE_ANGLES_ALL}
    }

    //  ONLY APPEARS IN DIFFICULTY 4
    export const ReflectByLineParam: Record<number, number> = {
        4: 8
    }
}

namespace QuestionGenerator{
    export function genMoveCoordinate(current: Point, difficulty: number): TransformResult{
        const RANGE = detail_constant.MoveCoordinateParam[difficulty]

        let move: Point

        /*  Chance of getting a move (0,0):
         *  - Lvl 1: 0.82%
         *  - Lvl 2: 0.23%
         *  - Lvl 3: 0.06%
         *  - Lvl 4: 0.03%
         */
        do{
            move = Point.randomRange(RANGE, -RANGE)
        } while (move.equals(Point.GLOBAL_ORIGIN))

        return TransformUtils.moveCoord(
            current,
            move
        )
    }

    export function genScaleCoordinate(current: Point, difficulty: number): TransformResult{
        const RANGE = detail_constant.ScaleCoordinateParam[difficulty]

        /*  Chance of getting a scale 0 (paradise) / 1 (not move at all) / -1(identical to rotate 180°):
         *  - Lvl 1, 2, 3: 0%    (not in a valid range)
         *  - Lvl 4:       9.68%
         */
        let scale: number
        do {
            scale = TransformUtils.randInt(RANGE.min, RANGE.max)
        } while ([-1, 0, 1].includes(scale))

        return TransformUtils.scaleCoord(
            current,
            scale
        )
    }

    export function genRotateCoordinate(current: Point, difficulty: number): TransformResult{
        const ANGLE_LIST = detail_constant.RotateCoordinateParam[difficulty]

        //  Does not break at all, as rotating 0° isn't even in the list
        return TransformUtils.rotateCoord(
            current,
            TransformUtils.choice(ANGLE_LIST)
        )
    }

    export function genReflectXAxisCoordinate(current: Point, _difficulty?: number): TransformResult{
        //  Breaks if current point is on x-axis (having y=0) but, there's nothing I can do.
        return TransformUtils.reflectByXAxis(current)
    }

    export function genReflectYAxisCoordinate(current: Point, _difficulty?: number): TransformResult{
        //  Breaks if current point is on y-axis (having x=0) but, there's nothing I can do.
        return TransformUtils.reflectByYAxis(current)
    }

    export function genReflect45DegLineCoordinate(current: Point, _difficulty?: number): TransformResult{
        //  Breaks if current point is on y=x but, there's nothing I can do.
        return TransformUtils.reflectBy45DegLine(current)
    }

    export function genReflect135DegLineCoordinate(current: Point, _difficulty?: number): TransformResult{
        //  Breaks if current point is on y=-x but, there's nothing I can do.
        return TransformUtils.reflectBy135DegLine(current)
    }

    export function genRotateCoordinateByPoint(current: Point, difficulty: number): TransformResult{
        if (difficulty < 3)
            return genRotateCoordinate(current, difficulty)

        const PARAM = detail_constant.RotateCoordinateByPointParam[difficulty]

        let origin: Point

        /* Chance of getting origin (0,0):
         * - Lvl 3: 0.82%
         * - Lvl 4: 0.23%
         */
        do {
            origin = Point.randomRange(PARAM.origin_range, -PARAM.origin_range)
        } while (origin.equals(current) || origin.equals(Point.GLOBAL_ORIGIN))

        return TransformUtils.rotateCoordByPoint(
            current,
            origin,
            TransformUtils.choice(PARAM.angle_list)
        )
    }

    export function genReflectByLineCoordinate(current: Point, difficulty: number): TransformResult{
        const RANGE = detail_constant.ReflectByLineParam[difficulty]

        let line: Line

        /* Chances of getting an invalid or overlapping line
        *  (!line.isvalid OR C=0 with either A=0 or B=0)
        *  - Lvl 4: 1.00%
        * */
        do {
            line = Line.randomRange(RANGE, -RANGE)
        } while (
            !line.isValid ||
            (line.C == 0 && (line.A == 0 || line.B == 0))  //  overlaps with x=0 or y=0
        )

        return TransformUtils.reflectByLine(
            current,
            line
        )
    }
}

export default QuestionGenerator;