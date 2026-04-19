import {type TutorialData, TransformResult} from "@/utils/transform-utils.ts";
import {Line, Point} from "@/utils/point.ts";
import Generator from "./question-generator.ts"

interface Lesson {
    id: string
    title: string
    icon: string
    description: string
    level: 'basic' | 'advanced' | 'expert'
}

interface Difficulty {
    label: string
    color: string,
    color_class: string
    text_color: string
    gradient_color: {
        from: string
        to: string
    }
}

type QuestionGeneratorType = (point: Point, difficulty: number) => TransformResult;

// 難度選項
export const OPTIONS_DIFFICULTY: Record<number, QuestionGeneratorType[]> = {
    1: [
        Generator.genMoveCoordinate,
        Generator.genScaleCoordinate,
        Generator.genRotateCoordinate,
        Generator.genReflectXAxisCoordinate,
        Generator.genReflectYAxisCoordinate
    ],
    2: [
        Generator.genMoveCoordinate,
        Generator.genScaleCoordinate,
        Generator.genRotateCoordinate,
        Generator.genReflectXAxisCoordinate,
        Generator.genReflectYAxisCoordinate
    ],
    3: [
        Generator.genMoveCoordinate,
        Generator.genScaleCoordinate,
        Generator.genRotateCoordinate,
        Generator.genReflectXAxisCoordinate,
        Generator.genReflectYAxisCoordinate,
        Generator.genReflect135DegLineCoordinate,
        Generator.genReflect45DegLineCoordinate,
        Generator.genRotateCoordinateByPoint
    ],
    4: [
        Generator.genMoveCoordinate,
        Generator.genScaleCoordinate,
        Generator.genRotateCoordinate,
        Generator.genReflectXAxisCoordinate,
        Generator.genReflectYAxisCoordinate,
        Generator.genReflect135DegLineCoordinate,
        Generator.genReflect45DegLineCoordinate,
        Generator.genRotateCoordinateByPoint,
        Generator.genReflectByLineCoordinate
    ]
}

export const TUTORIAL_DATA: Record<string, TutorialData> = {
    move: {
        title: "📍 平移 (Translation)",
        explanation: `平移是將一個點沿著固定方向移動固定距離。<br>如果我們平移 (Δx, Δy)，每個點 (x, y) 會移動到 (x+Δx, y+Δy)。<br><br>想像成在坐標平面上滑動這個點，不旋轉也不翻轉它。`,
        formula: `(x, y) → (x + dx, y + dy)<br><br>範例：平移 (3, -2)<br>(5, 4) → (5+3, 4-2) = (8, 2)`,
        example: `<div class="example-step">從點 $(2, 3)$ 開始平移 $(4, -1)$：</div>
                  <div class="example-step"><strong>步驟 1：</strong> $x' = 2 + 4 = 6$<strong></div>
                  <div class="example-step"><strong>步驟 2：</strong> $y' = 3 + (-1) = 2$</div>
                  <div class="example-step"><strong>結果：</strong> $(x', y')=\\boxed{(6, 2)}$</div>`,
        practice: {
            question: "將點 (3, 5) 平移 (2, -3)。新的坐標是什麼？",
            answer: new Point(5, 2)
        },
        demo: {
            type: 'move',
            text: "從 (2, 2) 平移 (3, 2)",
            start: new Point(2, 2),
            params: [new Point(3, 2)],
            gridRange: 10
        }
    },
    scale: {
        title: "📏 縮放 (Scaling)",
        explanation: `縮放是將坐標乘以一個比例係數來放大或縮小。大於 1 的係數會放大，介於 0 和 1 之間的係數會縮小。<br><br>負的比例係數也會將點沿原點反射。`,
        formula: `(x, y) → (x × k, y × k)<br><br>範例：放大 2 倍<br>(3, 4) → (3×2, 4×2) = (6, 8)`,
        example: `<div class="example-step">從點 $(4, 3)$ 開始放大到原來的 $3$ 倍：</div>
                  <div class="example-step"><strong>步驟 1：</strong> 對 $x$、$y$ 值分別應用比例係數 $3$</div>
                  <div class="example-step"><strong>步驟 2：</strong> $x' = 4 \\times 3 = 12$</div>
                  <div class="example-step"><strong>步驟 3：</strong> $y' = 3 \\times 3 = 9$</div>
                  <div class="example-step"><strong>結果：</strong> $(x', y')=\\boxed{(12, 9)}$</div>`,
        practice: {
            question: "將點 (5, 2) 放大至原來的 4 倍。新的坐標是什麼？",
            answer: new Point(20, 8)
        },
        demo: {
            type: 'scale',
            text: "從 (2, 1.5) 放大 2 倍",
            start: new Point(2, 1.5),
            params: [2],
            gridRange: 10
        }
    },
    rotate: {
        title: "🔄 旋轉 (Rotation)",
        explanation: `旋轉是將一個點繞原點 (0, 0) 旋轉特定角度。正角度表示逆時針旋轉，負角度表示順時針旋轉。<br><br>旋轉使用三角函數來計算新位置。`,
        formula: `(x, y) → (x·cos(θ) - y·sin(θ), x·sin(θ) + y·cos(θ))<br><br>特殊角度：<br>• 90°: (x, y) → (-y, x)<br>• 180°: (x, y) → (-x, -y)<br>• -90°: (x, y) → (y, -x)`,
        example: `<div class="example-step">將 $(3, 4)$ 旋轉 $90^\\circ$：</div>
                  <div class="example-step"><strong>步驟 1：</strong> 對於 $90^\\circ$ : $(x', y') = (-y, x)$</div>
                  <div class="example-step"><strong>步驟 2：</strong> $x' = -4$</div>
                  <div class="example-step"><strong>步驟 3：</strong> $y' = 3$</div>
                  <div class="example-step"><strong>結果：</strong> $(x', y')=\\boxed{(-4, 3)}$</div>`,
        practice: {
            question: "將點 (4, 3) 逆時針旋轉 90°。新的坐標是什麼？",
            answer: new Point(-3, 4)
        },
        demo: {
            type: 'rotate',
            text: "將 (3, 0) 逆時針旋轉 90°",
            start: new Point(3, 0),
            params: [90],
            gridRange: 5
        }
    },
    reflect_x: {
        title: "🪞 X 軸反射",
        explanation: `X 軸反射是將點垂直翻轉。X 坐標保持不變，Y 坐標變成它的相反數。<br><br>想像 X 軸是一面鏡子 - 點反射到另一側。`,
        formula: `(x, y) → (x, -y)<br><br>範例：反射 (3, 5)<br>(3, 5) → (3, -5)`,
        example: `<div class="example-step">點 $(2, 4)$ 以 $x$ 軸反射：</div>
                  <div class="example-step"><strong>步驟 1：</strong> 保持 $x$ 不變：$x' = 2$</div>
                  <div class="example-step"><strong>步驟 2：</strong> 將 $y$ 取反：$y = -(4) = -4$</div>
                  <div class="example-step"><strong>結果：</strong> $(x',y')=\\boxed{(2, -4)}$</div>`,
        practice: {
            question: "將點 (-3, 5) 沿 X 軸反射。新的坐標是什麼？",
            answer: new Point(-3, -5)
        },
        demo: {
            type: 'reflect',
            text: "將 (3, 2) 沿 x 軸反射",
            start: new Point(3, 2),
            params: ['x'],
            gridRange: 5
        }
    },
    reflect_y: {
        title: "🪞 Y 軸反射",
        explanation: `Y 軸反射是將點水平翻轉。Y 坐標保持不變，X 坐標變成它的相反數。<br><br>想像 Y 軸是一面鏡子 - 點反射到另一側。`,
        formula: `(x, y) → (-x, y)<br><br>範例：反射 (3, 5)<br>(3, 5) → (-3, 5)`,
        example: `<div class="example-step">點 $(3, 4)$ 以 $y$ 軸反射：</div>
                  <div class="example-step"><strong>步驟 1：</strong> 將 $x$ 取反：$x' = -3$</div>
                  <div class="example-step"><strong>步驟 2：</strong> 保持 $y$ 不變：$y' = 4$</div>
                  <div class="example-step"><strong>結果：</strong> $(x',y')=\\boxed{(-3, 4)}$</div>`,
        practice: {
            question: "將點 (4, -2) 沿 Y 軸反射。新的坐標是什麼？",
            answer: new Point(-4, -2)
        },
        demo: {
            type: 'reflect',
            text: "將 (2, 3) 沿 y 軸反射",
            start: new Point(2, 3),
            params: ['y'],
            gridRange: 5
        }
    },
    rotate_point: {
        title: "🎯 繞任意點旋轉",
        explanation: `這是繞任意點（不一定是原點）旋轉。過程包括：<br>1. 平移使中心點移動到原點<br>2. 繞原點旋轉<br>3. 平移回來<br><br>這比較複雜但非常強大！`,
        formula: `(x, y) → ((x-x₀)·cos(θ) - (y-y₀)·sin(θ) + x₀, (x-x₀)·sin(θ) + (y-y₀)·cos(θ) + y₀)<br><br>其中 (x₀, y₀) 是旋轉中心`,
        example: `<div class="example-step">將 $(5, 3)$ 繞 $(2, 1)$ 旋轉 $90^\\circ$：</div>
                  <div class="example-step"><strong>步驟 1：</strong> 平移：$(5-2, 3-1) = (3, 2)$</div>
                  <div class="example-step"><strong>步驟 2：</strong> 旋轉 90°: $(-2, 3)$</div>
                  <div class="example-step"><strong>步驟 3：</strong> 平移回來：$(-2+2, 3+1) = (0, 4)$</div>
                  <div class="example-step"><strong>結果：</strong> $(x', y')=\\boxed{(0, 4)}$</div>`,
        practice: {
            question: "將點 (4, 2) 繞 (1, 1) 旋轉 90°。新的坐標是什麼？",
            answer: new Point(0, 4)
        },
        demo: {
            type: 'rotate_point',
            text: "將 (3, 2) 繞 (1, 1) 逆時針旋轉 120°",
            start: new Point(3, 2) ,
            params: [new Point(1, 1), 120],
            gridRange: 5
        }
    },
    reflect_45: {
        title: "📐 y=x 直線反射",
        explanation: `沿 y=x 直線反射會交換 x 和 y 坐標。這條線以 45° 角穿過原點。<br><br>這個變換就像交換 x 和 y 的角色！`,
        formula: `(x, y) → (y, x)<br><br>範例：反射 (3, 5)<br>(3, 5) → (5, 3)`,
        example: `<div class="example-step">點 $(2, 7)$ 沿直線 $y=x$ 反射：</div>
                  <div class="example-step"><strong>步驟 1：</strong> 交換 $x$ 和 $y$</div>
                  <div class="example-step"><strong>步驟 2：</strong> $x' = 7$, $y' = 2$</div>
                  <div class="example-step"><strong>結果：</strong> $(x', y')=\\boxed{(7, 2)}$</div>`,
        practice: {
            question: "將點 (5, -3) 沿直線 y=x 反射。新的坐標是什麼？",
            answer: new Point(-3, 5)
        },
        demo: {
            type: 'reflect_line',
            text: "將 (3, 1) 沿 y=x 反射",
            start: new Point(3, 1),
            params: [new Line(1, -1, 0)],
            gridRange: 5
        }
    },
    reflect_135: {
        title: "📐 y=-x 直線反射",
        explanation: `沿 y=-x 直線反射會將兩個坐標取反並交換。這條線以 135° 角（或 -45°）延伸。<br><br>這就像先沿 y=x 反射，再將兩個坐標取反！`,
        formula: `(x, y) → (-y, -x)<br><br>範例：反射 (3, 5)<br>(3, 5) → (-5, -3)`,
        example: `<div class="example-step">點 $(4, -2)$ 沿直線 $y=-x$ 反射：</div>
                  <div class="example-step"><strong>步驟 1：</strong> 交換並取反</div>
                  <div class="example-step"><strong>步驟 2：</strong> $x' = -(-2) = 2$</div>
                  <div class="example-step"><strong>步驟 3：</strong> $y' = -4$</div>
                  <div class="example-step"><strong>結果：</strong> $(x', y')=\\boxed{(2, -4)}$</div>`,
        practice: {
            question: "將點 (-3, 4) 沿直線 y=-x 反射。新的坐標是什麼？",
            answer: new Point(4, -3)
        },
        demo: {
            type: 'reflect_line',
            text: "將 (2, 3) 沿 y=-x 反射",
            start: new Point(2, 3) ,
            params: [new Line(1, 1, 0)],
            gridRange: 5
        }
    },
    reflect_line: {
        title: "✏️ 一般直線反射",
        explanation: `這是將點沿任何由方程式 Ax + By + C = 0 給出的直線反射。這是最一般的反射形式。<br><br>公式使用點到直線的垂直距離。`,
        formula: `對於直線 Ax+By+C=0:<br>x' = x - 2A(Ax+By+C)/(A²+B²)<br>y' = y - 2B(Ax+By+C)/(A²+B²)<br><br>這看起來複雜但處理所有直線反射！`,
        example: `<div class="example-step">將 $(2, 3)$ 沿直線 $x+y-1=0$ 反射：</div>
                  <div class="example-step"><strong>步驟 2：</strong> 對比係數得 $A=1, B=1, C=-1$</div>
                  <div class="example-step"><strong>步驟 3：</strong> 計算 $Ax_0+By_0+C$ ： $2+3-1 = 4$</div>
                  <div class="example-step"><strong>步驟 4：</strong> $A^2+B^2=1+1=2$</div>
                  <div class="example-step"><strong>步驟 5：</strong> $x' = 2 - 2(1)\\frac{4}{2} = -2$</div>
                  <div class="example-step"><strong>步驟 6：</strong> $y' = 3 - 2(1)\\frac{4}{2} = -1$</div>
                  <div class="example-step"><strong>結果：</strong> $(x',y')=\\boxed{(-2, -1)}$</div>`,
        practice: {
            question: "將點 (1, 1) 沿直線 x+y=0（即 x+y+0=0）反射。新的坐標是什麼？",
            answer: new Point(-1, -1)
        },
        demo: {
            type: 'reflect_line',
            text: "將 (2, 1) 沿 4x-2y-1=0 反射",
            start: new Point(2, 1),
            params: [new Line(4, -2, -1)],
            gridRange: 5
        }
    }
}

export const latexFormulas: Record<string, string> = {
    move: '\\begin{pmatrix}x\'\\\\y\'\\end{pmatrix}=\\begin{pmatrix}x+\\Delta x\\\\y+\\Delta y\\end{pmatrix}',
    scale: '\\begin{pmatrix}x\'\\\\y\'\\end{pmatrix}=k\\begin{pmatrix}x\\\\y\\end{pmatrix}=\\begin{pmatrix}kx\\\\ky\\end{pmatrix}',
    rotate: '\\text{通式：}\\begin{pmatrix}x\'\\\\y\'\\end{pmatrix}=\\begin{pmatrix}\\cos\\theta&-\\sin\\theta\\\\\\sin\\theta&\\cos\\theta\\end{pmatrix}\\begin{pmatrix}x\\\\y\\end{pmatrix}=\\begin{pmatrix}x\\cos\\theta-y\\sin\\theta\\\\x\\sin\\theta+y\\cos\\theta\\end{pmatrix}\\newline\\newline\\text{特殊角：}\\newline90°:\\begin{pmatrix}x\\\\y\\end{pmatrix}=\\begin{pmatrix}-y\\\\x\\end{pmatrix},\\quad180°:\\begin{pmatrix}x\\\\y\\end{pmatrix}=\\begin{pmatrix}-x\\\\-y\\end{pmatrix},\\quad-90°:\\begin{pmatrix}x\\\\y\\end{pmatrix}=\\begin{pmatrix}y\\\\-x\\end{pmatrix}',
    reflect_x: '\\begin{pmatrix}x\'\\\\y\'\\end{pmatrix}=\\begin{pmatrix}0&-1\\\\1&0\\end{pmatrix}\\begin{pmatrix}x\\\\y\\end{pmatrix}=\\begin{pmatrix}x\\\\-y\\end{pmatrix}',
    reflect_y: '\\begin{pmatrix}x\'\\\\y\'\\end{pmatrix}=\\begin{pmatrix}0&1\\\\-1&0\\end{pmatrix}\\begin{pmatrix}x\\\\y\\end{pmatrix}=\\begin{pmatrix}-x\\\\y\\end{pmatrix}',
    rotate_point: '\\text{通式：}\\begin{pmatrix}x\'\\\\y\'\\end{pmatrix}=\\begin{pmatrix}\\cos\\theta&-\\sin\\theta\\\\\\sin\\theta&\\cos\\theta\\end{pmatrix}\\begin{pmatrix}x-x_0\\\\y-y_0\\end{pmatrix}+\\begin{pmatrix}x_0\\\\y_0\\end{pmatrix}',
    reflect_45: '\\begin{pmatrix}x\'\\\\y\'\\end{pmatrix}=\\begin{pmatrix}y\\\\x\\end{pmatrix}',
    reflect_135: '\\begin{pmatrix}x\'\\\\y\'\\end{pmatrix}=\\begin{pmatrix}-y\\\\-x\\end{pmatrix}',
    reflect_line: '\\begin{pmatrix}x\'\\\\y\'\\end{pmatrix}=\\begin{pmatrix}x-2Au\\\\y-2Bu\\end{pmatrix},\\text{其中}u=\\frac{Ax_0+By_0+C}{A^2+B^2}'
}


export const lessons: Lesson[] = [
    { id: 'move', title: '平移 (Translation)', icon: '↔️', description: '將坐標移動 (Δx, Δy)', level: 'basic' },
    { id: 'scale', title: '縮放 (Scaling)', icon: '📏', description: '放大或縮小坐標', level: 'basic' },
    { id: 'rotate', title: '旋轉 (Rotation)', icon: '🔄', description: '繞原點旋轉', level: 'basic' },
    { id: 'reflect_x', title: 'X 軸反射', icon: '🪞', description: '沿 X 軸翻轉', level: 'basic' },
    { id: 'reflect_y', title: 'Y 軸反射', icon: '🪞', description: '沿 Y 軸翻轉', level: 'basic' },
    { id: 'rotate_point', title: '繞點旋轉', icon: '🎯', description: '繞任意點旋轉', level: 'advanced' },
    { id: 'reflect_45', title: 'y=x 直線反射', icon: '📐', description: '沿對角線反射', level: 'advanced' },
    { id: 'reflect_135', title: 'y=-x 直線反射', icon: '📐', description: '沿反對角線反射', level: 'advanced' },
    { id: 'reflect_line', title: '一般直線反射', icon: '✏️', description: '沿 Ax+By+C=0 反射', level: 'expert' }
]

export const difficultyLevel: Record<number, Difficulty> = {
    1: {
        label: '基礎 (Basic)',
        color: '#bdf1d3',
        color_class: 'btn-normal',
        text_color: '#111',
        gradient_color: {
            from: "#C3E2C6 0%",
            to: "#D5E9C0 100%"
        }
    },
    2: {
        label: '進階 (Advanced)',
        color: '#f3cfa8',
        color_class: 'btn-hard',
        text_color: '#111',
        gradient_color: {
            from: "#FFF3E0 0%",
            to: "#FFE6C7 100%"
        }
    },
    3: {
        label: '困難 (Difficult)',
        color: '#f4a9a9',
        color_class: 'btn-hell',
        text_color: '#111',
        gradient_color: {
            from: "#FFE3E3 0%",
            to: "#FFC9C9 100%"
        }
    },
    4: {
        label: '地獄 (Hell)',
        color: '#a38e88',
        color_class: 'btn-extreme',
        text_color: "#fff",
        gradient_color: {
            from: "#3B1E1E 0%",
            to: "#1A0E0E 100%"
        }
    }
}