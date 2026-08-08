import { RenderPass } from "./RenderPass";

import { RenderContext } from "../RenderContext";
import { RenderScene } from "../RenderScene";
import { RenderCamera } from "../RenderCamera";

import { SSRBuffer } from "../postprocess/SSRBuffer";

import { SSRTrace } from "../postprocess/SSRTrace";
import { SSRResolve } from "../postprocess/SSRResolve";
import { SSRTemporalFilter } from "../postprocess/SSRTemporalFilter";
import { SSRDenoise } from "../postprocess/SSRDenoise";
import { SSRComposite } from "../postprocess/SSRComposite";

export interface SSRPassOptions {

    buffer?: SSRBuffer;

}

export class SSRPass extends RenderPass {

    private buffer: SSRBuffer | null = null;

    private readonly trace = new SSRTrace();

    private readonly resolve = new SSRResolve();

    private readonly temporal = new SSRTemporalFilter();

    private readonly denoise = new SSRDenoise();

    private readonly composite = new SSRComposite();

    public maxDistance = 100.0;

    public thickness = 0.15;

    public maxSteps = 64;

    constructor(
        options: SSRPassOptions = {}
    ) {

        super({

            name: "SSRPass",

            priority: 250

        });

        this.buffer = options.buffer ?? null;

    }

    setBuffer(
        buffer: SSRBuffer
    ): void {

        this.buffer = buffer;

    }

    protected override begin(
        context: RenderContext
    ): void {

        this.buffer?.bind();

        super.begin(context);

    }

    protected execute(

        context: RenderContext,

        scene: RenderScene,

        camera: RenderCamera

    ): void {

        this.trace.execute?.(

            context

        );

        this.resolve.execute?.(

            context

        );

        this.temporal.execute?.(

            context

        );

        this.denoise.execute?.(

            context

        );

        this.composite.execute?.(

            context

        );

    }

    protected override end(
        context: RenderContext
    ): void {

        this.buffer?.unbind();

    }

    resize(
        width: number,
        height: number
    ): void {

        this.buffer?.resize?.(

            width,

            height

        );

    }

    debugInfo() {

        return {

            type: "SSRPass",

            maxDistance: this.maxDistance,

            thickness: this.thickness,

            maxSteps: this.maxSteps

        };

    }

}