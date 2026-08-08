import { RenderPass } from "./RenderPass";

import { RenderContext } from "../RenderContext";
import { RenderScene } from "../RenderScene";
import { RenderCamera } from "../RenderCamera";

import { DepthPrepass } from "../postprocess/DepthPrepass";

import { MeshRenderer } from "../renderer/MeshRenderer";
import { DisplayMesh } from "../display/DisplayMesh";



export interface DepthPassOptions {

    depthBuffer?: DepthPrepass;

    renderer?: MeshRenderer;

    reverseZ?: boolean;

}



export class DepthPass extends RenderPass {

    private depthBuffer:

        DepthPrepass | null = null;

    private renderer:

        MeshRenderer | null = null;

    public reverseZ = false;



    constructor(

        options:

            DepthPassOptions = {}

    ) {

        super({

            name: "DepthPass",

            priority: 50,

            clearDepth: true

        });

        if (options.depthBuffer) {
            this.depthBuffer =
                options.depthBuffer;
        }

        if (options.renderer) {
            this.renderer =
                options.renderer;
        }

        if (options.reverseZ !== undefined) {
            this.reverseZ =
                options.reverseZ;
        }

    }



    public setDepthBuffer(

        depth:

            DepthPrepass

    ): void {

        this.depthBuffer =
            depth;

    }



    public setRenderer(

        renderer:

            MeshRenderer

    ): void {

        this.renderer =
            renderer;

    }



    protected override begin(

        context:

            RenderContext

    ): void {

        this.depthBuffer?.bind();

        super.begin(context);

    }



    protected execute(

        context:

            RenderContext,

        scene:

            RenderScene,

        camera:

            RenderCamera

    ): void {

        if (!this.renderer) {
            return;
        }

        const meshes =
            scene.getVisibleMeshes
                ? scene.getVisibleMeshes(camera)
                : [];

        for (const mesh of meshes) {

            this.renderDepthMesh(

                context,

                mesh,

                camera

            );

        }

    }



    private renderDepthMesh(

        context:

            RenderContext,

        mesh:

            DisplayMesh,

        camera:

            RenderCamera

    ): void {

        if (!mesh.visible) {
            return;
        }

        if ((mesh as any).castShadow === false) {
            return;
        }

        this.renderer?.renderDepth?.(

            context,

            mesh,

            camera

        );

    }



    protected override end(

        context:

            RenderContext

    ): void {

        this.depthBuffer?.unbind();

    }



    public debugInfo() {

        return {

            type: "DepthPass",

            reverseZ: this.reverseZ,

            hasDepthBuffer:
                this.depthBuffer !== null,

            hasRenderer:
                this.renderer !== null

        };

    }

}