import { RenderPass } from "./RenderPass";

import { RenderContext } from "../RenderContext";
import { RenderScene } from "../RenderScene";
import { RenderCamera } from "../RenderCamera";

import { SSAOBuffer } from "../postprocess/SSAOBuffer";
import { ShaderProgram } from "../shader/ShaderProgram";

export interface SSAOBlurPassOptions {

    input?: SSAOBuffer;

    output?: SSAOBuffer;

    shader?: ShaderProgram;

}

export class SSAOBlurPass extends RenderPass {

    private input: SSAOBuffer | null = null;

    private output: SSAOBuffer | null = null;

    private shader: ShaderProgram | null = null;

    constructor(
        options: SSAOBlurPassOptions = {}
    ) {

        super({

            name: "SSAOBlurPass",

            priority: 176

        });

        this.input = options.input ?? null;
        this.output = options.output ?? null;
        this.shader = options.shader ?? null;

    }

    setInput(
        buffer: SSAOBuffer
    ): void {

        this.input = buffer;

    }

    setOutput(
        buffer: SSAOBuffer
    ): void {

        this.output = buffer;

    }

    setShader(
        shader: ShaderProgram
    ): void {

        this.shader = shader;

    }

    protected override begin(
        context: RenderContext
    ): void {

        this.output?.bind();

        super.begin(context);

    }

    protected execute(

        context: RenderContext,

        scene: RenderScene,

        camera: RenderCamera

    ): void {

        if (

            !this.shader ||

            !this.input

        ) {

            return;

        }

        this.shader.bind();

        this.input.bind();

        context.drawFullscreenQuad?.();

    }

    protected override end(
        context: RenderContext
    ): void {

        this.output?.unbind();

    }

    resize(

        width: number,

        height: number

    ): void {

        this.output?.resize?.(

            width,

            height

        );

    }

    debugInfo() {

        return {

            type: "SSAOBlurPass",

            hasInput:

                this.input !== null,

            hasOutput:

                this.output !== null,

            hasShader:

                this.shader !== null

        };

    }

}