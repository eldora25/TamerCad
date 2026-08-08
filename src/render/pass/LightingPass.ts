import { RenderPass } from "./RenderPass";

import { RenderContext } from "../RenderContext";
import { RenderScene } from "../RenderScene";
import { RenderCamera } from "../RenderCamera";

import { GBuffer } from "../postprocess/GBuffer";

import { EnvironmentMap } from "../postprocess/EnvironmentMap";

import { ReflectionProbeBuffer } from "../postprocess/ReflectionProbeBuffer";

import { SSRComposite } from "../postprocess/SSRComposite";

import { MeshRenderer } from "../renderer/MeshRenderer";

import { Light } from "../light/Light";



export interface LightingPassOptions {

    renderer?: MeshRenderer;

    gBuffer?: GBuffer;

    environment?: EnvironmentMap;

    reflectionProbe?: ReflectionProbeBuffer;

    ssrComposite?: SSRComposite;

}



export class LightingPass extends RenderPass {

    private renderer:

        MeshRenderer | null = null;

    private gBuffer:

        GBuffer | null = null;

    private environment:

        EnvironmentMap | null = null;

    private reflectionProbe:

        ReflectionProbeBuffer | null = null;

    private ssrComposite:

        SSRComposite | null = null;

    constructor(

        options:

            LightingPassOptions = {}

    ) {

        super({

            name: "LightingPass",

            priority: 200

        });

        this.renderer =

            options.renderer ?? null;

        this.gBuffer =

            options.gBuffer ?? null;

        this.environment =

            options.environment ?? null;

        this.reflectionProbe =

            options.reflectionProbe ?? null;

        this.ssrComposite =

            options.ssrComposite ?? null;

    }

    public setRenderer(

        renderer:

            MeshRenderer

    ): void {

        this.renderer =

            renderer;

    }

    public setGBuffer(

        gbuffer:

            GBuffer

    ): void {

        this.gBuffer =

            gbuffer;

    }

    public setEnvironmentMap(

        map:

            EnvironmentMap

    ): void {

        this.environment =

            map;

    }

    public setReflectionProbe(

        probe:

            ReflectionProbeBuffer

    ): void {

        this.reflectionProbe =

            probe;

    }

    public setSSRComposite(

        composite:

            SSRComposite

    ): void {

        this.ssrComposite =

            composite;

    }

    protected execute(

        context:

            RenderContext,

        scene:

            RenderScene,

        camera:

            RenderCamera

    ): void {

        if (

            !this.gBuffer

        ) {

            return;

        }

        this.bindInputs();

        this.renderLights(

            context,

            scene,

            camera

        );

        this.renderEnvironment();

        this.renderReflections();

    }

    private bindInputs(): void {

        this.gBuffer?.bind();

    }

    private renderLights(

        context:

            RenderContext,

        scene:

            RenderScene,

        camera:

            RenderCamera

    ): void {

        const lights:

            Light[] =

            scene.getLights

                ? scene.getLights()

                : [];

        for (

            const light of

            lights

        ) {

            this.renderer?.renderLight?.(

                context,

                light,

                camera

            );

        }

    }

    private renderEnvironment(): void {

        if (

            !this.environment

        ) {

            return;

        }

        this.environment.bind?.();

    }

    private renderReflections(): void {

        if (

            !this.ssrComposite

        ) {

            return;

        }

        this.ssrComposite.debugInfo();

    }

    public debugInfo() {

        return {

            type:

                "LightingPass",

            hasGBuffer:

                this.gBuffer !== null,

            hasEnvironment:

                this.environment !== null,

            hasReflectionProbe:

                this.reflectionProbe !== null,

            hasSSRComposite:

                this.ssrComposite !== null

        };

    }

}