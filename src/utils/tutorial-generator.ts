import {Point, Line} from "@/utils/point.ts"
import {TransformUtils} from "@/utils/transform-utils.ts"
import {VALID_ROTATE_ANGLES, VALID_ROTATE_ANGLES_HARD} from "@/utils/transform-utils.ts";

export interface TutorialPracticeType{
    question: string;
    answer: Point;
}

export type TutorialPracticeGeneratorType = () => TutorialPracticeType;

namespace TutorialGenerator{
    export function genMoveCoordinate(): TutorialPracticeType{
        const start = Point.randomRange(10, -10)
        const delta= Point.randomRange(10, -10)

        return {
            question: `將點 ${start.toString()} 平移 ${delta.toString()}。`,
            answer: start.add(delta)
        }
    }

    export function genScaleCoordinate(): TutorialPracticeType{
        const start = Point.randomRange(10, -10)
        const scale = TransformUtils.randInt(2, 8)

        return {
            question: `將點 ${start.toString()} 縮放 ${scale.toString()} 倍。`,
            answer: start.scale(scale)
        }
    }

    export function genRotateCoordinate(): TutorialPracticeType{
        const start = Point.randomRange(10, -10)
        const angle = TransformUtils.choice(VALID_ROTATE_ANGLES)

        return {
            question: `將點 ${start.toString()} 旋轉 ${angle.toString()}° 。`,
            answer: start.rotate(TransformUtils.toRad(angle))
        }
    }

    export function genRotateCoordinateHard(): TutorialPracticeType{
        const start = Point.randomRange(10, -10)
        const angle = TransformUtils.choice(VALID_ROTATE_ANGLES_HARD)

        return {
            question: `將點 ${start.toString()} 旋轉 ${angle.toString()}° 。`,
            answer: start.rotate(TransformUtils.toRad(angle))
        }
    }

    export function genRotateByPointCoordinate(): TutorialPracticeType{
        const start = Point.randomRange(10, -10)
        const origin = Point.randomRange(10, -10)
        const angle = TransformUtils.choice(VALID_ROTATE_ANGLES)

        return {
            question: `將點 ${start.toString()} 旋轉 ${angle.toString()}° ，並以 ${origin.toString()} 作為旋轉中心。`,
            answer: start.rotate(TransformUtils.toRad(angle), origin)
        }
    }

    export function genReflectXAxisCoordinate(): TutorialPracticeType{
        const start = Point.randomRange(10, -10)

        return {
            question: `將點 ${start.toString()} 對 x 軸 反射。`,
            answer: start.reflect(new Line(1, 0, 0))
        }
    }

    export function genReflectYAxisCoordinate(): TutorialPracticeType{
        const start = Point.randomRange(10, -10)

        return {
            question: `將點 ${start.toString()} 對 y 軸 反射。`,
            answer: start.reflect(new Line(0, 1, 0))
        }
    }

    export function genReflect45DegLineCoordinate(): TutorialPracticeType{
        //  y = x
        const start = Point.randomRange(10, -10)

        return {
            question: `將點 ${start.toString()} 對直線 y = x 反射。`,
            answer: start.reflect(new Line(1, 1, 0))
        }
    }

    export function genReflect135DegLineCoordinate(): TutorialPracticeType{
        //  y = -x
        const start = Point.randomRange(10, -10)

        return {
            question: `將點 ${start.toString()} 對直線 y = -x 反射。`,
            answer: start.reflect(new Line(1, -1, 0))
        }
    }

    export function genReflectLineCoordinate(): TutorialPracticeType{
        const start = Point.randomRange(10, -10)
        let line: Line

        do {
            line = Line.randomRange(10, -10)
        } while (!line.isValid)

        return {
            question: `將點 ${start.toString()} 對直線 ${line.toString()} 反射。`,
            answer: start.reflect(line)
        }
    }
}

export default TutorialGenerator;