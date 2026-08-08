import { RenderPass } from "./RenderPass";

import { RenderContext } from "../RenderContext";
import { RenderScene } from "../RenderScene";
import { RenderCamera } from "../RenderCamera";

import { MeshRenderer } from "../renderer/MeshRenderer";

import { Light } from "../light/Light";
import { DirectionalLight } from "../light/DirectionalLight";
import { PointLight } from "../light/PointLight";
import { SpotLight } from "../light/SpotLight";

import { DirectionalShadow } from "../shadow/DirectionalShadow";
import { PointShadow } from "../shadow/PointShadow";
import { SpotShadow } from "../shadow/SpotShadow";



export interface ShadowPassOptions {

    renderer?: MeshRenderer;

}



export class ShadowPass extends RenderPass {

    private renderer:

        MeshRenderer | null = null;

    private directional:

        DirectionalShadow[] = [];

    private point:

        PointShadow[] = [];

    private spot:

        SpotShadow[] = [];



    constructor(

        options:

            ShadowPassOptions = {}

    ) {

        super({

            name: "ShadowPass",

            priority: 150,

            clearDepth: true

        });

        if (options.renderer) {
            this.renderer =
                options.renderer;
        }

    }



    public setRenderer(

        renderer:

            MeshRenderer

    ): void {

        this.renderer =
            renderer;

    }



    public addDirectionalShadow(

        shadow:

            DirectionalShadow

    ): void {

        this.directional.push(
            shadow
        );

    }



    public addPointShadow(

        shadow:

            PointShadow

    ): void {

        this.point.push(
            shadow
        );

    }



    public addSpotShadow(

        shadow:

            SpotShadow

    ): void {

        this.spot.push(
            shadow
        );

    }



    protected execute(

        context:

            RenderContext,

        scene:

            RenderScene,

        camera:

            RenderCamera

    ): void {

        this.renderDirectional(

            context,

            scene

        );

        this.renderPoint(

            context,

            scene

        );

        this.renderSpot(

            context,

            scene

        );

    }



    private renderDirectional(

        context:

            RenderContext,

        scene:

            RenderScene

    ): void {

        for (

            const shadow of

            this.directional

        ) {

            shadow.begin?.();

            this.renderSceneDepth(

                context,

                scene,

                shadow.light

            );

            shadow.end?.();

        }

    }



    private renderPoint(

        context:

            RenderContext,

        scene:

            RenderScene

    ): void {

        for (

            const shadow of

            this.point

        ) {

            shadow.begin?.();

            this.renderSceneDepth(

                context,

                scene,

                shadow.light

            );

            shadow.end?.();

        }

    }



    private renderSpot(

        context:

            RenderContext,

        scene:

            RenderScene

    ): void {

        for (

            const shadow of

            this.spot

        ) {

            shadow.begin?.();

            this.renderSceneDepth(

                context,

                scene,

                shadow.light

            );

            shadow.end?.();

        }

    }



    private renderSceneDepth(

        context:

            RenderContext,

        scene:

            RenderScene,

        light:

            Light

    ): void {

        if (!this.renderer) {
            return;
        }

        const meshes =
            scene.getMeshes
                ? scene.getMeshes()
                : [];

        for (

            const mesh of

            meshes

        ) {

            if (!mesh.visible) {
                continue;
            }

            if ((mesh as any).castShadow === false) {
                continue;
            }

            this.renderer.renderDepth?.(

                context,

                mesh,

                light

            );

        }

    }



    public clear(): void {

        this.directional.length = 0;

        this.point.length = 0;

        this.spot.length = 0;

    }



    public debugInfo() {

        return {

            type: "ShadowPass",

            directional:
                this.directional.length,

            point:
                this.point.length,

            spot:
                this.spot.length

        };

    }

}