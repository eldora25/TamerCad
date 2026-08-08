import { RenderPass } from "./RenderPass";

import { RenderContext } from "../RenderContext";
import { RenderScene } from "../RenderScene";
import { RenderCamera } from "../RenderCamera";

import { GBuffer } from "../postprocess/GBuffer";
import { SSAOBuffer } from "../postprocess/SSAOBuffer";

import { ShaderProgram } from "../shader/ShaderProgram";
import { RenderViewport } from "../RenderViewport";

export interface SSAOPassOptions {

    gBuffer?: GBuffer;

    output?: SSAOBuffer;

    shader?: ShaderProgram;

    viewport?: RenderViewport;

}

export class SSAOPass extends RenderPass {

    private gBuffer: GBuffer | null = null;

    private output: SSAOBuffer | null = null;

    private shader: ShaderProgram | null = null;

    private viewport: RenderViewport | null = null;

    public radius = 0.5;

    public bias = 0.025;

    public power = 1.5;

    constructor(
        options: SSAOPassOptions = {}
    ) {

        super({

            name: "SSAOPass",

            priority: 175

        });

        this.gBuffer = options.gBuffer ?? null;

        this.output = options.output ?? null;

        this.shader = options.shader ?? null;

        this.viewport = options.viewport ?? null;

    }

    public setGBuffer(
        buffer: GBuffer
    ): void {

        this.gBuffer = buffer;

    }

    public setOutput(
        buffer: SSAOBuffer
    ): void {

        this.output = buffer;

    }

    public setShader(
        shader: ShaderProgram
    ): void {

        this.shader = shader;

    }

    public setViewport(
        viewport: RenderViewport
    ): void {

        this.viewport = viewport;

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

            !this.gBuffer

        ) {

            return;

        }

        this.shader.bind();

        this.gBuffer.bind();

        this.shader.setUniform?.(

            "uRadius",

            this.radius

        );

        this.shader.setUniform?.(

            "uBias",

            this.bias

        );

        this.shader.setUniform?.(

            "uPower",

            this.power

        );

        context.drawFullscreenQuad?.();

    }

    protected override end(
        context: RenderContext
    ): void {

        this.output?.unbind();

    }

    public resize(

        width: number,

        height: number

    ): void {

        this.output?.resize?.(

            width,

            height

        );

    }

    public debugInfo() {

        return {

            type: "SSAOPass",

            radius: this.radius,

            bias: this.bias,

            power: this.power,

            hasShader:

                this.shader !== null,

            hasGBuffer:

                this.gBuffer !== null

        };

    }

}