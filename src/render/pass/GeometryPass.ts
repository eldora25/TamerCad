import { RenderPass } from "./RenderPass";
import { RenderContext } from "../RenderContext";
import { RenderScene } from "../RenderScene";
import { RenderCamera } from "../RenderCamera";

import { GBuffer } from "../postprocess/GBuffer";
import { MeshRenderer } from "../renderer/MeshRenderer";
import { DisplayMesh } from "../display/DisplayMesh";

export interface GeometryPassOptions {

    gBuffer?: GBuffer;

    renderer?: MeshRenderer;

}

export class GeometryPass extends RenderPass {

    private gBuffer: GBuffer | null = null;

    private renderer: MeshRenderer | null = null;

    constructor(
        options: GeometryPassOptions = {}
    ) {

        super({

            name: "GeometryPass",

            priority: 100,

            clearColor: true,

            clearDepth: true

        });

        if (options.gBuffer) {
            this.gBuffer = options.gBuffer;
        }

        if (options.renderer) {
            this.renderer = options.renderer;
        }

    }

    public setGBuffer(
        gBuffer: GBuffer
    ): void {

        this.gBuffer = gBuffer;

    }

    public setRenderer(
        renderer: MeshRenderer
    ): void {

        this.renderer = renderer;

    }

    protected override begin(
        context: RenderContext
    ): void {

        this.gBuffer?.bind();

        super.begin(context);

    }

    protected execute(
        context: RenderContext,
        scene: RenderScene,
        camera: RenderCamera
    ): void {

        if (!this.renderer) {
            return;
        }

        const meshes =
            scene.getVisibleMeshes
                ? scene.getVisibleMeshes(camera)
                : [];

        for (const mesh of meshes) {

            this.renderMesh(

                context,

                mesh,

                camera

            );

        }

    }

    private renderMesh(

        context: RenderContext,

        mesh: DisplayMesh,

        camera: RenderCamera

    ): void {

        if (!mesh.visible) {
            return;
        }

        this.renderer?.render(

            context,

            mesh,

            camera

        );

    }

    protected override end(
        context: RenderContext
    ): void {

        this.gBuffer?.unbind();

    }

}