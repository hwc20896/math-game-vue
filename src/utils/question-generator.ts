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

        return TransformUtils.moveCoord(
            current,
            Point.randomRange(RANGE, -RANGE)
        )
    }

    export function genScaleCoordinate(current: Point, difficulty: number): TransformResult{
        const RANGE = detail_constant.ScaleCoordinateParam[difficulty]

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

        const PARAM = detail_constant.RotateCoordinateByPointParam[difficulty]

        return TransformUtils.rotateCoordByPoint(
            current,
            Point.randomRange(PARAM.origin_range, -PARAM.origin_range),
            TransformUtils.choice(PARAM.angle_list)
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