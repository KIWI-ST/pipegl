import { mat4, vec3 } from 'wgpu-matrix';
import { cubeElements, cubePositions, cubeUvs } from "../util/createCube";
import { IPerformance, PipeGL, TAttribute, TUniform } from "../../src";

interface Attribute extends TAttribute {
    position: number[][];   //顶点坐标
    uv: number[][];          //纹理坐标
}

interface Uniform extends TUniform {
    projection: number[];                                                //投影矩阵
    view: number[];                                                    //世界矩阵（摄像头方向）
    model: { (performance: IPerformance, batchId: number): number[] };  //模型矩阵
}

const RADIUS: number = 700;

const CAMERAPOSITION = [0, 0, 5];

const ProjectionMatrix = mat4.perspective(Math.PI / 4, RADIUS / RADIUS, 0.01, 100);
const ViewMatrix = mat4.lookAt(
    vec3.create(CAMERAPOSITION[0], CAMERAPOSITION[1], CAMERAPOSITION[2]),
    vec3.create(0, 0.0, 0),
    vec3.create(0, 1, 0)
);
const ViewMatrixInvert = mat4.invert(ViewMatrix);
let ModelMatrix = mat4.identity();

const pipegl0 = new PipeGL({
    width: RADIUS,
    height: RADIUS
});

const draw0 = pipegl0.compile<Attribute, Uniform>({

    vert: `precision mediump float;

    attribute vec3 position;
    attribute vec2 uv;

    uniform mat4 projection,view ,model;

    varying vec2 vUv;


    void main(){
        vUv = uv;
        gl_Position = projection*view*model*vec4(position, 1.0);
    }
    `,

    frag: `precision mediump float;

    varying vec2 vUv;

    void main(){
        gl_FragColor = vec4(abs(vUv),0,1.0);
    }
    `,

    attributes: {
        position: cubePositions,
        uv: cubeUvs
    },

    uniforms: {
        projection: [...ProjectionMatrix],
        view: [...ViewMatrix],
        model: (performance: IPerformance, batchId: number): number[] => {
            ModelMatrix = mat4.rotateY(ModelMatrix, 0.005);
            return [...ModelMatrix];
        },
    },

    elements: cubeElements
})

const anim = () => {
    draw0.draw();
    requestAnimationFrame(anim);
}

anim();