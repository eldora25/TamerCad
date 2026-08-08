import { DeferredRenderer } from "./renderer/DeferredRenderer";
import { RenderContext } from "./RenderContext";
import { RenderScene } from "./RenderScene";
import { RenderCamera } from "./RenderCamera";

import { RenderPass } from "./pass/RenderPass";
import { DepthPass } from "./pass/DepthPass";
import { GeometryPass } from "./pass/GeometryPass";
import { ShadowPass } from "./pass/ShadowPass";
import { LightingPass } from "./pass/LightingPass";

export interface RenderPipelineOptions {

    context: RenderContext;

    renderer?: DeferredRenderer;

}

export class RenderPipeline {

    private readonly context: RenderContext;

    private readonly renderer: DeferredRenderer;

    private initialized = false;

    constructor(
        options: RenderPipelineOptions
    ) {

        this.context = options.context;

        this.renderer =
            options.renderer ??
            new DeferredRenderer({

                context: this.context

            });

    }

    initialize(): void {

        if (this.initialized) {
            return;
        }

        this.build();

        this.renderer.initialize();

        this.initialized = true;

    }

    dispose(): void {

        this.renderer.dispose();

        this.initialized = false;

    }

    render(

        scene: RenderScene,

        camera: RenderCamera

    ): void {

        if (!this.initialized) {

            this.initialize();

        }

        this.renderer.render(

            scene,

            camera

        );

    }

    resize(

        width: number,

        height: number

    ): void {

        this.renderer.resize(

            width,

            height

        );

    }

    private build(): void {

        this.renderer.clearPasses();

        this.renderer.addPass(

            new DepthPass()

        );

        this.renderer.addPass(

            new GeometryPass()

        );

        this.renderer.addPass(

            new ShadowPass()

        );

        this.renderer.addPass(

            new LightingPass()

        );

    }

    addPass(

        pass: RenderPass

    ): void {

        this.renderer.addPass(

            pass

        );

    }

    getRenderer():

    DeferredRenderer {

        return this.renderer;

    }

    debugInfo() {

        return {

            type:

                "RenderPipeline",

            initialized:

                this.initialized,

            renderer:

                this.renderer.debugInfo()

        };

    }

}