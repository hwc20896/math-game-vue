import {Point, Line} from '@/utils/point.ts'
import {
    TransformResult,
    TransformUtils,
    VALID_ROTATE_ANGLES,
    VALID_ROTATE_ANGLES_HARD
} from "@/utils/transform-utils.ts";

namespace detail_constant{
    export const MoveCoordinateParam: Record<number, number> = {  /* |range| < clamp */
        1: 10,
        2: 30,
        3: 50,
        4: 60
    }

    export const ScaleCoordinateParam: Record<number, {min: number, max: number}> = {
        1: {min: 2, max: 5},
        2: {min: 2, max: 10},
        3: {min: 2, max: 20},
        4: {min: -20, max: 20}
    }

    export const RotateCoordinateParam: Record<number, number[]> = {
        1: VALID_ROTATE_ANGLES,
        2: VALID_ROTATE_ANGLES_HARD,
        3: VALID_ROTATE_ANGLES_HARD,
        4: VALID_ROTATE_ANGLES_HARD
    }

    //  ONLY APPEARS IN DIFFICULTY 3 AND 4
    export const RotateCoordinateByPointParam: Record<number, {origin_range: number, angle_list: number[]}> = {
        3: {origin_range: 10, angle_list: VALID_ROTATE_ANGLES},
        4: {origin_range: 10, angle_list: VALID_ROTATE_ANGLES_HARD}
    }

    //  ONLY APPEARS IN DIFFICULTY 4
    export const ReflectByLineParam: Record<number, number> = {
        4: 10
    }
}

namespace QuestionGenerator{
    export function genMoveCoordinate(current: Point, difficulty: number): TransformResult{
        const RANGE = detail_constant.MoveCoordinateParam[difficulty]

        return TransformUtils.moveCoord(
            current,
            Point.randomRange(RANGE, -RANGE)
        )
    }

    export function genScaleCoordinate(current: Point, difficulty: number): TransformResult{
        const RANGE = detail_constant.ScaleCoordinateParam[difficulty]

        return TransformUtils.scaleCoord(
            current,
            TransformUtils.randInt(RANGE.min, RANGE.max)
        )
    }

    export function genRotateCoordinate(current: Point, difficulty: number): TransformResult{
        const ANGLE_LIST = detail_constant.RotateCoordinateParam[difficulty]

        return TransformUtils.rotateCoord(
            current,
            TransformUtils.choice(ANGLE_LIST)
        )
    }

    export function genReflectXAxisCoordinate(current: Point, _difficulty?: number): TransformResult{
        return TransformUtils.reflectByXAxis(current)
    }

    export function genReflectYAxisCoordinate(current: Point, _difficulty?: number): TransformResult{
        return TransformUtils.reflectByYAxis(current)
    }

    export function genReflect45DegLineCoordinate(current: Point, _difficulty?: number): TransformResult{
        return TransformUtils.reflectBy45DegLine(current)
    }

    export function genReflect135DegLineCoordinate(current: Point, _difficulty?: number): TransformResult{
        return TransformUtils.reflectBy135DegLine(current)
    }

    export function genRotateCoordinateByPoint(current: Point, difficulty: number): TransformResult{
        if (difficulty < 3)
            return genRotateCoordinate(current, difficulty)

        const RANGE = detail_constant.RotateCoordinateByPointParam[difficulty]

        return TransformUtils.rotateCoordByPoint(
            current,
            Point.randomRange(RANGE.origin_range, -RANGE.origin_range),
            TransformUtils.choice(RANGE.angle_list)
        )
    }

    export function genReflectByLineCoordinate(current: Point, difficulty: number): TransformResult{
        const RANGE = detail_constant.ReflectByLineParam[difficulty]

        return TransformUtils.reflectByLine(
            current,
            Line.randomRange(RANGE, -RANGE)
        )
    }
}

export default QuestionGenerator;